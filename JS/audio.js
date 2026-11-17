// Nueva versión de sonido
let audioCtx = null;
let master = null;
let noiseBuffer = null;
let musicTimer = null;
let wildlifeTimers = [];
let noteIndex = 0;
let nextNote = 0;
let currentPhase = 'day';
let stepAt = 0;

function initAudio() {
    if (audioCtx) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    master = audioCtx.createGain();
    master.gain.value = 0.5;
    master.connect(audioCtx.destination);

    noiseBuffer = createNoise();
}

function createNoise() {
    const buffer = audioCtx.createBuffer(
        1,
        audioCtx.sampleRate,
        audioCtx.sampleRate
    );

    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    return buffer;
}

function playTone(freq, time, duration, volume, type = 'sine') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.value = 1500;

    osc.type = type;
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(volume, time + duration * 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    osc.start(time);
    osc.stop(time + duration + 0.1);
}

// Música ambiental

function playPad(time) {
    const scale = [196.0, 233.08, 293.66, 349.23, 392.0, 466.16];

    const index = noteIndex % scale.length;
    noteIndex++;

    const frequency = scale[(index * 3) % scale.length];

    playTone(frequency, time, 3.6, 0.07, 'triangle');
    playTone(frequency * 2, time + 0.25, 3.0, 0.026);

    if (noteIndex % 4 === 1) {
        playTone(98, time, 6.4, 0.055);
    }
}

function startMusic() {
    nextNote = audioCtx.currentTime + 0.4;

    musicTimer = setInterval(() => {
        if (audioCtx.state !== 'running') return;

        while (nextNote < audioCtx.currentTime + 0.9) {
            playPad(nextNote);
            nextNote += 2.6;
        }
    }, 300);
}

// Sonidos ambientales

function playBird() {
    const time = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const frequency = 1900 + Math.random() * 900;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, time);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.7, time + 0.05);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.9, time + 0.12);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.045, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.15);

    osc.connect(gain);
    gain.connect(master);

    osc.start(time);
    osc.stop(time + 0.18);
}

function playCricket() {
    const base = audioCtx.currentTime;

    for (let i = 0; i < 2; i++) {
        const time = base + i * 0.09;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'square';
        osc.frequency.value = 4300;

        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.exponentialRampToValueAtTime(0.016, time + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

        osc.connect(gain);
        gain.connect(master);

        osc.start(time);
        osc.stop(time + 0.05);
    }
}

function playTick() {
    const time = audioCtx.currentTime;
    const source = audioCtx.createBufferSource();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();

    source.buffer = noiseBuffer;

    filter.type = 'bandpass';
    filter.frequency.value = 2300;
    filter.Q.value = 9;

    gain.gain.setValueAtTime(0.05, time);
    gain.gain.exponentialRampToValueAtTime(0.0005, time + 0.05);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    source.start(time);
    source.stop(time + 0.06);
}

function startWildlife() {
    wildlifeTimers.push(
        setInterval(() => {
            if (
                ['dawn', 'day', 'golden'].includes(currentPhase) &&
                Math.random() < 0.55
            ) {
                playBird();
            }
        }, 2100),

        setInterval(() => {
            if (['dusk', 'night'].includes(currentPhase)) {
                playCricket();
            }
        }, 850),

        setInterval(playTick, 1000)
    );
}

// Funciones públicas

export async function startAmbientAudio() {
    initAudio();
    await audioCtx.resume();

    if (musicTimer) return;

    startMusic();
    startWildlife();
}

export function setAmbientPhase(phase) {
    currentPhase = phase;
}

export function setAudioVolume(volume) {
    if (master) {
        master.gain.setTargetAtTime(
            volume,
            audioCtx.currentTime,
            0.05
        );
    }
}

export function playStepSound() {
    if (!audioCtx) return;

    const time = audioCtx.currentTime;

    if (time - stepAt < 0.26) return;
    stepAt = time;

    const source = audioCtx.createBufferSource();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();

    source.buffer = noiseBuffer;
    filter.type = 'bandpass';
    filter.frequency.value = 750;
    filter.Q.value = 1.1;

    gain.gain.setValueAtTime(0.11, time);
    gain.gain.exponentialRampToValueAtTime(0.0008, time + 0.1);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    source.start(time);
    source.stop(time + 0.12);
}

export function playCollectSound() {
    if (!audioCtx) return;

    const time = audioCtx.currentTime;

    playTone(520, time, 0.12, 0.1);
    playTone(780, time + 0.09, 0.18, 0.1);
}

export function playClockTickSound() {
    if (audioCtx) playTick();
}

export function playAmbientCue(isNight) {
    if (!audioCtx) return;

    if (isNight) {
        playCricket();
    } else {
        playBird();
    }
}