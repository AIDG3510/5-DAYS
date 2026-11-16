export const rooms = {
    habitacion: {
        name: 'Habitación',
        floorColor: '#262322',
        obstacles: [
            // Paredes exteriores
            { x: 0, y: 0, width: 640, height: 20, color: '#4a423d' },
            { x: 0, y: 460, width: 640, height: 20, color: '#4a423d' },
            { x: 0, y: 0, width: 20, height: 480, color: '#4a423d' },
            { x: 620, y: 0, width: 20, height: 190, color: '#4a423d' },
            { x: 620, y: 290, width: 20, height: 190, color: '#4a423d' },
            // Cama y escritorio
            { x: 40, y: 40, width: 110, height: 170, color: '#5c3a21' },
            { x: 40, y: 360, width: 140, height: 70, color: '#6e472b' }
        ],
        doors: [
            { x: 625, y: 190, width: 15, height: 100, targetRoom: 'sala', spawnX: 40, spawnY: 230 }
        ]
    },
    sala: {
        name: 'Sala',
        floorColor: '#2b2826',
        obstacles: [
            // Paredes con puertas izquierda (habitación), derecha (cocina) y abajo (baño)
            { x: 0, y: 0, width: 640, height: 20, color: '#4a423d' },
            { x: 0, y: 0, width: 20, height: 190, color: '#4a423d' },
            { x: 0, y: 290, width: 20, height: 190, color: '#4a423d' },
            { x: 620, y: 0, width: 20, height: 190, color: '#4a423d' },
            { x: 620, y: 290, width: 20, height: 190, color: '#4a423d' },
            { x: 0, y: 460, width: 270, height: 20, color: '#4a423d' },
            { x: 370, y: 460, width: 270, height: 20, color: '#4a423d' },
            // Sofá, mesa y reloj de pie
            { x: 220, y: 60, width: 200, height: 65, color: '#3b4d3b' },
            { x: 260, y: 160, width: 120, height: 55, color: '#6e472b' },
            { x: 540, y: 35, width: 50, height: 50, color: '#8a5a36' }
        ],
        doors: [
            { x: 0, y: 190, width: 15, height: 100, targetRoom: 'habitacion', spawnX: 575, spawnY: 230 },
            { x: 625, y: 190, width: 15, height: 100, targetRoom: 'cocina', spawnX: 40, spawnY: 230 },
            { x: 270, y: 465, width: 100, height: 15, targetRoom: 'bano', spawnX: 308, spawnY: 40 }
        ]
    },
    cocina: {
        name: 'Cocina',
        floorColor: '#252929',
        obstacles: [
            // Paredes
            { x: 0, y: 0, width: 640, height: 20, color: '#4a423d' },
            { x: 0, y: 460, width: 640, height: 20, color: '#4a423d' },
            { x: 620, y: 0, width: 20, height: 480, color: '#4a423d' },
            { x: 0, y: 0, width: 20, height: 190, color: '#4a423d' },
            { x: 0, y: 290, width: 20, height: 190, color: '#4a423d' },
            // Mesón, estufa y mesa comedor
            { x: 350, y: 30, width: 250, height: 60, color: '#556066' },
            { x: 320, y: 250, width: 150, height: 90, color: '#6e472b' }
        ],
        doors: [
            { x: 0, y: 190, width: 15, height: 100, targetRoom: 'sala', spawnX: 575, spawnY: 230 }
        ]
    },
    bano: {
        name: 'Baño',
        floorColor: '#20262b',
        obstacles: [
            // Paredes
            { x: 0, y: 460, width: 640, height: 20, color: '#4a423d' },
            { x: 0, y: 0, width: 20, height: 480, color: '#4a423d' },
            { x: 620, y: 0, width: 20, height: 480, color: '#4a423d' },
            { x: 0, y: 0, width: 270, height: 20, color: '#4a423d' },
            { x: 370, y: 0, width: 270, height: 20, color: '#4a423d' },
            // Bañera y lavamanos
            { x: 430, y: 310, width: 170, height: 120, color: '#788996' },
            { x: 40, y: 350, width: 90, height: 70, color: '#8a9ba8' }
        ],
        doors: [
            { x: 270, y: 0, width: 100, height: 15, targetRoom: 'sala', spawnX: 308, spawnY: 415 }
        ]
    }
};