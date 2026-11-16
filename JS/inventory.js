export const inventory = {
    items: [],
    selectedIndices: [],
    pagesCollected: 0,
    totalPages: 10,
    lastMessage: ''
};

const recipes = [
    { pair: ['Cable mordido', 'Cinta'], result: 'Cable reparado' },
    { pair: ['Imán', 'Cordel'], result: 'Imán con cuerda' },
    { pair: ['Linterna', 'Pilas'], result: 'Linterna encendida' },
    { pair: ['Linterna encendida', 'Imán con cuerda'], result: 'Pértiga de luz' }
];

export function addItem(itemName) {
    if (!inventory.items.includes(itemName)) {
        inventory.items.push(itemName);
        inventory.lastMessage = `Obtuviste: ${itemName}`;
    }
}

export function hasItem(itemName) {
    return inventory.items.includes(itemName);
}

export function toggleSelectSlot(index) {
    if (index < 0 || index >= inventory.items.length) return;

    const pos = inventory.selectedIndices.indexOf(index);
    if (pos !== -1) {
        inventory.selectedIndices.splice(pos, 1);
    } else {
        inventory.selectedIndices.push(index);
    }

    if (inventory.selectedIndices.length === 2) {
        tryCombine();
    }
}

function tryCombine() {
    const [idx1, idx2] = inventory.selectedIndices;
    const itemA = inventory.items[idx1];
    const itemB = inventory.items[idx2];

    const match = recipes.find(
        (r) =>
            (r.pair[0] === itemA && r.pair[1] === itemB) ||
            (r.pair[0] === itemB && r.pair[1] === itemA)
    );

    if (match) {
        // Eliminar los dos ingredientes de mayor a menor índice
        const sorted = [idx1, idx2].sort((a, b) => b - a);
        inventory.items.splice(sorted[0], 1);
        inventory.items.splice(sorted[1], 1);
        inventory.items.push(match.result);
        inventory.lastMessage = `¡Combinado! Creaste: ${match.result}`;
    } else {
        inventory.lastMessage = `No se puede combinar ${itemA} con ${itemB}.`;
    }

    inventory.selectedIndices = [];
}

export function renderInventoryHUD(ctx, canvasWidth, canvasHeight) {
    // Barra inferior semitransparente para el inventario
    ctx.fillStyle = 'rgba(15, 15, 15, 0.85)';
    ctx.fillRect(0, canvasHeight - 62, canvasWidth, 62);

    ctx.fillStyle = '#e6c280';
    ctx.font = 'bold 13px Courier New';
    ctx.fillText(`Hojas: ${inventory.pagesCollected}/${inventory.totalPages}  |  Teclas [1-8] para seleccionar y combinar:`, 16, canvasHeight - 42);

    // Mostrar los objetos actuales numerados
    let xOffset = 16;
    ctx.font = '12px Courier New';

    if (inventory.items.length === 0) {
        ctx.fillStyle = '#888';
        ctx.fillText('(Inventario vacío)', xOffset, canvasHeight - 18);
    } else {
        inventory.items.forEach((item, index) => {
            const isSelected = inventory.selectedIndices.includes(index);
            ctx.fillStyle = isSelected ? '#6ee7b7' : '#f0f0f0';
            const text = `[${index + 1}] ${item}`;
            ctx.fillText(text, xOffset, canvasHeight - 18);
            xOffset += ctx.measureText(text).width + 16;
        });
    }

    // Mensaje reciente de combinación o recolección
    if (inventory.lastMessage) {
        ctx.fillStyle = '#fde047';
        ctx.fillText(inventory.lastMessage, 16, canvasHeight - 72);
    }
}