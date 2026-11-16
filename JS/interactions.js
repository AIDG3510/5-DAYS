import { currentRoomKey } from './world.js';
import { showDialogue, GOOD_LINES } from './dialogue.js';
import { playCollectSound, playClockTickSound } from './audio.js';

export const INTERACTABLES = {
    sala: [
        { id: 'to_cocina', label: 'Cocina', x: 48, y: 245, r: 58 },
        { id: 'to_bano', label: 'Baño', x: 590, y: 245, r: 58 },
        { id: 'to_habitacion', label: 'Escaleras', x: 262, y: 245, r: 58 },
        { id: 'ventana', label: 'Ventana', x: 152, y: 245, r: 55 },
        { id: 'reloj', label: 'Reloj de péndulo', x: 368, y: 245, r: 55 },
        { id: 'tv', label: 'Televisor', x: 478, y: 280, r: 58 },
        { id: 'sofa', label: 'Sofá', x: 115, y: 350, r: 55 },
        { id: 'caja', label: 'Caja', x: 216, y: 365, r: 52, reqDay: 2 },
        { id: 'mama', label: 'Mamá', x: 260, y: 390, r: 58, reqMother: true }
    ],
    cocina: [
        { id: 'to_sala_c', label: 'Sala', x: 590, y: 245, r: 58 },
        { id: 'fregadero', label: 'Fregadero', x: 132, y: 305, r: 58 },
        { id: 'mesa', label: 'Mesa', x: 325, y: 355, r: 58 },
        { id: 'nevera', label: 'Nevera', x: 445, y: 275, r: 58 },
        { id: 'rejilla', label: 'Rejilla', x: 524, y: 245, r: 55 }
    ],
    habitacion: [
        { id: 'to_sala_h', label: 'Bajar', x: 580, y: 245, r: 58 },
        { id: 'cama', label: 'Cama', x: 192, y: 295, r: 55 },
        { id: 'bajo_cama', label: 'Debajo de la cama', x: 105, y: 355, r: 55 },
        { id: 'escritorio', label: 'Escritorio', x: 320, y: 320, r: 58 },
        { id: 'ventana_h', label: 'Ventana', x: 438, y: 245, r: 58 }
    ],
    bano: [
        { id: 'to_sala_b', label: 'Sala', x: 48, y: 245, r: 58 },
        { id: 'lavabo', label: 'Lavabo', x: 178, y: 300, r: 58 },
        { id: 'alacena', label: 'Alacena', x: 288, y: 245, r: 58 },
        { id: 'banera', label: 'Bañera', x: 470, y: 345, r: 62 }
    ]
};

export function getNearestInteractable(player, gameState) {
    const list = INTERACTABLES[currentRoomKey] || [];
    let best = null;
    let bestDist = Infinity;

    for (const item of list) {
        if (item.reqDay && gameState.day < item.reqDay) {
            continue;
        }
        if (item.reqMother && !gameState.motherVisible) {
            continue;
        }

        const dist = Math.hypot(item.x - (player.x + 12), item.y - (player.y + 12));
        if (dist < item.r && dist < bestDist) {
            bestDist = dist;
            best = item;
        }
    }

    return best;
}

