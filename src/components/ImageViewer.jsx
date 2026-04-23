/**
 * 圖片檢視區（含掃描 / 鎖定 / 失敗動畫 overlay）
 * @param {{ imgSrc, imgInfo, busy, locked, failed, onClickChange }} props
 */
export default function ImageViewer({ imgSrc, imgInfo, busy, locked, failed, onClickChange }) {
  return (
    <div
      className="imgwrap"
      style={busy ? { cursor: "not-allowed" } : {}}
      onClick={() => !busy && onClickChange()}
    >
      <img src={imgSrc} alt="aircraft" />
      {!busy && (
        <div className="img-hint">
          <span>🔄 點擊更換圖片</span>
        </div>
      )}
      <div className="imglbl">TARGET ACQUIRED</div>
      {imgInfo && (
        <div className="sizetag">{imgInfo.width}×{imgInfo.height} · {imgInfo.sizeKB} KB</div>
      )}

      {/* 掃描動畫 overlay */}
      {busy && (
        <div className="scan-overlay">
          <div className="scan-bg" />
          <div className="scan-line" />
          <div className="scan-hgrid">
            {[...Array(9)].map((_, i) => <div key={i} style={{ top: `${(i + 1) * 10}%` }} />)}
          </div>
          <div className="scan-corner scan-tl" />
          <div className="scan-corner scan-tr" />
          <div className="scan-corner scan-bl" />
          <div className="scan-corner scan-br" />
          <div className="scan-ring" />
          <div className="scan-cross" />
          <div className="scan-top-txt">AIRCRAFT IDENTIFICATION SYSTEM</div>
          <div className="scan-data">
            <span>ICAO REG · SCANNING</span>
            <span>TYPE · IDENTIFYING</span>
            <span>AIRLINE · MATCHING</span>
          </div>
          <div className="scan-bot-txt">▌ ANALYZING TARGET ▌</div>
        </div>
      )}

      {/* 鎖定動畫 overlay */}
      {locked && (
        <div className="lock-overlay">
          <div className="lock-frame">
            <div className="lock-label">TARGET LOCKED</div>
          </div>
        </div>
      )}

      {/* 失敗動畫 overlay */}
      {failed && (
        <div className="fail-overlay">
          <div className="fail-bg" />
          <div className="fail-corner-tl" />
          <div className="fail-corner-tr" />
          <div className="fail-corner-bl" />
          <div className="fail-corner-br" />
          <div className="fail-x" />
          <div className="fail-text">TARGET NOT IDENTIFIED</div>
        </div>
      )}
    </div>
  );
}
