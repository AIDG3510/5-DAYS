export const clockState = {
    day: 1,
    maxDays: 5,
    minutes: 9 * 60, // 09:00 AM = 540 minutos
    isGameOver: false
};

let accumulator = 0;

export function updateClock(deltaSeconds) {
    if (clockState.isGameOver) return;

    accumulator += deltaSeconds;

    // 1 segundo real = 3 minutos en el juego (posible reajuste)
    if (accumulator >= 1) {
        const ticks = Math.floor(accumulator);
        accumulator -= ticks;
        advanceMinutes(ticks * 3);
    }
}

export function advanceMinutes(mins) {
    clockState.minutes += mins;

    while (clockState.minutes >= 1440) {
        clockState.minutes -= 1440;
        clockState.day += 1;
    }

    if (clockState.day > clockState.maxDays) {
        clockState.day = clockState.maxDays;
        clockState.minutes = 23 * 60 + 59;
        clockState.isGameOver = true;
    }
}

export function adjustTime(deltaMinutes) {
    clockState.minutes += deltaMinutes;
    if (clockState.minutes < 0) clockState.minutes += 1440;
    if (clockState.minutes >= 1440) clockState.minutes -= 1440;
}

export function sleepUntilMorning() {
    if (clockState.day < clockState.maxDays) {
        clockState.day += 1;
        clockState.minutes = 9 * 60; // 09:00 AM, hora a la que se levanta (Adelantar tiempo)
    } else {
        clockState.isGameOver = true;
    }
    }

export function getFormattedTime() {
    const hours = Math.floor(clockState.minutes / 60);
    const mins = clockState.minutes % 60;
    const hh = String(hours).padStart(2, '0');
    const mm = String(mins).padStart(2, '0');
    return `${hh}:${mm}`;
}

export function renderDayNightOverlay(ctx, canvasWidth, canvasHeight) {
    const hour = Math.floor(clockState.minutes / 60);
    let darkness = 0;

    if (hour >= 20 || hour < 5) {
        darkness = 0.55; // Noche profunda
    } else if (hour >= 18) {
        darkness = 0.30; // Atardecer
    } else if (hour >= 5 && hour < 7) {
        darkness = 0.25; // Amanecer
    }

    if (darkness > 0) {
        ctx.fillStyle = `rgba(10, 14, 28, ${darkness})`;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
}

export function renderClockHUD(ctx, canvasWidth) {
    ctx.fillStyle = '#f0e6d2';
    ctx.font = 'bold 15px Courier New';
    const label = `Día ${clockState.day}/${clockState.maxDays} - ${getFormattedTime()}`;
    ctx.fillText(label, canvasWidth - 190, 42);
}