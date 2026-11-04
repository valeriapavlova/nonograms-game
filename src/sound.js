/* Sounds — Web Audio only, no audio files. Off by default.
   Everything goes through one master gain of MAX, so the loudest
   moment stays low; each voice below peaks at a fraction of it.
   The AudioContext is created only once sound is switched on,
   and resumed from a user gesture (iOS needs that). */

const MAX = 0.15;
const SILENT = 0.0001;   /* exponential ramps cannot reach 0 */

let on = false;
let ctx = null;
let master = null;
let noiseBuffer = null;

export function setSoundOn(value) {
  on = value;
  unlockSound();
}

/* call from user gestures: creates / wakes the context */
export function unlockSound() {
  if (!on) return;
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = MAX;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume().catch(() => { /* not allowed yet */ });
  } catch (e) { ctx = null; /* no audio */ }
}

/* ---------- building blocks ---------- */

/* gain envelope: quick rise to `peak`, exponential fall */
function envelope(t, peak, attack, decay) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(SILENT, t);
  g.gain.linearRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(SILENT, t + attack + decay);
  g.connect(master);
  return g;
}

function tone(type, freq, t, peak, attack, decay, { to, filter } = {}) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + attack + decay);
  let out = envelope(t, peak, attack, decay);
  if (filter) {
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = filter;
    f.connect(out);
    out = f;
  }
  o.connect(out);
  o.start(t);
  o.stop(t + attack + decay + 0.05);
}

function noise(t, peak, decay, type, freq, q) {
  if (!noiseBuffer) {
    noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.2), ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  src.connect(f).connect(envelope(t, peak, 0.003, decay));
  src.start(t);
  src.stop(t + decay + 0.05);
}

/* small bell: a sine with one inharmonic partial */
function bell(freq, t, peak, decay) {
  tone("sine", freq, t, peak, 0.004, decay);
  tone("sine", freq * 2.76, t, peak * 0.3, 0.002, decay * 0.4);
}

/* plucked string, bandura-like: bright attack that darkens fast */
function pluck(freq, t, peak) {
  const g = envelope(t, peak, 0.004, 0.9);
  const f = ctx.createBiquadFilter();
  f.type = "lowpass";
  f.Q.value = 2;
  f.frequency.setValueAtTime(4200, t);
  f.frequency.exponentialRampToValueAtTime(500, t + 0.35);
  f.connect(g);
  for (const detune of [0, 4]) {
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = freq;
    o.detune.value = detune;
    o.connect(f);
    o.start(t);
    o.stop(t + 1);
  }
}

/* ---------- the sounds ---------- */
const NOTE = { D4: 293.66, F4: 349.23, A4: 440, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, E6: 1318.51 };

const SOUNDS = {
  /* needle through fabric: a short airy pass and a soft low tap */
  fill(t) {
    noise(t, 0.6, 0.045, "bandpass", 2600, 1.2);
    tone("sine", 190, t, 0.35, 0.003, 0.05, { to: 120 });
  },
  /* ✕ (and clearing a cell): quieter, muffled click */
  mark(t) {
    noise(t, 0.7, 0.03, "lowpass", 1200, 0.7);
  },
  /* a row or a column is complete: small bell */
  line(t) {
    bell(NOTE.G5 * 2, t, 0.3, 0.7);
  },
  /* mistakes after "check": low, short, soft-edged */
  error(t) {
    tone("triangle", 165, t, 0.6, 0.02, 0.22, { to: 115, filter: 900 });
  },
  /* win, Ukraine: plucked phrase in D minor, ends on a strummed chord */
  winua(t) {
    [NOTE.D4, NOTE.F4, NOTE.A4, NOTE.D5].forEach((f, i) => pluck(f, t + i * 0.15, 0.3));
    [NOTE.D4, NOTE.A4, NOTE.D5].forEach((f, i) => pluck(f, t + 0.7 + i * 0.03, 0.22));
  },
  /* win, València: bright bells going up, ends on a ringing pair */
  winva(t) {
    [NOTE.C5, NOTE.D5, NOTE.E5, NOTE.G5, NOTE.A5].forEach((f, i) => bell(f, t + i * 0.11, 0.25, 0.5));
    bell(NOTE.C6, t + 0.6, 0.25, 0.9);
    bell(NOTE.E6, t + 0.6, 0.15, 0.9);
  }
};

/* play("fill") · play("win", "ua") */
export function playSound(name, collection) {
  if (!on) return;
  unlockSound();
  const sound = SOUNDS[name === "win" ? `win${collection}` : name];
  if (!ctx || !sound) return;
  try { sound(ctx.currentTime + 0.01); } catch (e) { /* no audio */ }
}
