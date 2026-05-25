# ✈ AircraftID · AI 飛機識別系統

上傳飛機照片，AI 自動辨識**機型、航空公司、機尾號**，並透過 JetAPI 交叉驗證查詢結果。

**線上體驗：** [https://aircraft-three.vercel.app](https://aircraft-gamma.vercel.app/)

---

## 功能特色

- **多模型支援** — Puter 免費模型（無需 API Key）或自備 Google / Anthropic / OpenAI API Key
- **EXIF 解析** — 自動讀取拍攝時間、GPS 座標、相機型號等資訊，輔助 AI 判斷
- **JetAPI 交叉驗證** — 辨識出機尾號後自動查詢官方資料庫比對機型與航空公司
- **辨識歷史紀錄** — 最多 50 筆，含縮圖、可點擊還原、可單筆或全部刪除
- **科技感動畫** — 掃描動畫、目標鎖定特效、失敗閃爍特效
- **快取管理** — 設定頁面顯示占用空間，支援一鍵清除

---

## AI 模型選擇

### 免費方案（Puter）

透過 [Puter](https://puter.com) 平台使用 AI，**完全免費、無需 API Key**，首次使用需以 Puter 帳號授權。

| 模型 | 說明 |
|------|------|
| **Gemini 2.5 Flash Lite** ⭐ 推薦 | 速度最快，適合清晰照片，日常首選 |
| **Gemini 2.5 Flash** | 精度最高，適合角度刁鑽或遮擋的照片 |
| **Gemini 2.0 Flash** | 穩定備援，舊版可靠 |

### 自備 API Key

API Key 僅儲存於瀏覽器本機（localStorage），不會上傳至任何伺服器。

| 模型 | 費用 | API Key 取得 |
|------|------|-------------|
| Gemini 2.5 Flash Lite | 免費方案可用 | [Google AI Studio](https://aistudio.google.com/apikey) |
| Gemini 2.5 Flash | 免費方案可用 | [Google AI Studio](https://aistudio.google.com/apikey) |
| Gemini 2.5 Pro | 付費 | [Google AI Studio](https://aistudio.google.com/apikey) |
| Claude Sonnet 4 | 付費 | [Anthropic Console](https://console.anthropic.com/settings/keys) |
| GPT-4o | 付費 | [OpenAI Platform](https://platform.openai.com/api-keys) |

---

## 部署方式

### 一、Fork 並部署到 Vercel（推薦）

1. Fork 此 repository 到自己的 GitHub 帳號
2. 前往 [vercel.com](https://vercel.com)，以 GitHub 帳號登入
3. 點 **Add New Project** → 選擇 fork 後的 repo
4. Framework Preset 選 **Vite**
5. 點 **Deploy**，完成

> **不需要設定任何環境變數。** API Key 由使用者在網頁設定頁面自行填入，儲存於瀏覽器本機。

### 二、本機開發

```bash
git clone https://github.com/BlackBloodE/Aircraft.git
cd Aircraft
npm install
npm run dev
```

開啟 http://localhost:5173，在右上角齒輪設定 API Key 或選擇 Puter 免費模型即可使用。

---

## 專案結構

```
Aircraft/
├── api/
│   ├── analyze.js              AI 辨識 serverless function（Gemini / Claude / OpenAI）
│   └── jetapi.js               JetAPI 機尾號查詢 serverless function
├── src/
│   ├── constants.js            全域常數（MODELS、PROVIDERS、Storage Keys）
│   ├── styles.js               全部 CSS-in-JS 樣式字串
│   ├── utils/
│   │   ├── storage.js          localStorage 讀寫工具
│   │   ├── image.js            圖片壓縮、縮圖產生、指紋計算
│   │   ├── exif.js             EXIF 解析與格式化
│   │   └── puter.js            Puter.js AI 呼叫封裝
│   ├── hooks/
│   │   ├── useHistory.js       歷史紀錄狀態管理
│   │   └── useAnalyze.js       辨識流程（Puter 警告 / 重複偵測 / AI 呼叫）
│   ├── components/
│   │   ├── modals/
│   │   │   ├── PuterWarningModal.jsx    Puter 首次使用授權提醒
│   │   │   └── DuplicateWarnModal.jsx   重複辨識確認
│   │   ├── SettingsPanel.jsx   設定面板（模型 / API Key / 快取）
│   │   ├── ImageViewer.jsx     圖片檢視區（含掃描 / 鎖定 / 失敗動畫）
│   │   ├── ResultsPanel.jsx    辨識結果顯示
│   │   ├── HistoryPanel.jsx    辨識歷史紀錄面板
│   │   └── CameraInfo.jsx      EXIF 攝影資訊摺疊卡片
│   ├── App.jsx                 薄編排層（~140 行）
│   └── main.jsx                React 入口
├── index.html                  載入 Puter.js CDN
├── package.json
├── vite.config.js
└── vercel.json
```

---

## 技術棧

- **前端** — React 18 + Vite，純 CSS-in-JS（無額外 UI 框架）
- **後端** — Vercel Serverless Functions
- **AI** — Google Gemini / Anthropic Claude / OpenAI GPT（自備 Key）或 Puter.js（免費）
- **資料庫查詢** — [JetAPI](https://www.jetapi.dev)
- **EXIF** — [exifr](https://github.com/MikeKovarik/exifr)
