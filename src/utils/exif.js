// ── EXIF 解析 ─────────────────────────────────────────────────
let _exifrLib    = null;
let _exifrLoaded = false;

async function getExifr() {
  if (_exifrLoaded) return _exifrLib;
  _exifrLoaded = true;
  try {
    const mod = await import(/* @vite-ignore */ "https://cdn.jsdelivr.net/npm/exifr@7.1.3/dist/full.esm.js");
    _exifrLib = mod.default || mod;
  } catch { _exifrLib = null; }
  return _exifrLib;
}

/** 從 File 物件讀取 EXIF 資料，失敗回傳 null */
export async function readExif(file) {
  try {
    const exifr = await getExifr();
    if (!exifr) return null;
    const data = await exifr.parse(file, { tiff: true, exif: true, gps: true, icc: false, iptc: false, jfif: false });
    return data || null;
  } catch { return null; }
}

/** 將快門速度數值格式化為字串，如 "1/250s" */
export const fmtShutter = (t) => {
  if (t == null) return null;
  if (t >= 1) return `${t}s`;
  return `1/${Math.round(1 / t)}s`;
};

/** 將日期格式化為繁體中文本地時間字串 */
export const fmtDate = (d) => {
  if (!d) return null;
  try { return new Date(d).toLocaleString("zh-TW", { hour12: false }); } catch { return String(d); }
};

/**
 * 從 EXIF 資料建立供 AI 使用的上下文物件
 * @param {object|null} exifData
 * @returns {{ dateTime: string|null, location: string|null }|null}
 */
export function buildExifContext(exifData) {
  if (!exifData) return null;
  return {
    dateTime: exifData.DateTimeOriginal ? fmtDate(exifData.DateTimeOriginal) : null,
    location: (exifData.latitude != null && exifData.longitude != null)
      ? `${exifData.latitude.toFixed(5)}, ${exifData.longitude.toFixed(5)}`
      : null,
  };
}
