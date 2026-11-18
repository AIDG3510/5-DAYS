export const ITEM_NAMES = {
    llave: 'Llave inglesa',
    cinta: 'Rollo de cinta',
    iman: 'Imán de nevera',
    destornillador: 'Destornillador',
    linterna: 'Linterna sin pilas',
    cordel: 'Cordel',
    pilas: 'Dos pilas',
    cable: 'Cable mordido',
    cable_reparado: 'Cable reparado',
    iman_cuerda: 'Imán con cuerda',
    linterna_on: 'Linterna encendida',
    pertiga: 'Pértiga de luz'
};

const RECIPES = [
    {
        a: 'cable',
        b: 'cinta',
        out: 'cable_reparado',
        line: 'Enrollo la cinta sobre el cable mordido. Queda feo, pero conduce.'
    },
    {
        a: 'iman',
        b: 'cordel',
        out: 'iman_cuerda',
        line: 'Ato el cordel al imán. Ya puedo pescar cosas donde no llega la mano.'
    },
    {
        a: 'linterna',
        b: 'pilas',
        out: 'linterna_on',
        line: 'Las pilas entran con un clic. El haz tiembla, pero alumbra.'
    },
    {
        a: 'linterna_on',
        b: 'iman_cuerda',
        out: 'pertiga',
        line: 'Ato la linterna al extremo de la cuerda. Ahora puedo mirar dentro de lo que no alcanzo.'
    }
];

export const inventory = {
    items: [],
    selectedIndices: [],
    leaves: [],
    totalLeaves: 10,
    lastMessage: ''
};

export function addItem(itemId) {
    if (!inventory.items.includes(itemId)) {
        inventory.items.push(itemId);
    }
}

export function hasItem(itemId) {
    return inventory.items.includes(itemId);
}

export function hasLeaf(leafId) {
    return inventory.leaves.includes(leafId);
}

export function collectLeaf(leafId) {
    if (!inventory.leaves.includes(leafId)) {
        inventory.leaves.push(leafId);
    }
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

    const match = RECIPES.find(
        (r) => (r.a === itemA && r.b === itemB) || (r.a === itemB && r.b === itemA)
    );

    if (match && !inventory.items.includes(match.out)) {
        inventory.items.push(match.out);
        inventory.lastMessage = match.line;
    } else if (match) {
        inventory.lastMessage = 'Ya fabriqué eso.';
    } else {
        inventory.lastMessage = 'Esas dos cosas no encajan.';
    }

    inventory.selectedIndices = [];
}

export function renderInventoryHUD(ctx, canvasWidth, canvasHeight) {
    ctx.font = '11px Courier New';

    const slotLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Z', 'X', 'C'];
    const maxWidth = canvasWidth - 28;
    const rows = [[]];
    let currentWidth = 0;

    inventory.items.forEach((id, index) => {
        const keyChar = slotLabels[index] || '?';
        const label = `[${keyChar}] ${ITEM_NAMES[id] || id}`;
        const labelWidth = ctx.measureText(label).width;
        const spacing = rows[rows.length - 1].length > 0 ? 12 : 0;

        if (currentWidth + spacing + labelWidth > maxWidth &&
            rows[rows.length - 1].length > 0) {
            rows.push([]);
            currentWidth = 0;
        }

        rows[rows.length - 1].push({ index, label });

        currentWidth +=
            (rows[rows.length - 1].length > 1 ? 12 : 0) + labelWidth;
    });

    const panelHeight = 43 + rows.length * 17;
    const panelTop = canvasHeight - panelHeight;

    ctx.fillStyle = 'rgba(20, 12, 22, 0.9)';
    ctx.fillRect(0, panelTop, canvasWidth, panelHeight);

    ctx.fillStyle = '#d9a441';
    ctx.font = 'bold 12px Courier New';

    ctx.fillText(
        `HOJAS: ${inventory.leaves.length}/${inventory.totalLeaves}  |  Pulsa [1-9 / Z-C] para juntar dos cosas:`,
        14,
        panelTop + 19
    );

    ctx.font = '11px Courier New';

    if (inventory.items.length === 0) {
        ctx.fillStyle = '#8a7a72';
        ctx.fillText('No llevo nada encima.', 14, panelTop + 42);
    } else {
        rows.forEach((row, rowIndex) => {
            let xOffset = 14;

            row.forEach(({ index, label }) => {
                const isSelected = inventory.selectedIndices.includes(index);

                ctx.fillStyle = isSelected ? '#ffb478' : '#f6e8c8';
                ctx.fillText(label, xOffset, panelTop + 42 + rowIndex * 17);

                xOffset += ctx.measureText(label).width + 12;
            });
        });
    }

    if (inventory.lastMessage) {
        ctx.fillStyle = '#ffe9b0';
        ctx.fillText(inventory.lastMessage, 14, panelTop - 8);
    }
}