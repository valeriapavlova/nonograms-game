/* localStorage wrapper — every call survives private mode / blocked storage */
export const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage off */ } },
  remove(k) { try { localStorage.removeItem(k); } catch (e) { /* storage off */ } },
  getRaw(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  setRaw(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage off */ } }
};

/* keys — one set per puzzle: collection, level and its position in the list */
export const progressKey = (c, l, i) => `punt:${c}:${l}:${i}`;
export const bestKey = (c, l, i) => `punt:${c}:${l}:${i}:best`;

export const loadProgress = (c, l, i) => store.get(progressKey(c, l, i));
export const saveProgress = (c, l, i, data) => store.set(progressKey(c, l, i), data);
export const clearProgress = (c, l, i) => store.set(progressKey(c, l, i), null);

export const loadBest = (c, l, i) => store.get(bestKey(c, l, i));
export function saveBest(c, l, i, seconds) {
  const best = loadBest(c, l, i);
  if (best == null || seconds < best) store.set(bestKey(c, l, i), seconds);
}

/* a puzzle counts as solved once it has a best time (revealing the solution does not count) */
export const isSolved = (c, l, i) => loadBest(c, l, i) != null;

/* which puzzle of each level was open last: { "ua:easy": 2, … } */
export const loadPositions = () => store.get("punt:positions") || {};
export const savePositions = (p) => store.set("punt:positions", p);

/* before the lists, each level had one puzzle saved under punt:c:l —
   it is now the first puzzle of that level */
export function migrateSingleLevels(levels) {
  for (const [c, l] of levels) {
    const oldProgress = store.get(`punt:${c}:${l}`);
    const oldBest = store.get(`punt:${c}:${l}:best`);
    if (oldProgress && !loadProgress(c, l, 0)) saveProgress(c, l, 0, oldProgress);
    if (oldBest != null && loadBest(c, l, 0) == null) store.set(bestKey(c, l, 0), oldBest);
    store.remove(`punt:${c}:${l}`);
    store.remove(`punt:${c}:${l}:best`);
  }
}
