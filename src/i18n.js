/* =========================================================
   INTERFACE TEXT — en · ca (Valencian) · uk
   ========================================================= */
export const STRINGS = {
  en: {
    tagline: "stitch by stitch, from Ukraine to València",
    ukraine: "ukraine", valencia: "valència",
    easy: "easy", medium: "medium", hard: "hard", soon: "Coming soon",
    check: "check", reset: "reset", solution: "solution", next: "next puzzle",
    hint: "click to fill · right-click to mark · drag to paint · progress saves automatically",
    madeBy: "made by", author: "valeria pavlova",
    solvedIn: "solved in", best: "best",
    altColors: "Alternative colors", sound: "Sound", collection: "Collection", level: "Level",
    board: "Puzzle board", tool: "Tool", fill: "Fill cell", mark: "Mark empty",
    cell: (r, c) => `Row ${r}, column ${c}`,
    title: "Punt — a nonogram game"
  },
  ca: {
    tagline: "punt a punt, d'Ucraïna a València",
    ukraine: "ucraïna", valencia: "valència",
    easy: "fàcil", medium: "mitjà", hard: "difícil", soon: "Prompte",
    check: "comprova", reset: "reinicia", solution: "solució", next: "següent",
    hint: "clic per a omplir · clic dret per a marcar · arrossega per a pintar · el progrés es guarda sol",
    madeBy: "fet per", author: "valeria pavlova",
    solvedIn: "resolt en", best: "millor",
    altColors: "Colors alternatius", sound: "So", collection: "Col·lecció", level: "Nivell",
    board: "Tauler", tool: "Eina", fill: "Omplir casella", mark: "Marcar buida",
    cell: (r, c) => `Fila ${r}, columna ${c}`,
    title: "Punt — un joc de nonogrames"
  },
  uk: {
    tagline: "стібок за стібком, з України до Валенсії",
    ukraine: "україна", valencia: "валенсія",
    easy: "легко", medium: "середньо", hard: "складно", soon: "Скоро",
    check: "перевірити", reset: "скинути", solution: "рішення", next: "далі",
    hint: "клік — заповнити · правий клік — позначити · тягни, щоб малювати · прогрес зберігається сам",
    madeBy: "зробила", author: "валерія павлова",
    solvedIn: "розв'язано за", best: "рекорд",
    altColors: "Інші кольори", sound: "Звук", collection: "Колекція", level: "Рівень",
    board: "Поле гри", tool: "Інструмент", fill: "Заповнити клітинку", mark: "Позначити порожню",
    cell: (r, c) => `Рядок ${r}, стовпець ${c}`,
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