export function interact(id, ctx) {
    const {
        giveLeaf,
        goRoom,
        flags,
        addItem,
        hasItem,
        hasLeaf,
        hf,
        advanceHours,
        sleep,
        triggerGoodEnding
    } = ctx;

    switch (id) {
        case 'to_cocina':
            return goRoom('cocina', 560, 265);
        case 'to_bano':
            return goRoom('bano', 60, 265);
        case 'to_habitacion':
            return goRoom('habitacion', 540, 265);
        case 'to_sala_c':
            return goRoom('sala', 65, 265);
        case 'to_sala_b':
            return goRoom('sala', 550, 265);
        case 'to_sala_h':
            return goRoom('sala', 255, 265);

        case 'escritorio':
            if (!hasLeaf('hoja1')) {
                return giveLeaf('hoja1', [
                    'El cajón del escritorio se abre con un tirón. Huele a lápiz y a madera vieja.',
                    'Doblada en cuatro, la primera hoja: «El niño que no quería dormir».',
                    'La aliso con la mano y la guardo donde va.'
                ]);
            }
            if (!hasItem('destornillador')) {
                addItem('destornillador');
                return showDialogue([
                    'Al fondo del cajón, debajo de los lápices, hay un destornillador con el mango mordido.',
                    'Me lo guardo. Nunca se sabe qué está atornillado en esta casa.'
                ]);
            }
            return showDialogue(['El cajón está vacío. Solo quedan migas de lápiz.']);

        case 'fregadero':
            if (hasLeaf('hoja2')) {
                return showDialogue(['El sifón vuelve a estar seco.']);
            }
            if (!hasItem('llave')) {
                return showDialogue([
                    'El tubo está atorado y la tuerca no cede con las manos.',
                    'Algo blanco se ve brillar dentro del sifón.',
                    'Necesito una llave. Una de verdad.'
                ]);
            }
            flags.sink = true;
            return giveLeaf('hoja2', [
                'La llave inglesa apenas da dos vueltas y el tubo cede.',
                'Sale un chorro de agua oxidada… y una hoja empapada.',
                'La pongo a secar entre las otras páginas.'
            ]);

        case 'ventana':
            if (hasLeaf('hoja3')) {
                return showDialogue(['Ya no queda nada en el marco de la ventana.']);
            }
            if (hf >= 17 && hf < 19.5) {
                return giveLeaf('hoja3', [
                    'La luz de la tarde entra en diagonal y quema el borde del marco.',
                    'Hay una hoja pegada al vidrio, como si hubiera intentado escaparse.',
                    'La página donde un padre enseña a volar una cometa.'
                ]);
            }
            return showDialogue([
                'La luz no da en el marco ahora mismo. Solo se ve el patio.',
                'Al atardecer el sol cruza esta ventana. Entonces sí se ve todo.'
            ]);

        case 'ventana_h':
            if (hasLeaf('hoja4')) {
                return showDialogue(['El alféizar está limpio. Amaneció y ya no hay nada.']);
            }
            if (hf >= 5 && hf < 8.5) {
                return giveLeaf('hoja4', [
                    'El sol apenas sale y la ventana está fría.',
                    'Sobre el alféizar, una hoja con rocío encima.',
                    '«La casa que aprendió a quedarse quieta.»'
                ]);
            }
            return showDialogue([
                'Solo se ve el techo del vecino y un cielo que no decide de qué color ponerse.',
                'Al amanecer esta ventana se llena de luz. Entonces sí se ve todo.'
            ]);

        case 'bajo_cama':
            if (hasLeaf('hoja5')) {
                return showDialogue(['Debajo de la cama solo quedan pelusas y una canica.']);
            }
            if (hasItem('linterna_on')) {
                return giveLeaf('hoja5', [
                    'Alumbro debajo de la cama: una canica, un calcetín y una hoja del libro.',
                    'La saco con dos dedos, como si me quemara.',
                    'La página del escondite que nunca encontré.'
                ]);
            }
            return showDialogue([
                'Debajo de la cama hay algo blanco, pero la oscuridad se lo come.',
                'Necesito una luz que llegue hasta el fondo.'
            ]);

        case 'banera':
            if (hasLeaf('hoja6')) {
                return showDialogue(['El agua está quieta. El tapón flota como un barquito.']);
            }
            if (hasItem('iman_cuerda')) {
                return giveLeaf('hoja6', [
                    'El agua está turbia y el tapón se lo tragó todo.',
                    'Bajo el imán atado al cordel hasta el desagüe y algo de papel se pega.',
                    'La página del naufragio, empapada y todavía legible.'
                ]);
            }
            return showDialogue([
                'El agua está turbia. En el fondo del desagüe se ve un borde blanco.',
                'Ni con la mano ni con la vista llego hasta ahí.'
            ]);

        case 'tv':
            if (hasLeaf('hoja7')) {
                return showDialogue(['La televisión sigue encendida. Ya no escucho lo que dicen.']);
            }
            if (!hasItem('cable') && !hasItem('cable_reparado')) {
                addItem('cable');
                return showDialogue([
                    'Detrás del televisor el cable está mordido, con los hilos al aire.',
                    'Lo arranco con cuidado. Así no iba a encender nunca.'
                ]);
            }
            if (!hasItem('cable_reparado')) {
                return showDialogue([
                    'El cable está mordido. Con eso la pantalla no enciende.',
                    'Con un poco de cinta podría empalmarlo.'
                ]);
            }
            if (hf < 20) {
                return showDialogue(['El cable ya está empalmado. Ahora solo falta que den las ocho.']);
            }
            flags.tvOn = true;
            return giveLeaf('hoja7', [
                'A las ocho el televisor se enciende con las noticias y su luz azul llena la sala.',
                'Detrás, entre los cables, asoma una hoja doblada.',
                'La página del mar. Siempre quise ver el mar.'
            ]);

        case 'reloj':
            if (!hasLeaf('hoja8') && hf >= 12 && hf < 13) {
                return giveLeaf('hoja8', [
                    'A las doce el cristal del reloj se abre solo, un segundo.',
                    'La hoja estaba atascada entre los engranajes, con el borde manchado de aceite.',
                    'La página donde todo el mundo duerme la siesta menos yo.'
                ]);
            }
            playClockTickSound();
            advanceHours(1);
            return showDialogue([
                'El péndulo se detiene un instante y la casa entera se queda sin aire.',
                'Adelanté las manecillas una hora. Detrás del cristal hay una hoja atascada en el XII.'
            ]);

        case 'rejilla':
            if (hasLeaf('hoja9')) {
                return showDialogue(['La rejilla sigue abierta. Solo queda polvo.']);
            }
            if (!flags.rejilla) {
                if (!hasItem('destornillador')) {
                    return showDialogue([
                'La rejilla está atornillada por las cuatro esquinas.',
                'Necesito algo con punta para abrirla.'
                ]);
                }   
                flags.rejilla = true;
                return showDialogue([
                    'Aflojo los cuatro tornillos con el destornillador y aparto la rejilla.',
                    'Adentro, al fondo del conducto, hay una hoja blanca. No llego con la mano.'
                ]);
            }
            if (!hasItem('iman_cuerda')) {
                return showDialogue([
                    'La hoja está al fondo del conducto, demasiado lejos.',
                    'Necesito algo largo que atrape.'
                ]);
            }
            return giveLeaf('hoja9', [
                'Bajo el imán atado al cordel por el conducto y espero.',
                'Se pega algo. Subo despacio para que no se caiga.',
                'La página del verano que nunca hizo tanto calor.'
            ]);

        case 'lavabo':
            if (hasLeaf('hoja10')) {
                return showDialogue(['El grifo gotea. Siempre ha goteado.']);
            }
            if (hasItem('pertiga')) {
                return giveLeaf('hoja10', [
                    'Meto la linterna atada al cordel por el desagüe y la casa se ve por dentro.',
                    'Ahí está, en el recodo del tubo: la última hoja, arrugada pero entera.',
                    '«Y al final, todos se fueron juntos.»'
                ]);
            }
            return showDialogue([
                'El grifo gotea. Siempre ha goteado.',
                'El desagüe se tragó algo: se ve un borde blanco al fondo.',
                'Hace falta luz. Y un brazo más largo que el mío.'
            ]);

        case 'alacena':
            if (hasItem('llave')) {
                return showDialogue(['Solo quedan curitas y un frasco sin etiqueta.']);
            }
            addItem('llave');
            playCollectSound();
            return showDialogue([
                'Abro la alacena: curitas, aspirinas y una llave inglesa que nunca debió estar ahí.',
                'Me la guardo. Pesa más de lo que parece.'
            ]);

        case 'mesa':
            if (!hasItem('cinta')) {
                addItem('cinta');
                playCollectSound();
                return showDialogue([
                    'Sobre la mesa, entre los papeles con números rojos, hay un rollo de cinta de embalar a medias.',
                    'Me lo guardo.'
                ]);
            }
            return showDialogue([
                'Los papeles siguen ahí, con sus números rojos.',
                'No sé leer cifras tan grandes. Solo sé que mamá ya no duerme.'
            ]);

        case 'nevera':
            if (!hasItem('iman')) {
                addItem('iman');
                playCollectSound();
                return showDialogue([
                    'La nevera está casi vacía: medio cartón de leche y un frasco sin etiqueta.',
                    'En la puerta hay un imán con forma de foca. Me lo guardo.'
                ]);
            }
            return showDialogue([
                'Solo queda medio cartón de leche.',
                'Mamá no ha ido al súper en toda la semana.'
            ]);

        case 'sofa':
            if (!hasItem('pilas')) {
                addItem('pilas');
                playCollectSound();
                return showDialogue([
                    'Meto la mano entre los cojines: monedas, un botón y dos pilas gordas.',
                    'Las pilas sí me sirven.'
                ]);
            }
            return showDialogue([
                'El sofá huele a polvo y a tardes de domingo.',
                'Aquí me quedaba dormido esperando a que ella llegara del trabajo.'
            ]);

        case 'caja':
            if (!hasItem('linterna')) {
                addItem('linterna');
                addItem('cordel');
                playCollectSound();
                return showDialogue([
                    'La caja dice «NIÑO» con plumón grueso.',
                    'Adentro: una linterna sin pilas y un carrete de cordel.',
                    'Me los guardo antes de que mamá la selle.'
                ]);
            }
            return showDialogue(['Adentro cabe todo menos lo que de verdad quiero llevarme.']);

        case 'cama':
            if (hf < 19) {
                return showDialogue(['Todavía hay luz. No tengo sueño.']);
            }
            return showDialogue(['Me acosté con el libro abierto sobre la almohada.'], false, sleep);

        case 'mama':
            return showDialogue(GOOD_LINES, true, triggerGoodEnding);

        default:
            return undefined;
    }
}

export function renderNearHint(ctx, near) {
    if (!near) {
        return;
    }
    ctx.fillStyle = 'rgba(20, 12, 22, 0.85)';
    ctx.fillRect(near.x - 45, near.y - 42, 110, 22);
    ctx.strokeStyle = '#d9a441';
    ctx.lineWidth = 1;
    ctx.strokeRect(near.x - 45, near.y - 42, 110, 22);

    ctx.fillStyle = '#ffb478';
    ctx.font = 'bold 11px Courier New';
    ctx.fillText(`[E] ${near.label}`, near.x - 38, near.y - 27);
}