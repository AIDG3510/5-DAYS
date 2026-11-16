import { player, updatePlayer, renderPlayer } from './player.js';
import { renderWorld, checkWorldTransitions } from './world.js';
import { addItem, toggleSelectSlot, renderInventoryHUD } from './inventory.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let isRunning = false;

// Objetos iniciales de prueba para verificar las 4 combinaciones (se quitarán al ponerlos en el mapa)
addItem('Linterna');
addItem('Pilas');
addItem('Imán');
addItem('Cordel');

window.addEventListener('keydown', (e) => {
    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= 8) {
        toggleSelectSlot(num - 1);
    }
});

export function startGame() {
    if (isRunning) return;
    isRunning = true;
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (!isRunning) return;

    update();
    render();

    requestAnimationFrame(gameLoop);
}

function update() {
    updatePlayer();
    checkWorldTransitions(player);
}

function render() {
    renderWorld(ctx, canvas.width, canvas.height);
    renderPlayer(ctx);
    renderInventoryHUD(ctx, canvas.width, canvas.height);
}