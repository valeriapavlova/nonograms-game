/* Entry point: state + event wiring */
import { Game, FILLED, MARKED, EMPTY } from "./game.js";
import { getPuzzle, hasPuzzle, puzzleList, ORDER } from "./puzzles.js";
import { setLang, initialLang, t } from "./i18n.js";
import { store, loadProgress, saveProgress, clearProgress, loadBest, saveBest, isSolved, loadPositions, savePositions, migrateSingleLevels } from "./storage.js";
import * as ui from "./ui.js";
import { setSoundOn, unlockSound, playSound } from "./sound.js";

const { $ } = ui;

let collection = "ua";
let level = "easy";
let index = 0;           // position of the puzzle in its level's list
let game;
let tool = FILLED;       // active tool
let painting = null;     // value being painted during a drag
let timerId = null;
let revealed = false;
let sound = store.get("punt:sound") === true;
let longPress = null;    // touch: timer that turns a tap into a mark

const SAVE_EVERY = 5;    // seconds between autosaves of the timer
const LONG_PRESS_MS = 450;

/* ---------- build ---------- */
/* keep the clock when leaving a puzzle unfinished */
function saveNow() {
  if (game && !game.won && timerId) saveProgress(collection, level, index, game.snapshot());
}

const firstUnsolved = (c, l) => puzzleList(c, l).findIndex((_, i) => !isSolved(c, l, i));

/* the puzzle to open for a level: the one played last, else the first unsolved */
function startIndex(c, l) {
  const saved = loadPositions()[`${c}:${l}`];
  if (Number.isInteger(saved) && saved < puzzleList(c, l).length) return saved;
  return Math.max(0, firstUnsolved(c, l));
}

/* "next puzzle": next unsolved in this level, then the next level with one left */
function nextPuzzle() {
  const list = puzzleList(collection, level);
  for (let k = 1; k < list.length; k++) {
    const i = (index + k) % list.length;
    if (!isSolved(collection, level, i)) return [collection, level, i];
  }
  const at = ORDER.findIndex(([c, l]) => c === collection && l === level);
  for (let k = 1; k < ORDER.length; k++) {
    const [c, l] = ORDER[(at + k) % ORDER.length];
    const i = firstUnsolved(c, l);
    if (i >= 0) return [c, l, i];
  }
  /* everything is solved: just keep going in order */
  if (index + 1 < list.length) return [collection, level, index + 1];
  return [...ORDER[(at + 1) % ORDER.length], 0];
}

/* switch puzzle; every argument is optional */
function open(c = collection, l = level, i = startIndex(c, l)) {
  saveNow();
  collection = c;
  level = l;
  index = i;
  savePositions({ ...loadPositions(), [`${c}:${l}`]: i });
  ui.syncTabs(collection, level);
  load();
}

function load() {
  game = new Game(getPuzzle(collection, level, index), loadProgress(collection, level, index));
  revealed = false;
  document.documentElement.dataset.collection = collection;
  document.documentElement.dataset.level = level;
  stopTimer();
  ui.renderBoard(game, puzzleList(collection, level));
  ui.hideStory();
  ui.clearFeedback();
  ui.showBest(loadBest(collection, level, index));
  ui.showTime(game.seconds);
  ui.renderDots(collection, level, index);
}

/* ---------- play ---------- */
function setCell(r, c, v) {
  const rowWas = game.rowDone(r), colWas = game.colDone(c);
  if (!game.set(r, c, v)) return;
  ui.paintCell(game, r, c);
  ui.updateClues(game);
  startTimer();
  saveProgress(collection, level, index, game.snapshot());
  if (game.isSolved()) { finish(false); return; }          /* plays the win melody */
  if ((!rowWas && game.rowDone(r)) || (!colWas && game.colDone(c))) playSound("line");
  else playSound(v === FILLED ? "fill" : "mark");          /* ✕ and clearing share the soft click */
}

function finish(wasRevealed) {
  game.won = true;
  revealed = wasRevealed;
  stopTimer();
  ui.setWon(true);
  ui.highlight(null);                 /* drop the row/column rings */
  if (!wasRevealed) {
    playSound("win", collection);
    saveBest(collection, level, index, game.seconds);
    ui.showBest(loadBest(collection, level, index));
    ui.renderDots(collection, level, index);
  }
  clearProgress(collection, level, index);
  ui.showStory(game, wasRevealed);
}

/* pointer: click, right-click, drag to paint (mouse + touch) */
const cellsEl = $("cells");

cellsEl.addEventListener("contextmenu", (e) => e.preventDefault());

cellsEl.addEventListener("pointerdown", (e) => {
  const el = e.target.closest(".cell");
  if (!el || game.won) return;
  e.preventDefault();
  const r = +el.dataset.r, c = +el.dataset.c;
  const before = game.get(r, c);
  const t = e.button === 2 ? MARKED : tool;
  painting = before === t ? EMPTY : t;
  setCell(r, c, painting);

  /* touch: holding the first cell switches the stroke to "mark" */
  if (e.pointerType === "touch" && tool === FILLED) {
    longPress = { r, c, id: setTimeout(() => {
      if (game.won) return;
      painting = before === MARKED ? EMPTY : MARKED;
      setCell(r, c, painting);
      if (navigator.vibrate) navigator.vibrate(10);
    }, LONG_PRESS_MS) };
  }
});

function cancelLongPress() {
  if (longPress) clearTimeout(longPress.id);
  longPress = null;
}

