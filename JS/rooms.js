export const FLOOR_Y = 230;

function rect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawShell(ctx, width, height, c) {
    rect(ctx, 0, 0, width, FLOOR_Y, c.wall);
    for (let x = 4; x < width; x += 36) rect(ctx, x, 0, 12, FLOOR_Y, c.stripe);
    rect(ctx, 0, FLOOR_Y - 22, width, 2, c.baseHi);
    rect(ctx, 0, FLOOR_Y - 20, width, 20, c.base);
    rect(ctx, 0, FLOOR_Y, width, height - FLOOR_Y, c.floor);
    for (let y = FLOOR_Y + 24; y < height; y += 24) rect(ctx, 0, y, width, 2, c.floorLine);
    for (let x = 36; x < width; x += 68) rect(ctx, x, FLOOR_Y, 2, height - FLOOR_Y, c.floorLine);
}

function drawDoor(ctx, x, y, w) {
    rect(ctx, x - 6, y - 6, w + 12, FLOOR_Y - y + 6, '#241722');
    rect(ctx, x, y, w, FLOOR_Y - y, '#6b4634');
    rect(ctx, x + 6, y + 8, w - 12, 42, '#7d5540');
    rect(ctx, x + 6, y + 58, w - 12, 52, '#7d5540');
    rect(ctx, x + w - 12, y + 52, 4, 10, '#d9a441');
}

function drawWindow(ctx, x, y, w, h, glass) {
    rect(ctx, x - 10, y - 10, w + 20, h + 20, '#6d4b40');
    rect(ctx, x - 4, y - 4, w + 8, h + 8, '#96705c');
    rect(ctx, x, y, w, h, glass);
    rect(ctx, x + Math.floor(w / 2) - 2, y, 4, h, '#96705c');
    rect(ctx, x, y + Math.floor(h / 2) - 2, w, 4, '#96705c');
    rect(ctx, x - 20, y - 16, 14, h + 36, '#6d3b48');
    rect(ctx, x + w + 6, y - 16, 14, h + 36, '#6d3b48');
}

function drawClock(ctx, x, y, t) {
    const swing = Math.sin(t * 2.5);
    rect(ctx, x, y, 56, 165, '#5a3628');
    rect(ctx, x + 6, y + 6, 44, 152, '#6d4330');
    rect(ctx, x + 14, y + 18, 28, 28, '#f7e7c8');
    rect(ctx, x + 27, y + 22, 3, 10, '#3a2a22');
    rect(ctx, x + 27, y + 30, 9, 3, '#3a2a22');
    rect(ctx, x + 12, y + 58, 32, 85, '#2b1a1e');
    const bx = x + 28 + Math.round(swing * 10);
    rect(ctx, x + 27, y + 62, 2, 62, '#a67c3a');
    rect(ctx, bx - 6, y + 120, 12, 12, '#d9a441');
}

function drawMother(ctx, cx, by) {
    const x = Math.round(cx - 14);
    const y = Math.round(by - 40);
    rect(ctx, x + 8, y + 4, 14, 14, '#e6b48d');
    rect(ctx, x + 6, y, 18, 8, '#4a3128');
    rect(ctx, x + 4, y + 4, 3, 22, '#4a3128');
    rect(ctx, x + 23, y + 4, 3, 22, '#4a3128');
    rect(ctx, x + 8, y + 18, 14, 22, '#7a4a5f');
}

