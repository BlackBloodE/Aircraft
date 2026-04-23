import { useState } from "react";

/**
 * 首次使用 Puter 前的第三方授權提醒 Modal
 * @param {{ onConfirm: (dontShow: boolean) => void, onCancel: () => void }} props
 */
export default function PuterWarningModal({ onConfirm, onCancel }) {
  const [dontShow, setDontShow] = useState(false);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-hdr">
          <span className="modal-hdr-icon">⚠</span>
          <span className="modal-hdr-title">第三方服務授權提醒</span>
        </div>
        <div className="modal-body">
          即將使用 <b>Puter</b> 提供的免費 AI 服務進行辨識。<br/>
          首次使用時將跳出 <b>Puter 登入視窗</b>，需以 Puter 帳號授權。<br/>
          授權完成後即可免費使用，<b>圖片資料將傳送至 Puter 伺服器處理</b>。
          <label className="modal-check-row" onClick={() => setDontShow(v => !v)}>
            <input type="checkbox" readOnly checked={dontShow} />
            下次不再顯示此提醒
          </label>
        </div>
        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onCancel}>取消</button>
          <button className="modal-btn-ok" onClick={() => onConfirm(dontShow)}>確認，繼續辨識</button>
        </div>
      </div>
    </div>
  );
}
