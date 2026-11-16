import { rooms } from './rooms.js';

export let currentRoomKey = 'habitacion';

export function getCurrentRoom() {
    return rooms[currentRoomKey];
}

export function isColliding(rectA, rectB) {
    return (
        rectA.x < rectB.x + rectB.width &&
        rectA.x + rectA.width > rectB.x &&
        rectA.y < rectB.y + rectB.height &&
        rectA.y + rectA.height > rectB.y
    );
}

export function checkWorldTransitions(player) {
    const room = getCurrentRoom();
    for (const door of room.doors) {
        if (isColliding(player, door)) {
            currentRoomKey = door.targetRoom;
            player.x = door.spawnX;
            player.y = door.spawnY;
            break;
        }
    }
}

export function renderWorld(ctx, canvasWidth, canvasHeight) {
    const room = getCurrentRoom();

    // Piso
    ctx.fillStyle = room.floorColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Paredes y muebles
    for (const obs of room.obstacles) {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }

    // Indicador visual de puertas (tapetes)
    ctx.fillStyle = '#3d332a';
    for (const door of room.doors) {
        ctx.fillRect(door.x, door.y, door.width, door.height);
    }

    // Nombre de la habitación actual
    ctx.fillStyle = '#d4d4d4';
    ctx.font = '14px Courier New';
    ctx.fillText(`Ubicación: ${room.name}`, 30, 42);
}