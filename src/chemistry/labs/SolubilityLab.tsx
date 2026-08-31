import React, { useState, useMemo } from 'react'

interface SoluteInfo {
  id: string
  name: string
  formula: string
  color: string
  evalSolubility: (tempC: number) => number
  desc: string
}

const SOLUTES: SoluteInfo[] = [
  {
    id: 'kno3',
    name: '硝酸鉀',
    formula: 'KNO₃',
    color: '#38bdf8',
    evalSolubility: (t) => 13.3 + 0.6 * t + 0.015 * t * t, // 20°C ~31.6g, 60°C ~110g, 80°C ~169g
    desc: '吸熱溶解，溶解度隨溫度劇烈上升',
  },
  {
    id: 'nacl',
    name: '氯化鈉 (食鹽)',
    formula: 'NaCl',
    color: '#facc15',
    evalSolubility: (t) => 35.7 + 0.04 * t, // 20°C ~36g, 100°C ~39.8g
    desc: '溶解度受溫度影響微弱',
  },
  {
    id: 'cuso4',
    name: '硫酸銅',
    formula: 'CuSO₄',
    color: '#60a5fa',
    evalSolubility: (t) => 14.3 + 0.45 * t + 0.003 * t * t, // 20°C ~20.7g, 60°C ~40g
    desc: '藍色晶體，隨溫度平穩上升',
  },
  {
    id: 'ce2so4',
    name: '硫酸鈰',
    formula: 'Ce₂(SO₄)₃',
    color: '#f43f5e',
    evalSolubility: (t) => Math.max(1.5, 20.0 - 0.18 * t), // 逆溶解度
    desc: '放熱溶解，高溫溶解度反而下降',
  },
]

/**
 * 化學動態實驗室：溶解度曲線與結晶析出實驗室 (SolubilityLab)
 * 模擬固體溶質溶解度曲線、飽和/未飽和/過飽和狀態、降溫結晶與析出量計算。
 */
