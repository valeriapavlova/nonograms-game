/* DOM rendering — reads the Game, never changes it */
import { t, getLang } from "./i18n.js";
import { fmt, FILLED, MARKED } from "./game.js";
import { LEVELS, hasPuzzle, puzzleList } from "./puzzles.js";
import { isSolved } from "./storage.js";

export const $ = (id) => document.getElementById(id);

const clueHTML = (clues, attr) => clues
  .map((c, i) => `<div class="clue" data-${attr}="${i}">${(c.length ? c : [0]).map((x) => `<span>${x}</span>`).join("")}</div>`)
  .join("");

export function renderBoard(game) {
  const { n } = game;
  const board = $("board");
  board.style.setProperty("--n", n);
  board.classList.remove("is-won");

  $("cluesCol").innerHTML = clueHTML(game.colClues, "col");
  $("cluesRow").innerHTML = clueHTML(game.rowClues, "row");

  const cells = $("cells");
  cells.innerHTML = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const b = document.createElement("button");
      b.className = "cell";
      if (c % 5 === 4 && c !== n - 1) b.classList.add("edge-r");
      if (r % 5 === 4 && r !== n - 1) b.classList.add("edge-b");
      if (c === n - 1) b.classList.add("last-c");
      if (r === n - 1) b.classList.add("last-r");
      b.dataset.r = r;
      b.dataset.c = c;
      b.style.setProperty("--d", `${(r + c) * 35}ms`);
      b.tabIndex = r === 0 && c === 0 ? 0 : -1;
      cells.appendChild(b);
    }
  }
  paintAll(game);
  fitBoard();
}

/* phones: the cell size comes from the space the stage really has
   (width AND height). Clue sizes depend on the cell size, so measure,
   scale, and measure again. Larger screens keep the CSS formula. */
const phone = window.matchMedia("(max-width: 640px)");
const MAX_BOARD = 360;   /* same cap as the desktop formula */

export function fitBoard() {
  const board = $("board");
  const stage = $("stage");
  board.style.removeProperty("--cell");
  if (!phone.matches) return;
  const n = +getComputedStyle(board).getPropertyValue("--n") || 5;
  /* leave room for the clue rings and focus outlines around the board */
  const w = stage.clientWidth - 8;
  const h = stage.clientHeight - 8;
  if (w <= 0 || h <= 0) return;
  let cell = MAX_BOARD / n;
  for (let k = 0; k < 4; k++) {
    board.style.setProperty("--cell", `${cell}px`);
    const box = board.getBoundingClientRect();
    const scale = Math.min(w / box.width, h / box.height);
    if (scale >= 1 && k > 0) break;
    cell = Math.min(MAX_BOARD / n, cell * scale);
  }
  /* whole pixels keep the grid lines crisp */
  board.style.setProperty("--cell", `${Math.max(12, Math.floor(cell))}px`);
}

if (typeof ResizeObserver !== "undefined") {
  let raf;
  new ResizeObserver(() => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(fitBoard);
  }).observe($("stage"));
}
phone.addEventListener("change", fitBoard);
/* the pixel font changes the clue sizes: fit again once it has loaded */
if (document.fonts) {
  document.fonts.ready.then(fitBoard);
  document.fonts.addEventListener("loadingdone", fitBoard);
}

export const cellEl = (game, r, c) => $("cells").children[r * game.n + c];

export function paintCell(game, r, c) {
  const el = cellEl(game, r, c);
  const v = game.get(r, c);
  el.classList.toggle("is-filled", v === FILLED);
  el.classList.toggle("is-marked", v === MARKED);
  /* three states, so the state goes into the label instead of aria-pressed */
  const state = v === FILLED ? "filled" : v === MARKED ? "marked" : "empty";
  el.setAttribute("aria-label", `${t("cell")(r + 1, c + 1)}, ${t(state)}`);
}

export function paintAll(game) {
  for (let r = 0; r < game.n; r++) for (let c = 0; c < game.n; c++) paintCell(game, r, c);
  updateClues(game);
}

export function updateClues(game) {
  document.querySelectorAll("#cluesRow .clue").forEach((el, r) => el.classList.toggle("is-done", game.rowDone(r)));
  document.querySelectorAll("#cluesCol .clue").forEach((el, c) => el.classList.toggle("is-done", game.colDone(c)));
}

