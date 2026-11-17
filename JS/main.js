import { startGame } from './game.js';
import { startAmbientAudio } from './audio.js';

const titleScreen = document.getElementById('title-screen');
const startButton = document.getElementById('start-button');
const gameCanvas = document.getElementById('game-canvas');

startButton.addEventListener('click', () => {
    titleScreen.style.display = 'none';
    gameCanvas.style.display = 'block';
    startAmbientAudio()
    startGame();
});