export const rooms = {
    sala: {
        name: 'Sala',
        draw(ctx, w, h, st) {
            drawShell(ctx, w, h, {
                wall: '#482f46', stripe: '#503550', base: '#2e1f2a',
                baseHi: '#3d2a3a', floor: '#6b4642', floorLine: '#5b3c39'
            });
            rect(ctx, 210, 310, 240, 90, '#66383f');
            rect(ctx, 220, 318, 220, 74, '#82454b');
            drawDoor(ctx, 18, 110, 60);
            drawDoor(ctx, 560, 110, 60);
            drawWindow(ctx, 115, 65, 76, 92, st.glassColor);
            rect(ctx, 220, 95, 84, FLOOR_Y - 95, '#1d1220');
            for (let i = 0; i < 5; i++) {
                rect(ctx, 220 + i * 4, FLOOR_Y - 22 - i * 18, 84 - i * 8, 8, '#3a2838');
            }
            drawClock(ctx, 340, 48, st.t);
            rect(ctx, 430, 195, 96, 65, '#6b4436');
            rect(ctx, 438, 130, 80, 64, '#3a2b33');
            rect(ctx, 444, 136, 56, 48, st.flags.tvOn ? '#7fc9b0' : '#1d161c');
            rect(ctx, 45, 275, 140, 58, '#6e3a48');
            rect(ctx, 45, 265, 140, 16, '#8a4a58');
            if (st.day >= 2) {
                rect(ctx, 195, 345, 42, 36, '#b98f68');
                rect(ctx, 214, 345, 4, 36, '#7a5334');
            }
            if (st.motherVisible) {
                drawMother(ctx, 260, 390);
            }
        },
        obstacles(st) {
            const list = [
                { x: 0, y: 0, width: 640, height: FLOOR_Y - 12 },
                { x: 0, y: 410, width: 640, height: 70 },
                { x: 0, y: 0, width: 14, height: 480 },
                { x: 626, y: 0, width: 14, height: 480 },
                { x: 45, y: 265, width: 140, height: 68 },
                { x: 430, y: 205, width: 96, height: 55 }
            ];
            if (st.day >= 2) list.push({ x: 195, y: 345, width: 42, height: 36 });
            return list;
        }
    },
    cocina: {
        name: 'Cocina',
        draw(ctx, w, h, st) {
            drawShell(ctx, w, h, {
                wall: '#4b3736', stripe: '#553f3d', base: '#2d211f',
                baseHi: '#3d2c28', floor: '#6a4a3f', floorLine: '#593d34'
            });
            drawWindow(ctx, 100, 60, 84, 80, st.glassColor);
            drawDoor(ctx, 560, 110, 60);
            rect(ctx, 45, 225, 175, 65, '#5a3c31');
            rect(ctx, 45, 225, 175, 8, '#8a6a52');
            rect(ctx, 265, 275, 120, 65, '#8a6a52');
            rect(ctx, 405, 110, 84, 145, '#cfc4ac');
            rect(ctx, 412, 175, 70, 4, '#b3a890');
            rect(ctx, 500, 135, 48, 44, st.flags.rejilla ? '#0d0a0c' : '#4a3d33');
        },
        obstacles() {
            return [
                { x: 0, y: 0, width: 640, height: FLOOR_Y - 12 },
                { x: 0, y: 410, width: 640, height: 70 },
                { x: 0, y: 0, width: 14, height: 480 },
                { x: 626, y: 0, width: 14, height: 480 },
                { x: 45, y: 225, width: 175, height: 65 },
                { x: 265, y: 275, width: 120, height: 65 },
                { x: 405, y: 210, width: 84, height: 45 }
            ];
        }
    },
    habitacion: {
        name: 'Habitación',
        draw(ctx, w, h, st) {
            drawShell(ctx, w, h, {
                wall: '#4a3350', stripe: '#533a5a', base: '#2c1e32',
                baseHi: '#3b2942', floor: '#6a4540', floorLine: '#593936'
            });
            drawWindow(ctx, 390, 55, 96, 90, st.glassColor);
            drawDoor(ctx, 550, 110, 60);
            rect(ctx, 36, 240, 140, 100, '#6b4436');
            rect(ctx, 44, 245, 124, 44, '#d8cbb4');
            rect(ctx, 42, 285, 126, 52, '#8a4a58');
            rect(ctx, 255, 240, 128, 65, '#8a6a52');
        },
        obstacles() {
            return [
                { x: 0, y: 0, width: 640, height: FLOOR_Y - 12 },
                { x: 0, y: 410, width: 640, height: 70 },
                { x: 0, y: 0, width: 14, height: 480 },
                { x: 626, y: 0, width: 14, height: 480 },
                { x: 36, y: 240, width: 140, height: 100 },
                { x: 255, y: 240, width: 128, height: 65 }
            ];
        }
    },
    bano: {
        name: 'Baño',
        draw(ctx, w, h) {
            drawShell(ctx, w, h, {
                wall: '#3f4655', stripe: '#48505f', base: '#282c36',
                baseHi: '#363b47', floor: '#5b5450', floorLine: '#4b4542'
            });
            drawDoor(ctx, 18, 110, 60);
            rect(ctx, 130, 60, 96, 100, '#a9b6bd');
            rect(ctx, 130, 225, 96, 58, '#c9c0b4');
            rect(ctx, 255, 85, 65, 95, '#7a6a5c');
            rect(ctx, 365, 235, 210, 95, '#cfc8bd');
            rect(ctx, 377, 250, 186, 65, '#89a4a6');
        },
        obstacles() {
            return [
                { x: 0, y: 0, width: 640, height: FLOOR_Y - 12 },
                { x: 0, y: 410, width: 640, height: 70 },
                { x: 0, y: 0, width: 14, height: 480 },
                { x: 626, y: 0, width: 14, height: 480 },
                { x: 130, y: 225, width: 96, height: 58 },
                { x: 365, y: 235, width: 210, height: 95 }
            ];
        }
    }
};