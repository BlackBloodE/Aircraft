import { useState, useRef } from "react";
import { MODELS, PUTER_ACK_KEY } from "../constants.js";
import { imgFingerprint, makeThumbnail, makeHistoryImg } from "../utils/image.js";
import { buildExifContext, fmtDate } from "../utils/exif.js";
import { buildPuterPrompt, puterParseJSON, callPuterAI } from "../utils/puter.js";
import { loadPuterAck, savePuterAck } from "../utils/storage.js";

/**
 * 封裝完整的辨識流程，包含：
 * - Puter 首次使用警告 Modal
 * - 重複辨識偵測 Modal
 * - AI 呼叫（Puter / API Key）
 * - JetAPI 交叉驗證
 * - 動畫控制（scan / lock / fail）
 *
 * @param {{ history, addRecord, patchRecord }} historyCtx  來自 useHistory 的操作
 * @param {{ selectedModel, apiKeys, imgSrc, b64, exifData }} inputCtx 來自 App 的輸入狀態
 */
export function useAnalyze({ history, addRecord, patchRecord, selectedModel, apiKeys, imgSrc, b64, exifData }) {
  const [busy, setBusy]               = useState(false);
  const [msg, setMsg]                 = useState("就緒 · 等待目標圖像");
  const [res, setRes]                 = useState(null);
  const [errDetail, setErrDetail]     = useState(null);
  const [ts, setTs]                   = useState(null);
  const [usedModel, setUsedModel]     = useState(null);
  const [jetApiData, setJetApiData]   = useState(null);
  const [jetApiLoading, setJetApiLoading] = useState(false);
  const [locked, setLocked]           = useState(false);
  const [failed, setFailed]           = useState(false);
  const [puterAcked, setPuterAcked]   = useState(loadPuterAck);
  const [puterWarnOpen, setPuterWarnOpen] = useState(false);
  const [dupWarnOpen, setDupWarnOpen] = useState(false);
  const [dupWarnInfo, setDupWarnInfo] = useState(null);

  const currentHistoryId = useRef(null);

  // 衍生值（避免重複計算）
  const currentModel  = MODELS.find(m => m.id === selectedModel) || MODELS[0];
  const isPuter       = currentModel.providerKey === "puter";
  const canAnalyze    = isPuter || !!apiKeys[currentModel.providerKey];

  // ── 切換 Puter 提醒 ACK ──────────────────────────────────────
  const togglePuterAck = () => {
    const next = !puterAcked;
    setPuterAcked(next);
    savePuterAck(next);
  };

  // ── JetAPI 查詢 ───────────────────────────────────────────────
  const fetchJetApi = async (registration) => {
    if (!registration) return;
    setJetApiLoading(true);
    try {
      const resp = await fetch("/api/jetapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registration }),
      });
      if (!resp.ok) return;
      const data = await resp.json();
      if (data.found) {
        setJetApiData(data);
        // 補全歷史紀錄
        if (currentHistoryId.current) {
          patchRecord(currentHistoryId.current, {
            type:    data.type    || undefined,
            airline: data.airline || undefined,
          });
        }
      }
    } catch { /* 查詢失敗不影響主流程 */ } finally {
      setJetApiLoading(false);
    }
  };

  // ── 入口：analyze ─────────────────────────────────────────────
  const analyze = () => {
    if (!b64 || !canAnalyze) return;
    // 若 Puter 且未 ACK 則先跳警告 Modal
    if (isPuter && !loadPuterAck()) {
      setPuterWarnOpen(true);
      return;
    }
    runAnalyze();
  };

  const confirmPuterWarn = (dontShow) => {
    if (dontShow) {
      savePuterAck(true);
      setPuterAcked(true);
    }
    setPuterWarnOpen(false);
    runAnalyze();
  };

  // ── 重複偵測 ──────────────────────────────────────────────────
  const runAnalyze = () => {
    const fp       = imgFingerprint(b64);
    const existing = history.find(r => r.fingerprint === fp);
    if (existing) {
      setDupWarnInfo({ ts: fmtDate(existing.ts), registration: existing.registration });
      setDupWarnOpen(true);
      return;
    }
    proceedAnalyze();
  };

  const confirmDupWarn = () => {
    setDupWarnOpen(false);
    proceedAnalyze();
  };

  // ── 實際辨識 ──────────────────────────────────────────────────
  const proceedAnalyze = async () => {
    setBusy(true); setRes(null); setErrDetail(null);
    setMsg(`使用 ${currentModel.name} 掃描中...`);

    const exifContext = buildExifContext(exifData);

    try {
      let parsed;
      if (isPuter) {
        const prompt = buildPuterPrompt(exifContext);
        const raw    = await callPuterAI(b64, currentModel.puterModel, prompt);
        parsed = puterParseJSON(raw);
      } else {
        const resp = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ b64, model: selectedModel, apiKey: apiKeys[currentModel.providerKey], exifContext }),
        });
        if (!resp.ok) {
          const e = await resp.json().catch(() => ({}));
          throw new Error(e.error || `HTTP ${resp.status}`);
        }
        parsed = await resp.json();
      }

      setRes(parsed);
      setUsedModel(currentModel.name);
      setTs(new Date().toLocaleTimeString("zh-TW", { hour12: false }));
      setMsg(parsed.is_aircraft ? "識別完成 · 目標確認" : "識別完成 · 未偵測到飛機");

      if (!parsed.is_aircraft) {
        setFailed(true);
        setTimeout(() => setFailed(false), 2600);
      }

      if (parsed.is_aircraft) {
        // 觸發鎖定動畫
        setLocked(false);
        requestAnimationFrame(() => requestAnimationFrame(() => setLocked(true)));
        setTimeout(() => setLocked(false), 2400);

        // 存入歷史紀錄
        const validVal = x => x && !["null", "unknown", "n/a", "none", ""].includes(String(x).toLowerCase()) ? x : null;
        Promise.all([makeThumbnail(imgSrc), makeHistoryImg(imgSrc)]).then(([thumb, img]) => {
          const record = {
            id:           Date.now(),
            fingerprint:  imgFingerprint(b64),
            thumb,
            img,
            registration: parsed.registration,
            type:         parsed.type  || null,
            airline:      parsed.airline || null,
            confidence:   parsed.confidence,
            notes:        parsed.notes,
            model:        currentModel.name,
            source:       isPuter ? "puter" : "api",
            ts:           new Date().toISOString(),
          };
          currentHistoryId.current = record.id;
          addRecord(record);
        });

        // JetAPI 交叉驗證
        const validReg = validVal(parsed.registration);
        if (validReg) fetchJetApi(validReg);
      }
    } catch (e) {
      setMsg("錯誤 · 分析失敗");
      setErrDetail(e.message);
      setFailed(true);
      setTimeout(() => setFailed(false), 2600);
    } finally {
      setBusy(false);
    }
  };

  // ── 重置（清除辨識結果與動畫狀態） ────────────────────────────
  const resetAnalyze = () => {
    setRes(null); setErrDetail(null);
    setUsedModel(null); setTs(null);
    setJetApiData(null); setLocked(false); setFailed(false);
    setMsg("就緒 · 等待目標圖像");
    currentHistoryId.current = null;
  };

  /**
   * 從歷史紀錄還原辨識狀態（由 App 呼叫）
   * @param {{ id, res, usedModel, ts, jetApiData }} restored  useHistory.restoreRecord 的回傳值
   */
  const restoreFromHistory = (restored) => {
    setRes(restored.res);
    setUsedModel(restored.usedModel);
    setTs(restored.ts);
    setJetApiData(restored.jetApiData);
    setJetApiLoading(false);
    setErrDetail(null);
    setLocked(false);
    setFailed(false);
    currentHistoryId.current = restored.id;
  };

  return {
    // 狀態
    busy, msg, res, errDetail, ts, usedModel,
    jetApiData, jetApiLoading,
    locked, failed,
    puterAcked, puterWarnOpen, dupWarnOpen, dupWarnInfo,
    // 衍生值
    currentModel, isPuter, canAnalyze,
    // 操作
    analyze, confirmPuterWarn, confirmDupWarn,
    togglePuterAck, resetAnalyze, restoreFromHistory,
    setMsg,
    // Modals 關閉
    cancelPuterWarn: () => setPuterWarnOpen(false),
    cancelDupWarn:   () => setDupWarnOpen(false),
  };
}
