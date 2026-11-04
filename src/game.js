/* Pure game logic — no DOM. Used by the browser and by scripts/check-puzzles.js */

/* cell values */
export const EMPTY = 0;
export const FILLED = 1;
export const MARKED = 2;

/* "#.#" → [1, 0, 1] */
export const parseGrid = (rows) => rows.map((r) => [...r].map((c) => (c === "#" ? 1 : 0)));

/* [1,1,0,1] → [2,1] */
export function lineClue(line) {
  const out = [];
  let run = 0;
  for (const v of line) {
    if (v === 1) run++;
    else if (run) { out.push(run); run = 0; }
  }
  if (run) out.push(run);
  return out;
}

export const column = (grid, c) => grid.map((row) => row[c]);

export function cluesFor(solution) {
  return {
    rows: solution.map(lineClue),
    cols: solution[0].map((_, c) => lineClue(column(solution, c)))
  };
}

export const fmt = (s) => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");

export class Game {
  constructor(puzzle, saved) {
    this.puzzle = puzzle;
    this.solution = parseGrid(puzzle.grid);
    this.n = this.solution.length;
    const clues = cluesFor(this.solution);
    this.rowClues = clues.rows;
    this.colClues = clues.cols;
    this.state = saved && saved.state && saved.state.length === this.n
      ? saved.state
      : Array.from({ length: this.n }, () => Array(this.n).fill(EMPTY));
    this.seconds = saved ? saved.seconds || 0 : 0;
    this.won = false;
  }

  /* returns true when the cell actually changed */
  set(r, c, v) {
    if (this.won || this.state[r][c] === v) return false;
    this.state[r][c] = v;
    return true;
  }

  get(r, c) { return this.state[r][c]; }

  filledLine(line) { return lineClue(line.map((v) => (v === FILLED ? 1 : 0))); }
  rowDone(r) { return this.filledLine(this.state[r]).join() === this.rowClues[r].join(); }
  colDone(c) { return this.filledLine(column(this.state, c)).join() === this.colClues[c].join(); }

  isSolved() {
    for (let r = 0; r < this.n; r++)
      for (let c = 0; c < this.n; c++)
        if ((this.state[r][c] === FILLED) !== (this.solution[r][c] === 1)) return false;
    return true;
  }

  /* filled cells that should be empty */
  wrongCells() {
    const out = [];
    for (let r = 0; r < this.n; r++)
      for (let c = 0; c < this.n; c++)
        if (this.state[r][c] === FILLED && this.solution[r][c] === 0) out.push([r, c]);
    return out;
  }

  reveal() { this.state = this.solution.map((row) => row.map((v) => (v ? FILLED : EMPTY))); }

  snapshot() { return { state: this.state, seconds: this.seconds }; }
}
