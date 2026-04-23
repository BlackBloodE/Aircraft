// ── Resize helpers ─────────────────────────────────────────────
function resizeDataUrl(dataUrl, maxPx, quality) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(maxPx / img.width, maxPx / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

/** 列表縮圖（72px、低品質） */
export const makeThumbnail  = (dataUrl) => resizeDataUrl(dataUrl, 72,  0.55);
/** 還原用圖（400px、中品質） */
export const makeHistoryImg = (dataUrl) => resizeDataUrl(dataUrl, 400, 0.78);

/** 以 base64 產生圖片指紋，用於重複偵測 */
export const imgFingerprint = (b64) => b64 ? `${b64.length}:${b64.slice(0, 60)}` : "";

/**
 * 壓縮圖片並返回 dataUrl / b64 / 尺寸資訊
 * @param {File} file
 * @param {number} maxPx 最大邊長（預設 1920）
 * @param {number} quality JPEG 品質（預設 0.85）
 * @returns {Promise<{dataUrl, b64, width, height, sizeKB}>}
 */
export function compressImage(file, maxPx = 1920, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxPx || height > maxPx) {
          if (width >= height) { height = Math.round(height * maxPx / width); width = maxPx; }
          else { width = Math.round(width * maxPx / height); height = maxPx; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve({ dataUrl, b64: dataUrl.split(",")[1], width, height, sizeKB: Math.round(dataUrl.length * 0.75 / 1024) });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
