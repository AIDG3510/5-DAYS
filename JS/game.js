import { updatePlayer, renderPlayer } from './player.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let isRunning = false;

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
    updatePlayer(canvas.width, canvas.height);
}

function render() {
    // Limpiar pantalla
    ctx.fillStyle = '#181818';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar jugador
    renderPlayer(ctx);
}