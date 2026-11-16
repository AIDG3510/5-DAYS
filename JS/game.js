import { player, updatePlayer, renderPlayer } from './player.js';
import { renderWorld, checkWorldTransitions } from './world.js';
import {
    updateClock,
    renderDayNightOverlay,
    renderClockHUD,
    sleepUntilMorning,
    adjustTime
} from './clock.js';

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
    renderDayNightOverlay(ctx, canvas.width, canvas.height);
    renderClockHUD(ctx, canvas.width);
}
