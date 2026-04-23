// api/flight.js — adsbdb 機尾號查詢
// 回傳 ICAO24 / operator / type，供前端優先使用（比 AI 辨識更可靠）

const ADSBDB = "https://api.adsbdb.com/v0";

async function fetchWithTimeout(url, timeoutMs, opts = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const resp = await fetch(url, { ...opts, signal: ctrl.signal });
    return resp;
  } finally {
    clearTimeout(timer);
  }
}

function isAbortError(e) {
  return e.name === "AbortError" || (e.message || "").toLowerCase().includes("aborted");
}

async function registrationToIcao24(registration) {
  const reg = registration.trim().toUpperCase();
  try {
    const resp = await fetchWithTimeout(`${ADSBDB}/aircraft/${encodeURIComponent(reg)}`, 6000);
    if (!resp.ok) return { found: false };
    const data = await resp.json();
    const ac = data?.response?.aircraft;
    if (!ac?.mode_s) return { found: false };
    return {
      found:    true,
      icao24:   ac.mode_s.toLowerCase().padStart(6, "0"),
      operator: ac.registered_owner || null,
      type:     ac.type             || null,
    };
  } catch (e) {
    if (isAbortError(e)) return { found: false, timedOut: true };
    return { found: false };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { registration } = req.body;
  if (!registration) return res.status(400).json({ error: "缺少機尾號 (registration)" });

  const result = await registrationToIcao24(registration);

  if (!result.found) {
    return res.status(200).json({
      found: false,
      reason: result.timedOut
        ? "adsbdb 查詢逾時，請稍後再試"
        : `查無 "${registration}" 的資料`,
    });
  }

  return res.status(200).json({
    found:    true,
    icao24:   result.icao24,
    operator: result.operator,
    type:     result.type,
  });
}
