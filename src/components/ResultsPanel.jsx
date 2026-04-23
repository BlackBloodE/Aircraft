/**
 * 辨識結果顯示面板
 * @param {{ res, usedModel, ts, jetApiData, jetApiLoading, locked }} props
 */
export default function ResultsPanel({ res, usedModel, ts, jetApiData, jetApiLoading, locked }) {
  if (!res) return null;

  // 過濾無效值
  const v = x => x && !["null", "unknown", "n/a", "none", ""].includes(String(x).toLowerCase()) ? x : null;

  if (!res.is_aircraft) {
    return (
      <div className="results">
        <div className="noplane">
          <div className="i">⚠</div>
          <p>未偵測到飛機目標</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results">
      <div className="rhdr">
        <span className="rtitle">▌ 識別結果</span>
        <span className="rmodel">{usedModel}</span>
        <span className="rtime">{ts}</span>
      </div>
      <div className="dgrid">
        {/* 機型：JetAPI 優先，查不到則顯示 AI 辨識版本 */}
        <div className="dcell">
          <div className="dlabel">機型 / Type</div>
          {jetApiLoading && !jetApiData ? (
            <div className="fl-loading"><span className="fl-spin">⟳</span>查詢中...</div>
          ) : v(jetApiData?.type) ? (
            <div className="fl-val-wrap">
              <div className="dval lg" style={{ fontSize: "16px" }}>{jetApiData.type}</div>
              <span className="fl-source">JetAPI</span>
            </div>
          ) : v(res.type) ? (
            <div className="fl-val-wrap">
              <div className="dval lg" style={{ fontSize: "16px" }}>{res.type}</div>
              <span className="fl-source">AI 辨識</span>
            </div>
          ) : (
            <div className="dval dim">—</div>
          )}
          <div className="cbar"><div className="cfill" style={{ width: `${res.confidence || 0}%` }} /></div>
        </div>

        {/* 航空公司：JetAPI 優先，查不到則顯示 AI 辨識版本 */}
        <div className="dcell">
          <div className="dlabel">航空公司 / Airline</div>
          {jetApiLoading && !jetApiData ? (
            <div className="fl-loading"><span className="fl-spin">⟳</span>查詢中...</div>
          ) : v(jetApiData?.airline) ? (
            <div className="fl-val-wrap">
              <div className="dval">{jetApiData.airline}</div>
              <span className="fl-source">JetAPI</span>
            </div>
          ) : v(res.airline) ? (
            <div className="fl-val-wrap">
              <div className="dval">{res.airline}</div>
              <span className="fl-source">AI 辨識</span>
            </div>
          ) : (
            <div className="dval dim">—</div>
          )}
        </div>

        {/* 機尾號 */}
        <div className="dcell">
          <div className="dlabel">機尾號 / Registration</div>
          <div className="fl-val-wrap">
            <div className={`dval${!v(res.registration) ? " dim" : ""}${locked && v(res.registration) ? " reg-lock" : ""}`}>
              {v(res.registration) || "—"}
            </div>
            {v(res.registration) && <span className="fl-source">AI 辨識</span>}
          </div>
        </div>

        {/* 可信度 */}
        <div className="dcell">
          <div className="dlabel">可信度 / Confidence</div>
          <div className="dval lg">{res.confidence || 0}<span style={{ fontSize: "11px" }}>%</span></div>
        </div>
      </div>

      {res.notes && (
        <div className="notes">
          <div className="nlabel">▌ AI 分析備註</div>
          <div className="ntext">{res.notes}</div>
        </div>
      )}
    </div>
  );
}
