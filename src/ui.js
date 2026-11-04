/* DOM rendering — reads the Game, never changes it */
import { t, getLang } from "./i18n.js";
import { fmt, FILLED, MARKED } from "./game.js";

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
      b.setAttribute("aria-label", t("cell")(r + 1, c + 1));
      b.tabIndex = r === 0 && c === 0 ? 0 : -1;
      cells.appendChild(b);
    }
  }
  paintAll(game);
}

export const cellEl = (game, r, c) => $("cells").children[r * game.n + c];

export function paintCell(game, r, c) {
  const el = cellEl(game, r, c);
  const v = game.get(r, c);
  el.classList.toggle("is-filled", v === FILLED);
  el.classList.toggle("is-marked", v === MARKED);
  el.setAttribute("aria-pressed", v === FILLED ? "true" : "false");
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

export const setWon = (on) => $("board").classList.toggle("is-won", on);

export const showTime = (s) => { $("timer").textContent = fmt(s); };
export const showBest = (best) => { $("best").textContent = best ? `${t("best")} ${fmt(best)}` : ""; };

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
  $("story").hidden = false;
  $("stage").classList.add("has-story");
}

export function hideStory() {
  $("story").hidden = true;
  $("stage").classList.remove("has-story");
}

/* ---------- toggles ---------- */
export function syncTabs(collection, level) {
  document.querySelectorAll("button[data-collection]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.collection === collection));
  document.querySelectorAll("button[data-level]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.level === level));
}

export function syncTool(mode) {
  $("modeFill").setAttribute("aria-pressed", mode === FILLED);
  $("modeMark").setAttribute("aria-pressed", mode === MARKED);
}
