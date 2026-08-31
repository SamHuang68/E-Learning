import React, { useState } from 'react'

/**
 * 物理動態實驗室：幾何光學與司乃耳定律 (OpticsLab)
 * 探討光在兩種介質交介面之折射、反射與全反射臨界角 θ_c = arcsin(n2/n1)。
 */
export const OpticsLab: React.FC = () => {
  const [n1, setN1] = useState(1.0) // 介質 1 折射率 (空氣 1.0, 水 1.33, 玻璃 1.5)
  const [n2, setN2] = useState(1.5) // 介質 2 折射率
  const [theta1Deg, setTheta1Deg] = useState(30) // 入射角 (°)

  const theta1Rad = (theta1Deg * Math.PI) / 180
  const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2
  const isTir = sinTheta2 > 1.0 // 全反射判斷
  const theta2Rad = isTir ? 0 : Math.asin(sinTheta2)
  const theta2Deg = isTir ? 0 : (theta2Rad * 180) / Math.PI

  // 臨界角
  const criticalAngleDeg = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null

  const cx = 150
  const cy = 100
  const rayLen = 90

  const incX = cx - rayLen * Math.sin(theta1Rad)
  const incY = cy - rayLen * Math.cos(theta1Rad)

  const refX = cx + rayLen * Math.sin(theta1Rad)
  const refY = cy - rayLen * Math.cos(theta1Rad)

  const refrX = isTir ? 0 : cx + rayLen * Math.sin(theta2Rad)
  const refrY = isTir ? 0 : cy + rayLen * Math.cos(theta2Rad)

  return (
    <div className="math-lab physics-lab optics-lab">
      <div className="lab-header">
        <div>
          <h3>🌈 幾何光學與司乃耳定律實驗室 (Snell's Law & Optics)</h3>
          <p className="lab-desc">
            司乃耳折射定律：n_1 sinθ_1 = n_2 sinθ_2。當光由光密介質射向光疏介質且 θ_1 &gt; θ_c 時發生全反射。
          </p>
        </div>
      </div>

      <div className="lab-workspace-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.3fr) minmax(240px, 1fr)', gap: '0.75rem' }}>
        <div className="lab-canvas-box" style={{ background: '#0f172a', borderRadius: '8px', padding: '0.65rem', border: '1px solid #1e293b' }}>
          <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* 介質 1 與 介質 2 分界 */}
            <rect x="0" y="0" width="300" height="100" fill="rgba(15, 23, 42, 0.9)" />
            <rect x="0" y="100" width="300" height="100" fill="rgba(56, 189, 248, 0.15)" />
            <line x1="0" y1="100" x2="300" y2="100" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="15" y="30" fill="#94a3b8" fontSize="10">介質 1 (n_1={n1})</text>
            <text x="15" y="130" fill="#38bdf8" fontSize="10">介質 2 (n_2={n2})</text>

            {/* 法線 */}
            <line x1={cx} y1="20" x2={cx} y2="180" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />

            {/* 入射光線 */}
            <line x1={incX} y1={incY} x2={cx} y2={cy} stroke="#facc15" strokeWidth="2.5" />

            {/* 反射光線 */}
            <line x1={cx} y1={cy} x2={refX} y2={refY} stroke="rgba(250, 204, 21, 0.5)" strokeWidth="1.5" />

            {/* 折射光線 */}
            {!isTir && (
              <line x1={cx} y1={cy} x2={refrX} y2={refrY} stroke="#38bdf8" strokeWidth="2.5" />
            )}

            {isTir && (
              <text x={cx} y="140" fill="#ef4444" fontSize="11" textAnchor="middle" fontWeight="bold">
                ⚠️ 全反射 (TIR) - 無折射光
              </text>
            )}
          </svg>
        </div>

        <div className="lab-controls-panel" style={{ background: 'var(--surface)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>介質 1 折射率 n_1：</span>
              <strong style={{ color: '#2563eb' }}>{n1}</strong>
            </label>
            <input type="range" min="1.0" max="2.4" step="0.05" value={n1} onChange={(e) => setN1(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>介質 2 折射率 n_2：</span>
              <strong style={{ color: '#2563eb' }}>{n2}</strong>
            </label>
            <input type="range" min="1.0" max="2.4" step="0.05" value={n2} onChange={(e) => setN2(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>入射角 θ_1：</span>
              <strong style={{ color: '#f59e0b' }}>{theta1Deg}°</strong>
            </label>
            <input type="range" min="0" max="85" step="1" value={theta1Deg} onChange={(e) => setTheta1Deg(Number(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b' }} />
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.45rem', borderRadius: '6px', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>折射角 θ_2：</span>
              <strong style={{ color: isTir ? '#ef4444' : '#10b981' }}>{isTir ? '無 (全反射)' : `${theta2Deg.toFixed(1)}°`}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>全反射臨界角 θ_c：</span>
              <strong>{criticalAngleDeg ? `${criticalAngleDeg.toFixed(1)}°` : '無臨界角 (n1 ≤ n2)'}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
