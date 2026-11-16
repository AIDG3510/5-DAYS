export const player = {
    x: 300,
    y: 220,
    width: 24,
    height: 24,
    speed: 3,
    color: '#e6c280'
};

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    s: false,
    a: false,
    d: false
};

window.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

export function updatePlayer(canvasWidth, canvasHeight) {
    if (keys.ArrowUp || keys.w) {
        player.y -= player.speed;
    }
    if (keys.ArrowDown || keys.s) {
        player.y += player.speed;
    }
    if (keys.ArrowLeft || keys.a) {
        player.x -= player.speed;
    }
    if (keys.ArrowRight || keys.d) {
        player.x += player.speed;
    }
// Barrera del canvas
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x + player.width > canvasWidth) {
        player.x = canvasWidth - player.width;
    }
    if (player.y + player.height > canvasHeight) {
        player.y = canvasHeight - player.height;
    }
}

export function renderPlayer(ctx) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}