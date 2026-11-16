import { currentRoomKey, isColliding } from './world.js';
import { showDialogue, triggerEnding } from './dialogue.js';
import { playCollectSound, playClockTickSound } from './audio.js';

export const worldEntities = [
    // --- PERSONAJES Y MUEBLES INTERACTIVOS ---
    { id: 'madre', room: 'sala', x: 170, y: 75, width: 26, height: 26, color: '#d97757', label: 'Madre', type: 'npc' },
    { id: 'reloj_pie', room: 'sala', x: 535, y: 40, width: 55, height: 55, color: '#b45309', label: 'Reloj', type: 'clock' },
    { id: 'cama', room: 'habitacion', x: 40, y: 40, width: 110, height: 170, color: '#7c2d12', label: 'Cama', type: 'bed' },

    // --- OBJETOS PARA COMBINACIONES ---
    { id: 'obj_cable', room: 'sala', x: 290, y: 230, width: 16, height: 16, color: '#38bdf8', itemName: 'Cable mordido', type: 'item', collected: false },
    { id: 'obj_cinta', room: 'cocina', x: 550, y: 110, width: 16, height: 16, color: '#38bdf8', itemName: 'Cinta', type: 'item', collected: false },
    { id: 'obj_iman', room: 'cocina', x: 350, y: 360, width: 16, height: 16, color: '#38bdf8', itemName: 'Imán', type: 'item', collected: false },
    { id: 'obj_cordel', room: 'habitacion', x: 195, y: 380, width: 16, height: 16, color: '#38bdf8', itemName: 'Cordel', type: 'item', collected: false },
    { id: 'obj_linterna', room: 'habitacion', x: 520, y: 70, width: 16, height: 16, color: '#38bdf8', itemName: 'Linterna', type: 'item', collected: false },
    { id: 'obj_pilas', room: 'bano', x: 145, y: 370, width: 16, height: 16, color: '#38bdf8', itemName: 'Pilas', type: 'item', collected: false },

    // --- LAS 10 HOJAS CON CONDICIONES ---
    { id: 'hoja_1', room: 'habitacion', x: 90, y: 310, width: 14, height: 14, color: '#fef08a', type: 'page', num: 1, collected: false, req: () => true, hint: '' },
    { id: 'hoja_2', room: 'sala', x: 80, y: 400, width: 14, height: 14, color: '#fef08a', type: 'page', num: 2, collected: false, req: (ctx) => ctx.hour >= 18 || ctx.hour < 6, hint: 'Solo brilla cuando cae la noche (18:00 - 06:00).' },
    { id: 'hoja_3', room: 'cocina', x: 560, y: 410, width: 14, height: 14, color: '#fef08a', type: 'page', num: 3, collected: false, req: (ctx) => ctx.hasItem('Linterna encendida') || ctx.hasItem('Pértiga de luz'), hint: 'Está en un rincón muy oscuro; necesitas una Linterna encendida.' },
    { id: 'hoja_4', room: 'bano', x: 560, y: 70, width: 14, height: 14, color: '#fef08a', type: 'page', num: 4, collected: false, req: (ctx) => ctx.hasItem('Imán con cuerda') || ctx.hasItem('Pértiga de luz'), hint: 'Cayó dentro de una rejilla metálica; necesitas un Imán con cuerda.' },
    { id: 'hoja_5', room: 'sala', x: 480, y: 390, width: 14, height: 14, color: '#fef08a', type: 'page', num: 5, collected: false, req: (ctx) => ctx.hasItem('Cable reparado'), hint: 'La lámpara cercana no enciende; necesitas un Cable reparado.' },
    { id: 'hoja_6', room: 'cocina', x: 250, y: 60, width: 14, height: 14, color: '#fef08a', type: 'page', num: 6, collected: false, req: (ctx) => ctx.hasItem('Pértiga de luz'), hint: 'Está en lo alto del estante oscuro; requiere la Pértiga de luz.' },
    { id: 'hoja_7', room: 'habitacion', x: 540, y: 400, width: 14, height: 14, color: '#fef08a', type: 'page', num: 7, collected: false, req: (ctx) => ctx.day >= 2, hint: 'Aparece a partir del Día 2.' },
    { id: 'hoja_8', room: 'bano', x: 60, y: 80, width: 14, height: 14, color: '#fef08a', type: 'page', num: 8, collected: false, req: (ctx) => ctx.day >= 3 && ctx.hour >= 12, hint: 'Solo visible desde el Día 3 después del mediodía.' },
    { id: 'hoja_9', room: 'cocina', x: 80, y: 410, width: 14, height: 14, color: '#fef08a', type: 'page', num: 9, collected: false, req: (ctx) => ctx.day >= 4, hint: 'Aparece a partir del Día 4.' },
    { id: 'hoja_10', room: 'sala', x: 310, y: 135, width: 14, height: 14, color: '#fef08a', type: 'page', num: 10, collected: false, req: (ctx) => ctx.pagesCollected >= 9, hint: 'Es la última hoja; reúne las otras 9 primero.' }
];

export function handleInteraction(player, gameContext) {
    // Área ampliada
    const reachBox = {
        x: player.x - 14,
        y: player.y - 14,
        width: player.width + 28,
        height: player.height + 28
    };

    const target = worldEntities.find(
        (ent) => ent.room === currentRoomKey && !ent.collected && isColliding(reachBox, ent)
    );

    if (!target) return;

    if (target.type === 'item') {
        target.collected = true;
        gameContext.addItem(target.itemName);
        playCollectSound();
        showDialogue([`Recogiste: ${target.itemName}.`]);
    } else if (target.type === 'page') {
        if (target.req(gameContext)) {
            target.collected = true;
            gameContext.collectPage();
            playCollectSound();
            showDialogue([`¡Encontraste la Hoja #${target.num}! (${gameContext.pagesCollected}/10)`]);
        } else {
            showDialogue([`No puedes tomar la Hoja #${target.num} todavía: ${target.hint}`]);
        }
    } else if (target.type === 'clock') {
        playClockTickSound();
        gameContext.advanceHours(2);
        showDialogue(['Manipulaste las manecillas del reloj: avanzaste 2 horas.']);
    } else if (target.type === 'bed') {
        gameContext.sleep();
    } else if (target.type === 'npc') {
        if (gameContext.pagesCollected >= 10) {
            triggerEnding(true);
        } else {
            showDialogue([
                `Madre: "Llevas ${gameContext.pagesCollected} de 10 hojas. Sigue buscando antes de que acabe el día 5."`
            ]);
        }
    }
}

export function renderEntities(ctx) {
    for (const ent of worldEntities) {
        if (ent.room !== currentRoomKey || ent.collected) continue;

        ctx.fillStyle = ent.color;
        ctx.fillRect(ent.x, ent.y, ent.width, ent.height);

        if (ent.type === 'npc' || ent.type === 'clock') {
            ctx.fillStyle = '#ffffff';
            ctx.font = '11px Courier New';
            ctx.fillText(ent.label, ent.x, ent.y - 5);
        }
    }
}