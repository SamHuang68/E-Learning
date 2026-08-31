import React, { useState } from 'react'

/**
 * 化學動態實驗室：VSEPR 分子空間幾何與混成軌域 (VseprGeometryLab)
 * 探討價殼層電子對互斥理論 (VSEPR) 與鍵角預測。
 */
export const VseprGeometryLab: React.FC = () => {
  const [bp, setBp] = useState(4) // 鍵結電子對 (Bonding Pairs)
  const [lp, setLp] = useState(0) // 孤對電子 (Lone Pairs)

  const sn = bp + lp // 空間位阻數 (Steric Number)

  let shape = '四面體形 (Tetrahedral)'
  let angle = '109.5°'
  let hybrid = 'sp³'
  let example = 'CH₄, SiH₄'

  if (sn === 2) {
    shape = '直線形 (Linear)'
    angle = '180°'
    hybrid = 'sp'
    example = 'BeCl₂, CO₂, C₂H₂'
  } else if (sn === 3) {
    if (lp === 0) {
      shape = '平面三角形 (Trigonal Planar)'
      angle = '120°'
      hybrid = 'sp²'
      example = 'BF₃, SO₃, NO₃⁻'
    } else {
      shape = '折線形 (Bent)'
      angle = '< 120° (約 119°)'
      hybrid = 'sp²'
      example = 'SO₂, O₃, NO₂⁻'
    }
  } else if (sn === 4) {
    if (lp === 0) {
      shape = '四面體形 (Tetrahedral)'
      angle = '109.5°'
      hybrid = 'sp³'
      example = 'CH₄, NH₄⁺, SO₄²⁻'
    } else if (lp === 1) {
      shape = '三角錐形 (Trigonal Pyramidal)'
      angle = '107.5°'
      hybrid = 'sp³'
      example = 'NH₃, PCl₃, H₃O⁺'
    } else {
      shape = '折線形 (Bent)'
      angle = '104.5°'
      hybrid = 'sp³'
      example = 'H₂O, OF₂, SCl₂'
    }
  } else if (sn === 5) {
    shape = lp === 0 ? '雙三角錐形 (Trigonal Bipyramidal)' : lp === 1 ? '蹺蹺板形 (Seesaw)' : lp === 2 ? 'T字形 (T-shaped)' : '直線形 (Linear)'
    angle = '90°, 120°, 180°'
    hybrid = 'sp³d'
    example = 'PCl₅, SF₄, ClF₃, XeF₂'
  } else if (sn === 6) {
    shape = lp === 0 ? '八面體形 (Octahedral)' : lp === 1 ? '四角錐形 (Square Pyramidal)' : '平面四邊形 (Square Planar)'
    angle = '90°, 180°'
    hybrid = 'sp³d²'
    example = 'SF₆, BrF₅, XeF₄'
  }

  return (
    <div className="math-lab chemistry-lab vsepr-lab">
      <div className="lab-header">
        <div>
          <h3>📐 VSEPR 分子空間幾何與混成軌域實驗室 (VSEPR Theory)</h3>
          <p className="lab-desc">
            空間位阻數 SN = σ 鍵結對 (BP) + 孤對電子 (LP)。孤對電子排斥力強於鍵結對，導致鍵角壓縮。
          </p>
        </div>
      </div>

      <div className="lab-workspace-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.2fr) minmax(240px, 1fr)', gap: '0.75rem' }}>
        <div className="lab-canvas-box" style={{ background: '#0f172a', borderRadius: '8px', padding: '0.65rem', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 240 160" style={{ width: '100%', maxWidth: '240px', height: 'auto' }}>
            {/* 中心原子 */}
            <circle cx="120" cy="80" r="16" fill="#2563eb" stroke="#60a5fa" strokeWidth="2" />
            <text x="120" y="84" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">中心 A</text>

            {/* 周圍原子與連線 (依 SN 繪製示意射線) */}
            {Array.from({ length: bp }).map((_, i) => {
              const angleVal = (2 * Math.PI * i) / sn - Math.PI / 2
              const px = 120 + 55 * Math.cos(angleVal)
              const py = 80 + 55 * Math.sin(angleVal)
              return (
                <g key={`bp-${i}`}>
                  <line x1="120" y1="80" x2={px} y2={py} stroke="#38bdf8" strokeWidth="2.5" />
                  <circle cx={px} cy={py} r="10" fill="#10b981" />
                  <text x={px} y={py + 3} fill="#fff" fontSize="8" textAnchor="middle">X</text>
                </g>
              )
            })}

            {/* 孤對電子 (黃色虛線水滴狀) */}
            {Array.from({ length: lp }).map((_, i) => {
              const angleVal = (2 * Math.PI * (bp + i)) / sn - Math.PI / 2
              const px = 120 + 48 * Math.cos(angleVal)
              const py = 80 + 48 * Math.sin(angleVal)
              return (
                <g key={`lp-${i}`}>
                  <ellipse cx={px} cy={py} rx="10" ry="6" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
                  <text x={px} y={py + 3} fill="#f59e0b" fontSize="8" textAnchor="middle">::</text>
                </g>
              )
            })}
          </svg>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.3rem' }}>綠球：鍵結原子 X，黃框：孤對電子 LP (::)</span>
        </div>

        <div className="lab-controls-panel" style={{ background: 'var(--surface)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>σ 鍵結對 (BP)：</span>
              <strong style={{ color: '#10b981' }}>{bp}</strong>
            </label>
            <input type="range" min="1" max="6" step="1" value={bp} onChange={(e) => setBp(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>孤對電子對 (LP)：</span>
              <strong style={{ color: '#f59e0b' }}>{lp}</strong>
            </label>
            <input type="range" min="0" max="3" step="1" value={lp} onChange={(e) => setLp(Number(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b' }} />
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.45rem', borderRadius: '6px', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>空間位阻數 SN：</span>
              <strong>{sn} ({hybrid} 混成)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>分子幾何形狀：</span>
              <strong style={{ color: '#2563eb' }}>{shape}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>預測鍵角：</span>
              <strong>{angle}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>典型範例：</span>
              <span style={{ color: 'var(--muted)' }}>{example}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