export const SolubilityLab: React.FC = () => {
  const [soluteId, setSoluteId] = useState<string>('kno3')
  const [tempC, setTempC] = useState<number>(60) // 溫度 (°C)
  const [waterG, setWaterG] = useState<number>(100) // 水重 (g)
  const [soluteAdded, setSoluteAdded] = useState<number>(90) // 加入溶質重 (g)

  const activeSolute = SOLUTES.find((s) => s.id === soluteId) || SOLUTES[0]

  // 當前溫度下的最大溶解度 (g / 100g 水)
  const maxSolPer100 = activeSolute.evalSolubility(tempC)
  // 當前水量下的最大溶解量 (g)
  const maxDissolved = (maxSolPer100 * waterG) / 100

  // 實際溶解量與結晶析出量
  const dissolved = Math.min(soluteAdded, maxDissolved)
  const precipitated = Math.max(0, soluteAdded - maxDissolved)
  const isSaturated = soluteAdded >= maxDissolved
  const concentrationPct = ((dissolved / Math.max(1, waterG + dissolved)) * 100).toFixed(1)

  // SVG 幾何
  const svgWidth = 420
  const svgHeight = 220

  // 左側溶解度曲線 (T: 0~100°C, S: 0~180g)
  const gX = 35
  const gY = 185
  const gW = 190
  const gH = 150

  const curvePath = useMemo(() => {
    const pts: string[] = []
    for (let t = 0; t <= 100; t += 2) {
      const s = activeSolute.evalSolubility(t)
      const sx = gX + (t / 100) * gW
      const sy = gY - (Math.min(180, s) / 180) * gH
      pts.push(`${t === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`)
    }
    return pts.join(' ')
  }, [activeSolute, gX, gY, gW, gH])

  const curCurveSx = gX + (tempC / 100) * gW
  const curCurveSy = gY - (Math.min(180, maxSolPer100) / 180) * gH

  // 右側燒杯幾何
  const beakerX = 270
  const beakerY = 40
  const beakerW = 110
  const beakerH = 135
  const liquidH = Math.min(beakerH - 20, 40 + (waterG / 200) * 55)
  const liquidY = beakerY + beakerH - liquidH

  // 沉澱物高度比例
  const precipH = Math.min(35, (precipitated / 150) * 35)

  return (
    <div className="math-lab chemistry-lab solubility-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 頂部標題 */}
      <div className="lab-header" style={{ marginBottom: '0.6rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🧊</span> 溶解度曲線與結晶析出實驗室 (Solubility & Crystallization)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            飽和溶液：溶劑在特定溫度下所能溶解之溶質上限。降溫或蒸發溶劑破壞溶解平衡即可析出固體晶體。
          </p>
        </div>
      </div>

      {/* 溶質種類快選 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.55rem' }}>
        {SOLUTES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`pill-btn ${soluteId === s.id ? 'active' : ''}`}
            style={{ padding: '0.15rem 0.4rem', fontSize: '0.68rem' }}
            onClick={() => setSoluteId(s.id)}
          >
            {s.formula} ({s.name})
          </button>
        ))}
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
        {/* 左側 SVG 溶解度圖表與燒杯視口 */}
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
            <span>溶解度曲線與燒杯析出</span>
            <span style={{ color: isSaturated ? '#ef4444' : '#10b981', fontWeight: 600 }}>
              {isSaturated ? `飽和 (析出 ${precipitated.toFixed(1)}g)` : '未飽和溶液'}
            </span>
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: 'auto', display: 'block', overflow: 'hidden' }}
          >
            {/* === 左側：溶解度曲線 === */}
            <line x1={gX} y1={gY} x2={gX + gW} y2={gY} stroke="#475569" strokeWidth="1.5" />
            <line x1={gX} y1={gY - gH} x2={gX} y2={gY} stroke="#475569" strokeWidth="1.5" />
            <text x={gX + 4} y={gY - gH + 8} fill="#94a3b8" fontSize="7.5">S (g/100g水)</text>
            <text x={gX + gW - 4} y={gY - 5} fill="#94a3b8" fontSize="7.5" textAnchor="end">T (°C)</text>

            {/* 曲線本體 */}
            <path d={curvePath} fill="none" stroke={activeSolute.color} strokeWidth="2.5" />

            {/* 當前溫度操作點 */}
            <line x1={curCurveSx} y1={gY} x2={curCurveSx} y2={curCurveSy} stroke="rgba(244, 63, 94, 0.4)" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx={curCurveSx} cy={curCurveSy} r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
            <text x={curCurveSx} y={Math.max(22, curCurveSy - 6)} fill="#fbcfe8" fontSize="8" fontWeight="bold" textAnchor="middle">
              {maxSolPer100.toFixed(0)}g @ {tempC}°C
            </text>

            {/* === 右側：動態燒杯 === */}
            <rect x={beakerX} y={beakerY} width={beakerW} height={beakerH} rx="4" fill="none" stroke="#94a3b8" strokeWidth="2" />
            <line x1={beakerX - 4} y1={beakerY} x2={beakerX + beakerW + 4} y2={beakerY} stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />

            {/* 溶液深度 */}
            <rect x={beakerX + 2} y={liquidY} width={beakerW - 4} height={liquidH - 2} fill="rgba(56, 189, 248, 0.22)" />
            <line x1={beakerX + 2} y1={liquidY} x2={beakerX + beakerW - 2} y2={liquidY} stroke="#38bdf8" strokeWidth="1.5" />

            {/* 底部結晶沉澱堆 */}
            {precipitated > 0 && (
              <polygon
                points={`
                  ${beakerX + 10},${beakerY + beakerH - 2}
                  ${beakerX + 30},${beakerY + beakerH - precipH}
                  ${beakerX + 60},${beakerY + beakerH - precipH * 0.8}
                  ${beakerX + 85},${beakerY + beakerH - precipH * 1.1}
                  ${beakerX + beakerW - 10},${beakerY + beakerH - 2}
                `}
                fill="#f8fafc"
                stroke="#cbd5e1"
                strokeWidth="1"
              />
            )}

            {/* 燒杯刻度標籤 */}
            <text x={beakerX + beakerW / 2} y={beakerY + beakerH + 16} fill="#cbd5e1" fontSize="8" fontWeight="bold" textAnchor="middle">
              {activeSolute.formula} 溶液 ({tempC}°C)
            </text>
          </svg>
        </div>

        {/* 右側控制面板與數據 */}
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
          {/* 經典溶解與結晶快照 */}
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '0.25rem' }}>
              ⚡ 經典溶解度與結晶快照：
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.3rem' }}>
              <button
                type="button"
                className="lab-snapshot-btn"
                onClick={() => {
                  setSoluteId('kno3')
                  setTempC(20)
                  setWaterG(100)
                  setSoluteAdded(160)
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
                ❄️ <strong>KNO₃ 降溫大量析出</strong>
                <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>20°C · 析出 128.4g</div>
              </button>
              <button
                type="button"
                className="lab-snapshot-btn"
                onClick={() => {
                  setSoluteId('nacl')
                  setTempC(20)
                  setWaterG(100)
                  setSoluteAdded(50)
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
                🧂 <strong>NaCl 食鹽飽和</strong>
                <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>溶解度平坦 · 析 13.5g</div>
              </button>
              <button
                type="button"
                className="lab-snapshot-btn"
                onClick={() => {
                  setSoluteId('cuso4')
                  setTempC(60)
                  setWaterG(100)
                  setSoluteAdded(41)
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
                💙 <strong>CuSO₄ 恰好飽和</strong>
                <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>60°C · 剛好完全溶解</div>
              </button>
              <button
                type="button"
                className="lab-snapshot-btn"
                onClick={() => {
                  setSoluteId('ce2so4')
                  setTempC(80)
                  setWaterG(100)
                  setSoluteAdded(20)
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
                🌡️ <strong>Ce₂(SO₄)₃ 逆溶解</strong>
                <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>升溫反而析出更多</div>
              </button>
            </div>
          </div>

          {/* 溶液溫度 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>溶液溫度 $T$：</span>
              <strong style={{ color: '#ef4444', fontFamily: 'monospace' }}>{tempC} °C</strong>
            </div>
            <input
              type="range"
              aria-label="溶液溫度"
              aria-valuetext={`${tempC} 攝氏度`}
              min="0"
              max="100"
              step="5"
              value={tempC}
              onChange={(e) => setTempC(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#ef4444', margin: 0 }}
            />
            <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.2rem' }}>
              <button
                type="button"
                className="pill-btn"
                style={{ flex: 1, padding: '0.15rem 0.2rem', fontSize: '0.65rem' }}
                onClick={() => setTempC((t) => Math.max(0, t - 20))}
              >
                ❄️ 降溫 20°C
              </button>
              <button
                type="button"
                className="pill-btn"
                style={{ flex: 1, padding: '0.15rem 0.2rem', fontSize: '0.65rem' }}
                onClick={() => setTempC((t) => Math.min(100, t + 20))}
              >
                🔥 升溫 20°C
              </button>
            </div>
          </div>

          {/* 加入溶質重 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>加入 {activeSolute.name} 重：</span>
              <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{soluteAdded} g</strong>
            </div>
            <input
              type="range"
              aria-label={`加入${activeSolute.name}的重量`}
              aria-valuetext={`${soluteAdded} 克`}
              min="10"
              max="200"
              step="5"
              value={soluteAdded}
              onChange={(e) => setSoluteAdded(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb', margin: 0 }}
            />
          </div>

          {/* 水量重 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>溶劑水重：</span>
              <strong style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{waterG} g</strong>
            </div>
            <input
              type="range"
              aria-label="溶劑水重量"
              aria-valuetext={`${waterG} 克`}
              min="50"
              max="200"
              step="10"
              value={waterG}
              onChange={(e) => setWaterG(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#38bdf8', margin: 0 }}
            />
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
              <span style={{ color: 'var(--muted)' }}>此溫度飽和溶解度：</span>
              <strong style={{ fontFamily: 'monospace' }}>{maxSolPer100.toFixed(1)} g / 100g 水</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>重量百分濃度 (wt%)：</span>
              <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{concentrationPct} %</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>結晶析出固體重：</span>
              <strong style={{ color: precipitated > 0 ? '#ef4444' : '#10b981', fontFamily: 'monospace' }}>
                {precipitated.toFixed(1)} g ({precipitated > 0 ? '已過飽和析出' : '完全溶解'})
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SolubilityLab
