export const dialogueState = {
    active: false,
    queue: [],
    currentIndex: 0,
    isEnding: false
};

const introLines = [
    'Línea 1: La casa parece más silenciosa desde que empezó esta semana.',
    'Línea 2: Mamá pasa casi todo el tiempo en la sala mirando por la ventana.',
    'Línea 3: Dice que ha perdido diez hojas importantes de su diario.',
    'Línea 4: Algunas quedaron escondidas en rincones oscuros o difíciles de alcanzar.',
    'Línea 5: Solo tenemos cinco días antes de tener que mudarnos.',
    'Línea 6: El viejo reloj de la sala parece alterar la percepción del tiempo.',
    'Línea 7: Si combino objetos útiles de la casa podré llegar a cada rincón.',
    'Línea 8: Muévete con WASD o flechas, e interactúa con la tecla E.',
    'Línea 9: Encuentra las 10 hojas antes de que termine el quinto día.'
];

export function startIntroDialogue() {
    showDialogue(introLines, false);
}

export function showDialogue(lines, isEnding = false) {
    dialogueState.active = true;
    dialogueState.queue = lines;
    dialogueState.currentIndex = 0;
    dialogueState.isEnding = isEnding;
}

export function advanceDialogue() {
    if (!dialogueState.active) return;

    if (dialogueState.currentIndex < dialogueState.queue.length - 1) {
        dialogueState.currentIndex += 1;
    } else if (!dialogueState.isEnding) {
        dialogueState.active = false;
        dialogueState.queue = [];
        dialogueState.currentIndex = 0;
    }
}

export function triggerMorningComment(day) {
    const comments = {
        2: ['Día 2 - 09:00: El sol entra por la habitación. Aún quedan recuerdos por recuperar.'],
        3: ['Día 3 - 09:00: Mitad de semana. Revisa bien los horarios en que aparecen algunas hojas.'],
        4: ['Día 4 - 09:00: Queda poco tiempo. Asegúrate de fabricar las herramientas necesarias.'],
        5: ['Día 5 - 09:00: Último día en la casa. Encuentra las hojas restantes y habla con mamá.']
    };
    if (comments[day]) {
        showDialogue(comments[day], false);
    }
}

export function triggerEnding(hasAllPages) {
    if (hasAllPages) {
        showDialogue([
            'FINAL BUENO: Le entregas las 10 hojas recuperadas a tu madre.',
            'Ella sonríe por primera vez en días al leer cada recuerdo intacto.',
            'Aunque dejen la casa atrás, la memoria de la familia sigue completa.'
        ], true);
    } else {
        showDialogue([
            'FINAL MALO: El quinto día ha terminado y las hojas siguen perdidas.',
            'Empacan las cajas en silencio sabiendo que algo valioso quedó olvidado.',
            'El tiempo se agotó.'
        ], true);
    }
}

export function renderDialogueBox(ctx, canvasWidth, canvasHeight) {
    if (!dialogueState.active) return;

    const boxHeight = 105;
    const y = canvasHeight - boxHeight - 12;

    ctx.fillStyle = 'rgba(10, 10, 14, 0.94)';
    ctx.fillRect(16, y, canvasWidth - 32, boxHeight);

    ctx.strokeStyle = '#e6c280';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, y, canvasWidth - 32, boxHeight);

    ctx.fillStyle = '#f5f5f5';
    ctx.font = '14px Courier New';
    const currentText = dialogueState.queue[dialogueState.currentIndex] || '';
    ctx.fillText(currentText, 30, y + 38);

    ctx.fillStyle = '#a3a3a3';
    ctx.font = '12px Courier New';
    const hint = dialogueState.isEnding
        ? 'Fin de la partida — Recarga la página para volver a jugar'
        : `Presiona [E] para continuar (${dialogueState.currentIndex + 1}/${dialogueState.queue.length})`;
    ctx.fillText(hint, 30, y + 80);
}