export function highlight(el) {
  document.querySelectorAll(".clue.is-hover").forEach((x) => x.classList.remove("is-hover"));
  if (!el) return;
  document.querySelector(`#cluesRow [data-row="${el.dataset.r}"]`)?.classList.add("is-hover");
  document.querySelector(`#cluesCol [data-col="${el.dataset.c}"]`)?.classList.add("is-hover");
}

export function flashWrong(game, cells) {
  cells.forEach(([r, c]) => cellEl(game, r, c).classList.add("is-wrong"));
  setTimeout(() => document.querySelectorAll(".is-wrong").forEach((x) => x.classList.remove("is-wrong")), 1400);
}

/* "check" result: visible line + polite announcement (role="status") */
let feedbackTimer;
export function showFeedback(text) {
  const el = $("feedback");
  el.textContent = text;
  clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => { el.textContent = ""; }, 3000);
}
export function clearFeedback() {
  clearTimeout(feedbackTimer);
  $("feedback").textContent = "";
}

/* screen-reader only announcement (the timer itself is not live) */
export function announce(text) {
  const el = $("announce");
  el.textContent = "";
  requestAnimationFrame(() => { el.textContent = text; });
}

export const setWon = (on) => $("board").classList.toggle("is-won", on);

export const showTime = (s) => { $("timer").textContent = fmt(s); };
export const showBest = (best) => { $("best").textContent = best != null ? `${t("best")} ${fmt(best)}` : ""; };

/* ---------- story card ---------- */
export function fillStory(game, revealed) {
  const lang = getLang();
  const p = game.puzzle;
  const name = p.name[lang];
  $("storyEyebrow").textContent = revealed ? t("solution") : `${t("solvedIn")} ${fmt(game.seconds)}`;
  $("storyTitle").textContent = name;
  /* show the original name when it differs from the translated one */
  $("storyNative").textContent = name === p.original ? p.region[lang] : `${p.original} — ${p.region[lang]}`;
  $("storyText").textContent = p.text[lang];
}

export function showStory(game, revealed) {
  fillStory(game, revealed);
  announce(`${$("storyEyebrow").textContent}. ${$("storyTitle").textContent}`);
  /* phones: let the last cross-stitch finish before the sheet covers the board
     (same timing as the --d delay per cell + the 0.45s stitch animation) */
  $("story").style.setProperty("--sheet-delay", `${(2 * game.n - 2) * 35 + 450}ms`);
  $("story").hidden = false;
  $("stage").classList.add("has-story");
  /* on phones the card is a sheet over the game: move focus into it */
  if (phone.matches) $("story").focus({ preventScroll: true });
}

export function hideStory() {
  $("story").hidden = true;
  $("stage").classList.remove("has-story");
}

/* ---------- toggles ---------- */
export function syncTabs(collection, level) {
  document.querySelectorAll("button[data-collection]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.collection === collection));
  document.querySelectorAll("button[data-level]").forEach((b) => {
    const lv = b.dataset.level;
    const ready = hasPuzzle(collection, lv);
    b.setAttribute("aria-pressed", lv === level);
    /* still focusable, so keyboard and screen reader users can find out why it is locked */
    if (ready) b.removeAttribute("aria-disabled");
    else b.setAttribute("aria-disabled", "true");
    b.querySelector("small").textContent = ready ? `${LEVELS[lv]}×${LEVELS[lv]}` : t("soon");
  });
}

/* progress dots under the level switch: ● solved · ring = current · ○ not yet */
export function renderDots(collection, level, index) {
  const list = puzzleList(collection, level);
  const nav = $("dots");
  nav.hidden = list.length < 2;
  nav.innerHTML = list.map((_, i) => {
    const solved = isSolved(collection, level, i);
    const state = t(solved ? "dotSolved" : "dotUnsolved");
    const current = i === index ? ' aria-current="true"' : "";
    return `<button type="button" class="dot${solved ? " is-solved" : ""}" data-index="${i}"${current} aria-label="${t("dotLabel")(i + 1, list.length)}, ${state}"></button>`;
  }).join("");
}

export function syncTool(mode) {
  $("modeFill").setAttribute("aria-pressed", mode === FILLED);
  $("modeMark").setAttribute("aria-pressed", mode === MARKED);
}
