/* =========================================================
   INTERFACE TEXT — en · ca (Valencian) · uk
   ========================================================= */
/* 1 помилка · 2–4 помилки · 5+ помилок */
const ukPlural = (n, one, few, many) => {
  const d = n % 10, h = n % 100;
  if (d === 1 && h !== 11) return one;
  if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return few;
  return many;
};

export const STRINGS = {
  en: {
    tagline: "stitch by stitch, from Ukraine to València",
    ukraine: "ukraine", valencia: "valència", ukraineShort: "UA", valenciaShort: "VAL",
    easy: "easy", medium: "medium", hard: "hard", soon: "coming soon",
    check: "check", reset: "reset", solution: "solution", next: "next puzzle",
    hint: "click to fill · right-click to mark · drag to paint · progress saves automatically",
    madeBy: "made by", author: "valeria pavlova",
    solvedIn: "solved in", best: "best",
    altColors: "Alternative colors", sound: "Sound", collection: "Collection", level: "Level",
    board: "Puzzle board", tool: "Tool", fill: "Fill cell", mark: "Mark empty",
    hintTouch: "tap to fill · long-press or × tool to mark · drag to paint · progress saves automatically",
    keys: "arrow keys move · enter or space fills · x marks empty",
    filled: "filled", marked: "marked empty", empty: "empty",
    noErrors: "no mistakes so far",
    mistakes: (n) => `${n} ${n === 1 ? "mistake" : "mistakes"}`,
    cell: (r, c) => `Row ${r}, column ${c}`,
    puzzles: "Puzzles in this level",
    dotLabel: (i, n) => `Puzzle ${i} of ${n}`, dotSolved: "solved", dotUnsolved: "not solved yet", close: "Close",
    title: "Punt — a nonogram game"
  },
  ca: {
    tagline: "punt a punt, d'Ucraïna a València",
    ukraine: "ucraïna", valencia: "valència", ukraineShort: "UA", valenciaShort: "VAL",
    easy: "fàcil", medium: "mitjà", hard: "difícil", soon: "prompte",
    check: "comprova", reset: "reinicia", solution: "solució", next: "següent",
    hint: "clic per a omplir · clic dret per a marcar · arrossega per a pintar · el progrés es guarda sol",
    madeBy: "fet per", author: "valeria pavlova",
    solvedIn: "resolt en", best: "millor",
    altColors: "Colors alternatius", sound: "So", collection: "Col·lecció", level: "Nivell",
    board: "Tauler", tool: "Eina", fill: "Omplir casella", mark: "Marcar buida",
    hintTouch: "toca per a omplir · mantín premut o eina × per a marcar · arrossega per a pintar · el progrés es guarda sol",
    keys: "fletxes per a moure't · intro o espai omplin · x marca buida",
    filled: "plena", marked: "marcada buida", empty: "buida",
    noErrors: "de moment, cap error",
    mistakes: (n) => `${n} ${n === 1 ? "error" : "errors"}`,
    cell: (r, c) => `Fila ${r}, columna ${c}`,
    puzzles: "Nonogrames d'aquest nivell",
    dotLabel: (i, n) => `Nonograma ${i} de ${n}`, dotSolved: "resolt", dotUnsolved: "encara sense resoldre", close: "Tanca",
    title: "Punt — un joc de nonogrames"
  },
  uk: {
    tagline: "стібок за стібком, з України до Валенсії",
    ukraine: "україна", valencia: "валенсія", ukraineShort: "UA", valenciaShort: "VAL",
    easy: "легко", medium: "середньо", hard: "складно", soon: "скоро",
    check: "перевірити", reset: "скинути", solution: "рішення", next: "далі",
    hint: "клік — заповнити · правий клік — позначити · тягни, щоб малювати · прогрес зберігається сам",
    madeBy: "зробила", author: "валерія павлова",
    solvedIn: "розв'язано за", best: "рекорд",
    altColors: "Інші кольори", sound: "Звук", collection: "Колекція", level: "Рівень",
    board: "Поле гри", tool: "Інструмент", fill: "Заповнити клітинку", mark: "Позначити порожню",
    hintTouch: "тап — заповнити · довге натискання або × — позначити · тягни, щоб малювати · прогрес зберігається сам",
    keys: "стрілки — рух · enter або пробіл — заповнити · x — позначити порожню",
    filled: "заповнена", marked: "позначена порожньою", empty: "порожня",
    noErrors: "поки без помилок",
    mistakes: (n) => `${n} ${ukPlural(n, "помилка", "помилки", "помилок")}`,
    cell: (r, c) => `Рядок ${r}, стовпець ${c}`,
    puzzles: "Нонограми цього рівня",
    dotLabel: (i, n) => `Нонограма ${i} з ${n}`, dotSolved: "розв'язана", dotUnsolved: "ще не розв'язана", close: "Закрити",
    title: "Punt — гра-нонограма"
  }
};

import { store } from "./storage.js";

export const LANGS = Object.keys(STRINGS);
let lang = "en";

export const getLang = () => lang;
export const t = (k) => STRINGS[lang][k];

/* apply the language to every [data-i18n*] node */
export function setLang(l) {
  lang = STRINGS[l] ? l : "en";
  document.documentElement.lang = lang;
  document.title = t("title");
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-label]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nLabel)));
  document.querySelectorAll("[data-i18n-title]").forEach((el) => el.setAttribute("title", t(el.dataset.i18nTitle)));
  document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === lang));
  store.setRaw("punt:lang", lang);
}

export function initialLang() {
  const saved = store.getRaw("punt:lang");
  if (saved && STRINGS[saved]) return saved;
  const nav = (navigator.language || "en").toLowerCase();
  if (nav.startsWith("uk")) return "uk";
  if (nav.startsWith("ca")) return "ca";
  return "en";
}
