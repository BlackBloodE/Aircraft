import { useState } from "react";
import { loadHistory, saveHistory } from "../utils/storage.js";
import { fmtDate } from "../utils/exif.js";

/**
 * 管理辨識歷史紀錄的狀態與操作
 */
export function useHistory() {
  const [history, setHistory] = useState(loadHistory);

  /** 新增一筆紀錄（若已有相同指紋則取代） */
  const addRecord = (record) => {
    setHistory(prev => {
      const exists = prev.findIndex(r => r.fingerprint === record.fingerprint);
      const updated = exists >= 0
        ? [record, ...prev.filter((_, i) => i !== exists)]
        : [record, ...prev];
      saveHistory(updated);
      return updated;
    });
  };

  /** 以 id 更新部分欄位（如 JetAPI 補全 type/airline） */
  const patchRecord = (id, patch) => {
    setHistory(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, ...patch } : r);
      saveHistory(updated);
      return updated;
    });
  };

  /** 刪除單筆 */
  const deleteRecord = (id) => {
    setHistory(prev => {
      const updated = prev.filter(r => r.id !== id);
      saveHistory(updated);
      return updated;
    });
  };

  /** 清除全部 */
  const clearAll = () => {
    saveHistory([]);
    setHistory([]);
  };

  /**
   * 將歷史紀錄還原為畫面狀態
   * @param {object} record
   * @returns {{ id, imgSrc, b64, res, usedModel, ts, jetApiData }}
   */
  const restoreRecord = (record) => {
    const restoreImg = record.img || record.thumb;
    return {
      id:         record.id,
      imgSrc:     restoreImg,
      b64:        restoreImg ? restoreImg.split(",")[1] : null,
      res:        {
        is_aircraft:  true,
        registration: record.registration,
        type:         record.type,
        airline:      record.airline,
        confidence:   record.confidence,
        notes:        record.notes,
      },
      usedModel:  record.model,
      ts:         fmtDate(record.ts),
      jetApiData: (record.type || record.airline)
        ? { found: true, type: record.type, airline: record.airline }
        : null,
    };
  };

  return { history, addRecord, patchRecord, deleteRecord, clearAll, restoreRecord };
}
