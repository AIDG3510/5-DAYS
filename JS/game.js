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
    // jugador, reloj, colisiones.
}

function render() {
    // Limpiar fotogramas
    ctx.fillStyle = '#181818';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texto temporal para comprobar que el canvas funciona
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px Courier New';
    ctx.fillText('Motor de 5 DAYS iniciado...', 20, 40);
}