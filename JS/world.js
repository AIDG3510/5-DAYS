import { rooms } from './rooms.js';

export let currentRoomKey = 'sala';

export function setRoom(roomKey) {
    currentRoomKey = roomKey;
}

export function getCurrentRoom() {
    return rooms[currentRoomKey] || rooms.sala;
}

export function isColliding(rectA, rectB) {
    return (
        rectA.x < rectB.x + rectB.width &&
        rectA.x + rectA.width > rectB.x &&
        rectA.y < rectB.y + rectB.height &&
        rectA.y + rectA.height > rectB.y
    );
}

export function renderWorld(ctx, canvasWidth, canvasHeight, state) {
    const room = getCurrentRoom();
    room.draw(ctx, canvasWidth, canvasHeight, state);

    ctx.fillStyle = '#f6e8c8';
    ctx.font = 'bold 14px Courier New';
    ctx.fillText(`Habitación: ${room.name}`, 24, 34);
}