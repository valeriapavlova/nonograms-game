/* localStorage wrapper — every call survives private mode / blocked storage */
export const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage off */ } },
  getRaw(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  setRaw(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage off */ } }
};

/* keys */
export const progressKey = (collection, level) => `punt:${collection}:${level}`;
export const bestKey = (collection, level) => `punt:${collection}:${level}:best`;

export const loadProgress = (c, l) => store.get(progressKey(c, l));
export const saveProgress = (c, l, data) => store.set(progressKey(c, l), data);
export const clearProgress = (c, l) => store.set(progressKey(c, l), null);

export const loadBest = (c, l) => store.get(bestKey(c, l));
export function saveBest(c, l, seconds) {
  const best = loadBest(c, l);
  if (!best || seconds < best) store.set(bestKey(c, l), seconds);
}
