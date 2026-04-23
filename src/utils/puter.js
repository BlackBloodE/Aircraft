// ── Puter.js AI 呼叫工具 ────────────────────────────────────────

/**
 * 建立飛機辨識的 Prompt（含 EXIF 上下文）
 * @param {{ dateTime: string|null, location: string|null }|null} exifContext
 */
export function buildPuterPrompt(exifContext) {
  let p = `You are an expert aviation analyst. Analyze this aircraft image carefully and return ONLY valid JSON.\n\nIdentify from the image:\n1. Registration / tail number — check fuselage, tail fin, engines (e.g. B-18601, N12345, JA8001). Even partially visible registrations count — make your best guess.\n2. Aircraft type / model — (e.g. "Airbus A350-941", "Boeing 737-800", "Airbus A321neo")\n3. Airline — the operating airline name (e.g. "STARLUX", "China Airlines", "EVA Air")\n\nReturn this exact JSON structure (use null for any field that cannot be determined):\n{"is_aircraft":boolean,"registration":"tail number or null","type":"aircraft model or null","airline":"airline name or null","confidence":0-100,"notes":"brief observations in Traditional Chinese"}`;
  if (exifContext?.dateTime) p += `\n\nPhoto taken at: ${exifContext.dateTime}`;
  if (exifContext?.location) p += `\nGPS: ${exifContext.location} (use to narrow down registration prefixes)`;
  return p + "\n\nReturn ONLY the JSON object. No markdown, no extra text.";
}

/**
 * 解析 Puter AI 回傳的 JSON（容錯處理 Markdown 包裝等情況）
 * @param {string} raw
 * @returns {object}
 */
export function puterParseJSON(raw) {
  let clean = raw.replace(/^```(?:json)?\s*/im, "").replace(/\s*```\s*$/im, "").trim();
  try { return JSON.parse(clean); } catch {}
  const m = clean.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("AI 未回傳有效的 JSON");
  const fixed = m[0].replace(/("(?:[^"\\]|\\.)*")|[\n\r]+/g, (match, str) => str ? str : " ");
  return JSON.parse(fixed);
}

/**
 * 透過 Puter.js 呼叫 AI（使用 shorthand API 以確保 vision 模式正確啟用）
 * @param {string} b64 base64 圖片資料
 * @param {string} puterModel Puter 模型 ID（如 "google/gemini-2.5-flash"）
 * @param {string} prompt 分析提示詞
 * @returns {Promise<string>} AI 回傳的原始文字
 */
export async function callPuterAI(b64, puterModel, prompt) {
  const p = window.puter;
  if (!p?.ai?.chat) throw new Error("Puter.js 未載入，請重新整理頁面");
  // 使用 shorthand API: chat(prompt, imageDataUrl, options)
  // 這樣 Puter.js 會自動設定 vision:true，確保後端正確路由圖片
  const dataUrl = `data:image/jpeg;base64,${b64}`;
  const resp = await p.ai.chat(prompt, dataUrl, { model: puterModel });
  const content = resp?.message?.content ?? resp?.content ?? resp;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.filter(c => c.type === "text").map(c => c.text).join("");
  return String(content ?? "");
}
