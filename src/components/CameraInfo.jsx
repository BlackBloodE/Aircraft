import { useState } from "react";
import { fmtShutter, fmtDate } from "../utils/exif.js";

/**
 * 攝影資訊摺疊面板（EXIF 卡片）
 * @param {{ exif: object|null }} props
 */
export default function CameraInfo({ exif }) {
  const [open, setOpen] = useState(false);
  if (!exif) return null;

  const camera = [exif.Make, exif.Model].filter(Boolean).join(" ") || null;
  const rows = [
    { label: "相機",    value: camera },
    { label: "鏡頭",    value: exif.LensModel || null },
    { label: "拍攝時間", value: fmtDate(exif.DateTimeOriginal) },
    { label: "ISO",    value: exif.ISO != null ? String(exif.ISO) : null },
    { label: "光圈",   value: exif.FNumber != null ? `f/${exif.FNumber}` : null },
    { label: "快門",   value: fmtShutter(exif.ExposureTime) },
    { label: "焦距",   value: exif.FocalLength != null ? `${exif.FocalLength} mm` : null },
    { label: "等效焦距", value: exif.FocalLengthIn35mmFormat != null ? `${exif.FocalLengthIn35mmFormat} mm` : null },
  ].filter(r => r.value);

  const hasGps = exif.latitude != null && exif.longitude != null;
  if (rows.length === 0 && !hasGps) return null;

  return (
    <div className="exif-card">
      <button className="exif-toggle" onClick={() => setOpen(o => !o)}>
        <span className="etitle">
          <span>📷</span>
          <span>攝影資訊</span>
          {hasGps && <span className="exif-badge">GPS</span>}
          {camera && <span className="exif-badge">{camera.split(" ").slice(0, 2).join(" ")}</span>}
        </span>
        <span className="earrow">{open ? "▲ 收起" : "▼ 展開"}</span>
      </button>
      {open && (
        <div className="exif-body">
          <div className="exif-grid">
            {rows.map(r => (
              <div key={r.label} className="exif-row">
                <span className="exif-lbl">{r.label}</span>
                <span className="exif-val">{r.value}</span>
              </div>
            ))}
          </div>
          {hasGps && (
            <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(0,255,157,.06)" }}>
              <div className="exif-lbl" style={{ marginBottom: "4px" }}>GPS 座標</div>
              <div className="exif-val" style={{ fontSize: "11px", fontFamily: "'Share Tech Mono',monospace", color: "rgba(0,255,157,.7)" }}>
                {exif.latitude.toFixed(6)}, {exif.longitude.toFixed(6)}
              </div>
              <a
                href={`https://maps.google.com/?q=${exif.latitude},${exif.longitude}`}
                target="_blank" rel="noopener noreferrer"
                style={{ fontSize: "9px", color: "rgba(0,255,157,.4)", letterSpacing: "1px", textDecoration: "none", borderBottom: "1px solid rgba(0,255,157,.2)", paddingBottom: "1px", marginTop: "4px", display: "inline-block" }}
              >↗ 在 Google Maps 查看</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
