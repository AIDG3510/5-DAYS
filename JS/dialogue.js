export const dialogueState = {
    active: false,
    queue: [],
    currentIndex: 0,
    isEnding: false,
    onDone: null
};

export const INTRO_LINES = [
    'MAMÁ: Ya está decidido. Nos vamos en cinco días.',
    'No dijo por qué. Yo no pregunté.',
    'Me dio cinco días para recoger mis cosas.',
    'Guardé los juguetes. La ropa. Los dibujos.',
    'Y entonces busqué mi libro. El que ella me leía antes de dormir.',
    'Estaba debajo de la cama. Pero le faltaban diez hojas.',
    'Diez hojas. Cinco días.',
    'Dos por día. Ni una más.',
    'Si las encuentro todas, quizá todo siga igual.'
];

const MORNING_COMMENTS = [
    'No me preguntó por el libro.',
    'MAMÁ: ¿Otra vez con ese libro? Ya casi no queda nada que empacar.',
    'MAMÁ: Te está quedando poco tiempo, mi amor.',
    'MAMÁ: Solo quedan las cosas grandes. Las tuyas van en la caja azul.',
    'MAMÁ: ...¿Ya lo terminaste?'
];

export function morningLines(day, leafCount) {
    const left = Math.max(1, 6 - day);
    const days = left === 1 ? 'Queda un día.' : `Quedan ${left} días.`;
    return [
        `MAMÁ: Buenos días. ${days}`,
        MORNING_COMMENTS[Math.min(MORNING_COMMENTS.length - 1, Math.floor(leafCount / 2))],
        'Su voz suena como si cargara algo pesado.'
    ];
}

export const GOOD_LINES = [
    'MAMÁ: ¿Ya estás listo?',
    'Sí. Tengo el libro. Le puse las diez hojas en su lugar.',
    'MAMÁ: Entonces vámonos. El camión ya está abajo.',
    'Cerré el libro y lo apreté contra el pecho.',
    'No me despedí de la casa. No supe cómo hacerlo.',
    'Pero el libro iba completo, y eso era una forma de no perderla.'
];

export const BAD_LINES = [
    'MAMÁ: Se acabó el tiempo, mi amor. Tenemos que irnos ya.',
    'Cerré el libro con las hojas que todavía le faltaban.',
    'Las otras se quedaron en algún rincón de esta casa.',
    'Adentro quedaron las páginas que nunca alcancé a leer.'
];

export function startIntroDialogue(onDone = null) {
    showDialogue(INTRO_LINES, false, onDone);
}

export function showDialogue(lines, isEnding = false, onDone = null) {
    dialogueState.active = true;
    dialogueState.queue = Array.isArray(lines) ? lines : [lines];
    dialogueState.currentIndex = 0;
    dialogueState.isEnding = isEnding;
    dialogueState.onDone = onDone;
}

export function advanceDialogue() {
    if (!dialogueState.active) return;

    if (dialogueState.currentIndex < dialogueState.queue.length - 1) {
        dialogueState.currentIndex += 1;
    } else if (!dialogueState.isEnding) {
        const callback = dialogueState.onDone;
        dialogueState.active = false;
        dialogueState.queue = [];
        dialogueState.currentIndex = 0;
        dialogueState.onDone = null;
        if (callback) callback();
    }
}

export function renderDialogueBox(ctx, canvasWidth, canvasHeight) {
    if (!dialogueState.active) return;

    const boxHeight = 110;
    const y = canvasHeight - boxHeight - 14;

    ctx.fillStyle = 'rgba(20, 12, 22, 0.94)';
    ctx.fillRect(16, y, canvasWidth - 32, boxHeight);

    ctx.strokeStyle = '#d9a441';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, y, canvasWidth - 32, boxHeight);

    const raw = dialogueState.queue[dialogueState.currentIndex] || '';
    const hasSpeaker = raw.startsWith('MAMÁ: ');
    const speaker = hasSpeaker ? 'MAMÁ' : '';
    const body = hasSpeaker ? raw.slice(6) : raw;

    let textY = y + 36;
    if (speaker) {
        ctx.fillStyle = '#ffb478';
        ctx.font = 'bold 13px Courier New';
        ctx.fillText(speaker, 30, y + 26);
        textY = y + 48;
    }

    ctx.fillStyle = '#f6e8c8';
    ctx.font = '14px Courier New';
    wrapText(ctx, body, 30, textY, canvasWidth - 64, 19);

    ctx.fillStyle = '#a8968a';
    ctx.font = '11px Courier New';
    const hint = dialogueState.isEnding
        ? 'FIN — Recarga la página (F5) para volver a jugar'
        : `Pulsa [E] para seguir (${dialogueState.currentIndex + 1}/${dialogueState.queue.length})`;
    ctx.fillText(hint, 30, y + 95);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        if (ctx.measureText(testLine).width > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);
}