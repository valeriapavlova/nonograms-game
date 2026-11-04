# Punt — project rules

Punt is a nonogram game where every cell is a cross-stitch, with a Ukraine and a València collection. Read the README for the concept and structure.

## Rules (always follow)

- **Stack:** HTML, CSS and vanilla JavaScript (ES modules) only. No frameworks, no bundlers or build steps. No `!important` in CSS.
- **Design reference:** `design/punt-design.html`. Do not change the design (colors, type, layout, components, copy) without explicit permission from Valeria.
- **No blue in the Ukraine collection.** White + blue + red reads as the Russian flag. Ukraine uses only red, black and white linen. This applies to every Ukraine palette, native and alternative.
- **Texts:** all interface strings in all 3 languages (`en`, `ca` = Valencian, `uk`) live only in `src/i18n.js`. Never hard-code UI text elsewhere. Puzzle stories stay in `src/puzzles.js` in their existing format.
- **Puzzles:** before any commit that touches puzzles, run `npm run check`. It must report that every puzzle has exactly one solution.
- **Commits:** one commit per logical step. Short English message in the imperative mood ("Add …", "Fix …").
- **Git:** work on a branch and open a pull request into `main`. Never push to `main` directly.
- **Accessibility:** if something in the design conflicts with accessibility (WCAG 2.2 AA: contrast, focus, keyboard, screen readers, reduced motion), ask Valeria first. Do not fix it silently.

## Useful commands

- `npm start` — local server at http://localhost:8000 (ES modules need a server)
- `npm run check` — validate all puzzles
- `node scripts/screenshots.cjs` — regenerate README screenshots, OG image and PNG icons (needs Playwright and `npm start` running)
