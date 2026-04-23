// api/jetapi.js — JetAPI 機尾號查詢（航空公司、機型）

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

// 從各種可能的巢狀結構中取出值
function extract(obj, ...paths) {
  for (const path of paths) {
    const keys = path.split(".");
    let cur = obj;
    for (const k of keys) {
      if (cur == null || typeof cur !== "object") { cur = null; break; }
      cur = cur[k];
    }
    if (cur != null && cur !== "") return String(cur);
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { registration } = req.body;
  if (!registration) return res.status(400).json({ error: "缺少機尾號 (registration)" });

  const reg = registration.trim().toUpperCase();
  const url = `https://www.jetapi.dev/api?reg=${encodeURIComponent(reg)}&only_fr=true`;

  try {
    const resp = await fetchWithTimeout(url, 8000, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; AircraftID/1.0)",
      },
    });

    if (!resp.ok) {
      return res.status(200).json({ found: false, reason: `查詢失敗 (HTTP ${resp.status})` });
    }

    const data = await resp.json();

    // 處理空回應
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return res.status(200).json({ found: false, reason: `查無 "${reg}" 的資料` });
    }

    // 支援陣列或物件回應
    const item = Array.isArray(data) ? data[0] : data;

    // 嘗試多層可能的欄位路徑（含 FR24 巢狀格式）
    const airline = extract(item,
      "Airline",                    // JetAPI 實際欄位（大寫）
      "Operator",
      "flightroute.airline.name",
      "flightroute.airline.short",
      "airline.name",
      "airline.short",
      "airline",
      "operator",
      "owner",
      "airline_name",
    );

    const type = extract(item,
      "Aircraft",                         // JetAPI 實際欄位（大寫）
      "TypeCode",
      "flightroute.aircraft.model.text",
      "flightroute.aircraft.model.code",
      "aircraft.model.text",
      "aircraft.model.code",
      "aircraft.type",
      "type",
      "aircraft_type",
      "model",
      "icaoType",
      "icao_type",
    );

    if (!airline && !type) {
      return res.status(200).json({ found: false, reason: `"${reg}" 有資料但無航空公司/機型資訊` });
    }

    return res.status(200).json({ found: true, airline, type });

  } catch (e) {
    const timedOut = e.name === "AbortError";
    return res.status(200).json({
      found:  false,
      reason: timedOut ? "JetAPI 查詢逾時" : "JetAPI 查詢失敗",
    });
  }
}
