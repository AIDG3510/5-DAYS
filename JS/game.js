import { player, updatePlayer, renderPlayer } from './player.js';
import { renderWorld, checkWorldTransitions } from './world.js';

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
    updatePlayer();
    checkWorldTransitions(player);
}

function render() {
    renderWorld(ctx, canvas.width, canvas.height);
    renderPlayer(ctx);
}