window.addEventListener("pointermove", (e) => {
  const target = document.elementFromPoint(e.clientX, e.clientY);
  const el = target && target.closest ? target.closest(".cell") : null;
  ui.highlight(game.won ? null : el);
  if (painting === null || !el) return;
  if (longPress && (+el.dataset.r !== longPress.r || +el.dataset.c !== longPress.c)) cancelLongPress();
  setCell(+el.dataset.r, +el.dataset.c, painting);
});

window.addEventListener("pointerup", () => { painting = null; cancelLongPress(); });
window.addEventListener("pointercancel", () => { painting = null; cancelLongPress(); });

/* keyboard: arrows move, Enter/Space fill, X marks */
cellsEl.addEventListener("keydown", (e) => {
  const el = e.target.closest(".cell");
  if (!el) return;
  let r = +el.dataset.r, c = +el.dataset.c;
  const moves = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
  if (moves[e.key]) {
    e.preventDefault();
    r = Math.min(game.n - 1, Math.max(0, r + moves[e.key][0]));
    c = Math.min(game.n - 1, Math.max(0, c + moves[e.key][1]));
    el.tabIndex = -1;
    const next = ui.cellEl(game, r, c);
    next.tabIndex = 0;
    next.focus();
    ui.highlight(game.won ? null : next);
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    setCell(r, c, game.get(r, c) === tool ? EMPTY : tool);
  } else if (e.key.toLowerCase() === "x") {
    setCell(r, c, game.get(r, c) === MARKED ? EMPTY : MARKED);
  }
});

/* ---------- timer ---------- */
function startTimer() {
  if (timerId) return;
  timerId = setInterval(() => {
    game.seconds++;
    ui.showTime(game.seconds);
    if (game.seconds % SAVE_EVERY === 0) saveProgress(collection, level, index, game.snapshot());
  }, 1000);
}
function stopTimer() { clearInterval(timerId); timerId = null; }

/* ---------- controls ---------- */
$("checkBtn").addEventListener("click", () => {
  if (game.won) return;
  const wrong = game.wrongCells();
  ui.flashWrong(game, wrong);
  if (wrong.length) playSound("error");
  ui.showFeedback(wrong.length ? t("mistakes")(wrong.length) : t("noErrors"));
});

$("resetBtn").addEventListener("click", () => {
  clearProgress(collection, level, index);
  load();
});

$("solveBtn").addEventListener("click", () => {
  if (game.won) return;
  game.reveal();
  ui.paintAll(game);
  finish(true);
});

$("nextBtn").addEventListener("click", () => open(...nextPuzzle()));

/* phone bottom sheet: close with × or Escape, focus goes back to the board */
function closeStory() {
  if ($("story").hidden) return;
  ui.hideStory();
  const cell = $("cells").querySelector('[tabindex="0"]');
  if (cell) cell.focus({ preventScroll: true });
}
$("storyClose").addEventListener("click", closeStory);
$("story").addEventListener("keydown", (e) => { if (e.key === "Escape") closeStory(); });

document.querySelectorAll("button[data-collection]").forEach((b) =>
  b.addEventListener("click", () => {
    const c = b.dataset.collection;
    open(c, hasPuzzle(c, level) ? level : "easy");
  })
);
document.querySelectorAll("button[data-level]").forEach((b) =>
  b.addEventListener("click", () => {
    if (b.getAttribute("aria-disabled") === "true") return;
    open(collection, b.dataset.level);
  })
);

/* progress dots: one per puzzle of the level */
$("dots").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-index]");
  if (b && +b.dataset.index !== index) open(collection, level, +b.dataset.index);
});

$("modeFill").addEventListener("click", () => { tool = FILLED; ui.syncTool(tool); });
$("modeMark").addEventListener("click", () => { tool = MARKED; ui.syncTool(tool); });

/* palette: each collection has a native palette; the button flips to its alternative */
function setPalette(m) {
  document.documentElement.dataset.mode = m;
  $("themeBtn").setAttribute("aria-pressed", m === "alt");
  store.set("punt:mode", m);
}
if (store.get("punt:mode") === "alt") setPalette("alt");
$("themeBtn").addEventListener("click", () => {
  setPalette(document.documentElement.dataset.mode === "alt" ? "native" : "alt");
});

/* sound: off by default, the choice is remembered (sounds in sound.js) */
setSoundOn(sound);
$("soundBtn").setAttribute("aria-pressed", sound);
$("soundBtn").addEventListener("click", () => {
  sound = !sound;
  setSoundOn(sound);
  $("soundBtn").setAttribute("aria-pressed", sound);
  store.set("punt:sound", sound);
  playSound("fill");                   /* a stitch to say "sound is on" */
});
/* browsers (iOS above all) only start audio from a user gesture */
["pointerup", "keydown"].forEach((type) => document.addEventListener(type, unlockSound));

document.querySelectorAll("[data-lang]").forEach((b) =>
  b.addEventListener("click", () => {
    setLang(b.dataset.lang);
    ui.renderBoard(game, puzzleList(collection, level));   /* cell labels */
    if (game.won) { ui.setWon(true); ui.fillStory(game, revealed); }
    ui.showBest(loadBest(collection, level, index));
    ui.syncTabs(collection, level);    /* "coming soon" label */
    ui.renderDots(collection, level, index);
  })
);

/* save the clock when the tab is hidden or closed */
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") saveNow(); });
window.addEventListener("pagehide", saveNow);

/* touch screens get their own instructions */
if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) $("hint").dataset.i18n = "hintTouch";

migrateSingleLevels(ORDER);
setLang(initialLang());
open();
