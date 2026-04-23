// ── 模型清單 ──────────────────────────────────────────────────
export const MODELS = [
  // Puter（免費，無需 API Key）
  // 2.5 Flash Lite：速度最快，日常辨識首選；精度略遜於 2.5 Flash，但對大多數清晰照片綽綽有餘
  { id: "puter-gemini-25-lite", name: "Gemini 2.5 Flash Lite", provider: "Google",    providerKey: "puter",     puterModel: "google/gemini-2.5-flash-lite", badge: "PUTER", badgeColor: "#a78bfa", quality: 4, desc: "速度最快 · 適合清晰照片 · 日常首選 · 推薦" },
  // 2.5 Flash：辨識能力最強，適合角度刁鑽或局部遮擋的照片；速度稍慢於 Lite
  { id: "puter-gemini-25",      name: "Gemini 2.5 Flash",      provider: "Google",    providerKey: "puter",     puterModel: "google/gemini-2.5-flash",      badge: "PUTER", badgeColor: "#a78bfa", quality: 5, desc: "精度最高 · 適合難辨識照片 · 速度稍慢" },
  // 2.0 Flash：穩定可靠的舊版備援，若 2.5 系列出現問題可切換
  { id: "puter-gemini-20",      name: "Gemini 2.0 Flash",      provider: "Google",    providerKey: "puter",     puterModel: "gemini-2.0-flash",              badge: "PUTER", badgeColor: "#a78bfa", quality: 3, desc: "穩定備援 · 舊版可靠 · 速度快" },

  // 自備 API Key
  { id: "gemini-2.5-flash-lite",    name: "Gemini 2.5 Flash Lite", provider: "Google",    providerKey: "google",    badge: "FREE", badgeColor: "#00ff9d", quality: 3, desc: "免費 · 速度最快 · 適合日常使用" },
  { id: "gemini-2.5-flash",         name: "Gemini 2.5 Flash",      provider: "Google",    providerKey: "google",    badge: "FREE", badgeColor: "#00ff9d", quality: 4, desc: "免費 · 高效能 · 辨識能力強" },
  { id: "gemini-2.5-pro",           name: "Gemini 2.5 Pro",        provider: "Google",    providerKey: "google",    badge: "PAID", badgeColor: "#ffaa00", quality: 5, desc: "付費 · 最高精度 · 適合細節辨識" },
  { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4",       provider: "Anthropic", providerKey: "anthropic", badge: "PAID", badgeColor: "#ffaa00", quality: 5, desc: "付費 · 頂級辨識精度" },
  { id: "gpt-4o",                   name: "GPT-4o",                provider: "OpenAI",    providerKey: "openai",    badge: "PAID", badgeColor: "#ffaa00", quality: 5, desc: "付費 · 廣泛應用" },
];

// ── API Key 供應商 ────────────────────────────────────────────
export const PROVIDERS = [
  { key: "google",    name: "Google Gemini",  placeholder: "AIzaSy...",    link: "https://aistudio.google.com/apikey",         linkText: "免費取得" },
  { key: "anthropic", name: "Anthropic",      placeholder: "sk-ant-...",   link: "https://console.anthropic.com/settings/keys", linkText: "取得 Key" },
  { key: "openai",    name: "OpenAI",         placeholder: "sk-...",       link: "https://platform.openai.com/api-keys",        linkText: "取得 Key" },
];

// ── localStorage Keys ─────────────────────────────────────────
export const STORAGE_KEY   = "aircraftid_apikeys";
export const MODEL_KEY     = "aircraftid_model";
export const HISTORY_KEY   = "aircraftid_history";
export const PUTER_ACK_KEY = "aircraftid_puter_ack"; // "1" = 已同意，不再提示

// ── 其他常數 ──────────────────────────────────────────────────
export const MAX_HISTORY   = 50;
export const DEFAULT_MODEL = "puter-gemini-25-lite";
