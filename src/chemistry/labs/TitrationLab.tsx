import React, { useState, useMemo } from 'react'

/**
 * 化學動態實驗室：酸鹼滴定與 pH 曲線實驗室 (TitrationLab)
 * 模擬強鹼 NaOH (0.1M) 滴定強酸 HCl (25mL, 0.1M) 與弱酸 CH3COOH (25mL, 0.1M, pKa=4.74)。
 * 包含動態滴定管、錐形瓶指示劑即時變色、S 型滴定曲線、緩衝區與當量點極值標記。
 */
export const TitrationLab: React.FC = () => {
  const [acidType, setAcidType] = useState<'strong' | 'weak'>('strong')
  const [indicator, setIndicator] = useState<'phenolphthalein' | 'btb' | 'methyl_orange'>('phenolphthalein')
  const [vTitrant, setVTitrant] = useState<number>(15) // 已加入 0.1M NaOH 體積 (mL)

  const cAcid = 0.1 // M
  const vAcid = 25 // mL
  const cBase = 0.1 // M
  const pKa = 4.74 // CH3COOH

  const vEquiv = (cAcid * vAcid) / cBase // 當量點 25.0 mL

  // 計算即時 pH
  const ph = useMemo(() => {
    if (vTitrant === 0) {
      return acidType === 'strong' ? 1.0 : 0.5 * (pKa - Math.log10(cAcid))
    }
    if (vTitrant < vEquiv) {
      if (acidType === 'strong') {
        const remainingMol = (cAcid * vAcid - cBase * vTitrant) / 1000
        const totalVolL = (vAcid + vTitrant) / 1000
        return Math.max(0.5, -Math.log10(remainingMol / totalVolL))
      } else {
        // 緩衝溶液 Henderson-Hasselbalch
        const ratio = vTitrant / Math.max(1e-4, vEquiv - vTitrant)
        return Math.max(1.0, Math.min(13.5, pKa + Math.log10(ratio)))
      }
    }
    if (Math.abs(vTitrant - vEquiv) < 1e-4) {
      return acidType === 'strong' ? 7.0 : 8.72
    }
    // 過量強鹼
    const excessMol = (cBase * (vTitrant - vEquiv)) / 1000
    const totalVolL = (vAcid + vTitrant) / 1000
    const poh = -Math.log10(excessMol / totalVolL)
    return Math.min(13.8, 14 - poh)
  }, [vTitrant, acidType, cAcid, vAcid, cBase, pKa, vEquiv])

  // 指示劑顏色判定
  const flaskLiquidColor = useMemo(() => {
    if (indicator === 'phenolphthalein') {
      // 酚酞：pH < 8.2 無色/微淡粉，pH > 8.2 鮮豔粉紅
      if (ph < 8.0) return 'rgba(241, 245, 249, 0.4)'
      if (ph < 8.5) return 'rgba(244, 114, 182, 0.45)'
      return 'rgba(236, 72, 153, 0.85)'
    }
    if (indicator === 'btb') {
      // 溴百里酚藍：pH < 6.0 黃色，6.0~7.6 綠色，> 7.6 藍色
      if (ph < 6.0) return 'rgba(250, 204, 21, 0.8)'
      if (ph <= 7.6) return 'rgba(34, 197, 94, 0.8)'
      return 'rgba(59, 130, 246, 0.85)'
    }
    // 甲基橙：pH < 3.1 紅色，3.1~4.4 橙色，> 4.4 黃色
    if (ph < 3.1) return 'rgba(239, 68, 68, 0.85)'
    if (ph <= 4.4) return 'rgba(249, 115, 22, 0.85)'
    return 'rgba(250, 204, 21, 0.85)'
  }, [ph, indicator])

  // 滴定曲線路徑 (0~50 mL)
  const curvePoints = useMemo(() => {
    const pts: Array<{ v: number; phVal: number }> = []
    for (let v = 0; v <= 50; v += 0.5) {
      let p = 7.0
      if (v === 0) {
        p = acidType === 'strong' ? 1.0 : 2.87
      } else if (v < 25) {
        if (acidType === 'strong') {
          const rem = (cAcid * vAcid - cBase * v) / 1000
          p = -Math.log10(rem / ((vAcid + v) / 1000))
        } else {
          p = pKa + Math.log10(v / (25 - v))
        }
      } else if (Math.abs(v - 25) < 0.1) {
        p = acidType === 'strong' ? 7.0 : 8.72
      } else {
        const exc = (cBase * (v - 25)) / 1000
        p = 14 + Math.log10(exc / ((vAcid + v) / 1000))
      }
      pts.push({ v, phVal: Math.min(14, Math.max(0, p)) })
    }
    return pts
  }, [acidType, cAcid, vAcid, cBase, pKa])

  // SVG 幾何參數
  const svgWidth = 420
  const svgHeight = 220
  const graphOriginX = 135
  const graphOriginY = 185
  const graphW = 260
  const graphH = 150

  const svgPath = useMemo(() => {
    return curvePoints
      .map((pt, idx) => {
        const sx = graphOriginX + (pt.v / 50) * graphW
        const sy = graphOriginY - (pt.phVal / 14) * graphH
        return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`
      })
      .join(' ')
  }, [curvePoints, graphOriginX, graphOriginY, graphW, graphH])

  const curSx = graphOriginX + (vTitrant / 50) * graphW
  const curSy = graphOriginY - (ph / 14) * graphH
  const eqSx = graphOriginX + (25 / 50) * graphW
  const eqSy = graphOriginY - ((acidType === 'strong' ? 7.0 : 8.72) / 14) * graphH

  return (
    <div className="math-lab chemistry-lab titration-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 頂部標題 */}
      <div className="lab-header" style={{ marginBottom: '0.6rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🧪</span> 酸鹼滴定與 pH 曲線實驗室 (Acid-Base Titration)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {'滴定當量點分析：強酸強鹼當量點 pH=7.0；弱酸強鹼半當量點 pH = pKa = 4.74，當量點弱鹼水解 pH=8.72。'}
          </p>
        </div>
      </div>

      {/* 經典酸鹼滴定情境快照切換 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.55rem' }}>
        <button
          type="button"
          className="pill-btn"
          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', background: acidType === 'strong' && vTitrant === 25 ? 'rgba(236, 72, 153, 0.2)' : undefined }}
          onClick={() => { setAcidType('strong'); setIndicator('phenolphthalein'); setVTitrant(25); }}
        >
          🧪 強酸滴定當量點 (HCl + NaOH, pH=7.0)
        </button>
        <button
          type="button"
          className="pill-btn"
          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', background: acidType === 'weak' && vTitrant === 12.5 ? 'rgba(56, 189, 248, 0.2)' : undefined }}
          onClick={() => { setAcidType('weak'); setIndicator('phenolphthalein'); setVTitrant(12.5); }}
        >
          ⚖️ 弱酸半當量緩衝點 (pH=pKa=4.74)
        </button>
        <button
          type="button"
          className="pill-btn"
          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', background: acidType === 'weak' && vTitrant === 25 ? 'rgba(236, 72, 153, 0.2)' : undefined }}
          onClick={() => { setAcidType('weak'); setIndicator('phenolphthalein'); setVTitrant(25); }}
        >
          🌸 弱酸當量點弱鹼水解 (pH=8.72 酚酞變粉紅)
        </button>
      </div>

      {/* 雙欄響應式佈局 */}
      <div
        className="lab-workspace-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(295px, 1fr))',
          gap: '0.75rem',
          alignItems: 'start',
          width: '100%',
        }}
      >
        {/* 左側 SVG 滴定裝置與 S 曲線 */}
        <div
          className="lab-canvas-box"
          style={{
            background: 'linear-gradient(180deg, #0b1329 0%, #0f172a 100%)',
            borderRadius: '10px',
            padding: '0.6rem',
            border: '1px solid #1e293b',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.72rem', color: '#94a3b8' }}>
            <span>滴定器材與 pH 即時曲線</span>
            <span style={{ color: ph < 7 ? '#ef4444' : ph > 7 ? '#38bdf8' : '#10b981', fontWeight: 600 }}>
              當前 pH = {ph.toFixed(2)}
            </span>
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: 'auto', display: 'block', overflow: 'hidden' }}
          >
            {/* === 左側：滴定管與錐形瓶 === */}
            {/* 滴定管 (Buret) */}
            <rect x="42" y="15" width="16" height="85" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" rx="2" />
            <rect x="44" y={17 + (vTitrant / 50) * 75} width="12" height={80 - (vTitrant / 50) * 75} fill="rgba(56, 189, 248, 0.4)" />
            <line x1="50" y1="100" x2="50" y2="115" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="50" cy="118" r="2.5" fill="#38bdf8" />
            <text x="50" y="12" fill="#94a3b8" fontSize="7" textAnchor="middle">滴定管 (NaOH)</text>

            {/* 錐形瓶 (Erlenmeyer Flask) */}
            <polygon
              points="40,126 60,126 78,185 22,185"
              fill={flaskLiquidColor}
              stroke="#cbd5e1"
              strokeWidth="1.8"
            />
            <text x="50" y="198" fill="#cbd5e1" fontSize="7.5" textAnchor="middle">
              {acidType === 'strong' ? 'HCl 溶液' : 'CH₃COOH'}
            </text>

            {/* === 右側：pH 曲線圖 === */}
            {/* 坐標軸 */}
            <line x1={graphOriginX} y1={graphOriginY} x2={graphOriginX + graphW} y2={graphOriginY} stroke="#475569" strokeWidth="1.5" />
            <line x1={graphOriginX} y1={graphOriginY - graphH} x2={graphOriginX} y2={graphOriginY} stroke="#475569" strokeWidth="1.5" />
            <text x={graphOriginX + 6} y={graphOriginY - graphH + 8} fill="#94a3b8" fontSize="8">pH</text>
            <text x={graphOriginX + graphW - 5} y={graphOriginY - 5} fill="#94a3b8" fontSize="8" textAnchor="end">V (mL)</text>

            {/* pH=7 中性基準線 */}
            <line
              x1={graphOriginX}
              y1={graphOriginY - (7 / 14) * graphH}
              x2={graphOriginX + graphW}
              y2={graphOriginY - (7 / 14) * graphH}
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <text x={graphOriginX - 8} y={graphOriginY - (7 / 14) * graphH + 3} fill="#64748b" fontSize="7">7</text>

            {/* 當量點 V=25mL 鉛直線 */}
            <line
              x1={eqSx}
              y1={graphOriginY - graphH}
              x2={eqSx}
              y2={graphOriginY}
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <text x={eqSx} y={graphOriginY + 12} fill="#64748b" fontSize="7.5" textAnchor="middle">25</text>

            {/* S 滴定曲線 */}
            <path d={svgPath} fill="none" stroke="#38bdf8" strokeWidth="2.5" />

            {/* 當量點標記 */}
            <circle cx={eqSx} cy={eqSy} r="4" fill="#10b981" stroke="#fff" strokeWidth="1" />
            <text x={eqSx + 6} y={eqSy - 4} fill="#34d399" fontSize="7.5" fontWeight="bold">
              當量點
            </text>

            {/* 當前操作點 */}
            <circle cx={curSx} cy={curSy} r="5.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            <text x={curSx} y={Math.max(20, curSy - 8)} fill="#f59e0b" fontSize="8.5" fontWeight="bold" textAnchor="middle">
              ({vTitrant.toFixed(1)}mL, {ph.toFixed(2)})
            </text>
          </svg>
        </div>

        {/* 右側控制面板 */}
        <div
          className="lab-controls-panel"
          style={{
            background: 'var(--surface)',
            padding: '0.65rem',
            borderRadius: '10px',
            border: '1px solid var(--line)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            minWidth: 0,
          }}
        >
          {/* 經典酸鹼滴定快照 */}
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '0.25rem' }}>
              ⚡ 經典酸鹼滴定情境快照：
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.3rem' }}>
              <button
                type="button"
                className="lab-snapshot-btn"
                onClick={() => {
                  setAcidType('strong')
                  setIndicator('btb')
                  setVTitrant(25.0)
                }}
                style={{
                  padding: '0.25rem 0.4rem',
                  fontSize: '0.68rem',
                  borderRadius: '6px',
                  border: '1px solid var(--line)',
                  background: 'var(--surface-soft)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                ⚖️ <strong>強酸強鹼當量點</strong>
                <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>HCl + NaOH · pH=7.00 中性</div>
              </button>
              <button
                type="button"
                className="lab-snapshot-btn"
                onClick={() => {
                  setAcidType('weak')
                  setIndicator('phenolphthalein')
                  setVTitrant(25.0)
                }}
                style={{
                  padding: '0.25rem 0.4rem',
                  fontSize: '0.68rem',
                  borderRadius: '6px',
                  border: '1px solid var(--line)',
                  background: 'var(--surface-soft)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                🌸 <strong>弱酸滴定酚酞變色</strong>
                <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>CH₃COOH · pH=8.72 弱鹼性</div>
              </button>
              <button
                type="button"
                className="lab-snapshot-btn"
                onClick={() => {
                  setAcidType('weak')
                  setIndicator('phenolphthalein')
                  setVTitrant(12.5)
                }}
                style={{
                  padding: '0.25rem 0.4rem',
                  fontSize: '0.68rem',
                  borderRadius: '6px',
                  border: '1px solid var(--line)',
                  background: 'var(--surface-soft)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                🧪 <strong>半中和點 (pH = pKa)</strong>
                <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>V=12.5mL · pH=4.74 最佳緩衝</div>
              </button>
              <button
                type="button"
                className="lab-snapshot-btn"
                onClick={() => {
                  setAcidType('strong')
                  setIndicator('methyl_orange')
                  setVTitrant(0.0)
                }}
                style={{
                  padding: '0.25rem 0.4rem',
                  fontSize: '0.68rem',
                  borderRadius: '6px',
                  border: '1px solid var(--line)',
                  background: 'var(--surface-soft)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                🔴 <strong>初始強酸狀態 (pH=1)</strong>
                <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>0.1M HCl 未加入滴定液</div>
              </button>
            </div>
          </div>

          {/* 酸液種類 */}
          <div>
            <label style={{ fontSize: '0.74rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
              被滴定酸液試樣：
            </label>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button
                type="button"
                className={`pill-btn ${acidType === 'strong' ? 'active' : ''}`}
                style={{ flex: 1, padding: '0.2rem', fontSize: '0.7rem' }}
                onClick={() => setAcidType('strong')}
              >
                強酸 HCl (0.1M)
              </button>
              <button
                type="button"
                className={`pill-btn ${acidType === 'weak' ? 'active' : ''}`}
                style={{ flex: 1, padding: '0.2rem', fontSize: '0.7rem' }}
                onClick={() => setAcidType('weak')}
              >
                弱酸 CH₃COOH (pKa 4.74)
              </button>
            </div>
          </div>

          {/* 指示劑種類 */}
          <div>
            <label style={{ fontSize: '0.74rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
              酸鹼指示劑：
            </label>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                type="button"
                className={`pill-btn ${indicator === 'phenolphthalein' ? 'active' : ''}`}
                style={{ flex: 1, padding: '0.15rem 0.2rem', fontSize: '0.65rem' }}
                onClick={() => setIndicator('phenolphthalein')}
              >
                酚酞 (8.2~10.0)
              </button>
              <button
                type="button"
                className={`pill-btn ${indicator === 'btb' ? 'active' : ''}`}
                style={{ flex: 1, padding: '0.15rem 0.2rem', fontSize: '0.65rem' }}
                onClick={() => setIndicator('btb')}
              >
                BTB (6.0~7.6)
              </button>
              <button
                type="button"
                className={`pill-btn ${indicator === 'methyl_orange' ? 'active' : ''}`}
                style={{ flex: 1, padding: '0.15rem 0.2rem', fontSize: '0.65rem' }}
                onClick={() => setIndicator('methyl_orange')}
              >
                甲基橙 (3.1~4.4)
              </button>
            </div>
          </div>

          {/* 滴入體積滑桿 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>已滴入 NaOH 體積：</span>
              <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{vTitrant.toFixed(1)} mL</strong>
            </div>
            <input
              type="range"
              aria-label="已滴入氫氧化鈉體積"
              aria-valuetext={`${vTitrant.toFixed(1)} 毫升`}
              min="0"
              max="50"
              step="0.5"
              value={vTitrant}
              onChange={(e) => setVTitrant(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb', margin: 0 }}
            />
            {/* 快速微調按鈕 */}
            <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.25rem' }}>
              <button
                type="button"
                className="pill-btn"
                style={{ flex: 1, padding: '0.15rem 0.2rem', fontSize: '0.65rem' }}
                onClick={() => setVTitrant(0)}
              >
                歸零
              </button>
              <button
                type="button"
                className="pill-btn"
                style={{ flex: 1, padding: '0.15rem 0.2rem', fontSize: '0.65rem' }}
                onClick={() => setVTitrant((v) => Math.min(50, v + 1))}
              >
                +1 mL
              </button>
              <button
                type="button"
                className="pill-btn"
                style={{ flex: 1, padding: '0.15rem 0.2rem', fontSize: '0.65rem' }}
                onClick={() => setVTitrant(25)}
              >
                當量點 (25mL)
              </button>
            </div>
          </div>

          {/* 數據面板 */}
          <div
            style={{
              background: 'var(--surface-soft)',
              padding: '0.45rem 0.55rem',
              borderRadius: '8px',
              fontSize: '0.72rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.22rem',
              border: '1px solid var(--line)',
              marginTop: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>當前溶液狀態：</span>
              <strong style={{ color: ph < 7 ? '#ef4444' : ph > 7 ? '#3b82f6' : '#10b981' }}>
                pH {ph.toFixed(2)} ({ph < 7 ? '酸性' : ph > 7 ? '鹼性' : '中性'})
              </strong>
            </div>
            {acidType === 'weak' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--muted)' }}>半當量點 (12.5mL)：</span>
                <strong style={{ color: '#8b5cf6' }}>pH = pKa = 4.74</strong>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>化學計量當量點：</span>
              <strong style={{ color: '#10b981' }}>25.0 mL ({acidType === 'strong' ? 'pH=7.00' : 'pH=8.72'})</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TitrationLab
