import React, { useState } from 'react'

/**
 * 國中化學實驗室：溶解度與降溫結晶實驗室 (SolubilityLab)
 * 模擬硝酸鉀 (KNO3) 溶解度隨溫度上升，降溫析出結晶量。
 */
export const SolubilityLab: React.FC = () => {
  const [tempC, setTempC] = useState(60) // 溫度 (°C)
  const [waterG, setWaterG] = useState(100) // 水重 (g)
  const [soluteAdded, setSoluteAdded] = useState(100) // 加入溶質重 (g)

  // KNO3 溶解度經驗公式 (g/100g 水): 20°C: 32g; 40°C: 64g; 60°C: 110g; 80°C: 170g
  const maxSolubilityPer100 = Math.round(15 + 0.5 * tempC + 0.018 * tempC * tempC)
  const maxDissolved = (maxSolubilityPer100 * waterG) / 100

  const dissolved = Math.min(soluteAdded, maxDissolved)
  const precipitated = Math.max(0, soluteAdded - maxDissolved)
  const isSaturated = soluteAdded >= maxDissolved

  const concentrationPct = ((dissolved / (waterG + dissolved)) * 100).toFixed(1)

  return (
    <div className="math-lab chemistry-lab solubility-lab">
      <div className="lab-header">
        <div>
          <h3>🧊 溶解度曲線與結晶析出實驗室 (Solubility & Crystallization)</h3>
          <p className="lab-desc">
            飽和溶液定義：在特定溫度下，溶劑所能溶解溶質之最大量。降溫或蒸發溶劑可析出結晶。
          </p>
        </div>
      </div>

      <div className="lab-workspace-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.2fr) minmax(240px, 1fr)', gap: '0.75rem' }}>
        <div className="lab-canvas-box" style={{ background: '#0f172a', borderRadius: '8px', padding: '0.65rem', border: '1px solid #1e293b' }}>
          <svg viewBox="0 0 260 160" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* 燒杯 */}
            <rect x="70" y="30" width="120" height="110" fill="none" stroke="#94a3b8" strokeWidth="2" rx="4" />
            {/* 溶液水深 */}
            <rect x="72" y="60" width="116" height="78" fill="rgba(56, 189, 248, 0.2)" />
            <line x1="72" y1="60" x2="188" y2="60" stroke="#38bdf8" strokeWidth="1.5" />

            {/* 底部沉澱晶體 */}
            {precipitated > 0 && (
              <polygon points="100,138 110,130 120,138 135,128 150,138 160,138 72,138" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            )}

            <text x="130" y="152" fill="#38bdf8" fontSize="9" textAnchor="middle">
              {isSaturated ? `飽和溶液 (析出 ${precipitated.toFixed(1)}g 結晶)` : '未飽和溶液'}
            </text>
          </svg>
        </div>

        <div className="lab-controls-panel" style={{ background: 'var(--surface)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>溶液溫度 T：</span>
              <strong style={{ color: '#ef4444' }}>{tempC} °C</strong>
            </label>
            <input type="range" min="10" max="90" step="5" value={tempC} onChange={(e) => setTempC(Number(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>加入 KNO₃ 溶質重：</span>
              <strong style={{ color: '#2563eb' }}>{soluteAdded} g</strong>
            </label>
            <input type="range" min="10" max="200" step="5" value={soluteAdded} onChange={(e) => setSoluteAdded(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>水重 (溶劑)：</span>
              <strong style={{ color: '#38bdf8' }}>{waterG} g</strong>
            </label>
            <input type="range" min="50" max="200" step="10" value={waterG} onChange={(e) => setWaterG(Number(e.target.value))} style={{ width: '100%', accentColor: '#38bdf8' }} />
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.45rem', borderRadius: '6px', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>溶解度：</span>
              <strong>{maxSolubilityPer100} g / 100g 水</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>重量百分濃度：</span>
              <strong>{concentrationPct} %</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>結晶析出量：</span>
              <strong style={{ color: precipitated > 0 ? '#ef4444' : '#10b981' }}>{precipitated.toFixed(1)} g</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
