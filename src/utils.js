function createGrid(rows, cols) {
    const grid = [];
    for (let i = 0; i < rows; i++) {
        const row = new Array(cols).fill(0);
        grid.push(row);
    }
    return grid;
}

function generateClues(grid) {
    const rowClues = grid.map(row => getClues(row));
    const colClues = [];
    for (let col = 0; col < grid[0].length; col++) {
        const column = grid.map(row => row[col]);
        colClues.push(getClues(column));
    }
    return { rowClues, colClues };
}

function getClues(line) {
    const clues = [];
    let count = 0;
    for (const cell of line) {
        if (cell === 1) {
            count++;
        } else {
            if (count > 0) {
                clues.push(count);
                count = 0;
            }
        }
    }
    if (count > 0) {
        clues.push(count);
    }
    return clues;
}

export { createGrid, generateClues };