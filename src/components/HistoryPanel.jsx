import { useState } from "react";
import { fmtDate } from "../utils/exif.js";

/**
 * 辨識歷史紀錄面板
 * @param {{ history, onDelete, onDeleteAll, onSelect }} props
 */
export default function HistoryPanel({ history, onDelete, onDeleteAll, onSelect }) {
  const [open, setOpen] = useState(true);
  if (history.length === 0) return null;

  return (
    <div className="hist-panel">
      <div className="hist-hdr">
        <button className="hist-toggle" onClick={() => setOpen(o => !o)}>
          <span className="hist-title">▌ 辨識歷史</span>
          <span className="hist-count">{history.length} 筆</span>
          <span className="hist-arrow">{open ? "▲" : "▼"}</span>
        </button>
        <button className="hist-clear" onClick={() => {
          if (window.confirm("確定要清除所有辨識歷史？")) onDeleteAll();
        }}>全部刪除</button>
      </div>
      {open && (
        <div className="hist-list">
          {history.map(r => (
            <div key={r.id} className="hist-item hist-item-click" onClick={() => onSelect(r)}>
              {r.thumb
                ? <img src={r.thumb} className="hist-thumb" alt="" />
                : <div className="hist-thumb-ph">✈</div>
              }
              <div className="hist-info">
                <div className="hist-reg">{r.registration || "—"}</div>
                <div className="hist-detail">
                  {[r.airline, r.type].filter(Boolean).join(" · ") || "—"}
                </div>
                <div className="hist-meta">
                  <span className="hist-ts">{fmtDate(r.ts)}</span>
                  <span className="hist-mdl">{r.model}</span>
                  {r.source === "puter"
                    ? <span className="hist-src hist-src-puter">PUTER</span>
                    : <span className="hist-src hist-src-api">API</span>
                  }
                </div>
              </div>
              <button
                className="hist-del"
                onClick={e => { e.stopPropagation(); onDelete(r.id); }}
                title="刪除此筆"
              >✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
