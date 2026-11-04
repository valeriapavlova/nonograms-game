#!/usr/bin/env node
/* Checks every puzzle in src/puzzles.js:
   - grid is square, only "#" and ".", size matches its level
   - the grid is not empty
   - all texts exist in every language
   - the clues have exactly ONE solution (line solving + backtracking)
   Run: npm run check  (exit code 1 on any problem) */

import { PUZZLES, LEVELS } from "../src/puzzles.js";
import { LANGS } from "../src/i18n.js";
import { parseGrid, cluesFor } from "../src/game.js";

const UNKNOWN = -1;

/* all ways to place `clue` in a line of length n that agree with `known` */
function lineOptions(clue, known) {
  const n = known.length;
  const out = [];
  const line = Array(n).fill(0);
  (function place(i, start) {
    if (i === clue.length) {
      for (let k = start; k < n; k++) if (known[k] === 1) return;
      out.push(line.slice());
      return;
    }
    const len = clue[i];
    const rest = clue.slice(i + 1).reduce((a, b) => a + b + 1, 0);
    for (let s = start; s + len + rest <= n; s++) {
      if (known[s - 1] === 1 && s - 1 >= start) break;          /* skipped a filled cell */
      let ok = true;
      for (let k = s; k < s + len; k++) if (known[k] === 0) { ok = false; break; }
      if (ok && known[s + len] === 1) ok = false;               /* block must end here */
      if (ok) {
        for (let k = s; k < s + len; k++) line[k] = 1;
        place(i + 1, s + len + 1);
        for (let k = s; k < s + len; k++) line[k] = 0;
      }
      if (known[s] === 1) break;                                /* can't slide past a filled cell */
    }
  })(0, 0);
  return out;
}

/* fill in every cell that all options of a line agree on; false = contradiction */
function propagate(grid, rows, cols) {
  const n = grid.length;
  let changed = true;
  while (changed) {
    changed = false;
    for (let axis = 0; axis < 2; axis++) {
      for (let i = 0; i < n; i++) {
        const get = (k) => (axis ? grid[k][i] : grid[i][k]);
        const set = (k, v) => { if (axis) grid[k][i] = v; else grid[i][k] = v; };
        const known = Array.from({ length: n }, (_, k) => get(k));
        const opts = lineOptions(axis ? cols[i] : rows[i], known);
        if (!opts.length) return false;
        for (let k = 0; k < n; k++) {
          if (known[k] !== UNKNOWN) continue;
          const v = opts[0][k];
          if (opts.every((o) => o[k] === v)) { set(k, v); changed = true; }
        }
      }
    }
  }
  return true;
}

/* number of solutions, stops counting at `limit` */
function countSolutions(rows, cols, limit = 2) {
  const n = rows.length;
  let count = 0;
  (function search(grid) {
    if (count >= limit) return;
    if (!propagate(grid, rows, cols)) return;
    let cell = null;
    for (let r = 0; r < n && !cell; r++) for (let c = 0; c < n; c++) if (grid[r][c] === UNKNOWN) { cell = [r, c]; break; }
    if (!cell) { count++; return; }
    for (const v of [1, 0]) {
      const next = grid.map((row) => row.slice());
      next[cell[0]][cell[1]] = v;
      search(next);
    }
  })(Array.from({ length: n }, () => Array(n).fill(UNKNOWN)));
  return count;
}

let problems = 0;
const fail = (id, msg) => { problems++; console.error(`  ✗ ${id}: ${msg}`); };

for (const [collection, levels] of Object.entries(PUZZLES)) {
  for (const [level, puzzle] of Object.entries(levels)) {
    const id = `${collection}/${level}`;
    const size = LEVELS[level];
    const g = puzzle.grid;
    if (!size) { fail(id, `unknown level "${level}" (add it to LEVELS)`); continue; }
    if (!Array.isArray(g) || g.length !== size) { fail(id, `needs ${size} rows, has ${g && g.length}`); continue; }
    if (g.some((row) => row.length !== size)) { fail(id, `every row must be ${size} characters`); continue; }
    if (g.some((row) => /[^#.]/.test(row))) { fail(id, `only "#" and "." are allowed`); continue; }
    if (!g.join("").includes("#")) { fail(id, "grid is empty"); continue; }
    if (!puzzle.original) fail(id, "missing original name");
    for (const field of ["name", "region", "text"])
      for (const lang of LANGS)
        if (!puzzle[field] || !puzzle[field][lang]) fail(id, `missing ${field}.${lang}`);

    const { rows, cols } = cluesFor(parseGrid(g));
    const found = countSolutions(rows, cols);
    if (found === 1) console.log(`  ✓ ${id} (${size}×${size}) — one solution`);
    else fail(id, found === 0 ? "no solution (bug in checker?)" : "more than one solution");
  }
}

console.log(problems ? `\n${problems} problem(s)` : "\nall puzzles ok");
process.exit(problems ? 1 : 0);
