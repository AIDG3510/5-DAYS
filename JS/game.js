import { player, updatePlayer, renderPlayer } from './player.js';
import { renderWorld, checkWorldTransitions } from './world.js';
<<<<<<< HEAD
import { addItem, toggleSelectSlot, renderInventoryHUD } from './inventory.js';
=======
import {
    updateClock,
    renderDayNightOverlay,
    renderClockHUD,
    sleepUntilMorning,
    adjustTime
} from './clock.js';
>>>>>>> feature/sistema-reloj

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let isRunning = false;
let lastTimestamp = 0;

// Atajos temporales de prueba (T: adelantar 1 hora, N: dormir al día siguiente)
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === 't') adjustTime(60);
    if (key === 'n') sleepUntilMorning();
});

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
    lastTimestamp = performance.now();
    requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    if (!isRunning) return;

    const deltaSeconds = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    update(deltaSeconds);
    render();

    requestAnimationFrame(gameLoop);
}

function update(deltaSeconds) {
    updatePlayer();
    checkWorldTransitions(player);
    updateClock(deltaSeconds);
}

function render() {
    renderWorld(ctx, canvas.width, canvas.height);
    renderPlayer(ctx);
<<<<<<< HEAD
    renderInventoryHUD(ctx, canvas.width, canvas.height);
}
=======
    renderDayNightOverlay(ctx, canvas.width, canvas.height);
    renderClockHUD(ctx, canvas.width);
}
>>>>>>> feature/sistema-reloj
