// api/analyze.js — 使用使用者提供的 API Key，不需要環境變數

// 強健的 JSON 解析：處理 AI 常見的回傳問題
// 1. markdown code block（```json ... ```）
// 2. string 值內的裸換行符（JSON 規範不允許）
function robustParseJSON(raw) {
  // 移除 markdown code block
  let clean = raw
    .replace(/^```(?:json)?\s*/im, "")
    .replace(/\s*```\s*$/im, "")
    .trim();

  // 先嘗試直接解析
  try { return JSON.parse(clean); } catch (_) {}

  // 取出最外層的 JSON 物件
  const m = clean.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("AI 未回傳有效的 JSON");

  // 修正 string 值內的裸換行／回車，替換成空格
  // 正規式：匹配已跳脫的字串（跳過）或裸換行（替換）
  const fixed = m[0].replace(
    /("(?:[^"\\]|\\.)*")|[\n\r]+/g,
    (match, str) => str ? str : " "
  );

  return JSON.parse(fixed);
}

function buildPrompt(exifContext) {
  const base = `You are an expert aviation analyst. Analyze this aircraft image carefully and return ONLY valid JSON.

Identify the following from the image:
1. Registration / tail number — check fuselage, tail fin, engines (e.g. B-18601, N12345, JA8001, G-BOAC, HL7700). Even partially visible registrations count — make your best guess.
2. Aircraft type / model — (e.g. "Airbus A350-941", "Boeing 737-800", "Airbus A321neo")
3. Airline — the operating airline name (e.g. "STARLUX", "China Airlines", "EVA Air")

Return this exact JSON structure (use null for any field that cannot be determined):
{"is_aircraft":boolean,"registration":"tail number or null","type":"aircraft model or null","airline":"airline name or null","confidence":0-100,"notes":"brief observations in Traditional Chinese"}`;

  if (!exifContext || (!exifContext.dateTime && !exifContext.location)) {
    return base + "\n\nReturn ONLY the JSON object. No markdown, no extra text.";
  }

  let ctx = "\n\nAdditional photo metadata that may help:";
  if (exifContext.dateTime) {
    ctx += `\n- Photo taken at: ${exifContext.dateTime}`;
  }
  if (exifContext.location) {
    ctx += `\n- Photo GPS location: ${exifContext.location} (use this to narrow down possible registration prefixes for that country/region)`;
  }
  ctx += "\n\nReturn ONLY the JSON object. No markdown, no extra text.";

  return base + ctx;
}

async function callGemini(b64, model, apiKey, prompt) {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: "image/jpeg", data: b64 } }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048,
          // thinkingBudget:0 關閉 Gemini 2.5 thinking 功能：
          // 預設 thinking 至少佔用 1024 token，與 maxOutputTokens 同值時
          // 會把實際 JSON 回應截斷，導致 "Unterminated string" 錯誤
          thinkingConfig: { thinkingBudget: 0 }
        }
      })
    }
  );
  if (!resp.ok) { const e = await resp.json().catch(()=>({})); throw new Error(e?.error?.message || `Gemini ${resp.status}`); }
  const d = await resp.json();
  // Gemini 2.5 系列有 thinking 功能，parts[0] 可能是思考過程（thought:true），
  // 必須過濾掉才能拿到實際 JSON 輸出
  const parts = d.candidates?.[0]?.content?.parts || [];
  const text  = parts.filter(p => !p.thought).map(p => p.text || "").join("");
  return text || parts.at(-1)?.text || "";
}

async function callClaude(b64, model, apiKey, prompt) {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model, max_tokens: 1024, system: prompt,
      messages: [{ role: "user", content: [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } },
        { type: "text", text: "Identify the aircraft and return the JSON." }
      ]}]
    })
  });
  if (!resp.ok) { const e = await resp.json().catch(()=>({})); throw new Error(e?.error?.message || `Anthropic ${resp.status}`); }
  const d = await resp.json();
  return d.content?.map(b => b.text || "").join("") || "";
}

async function callOpenAI(b64, model, apiKey, prompt) {
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({
      model, max_tokens: 1024,
      messages: [{ role: "user", content: [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${b64}` } }
      ]}]
    })
  });
  if (!resp.ok) { const e = await resp.json().catch(()=>({})); throw new Error(e?.error?.message || `OpenAI ${resp.status}`); }
  const d = await resp.json();
  return d.choices?.[0]?.message?.content || "";
}

const GEMINI  = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-2.5-pro"];
const CLAUDE  = ["claude-sonnet-4-20250514"];
const OPENAI  = ["gpt-4o"];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { b64, model = "gemini-2.5-flash-lite", apiKey, exifContext } = req.body;
  if (!b64)    return res.status(400).json({ error: "Missing image data" });
  if (!apiKey) return res.status(400).json({ error: "Missing API Key，請在設定中填入 API Key" });

  const prompt = buildPrompt(exifContext || null);

  try {
    let raw = "";
    if (GEMINI.includes(model))      raw = await callGemini(b64, model, apiKey, prompt);
    else if (CLAUDE.includes(model)) raw = await callClaude(b64, model, apiKey, prompt);
    else if (OPENAI.includes(model)) raw = await callOpenAI(b64, model, apiKey, prompt);
    else return res.status(400).json({ error: `未知模型：${model}` });

    const parsed = robustParseJSON(raw);
    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
