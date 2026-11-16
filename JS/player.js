import { getCurrentRoom, isColliding } from './world.js';

export const player = {
    x: 240,
    y: 220,
    width: 24,
    height: 24,
    speed: 3,
    color: '#e6c280'
};

const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

function hitsObstacle(nextX, nextY) {
    const room = getCurrentRoom();
    const hitbox = { x: nextX, y: nextY, width: player.width, height: player.height };
    return room.obstacles.some((obs) => isColliding(hitbox, obs));
}

export function updatePlayer() {
    let dx = 0;
    let dy = 0;

    if (keys['arrowup'] || keys['w']) dy -= player.speed;
    if (keys['arrowdown'] || keys['s']) dy += player.speed;
    if (keys['arrowleft'] || keys['a']) dx -= player.speed;
    if (keys['arrowright'] || keys['d']) dx += player.speed;

    // comprobar colisión
    if (dx !== 0 && !hitsObstacle(player.x + dx, player.y)) {
        player.x += dx;
    }

    // comprobar colisión en Y
    if (dy !== 0 && !hitsObstacle(player.x, player.y + dy)) {
        player.y += dy;
    }
}

export function renderPlayer(ctx) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}