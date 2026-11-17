import { player, updatePlayer, renderPlayer } from './player.js';
import { renderWorld, setRoom } from './world.js';
import {
    clockState,
    updateClock,
    renderDayNightOverlay,
    renderClockHUD,
    sleepUntilMorning,
    adjustTime
} from './clock.js';
import {
    inventory,
    addItem,
    hasItem,
    hasLeaf,
    collectLeaf,
    toggleSelectSlot,
    renderInventoryHUD
} from './inventory.js';
import {
    dialogueState,
    startIntroDialogue,
    advanceDialogue,
    showDialogue,
    morningLines,
    BAD_LINES,
    renderDialogueBox
} from './dialogue.js';
import { getNearestInteractable, interact, renderNearHint } from './interactions.js';
import {
    playStepSound,
    playCollectSound,
    setAmbientPhase
} from './audio.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let isRunning = false;
let lastTimestamp = 0;
let stepTimer = 0;
let nearTarget = null;

const flags = { tvOn: false, sink: false, rejilla: false };

function getGameContext() {
    const hf = clockState.minutes / 60;
    return {
        day: clockState.day,
        hf,
        flags,
        motherVisible: inventory.leaves.length >= 10,
        addItem,
        hasItem,
        hasLeaf,
        giveLeaf(leafId, lines) {
            collectLeaf(leafId);
            playCollectSound();
            const count = inventory.leaves.length;
            const extra = [`Hoja ${count} de 10.`];
            if (count >= 10) {
                extra.push('El libro vuelve a estar completo. Ahora tengo que encontrar a mamá.');
            }
            showDialogue([...lines, ...extra]);
        },
        goRoom(roomKey, spawnX, spawnY) {
            setRoom(roomKey);
            player.x = spawnX;
            player.y = spawnY;
        },
        advanceHours(h) {
            adjustTime(h * 60);
        },
        sleep() {
            if (clockState.day >= 5) {
                showDialogue(BAD_LINES, true);
                return;
            }
            sleepUntilMorning();
            flags.tvOn = false;
            showDialogue(morningLines(clockState.day, inventory.leaves.length));
        },
        triggerGoodEnding() {}
    };
}

window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();

    if (key === 'e' || key === 'enter') {
        if (dialogueState.active) {
            advanceDialogue();
        } else if (nearTarget) {
            interact(nearTarget.id, getGameContext());
        }
        return;
    }

    if (dialogueState.active) return;

    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= 9) {
        toggleSelectSlot(num - 1);
    }
});

export function startGame() {
    if (isRunning) return;
    isRunning = true;
    lastTimestamp = performance.now();
    startIntroDialogue();
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
    if (dialogueState.active) return;

    const worldState = {
        day: clockState.day,
        flags,
        motherVisible: inventory.leaves.length >= 10,
        t: performance.now() / 1000,
        glassColor: clockState.minutes >= 1080 || clockState.minutes < 360 ? '#2c2544' : '#ffe6bd'
    };

    const prevX = player.x;
    const prevY = player.y;

    updatePlayer(worldState);

    if (player.x !== prevX || player.y !== prevY) {
        stepTimer += 1;
        if (stepTimer % 18 === 0) playStepSound();
    }

    updateClock(deltaSeconds);
    const hour = Math.floor(clockState.minutes / 60);

    if (hour >= 5 && hour < 7) {
        setAmbientPhase('dawn');
    } else if (hour >= 7 && hour < 17) {
        setAmbientPhase('day');
    } else if (hour >= 17 && hour < 20) {
        setAmbientPhase('golden');
    } else if (hour >= 20 && hour < 21) {
        setAmbientPhase('dusk');
    } else {
        setAmbientPhase('night');
    }

    if (clockState.isGameOver && !dialogueState.active) {
        showDialogue(BAD_LINES, true);
    }

    nearTarget = getNearestInteractable(player, worldState);
}

function render() {
    const worldState = {
        day: clockState.day,
        flags,
        motherVisible: inventory.leaves.length >= 10,
        t: performance.now() / 1000,
        glassColor: clockState.minutes >= 1080 || clockState.minutes < 360 ? '#2c2544' : '#ffe6bd'
    };

    renderWorld(ctx, canvas.width, canvas.height, worldState);
    renderPlayer(ctx);
    renderNearHint(ctx, nearTarget);
    renderDayNightOverlay(ctx, canvas.width, canvas.height);
    renderClockHUD(ctx, canvas.width);
    renderInventoryHUD(ctx, canvas.width, canvas.height);
    renderDialogueBox(ctx, canvas.width, canvas.height);
}