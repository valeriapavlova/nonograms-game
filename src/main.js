// Este archivo es el punto de entrada de la aplicación. Se encarga de inicializar el juego, generar la cuadrícula del Nonogram y manejar los eventos de clic en las celdas.

import { Game } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const game = new Game(gameContainer);
    game.init();
});

import { createGrid } from './utils.js';

const gameContainer = document.createElement('div');
gameContainer.id = 'game-container';
document.body.appendChild(gameContainer);

const game = new Game();
game.startGame();

gameContainer.addEventListener('click', (event) => {
    const cell = event.target;
    if (cell.classList.contains('cell')) {
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        game.fillCell(row, col);
    }
});

createGrid(gameContainer);