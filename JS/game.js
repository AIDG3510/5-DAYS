import { player, updatePlayer, renderPlayer } from './player.js';
import { renderWorld, checkWorldTransitions } from './world.js';
import {
    dialogueState,
    startIntroDialogue,
    advanceDialogue,
    renderDialogueBox
} from './dialogue.js';
import { handleInteraction, renderEntities } from './interactions.js';
import { playStepSound } from './audio.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let isRunning = false;
let stepTimer = 0;

// Estado temporal en esta rama antes del merge final
const tempState = {
    day: 1,
    hour: 9,
    pagesCollected: 0,
    items: [],
    addItem(name) { this.items.push(name); },
    hasItem(name) { return this.items.includes(name); },
    collectPage() { this.pagesCollected += 1; },
    advanceHours(h) { this.hour = (this.hour + h) % 24; },
    sleep() { this.day += 1; this.hour = 9; }
};

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'e') {
        if (dialogueState.active) {
            advanceDialogue();
        } else {
            handleInteraction(player, tempState);
        }
    }
});

export function startGame() {
    if (isRunning) return;
    isRunning = true;
    startIntroDialogue();
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (!isRunning) return;

    update();
    render();

    requestAnimationFrame(gameLoop);
}

function update() {
    if (dialogueState.active) return;

    const prevX = player.x;
    const prevY = player.y;

    updatePlayer();
    checkWorldTransitions(player);

    if (player.x !== prevX || player.y !== prevY) {
        stepTimer += 1;
        if (stepTimer % 18 === 0) playStepSound();
    }
}

function render() {
    renderWorld(ctx, canvas.width, canvas.height);
    renderEntities(ctx);
    renderPlayer(ctx);
    renderDialogueBox(ctx, canvas.width, canvas.height);
}
