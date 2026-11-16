import { getCurrentRoom, isColliding } from './world.js';

export const player = {
    x: 310,
    y: 310,
    width: 24,
    height: 24,
    speed: 3
};

const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

function hitsObstacle(nextX, nextY, worldState) {
    const room = getCurrentRoom();
    const hitbox = { x: nextX, y: nextY, width: player.width, height: player.height };
    return room.obstacles(worldState).some((obs) => isColliding(hitbox, obs));
}

export function updatePlayer(worldState) {
    let dx = 0;
    let dy = 0;

    if (keys['arrowup'] || keys['w']) dy -= player.speed;
    if (keys['arrowdown'] || keys['s']) dy += player.speed;
    if (keys['arrowleft'] || keys['a']) dx -= player.speed;
    if (keys['arrowright'] || keys['d']) dx += player.speed;

    if (dx !== 0 && !hitsObstacle(player.x + dx, player.y, worldState)) {
        player.x += dx;
    }
    if (dy !== 0 && !hitsObstacle(player.x, player.y + dy, worldState)) {
        player.y += dy;
    }
}

export function renderPlayer(ctx) {
    const x = player.x;
    const y = player.y;
    ctx.fillStyle = '#3f4a68';
    ctx.fillRect(x + 4, y + 14, 6, 8);
    ctx.fillRect(x + 14, y + 14, 6, 8);
    ctx.fillStyle = '#cf7c4d';
    ctx.fillRect(x + 4, y + 6, 16, 10);
    ctx.fillStyle = '#e8b98f';
    ctx.fillRect(x + 5, y - 4, 14, 11);
    ctx.fillStyle = '#3a2b2a';
    ctx.fillRect(x + 5, y - 6, 14, 5);
}