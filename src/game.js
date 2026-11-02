export class Game {
    constructor(size) {
        this.size = size;
        this.grid = this.createGrid();
        this.solution = this.generateSolution();
        this.isGameOver = false;
    }

    createGrid() {
        return Array.from({ length: this.size }, () => Array(this.size).fill(null));
    }

    generateSolution() {
        // Lógica para generar una solución de Nonogram
        // Esto es un ejemplo simple, se puede mejorar
        return Array.from({ length: this.size }, () => Array(this.size).fill(0));
    }

    startGame() {
        this.isGameOver = false;
        this.grid = this.createGrid();
        this.solution = this.generateSolution();
        // Aquí se pueden agregar más inicializaciones
    }

    fillCell(x, y, value) {
        if (!this.isGameOver && this.grid[x] && this.grid[x][y] === null) {
            this.grid[x][y] = value;
            this.checkWin();
        }
    }

    checkWin() {
        // Lógica para verificar si el jugador ha ganado
        const isWin = this.grid.flat().every((cell, index) => cell === this.solution.flat()[index]);
        if (isWin) {
            this.isGameOver = true;
            alert("¡Has ganado!");
        }
    }
}

export default Game;