/* Entry point: state + event wiring */
import { Game, FILLED, MARKED, EMPTY } from "./game.js";
import { getPuzzle, hasPuzzle, ORDER } from "./puzzles.js";
import { setLang, initialLang, t } from "./i18n.js";
import { store, loadProgress, saveProgress, clearProgress, loadBest, saveBest } from "./storage.js";
import * as ui from "./ui.js";

const { $ } = ui;

let collection = "ua";
let level = "easy";
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
  if (game && !game.won && timerId) saveProgress(collection, level, game.snapshot());
}

function load() {
  saveNow();
  game = new Game(getPuzzle(collection, level), loadProgress(collection, level));
  revealed = false;
  document.documentElement.dataset.collection = collection;
  stopTimer();
  ui.renderBoard(game);
  ui.hideStory();
  ui.clearFeedback();
  ui.showBest(loadBest(collection, level));
  ui.showTime(game.seconds);
}

/* ---------- play ---------- */
function setCell(r, c, v) {
  if (!game.set(r, c, v)) return;
  ui.paintCell(game, r, c);
  ui.updateClues(game);
  startTimer();
  blip();
  saveProgress(collection, level, game.snapshot());
  if (game.isSolved()) finish(false);
}

function finish(wasRevealed) {
  game.won = true;
  revealed = wasRevealed;
  stopTimer();
  ui.setWon(true);
  if (!wasRevealed) {
    saveBest(collection, level, game.seconds);
    ui.showBest(loadBest(collection, level));
  }
  clearProgress(collection, level);
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
  ui.highlight(el);
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
    ui.highlight(next);
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
    if (game.seconds % SAVE_EVERY === 0) saveProgress(collection, level, game.snapshot());
  }, 1000);
}
function stopTimer() { clearInterval(timerId); timerId = null; }

/* ---------- controls ---------- */
$("checkBtn").addEventListener("click", () => {
  if (game.won) return;
  const wrong = game.wrongCells();
  ui.flashWrong(game, wrong);
  ui.showFeedback(wrong.length ? t("mistakes")(wrong.length) : t("noErrors"));
});

$("resetBtn").addEventListener("click", () => {
  clearProgress(collection, level);
  load();
});

$("solveBtn").addEventListener("click", () => {
  if (game.won) return;
  game.reveal();
  ui.paintAll(game);
  finish(true);
});

$("nextBtn").addEventListener("click", () => {
  const i = ORDER.findIndex(([a, b]) => a === collection && b === level);
  [collection, level] = ORDER[(i + 1) % ORDER.length];
  ui.syncTabs(collection, level);
  load();
});

document.querySelectorAll("button[data-collection]").forEach((b) =>
  b.addEventListener("click", () => {
    collection = b.dataset.collection;
    if (!hasPuzzle(collection, level)) level = "easy";
    ui.syncTabs(collection, level);
    load();
  })
);
document.querySelectorAll("button[data-level]").forEach((b) =>
  b.addEventListener("click", () => {
    if (b.getAttribute("aria-disabled") === "true") return;
    level = b.dataset.level;
    ui.syncTabs(collection, level);
    load();
  })
);

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

/* sound: tiny click, off by default */
let audio;
$("soundBtn").setAttribute("aria-pressed", sound);
$("soundBtn").addEventListener("click", () => {
  sound = !sound;
  $("soundBtn").setAttribute("aria-pressed", sound);
  store.set("punt:sound", sound);
});
function blip() {
  if (!sound) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const o = audio.createOscillator(), g = audio.createGain();
    o.type = "square";
    o.frequency.value = 660;
    g.gain.setValueAtTime(0.04, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.06);
    o.connect(g).connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + 0.06);
  } catch (e) { /* no audio */ }
}

document.querySelectorAll("[data-lang]").forEach((b) =>
  b.addEventListener("click", () => {
    setLang(b.dataset.lang);
    ui.renderBoard(game);              /* cell labels */
    if (game.won) { ui.setWon(true); ui.fillStory(game, revealed); }
    ui.showBest(loadBest(collection, level));
    ui.syncTabs(collection, level);    /* "coming soon" label */
  })
);

/* save the clock when the tab is hidden or closed */
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") saveNow(); });
window.addEventListener("pagehide", saveNow);

/* touch screens get their own instructions */
if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) $("hint").dataset.i18n = "hintTouch";

setLang(initialLang());
ui.syncTabs(collection, level);
load();
