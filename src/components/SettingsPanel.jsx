import { useState } from "react";
import { MODELS, PROVIDERS } from "../constants.js";
import { calcCacheSize, fmtBytes } from "../utils/storage.js";

function QDots({ n }) {
  return (
    <div className="mqdots">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className={`mqdot${i <= n ? " on" : ""}`} />
      ))}
    </div>
  );
}

/**
 * 設定面板（模型選擇 / API Key / 快取管理）
 * @param {{ selectedModel, onSelectModel, apiKeys, onSaveKey, onClose,
 *           history, onClearHistory, puterAcked, onTogglePuterAck }} props
 */
export default function SettingsPanel({
  selectedModel, onSelectModel,
  apiKeys, onSaveKey,
  onClose,
  history, onClearHistory,
  puterAcked, onTogglePuterAck,
}) {
  const [tab, setTab]       = useState("models");
  const [drafts, setDrafts] = useState(() => Object.fromEntries(PROVIDERS.map(p => [p.key, ""])));
  const [saved, setSaved]   = useState({});
  const [show, setShow]     = useState({});

  const hasKey = (modelId) => {
    const m = MODELS.find(x => x.id === modelId);
    if (m?.providerKey === "puter") return true;
    return !!apiKeys[m?.providerKey];
  };

  const handleSave = (providerKey) => {
    const val = drafts[providerKey].trim();
    if (!val) return;
    onSaveKey(providerKey, val);
    setDrafts(d => ({ ...d, [providerKey]: "" }));
    setSaved(s => ({ ...s, [providerKey]: true }));
    setTimeout(() => setSaved(s => ({ ...s, [providerKey]: false })), 2000);
  };

  const handleClear = (providerKey) => {
    onSaveKey(providerKey, "");
    setDrafts(d => ({ ...d, [providerKey]: "" }));
  };

  const mask = (k) => k ? k.slice(0, 6) + "••••••••" + k.slice(-3) : "";

  return (
    <div className="spanel">
      <div className="spanel-hdr">
        <span className="spanel-title">▌ 設定</span>
        <button className="spanel-close" onClick={onClose}>×</button>
      </div>
      <div className="stabs">
        <button className={`stab${tab === "models" ? " on" : ""}`} onClick={() => setTab("models")}>選擇模型</button>
        <button className={`stab${tab === "keys"   ? " on" : ""}`} onClick={() => setTab("keys")}>API 金鑰</button>
        <button className={`stab${tab === "cache"  ? " on" : ""}`} onClick={() => setTab("cache")}>快取</button>
      </div>

      {/* ── 模型選擇 ─────────────────────────────────────────────── */}
      {tab === "models" && (
        <div className="stab-body">
          <div style={{ fontSize: "8px", letterSpacing: "3px", color: "rgba(167,139,250,.5)", textTransform: "uppercase", marginBottom: "8px", paddingBottom: "6px", borderBottom: "1px solid rgba(167,139,250,.15)" }}>▌ Puter · 免費 · 無需 API Key</div>
          {MODELS.filter(m => m.providerKey === "puter").map(m => (
            <button
              key={m.id}
              className={`mitem${selectedModel === m.id ? " sel" : ""}`}
              onClick={() => { onSelectModel(m.id); onClose(); }}
            >
              <div className="mradio"><div className="mrdot" /></div>
              <div className="minfo">
                <div className="mnrow">
                  <span className="mname">{m.name}</span>
                  <span className="mprov">{m.provider}</span>
                  <span className="mbadge" style={{ background: m.badgeColor + "22", color: m.badgeColor, border: `1px solid ${m.badgeColor}44` }}>{m.badge}</span>
                  {m.id === "puter-gemini-25-lite" && (
                    <span style={{ fontSize: "8px", padding: "2px 6px", background: "rgba(0,255,157,.12)", color: "#00ff9d", border: "1px solid rgba(0,255,157,.35)", letterSpacing: "1px", fontWeight: 700 }}>推薦</span>
                  )}
                </div>
                <div className="mdesc">{m.desc}</div>
                <QDots n={m.quality} />
                <div style={{ fontSize: "9px", color: "rgba(167,139,250,.6)", marginTop: "4px" }}>✓ 首次使用將跳出 Puter 登入視窗</div>
              </div>
            </button>
          ))}

          {/* Puter 授權提醒開關 */}
          <label
            style={{ display: "flex", alignItems: "center", gap: "9px", marginTop: "10px", padding: "10px 12px", border: "1px solid rgba(167,139,250,.12)", background: "rgba(167,139,250,.04)", cursor: "pointer", userSelect: "none" }}
            onClick={onTogglePuterAck}
          >
            <input type="checkbox" readOnly checked={puterAcked} style={{ accentColor: "#a78bfa", width: "13px", height: "13px", flexShrink: 0, cursor: "pointer" }} />
            <span style={{ fontSize: "10px", color: "rgba(167,139,250,.55)", letterSpacing: "1px" }}>下次使用 Puter 時不再顯示第三方授權提醒</span>
          </label>

          <div style={{ fontSize: "8px", letterSpacing: "3px", color: "rgba(0,255,157,.35)", textTransform: "uppercase", margin: "14px 0 8px", paddingBottom: "6px", borderBottom: "1px solid rgba(0,255,157,.1)" }}>▌ 自備 API Key</div>
          {MODELS.filter(m => m.providerKey !== "puter").map(m => (
            <button
              key={m.id}
              className={`mitem${selectedModel === m.id ? " sel" : ""}`}
              onClick={() => { onSelectModel(m.id); onClose(); }}
            >
              <div className="mradio"><div className="mrdot" /></div>
              <div className="minfo">
                <div className="mnrow">
                  <span className="mname">{m.name}</span>
                  <span className="mprov">{m.provider}</span>
                  <span className="mbadge" style={{ background: m.badgeColor + "22", color: m.badgeColor, border: `1px solid ${m.badgeColor}44` }}>{m.badge}</span>
                </div>
                <div className="mdesc">{m.desc}</div>
                <QDots n={m.quality} />
                {!hasKey(m.id) && (
                  <div className="mno-key">⚠ 尚未設定 {m.provider} API Key</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── API Key ──────────────────────────────────────────────── */}
      {tab === "keys" && (
        <div className="stab-body">
          {PROVIDERS.map(p => (
            <div key={p.key} className="keyblock">
              <div className="keylabel">
                <span>{p.name}</span>
                <a href={p.link} target="_blank" rel="noopener noreferrer">{p.linkText} ↗</a>
              </div>
              <div className="keyrow">
                <input
                  className="keyinput"
                  type={show[p.key] ? "text" : "password"}
                  placeholder={apiKeys[p.key] ? mask(apiKeys[p.key]) : p.placeholder}
                  value={drafts[p.key]}
                  onChange={e => setDrafts(d => ({ ...d, [p.key]: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handleSave(p.key)}
                />
                <button className="keysave" onClick={() => handleSave(p.key)}>
                  {saved[p.key] ? "✓ 已儲存" : "儲存"}
                </button>
              </div>
              {apiKeys[p.key] ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div className="keystatus ok">✓ 已設定 · {mask(apiKeys[p.key])}</div>
                  <button className="keyclear" onClick={() => handleClear(p.key)}>清除</button>
                </div>
              ) : (
                <div className="keystatus empty">⚠ 尚未設定</div>
              )}
            </div>
          ))}
          <div className="privacy-note">🔒 API Key 僅儲存在您的瀏覽器本機，不會上傳至伺服器</div>
        </div>
      )}

      {/* ── 快取 ──────────────────────────────────────────────────── */}
      {tab === "cache" && (
        <div className="stab-body">
          <div className="cache-info">
            <div className="cache-row">
              <span className="cache-label">歷史紀錄筆數</span>
              <span className="cache-val">{history.length} 筆</span>
            </div>
            <div className="cache-row">
              <span className="cache-label">占用空間（估算）</span>
              <span className="cache-val">{fmtBytes(calcCacheSize())}</span>
            </div>
            <div className="cache-row" style={{ flexDirection: "column", alignItems: "stretch", gap: "8px" }}>
              <span className="cache-label">清除歷史紀錄</span>
              <button className="cache-clear" onClick={() => {
                if (window.confirm(`確定要清除全部 ${history.length} 筆辨識歷史？`)) {
                  onClearHistory();
                }
              }}>清除所有歷史紀錄</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
