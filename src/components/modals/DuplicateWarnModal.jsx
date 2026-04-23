/**
 * 重複辨識確認 Modal
 * @param {{ info: { ts: string, registration: string }, onConfirm: () => void, onCancel: () => void }} props
 */
export default function DuplicateWarnModal({ info, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal" style={{ borderColor: "rgba(255,170,0,.4)", boxShadow: "0 0 50px rgba(255,170,0,.12)" }}>
        <div className="modal-hdr" style={{ background: "rgba(255,170,0,.07)", borderColor: "rgba(255,170,0,.15)" }}>
          <span className="modal-hdr-icon">⚠</span>
          <span className="modal-hdr-title" style={{ color: "rgba(255,170,0,.9)" }}>重複辨識提醒</span>
        </div>
        <div className="modal-body">
          此圖片曾於 <b style={{ color: "rgba(255,170,0,.9)" }}>{info.ts}</b> 辨識過。<br/>
          機尾號：<b style={{ color: "rgba(255,170,0,.9)" }}>{info.registration || "未知"}</b><br/><br/>
          確定要再次辨識？<b style={{ color: "rgba(255,170,0,.75)" }}>將消耗 API 用量或 Puter 配額。</b>
        </div>
        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onCancel}>取消</button>
          <button
            className="modal-btn-ok"
            style={{ borderColor: "rgba(255,170,0,.8)", color: "rgba(255,170,0,.9)" }}
            onClick={onConfirm}
          >確認，再次辨識</button>
        </div>
      </div>
    </div>
  );
}
