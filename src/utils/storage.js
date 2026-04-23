import { STORAGE_KEY, MODEL_KEY, HISTORY_KEY, MAX_HISTORY, DEFAULT_MODEL, PUTER_ACK_KEY } from '../constants.js';

// ── API Keys ───────────────────────────────────────────────────
export const loadKeys  = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; } };
export const saveKeys  = (k) => localStorage.setItem(STORAGE_KEY, JSON.stringify(k));

// ── Model ──────────────────────────────────────────────────────
export const loadModel = () => localStorage.getItem(MODEL_KEY) || DEFAULT_MODEL;
export const saveModel = (m) => localStorage.setItem(MODEL_KEY, m);

// ── History ────────────────────────────────────────────────────
export const loadHistory = () => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; } };
export const saveHistory = (h) => { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, MAX_HISTORY))); } catch {} };

// ── Puter ACK ──────────────────────────────────────────────────
export const loadPuterAck  = () => localStorage.getItem(PUTER_ACK_KEY) === "1";
export const savePuterAck  = (val) => val ? localStorage.setItem(PUTER_ACK_KEY, "1") : localStorage.removeItem(PUTER_ACK_KEY);

// ── Cache ──────────────────────────────────────────────────────
export const calcCacheSize = () =>
  [STORAGE_KEY, MODEL_KEY, HISTORY_KEY].reduce((acc, k) => {
    const v = localStorage.getItem(k);
    return acc + (v ? v.length * 2 : 0);
  }, 0);

export const fmtBytes = (b) =>
  b >= 1048576 ? `${(b / 1048576).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`;
