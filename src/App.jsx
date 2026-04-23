import { useState, useRef, useCallback } from "react";
import { css } from "./styles.js";
import { loadKeys, saveKeys, loadModel, saveModel } from "./utils/storage.js";
import { compressImage } from "./utils/image.js";
import { readExif } from "./utils/exif.js";
import { useHistory } from "./hooks/useHistory.js";
import { useAnalyze } from "./hooks/useAnalyze.js";
import PuterWarningModal  from "./components/modals/PuterWarningModal.jsx";
import DuplicateWarnModal from "./components/modals/DuplicateWarnModal.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import ImageViewer   from "./components/ImageViewer.jsx";
import ResultsPanel  from "./components/ResultsPanel.jsx";
import CameraInfo    from "./components/CameraInfo.jsx";
import HistoryPanel  from "./components/HistoryPanel.jsx";

export default function App() {
  // ── 圖片狀態 ──────────────────────────────────────────────────
  const [imgSrc, setImgSrc]   = useState(null);
  const [b64, setB64]         = useState(null);
  const [imgInfo, setImgInfo] = useState(null);
  const [exifData, setExifData] = useState(null);
  const [drag, setDrag]       = useState(false);
  const fileRef               = useRef();

  // ── 設定狀態 ──────────────────────────────────────────────────
  const [showSettings, setShowSettings] = useState(false);
  const [selectedModel, setSelectedModel] = useState(loadModel);
  const [apiKeys, setApiKeys] = useState(loadKeys);

  // ── 歷史紀錄 ──────────────────────────────────────────────────
  const historyCtx = useHistory();

  // ── 辨識流程 ──────────────────────────────────────────────────
  const analyzeCtx = useAnalyze({
    history:       historyCtx.history,
    addRecord:     historyCtx.addRecord,
    patchRecord:   historyCtx.patchRecord,
    selectedModel,
    apiKeys,
    imgSrc,
    b64,
    exifData,
  });

  const {
    busy, msg, res, errDetail, ts, usedModel,
    jetApiData, jetApiLoading, locked, failed,
    puterAcked, puterWarnOpen, dupWarnOpen, dupWarnInfo,
    currentModel, canAnalyze,
    analyze, confirmPuterWarn, confirmDupWarn,
    togglePuterAck, resetAnalyze, restoreFromHistory,
    cancelPuterWarn, cancelDupWarn,
    setMsg,
  } = analyzeCtx;

  // ── 操作函式 ──────────────────────────────────────────────────
  const handleSelectModel = (id) => { setSelectedModel(id); saveModel(id); };
  const handleSaveKey = (providerKey, val) => {
    const updated = { ...apiKeys, [providerKey]: val };
    setApiKeys(updated);
    saveKeys(updated);
  };

  const loadFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    resetAnalyze();
    setExifData(null);
    setMsg("讀取圖像與 EXIF 中...");
    try {
      const [compressed, exif] = await Promise.all([
        compressImage(file),
        readExif(file),
      ]);
      const { dataUrl, b64: c, width, height, sizeKB } = compressed;
      setImgSrc(dataUrl);
      setB64(c);
      setImgInfo({ width, height, sizeKB });
      setExifData(exif);
      const exifHint = exif
        ? (exif.Make ? ` · ${[exif.Make, exif.Model].filter(Boolean).join(" ")}` : " · 含 EXIF")
        : "";
      setMsg(`圖像已載入 · ${width}×${height} · ${sizeKB} KB${exifHint}`);
    } catch { setMsg("錯誤 · 圖像載入失敗"); }
  }, [resetAnalyze, setMsg]);

  const reset = () => {
    setImgSrc(null); setB64(null); setImgInfo(null); setExifData(null);
    resetAnalyze();
  };

  const handleSelectHistory = (record) => {
    const restored = historyCtx.restoreRecord(record);
    setImgSrc(restored.imgSrc);
    setB64(restored.b64);
    setImgInfo(null);
    setExifData(null);
    restoreFromHistory(restored);
    setMsg(`已還原歷史紀錄 · ${record.registration || "—"}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDrop = (e) => { e.preventDefault(); setDrag(false); loadFile(e.dataTransfer.files[0]); };

  // ── Render ────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>

      {puterWarnOpen && (
        <PuterWarningModal onConfirm={confirmPuterWarn} onCancel={cancelPuterWarn} />
      )}
      {dupWarnOpen && dupWarnInfo && (
        <DuplicateWarnModal info={dupWarnInfo} onConfirm={confirmDupWarn} onCancel={cancelDupWarn} />
      )}

      <div className="app">
        <div className="grid" />
        <div className="wrap">

          {/* ── Header ─────────────────────────────────────────── */}
          <div className="hdr">
            <div className="hdr-badge">Aviation Intelligence System v1.0</div>
            <h1>AircraftID</h1>
            <p className="sub">AI 飛機識別系統 · 機型 / 航空公司</p>
            <button
              className={`gear${showSettings ? " on" : ""}`}
              onClick={() => setShowSettings(s => !s)}
              title="設定"
            >⚙</button>
          </div>

          {/* ── Settings Panel ─────────────────────────────────── */}
          {showSettings && (
            <SettingsPanel
              selectedModel={selectedModel}
              onSelectModel={handleSelectModel}
              apiKeys={apiKeys}
              onSaveKey={handleSaveKey}
              onClose={() => setShowSettings(false)}
              history={historyCtx.history}
              onClearHistory={historyCtx.clearAll}
              puterAcked={puterAcked}
              onTogglePuterAck={togglePuterAck}
            />
          )}

          {/* ── Current Model Bar ──────────────────────────────── */}
          <div className="curmodel" onClick={() => setShowSettings(s => !s)}>
            <span style={{ opacity: .45 }}>⚙</span>
            <span>模型：</span>
            <span className="curmodel-name">{currentModel.name}</span>
            <span className="mbadge" style={{ fontSize: "8px", padding: "2px 5px", background: currentModel.badgeColor + "22", color: currentModel.badgeColor, border: `1px solid ${currentModel.badgeColor}44` }}>{currentModel.badge}</span>
            {!canAnalyze && <span className="curmodel-nokey">⚠ 未設定 API Key</span>}
            <span style={{ marginLeft: "auto", opacity: .3, fontSize: "10px" }}>點擊切換 ▾</span>
          </div>

          {/* ── Status Bar ─────────────────────────────────────── */}
          <div className="statusbar">
            <div className={`dot${busy ? " blink" : ""}`} />
            <span>{msg}</span>
          </div>

          {/* ── 隱藏 file input ────────────────────────────────── */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={e => { if (!busy) { loadFile(e.target.files[0]); } e.target.value = ""; }}
          />

          {/* ── Dropzone / Image Viewer ────────────────────────── */}
          {!imgSrc ? (
            <div
              className={`dropzone${drag ? " over" : ""}`}
              onClick={() => fileRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
            >
              <div className="plane-icon">✈</div>
              <h2>上傳飛機照片</h2>
              <p>支援任何大小 · 自動壓縮 · 自動讀取 EXIF 資訊</p>
            </div>
          ) : (
            <>
              <ImageViewer
                imgSrc={imgSrc}
                imgInfo={imgInfo}
                busy={busy}
                locked={locked}
                failed={failed}
                onClickChange={() => fileRef.current.click()}
              />
              <button
                className={`btn${busy ? " pulse" : ""}`}
                onClick={analyze}
                disabled={busy || !canAnalyze}
                title={!canAnalyze ? `請先在設定中填入 ${currentModel.provider} API Key` : ""}
              >
                {busy
                  ? `▌ ${currentModel.name} 分析中...`
                  : !canAnalyze
                    ? `⚠ 請先設定 ${currentModel.provider} API Key`
                    : "▶ 啟動識別掃描"}
              </button>
            </>
          )}

          {/* ── Error ──────────────────────────────────────────── */}
          {errDetail && (
            <div className="results"><div className="errmsg">⚠ {errDetail}</div></div>
          )}

          {/* ── Results ────────────────────────────────────────── */}
          <ResultsPanel
            res={res}
            usedModel={usedModel}
            ts={ts}
            jetApiData={jetApiData}
            jetApiLoading={jetApiLoading}
            locked={locked}
          />

          {/* ── Camera Info (EXIF) ─────────────────────────────── */}
          {imgSrc && <CameraInfo exif={exifData} />}

          {/* ── Reset Button ───────────────────────────────────── */}
          {imgSrc && (
            <button className="resetbtn" onClick={reset}>↺ 重置 · 上傳新圖片</button>
          )}

          {/* ── History Panel ──────────────────────────────────── */}
          <HistoryPanel
            history={historyCtx.history}
            onDelete={historyCtx.deleteRecord}
            onDeleteAll={historyCtx.clearAll}
            onSelect={handleSelectHistory}
          />

          {/* ── Footer ─────────────────────────────────────────── */}
          <div style={{ textAlign: "center", padding: "32px 0 12px" }}>
            <a
              href="https://github.com/BlackBloodE/Aircraft"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub 倉庫"
              style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "rgba(0,255,157,.25)", textDecoration: "none", fontSize: "11px", letterSpacing: "2px", transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(0,255,157,.7)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(0,255,157,.25)"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
              </svg>
              BlackBloodE / Aircraft
            </a>
          </div>

        </div>
      </div>
    </>
  );
}
