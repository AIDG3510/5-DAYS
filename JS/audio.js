let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(freq, duration, type = 'sine', volume = 0.08) {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

export function playStepSound() {
    playTone(110, 0.05, 'triangle', 0.03);
}

export function playCollectSound() {
    playTone(520, 0.12, 'sine', 0.1);
    setTimeout(() => playTone(780, 0.18, 'sine', 0.1), 90);
}

export function playClockTickSound() {
    playTone(880, 0.04, 'square', 0.04);
}

export function playAmbientCue(isNight) {
    if (isNight) {
        // Chirrido agudo corto (grillos)
        playTone(3200, 0.06, 'sine', 0.02);
    } else {
        // Trino suave (aves)
        playTone(1400, 0.09, 'sine', 0.02);
    }
}