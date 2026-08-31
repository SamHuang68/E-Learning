import React, { useState } from 'react'

/**
 * 國中物理實驗室：阿基米德浮力與密度 (BuoyancyLab)
 * 探討浮力 B = V_排 * D_液 與物體浮沉條件 (D_物 vs D_液)。
 */
export const BuoyancyLab: React.FC = () => {
  const [objectDensity, setObjectDensity] = useState(0.8) // 物體密度 g/cm^3
  const [liquidDensity, setLiquidDensity] = useState(1.0) // 液體密度 (水 1.0, 鹽水 1.2, 酒精 0.8)
  const volume = 100 // 物體體積 cm^3

  // 物體重量 (gw)
  const weight = volume * objectDensity
  // 浸入體積 (cm^3)
  const submergedVol = objectDensity < liquidDensity ? (weight / liquidDensity) : volume
  // 浮力 (gw)
  const buoyancy = submergedVol * liquidDensity

  const stateText =
    objectDensity < liquidDensity
      ? '浮體 (B = W, 漂浮於液面)'
      : objectDensity === liquidDensity
      ? '懸浮體 (B = W, 停留於液體內部任一處)'
      : '沉體 (B < W, 沉入容器底部)'

  const submergencePct = Math.min(100, Math.round((submergedVol / volume) * 100))

  return (
    <div className="math-lab physics-lab buoyancy-lab">
      <div className="lab-header">
        <div>
          <h3>⛵ 阿基米德浮力與密度實驗室 (Buoyancy & Density Lab)</h3>
          <p className="lab-desc">
            阿基米德原理：物體在液體中所受浮力等於其排開液體的重量 (B = V_排 × D_液)。
          </p>
        </div>
      </div>

      <div className="lab-workspace-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.3fr) minmax(240px, 1fr)', gap: '0.75rem' }}>
        <div className="lab-canvas-box" style={{ background: '#0f172a', borderRadius: '8px', padding: '0.65rem', border: '1px solid #1e293b' }}>
          <svg viewBox="0 0 300 180" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* 水槽 */}
            <rect x="50" y="40" width="200" height="120" fill="none" stroke="#94a3b8" strokeWidth="2" rx="4" />
            {/* 液體 */}
            <rect x="52" y="70" width="196" height="88" fill="rgba(56, 189, 248, 0.25)" />
            <line x1="52" y1="70" x2="248" y2="70" stroke="#38bdf8" strokeWidth="1.5" />

            {/* 物體 */}
            {objectDensity < liquidDensity ? (
              /* 漂浮 */
              <rect
                x="120"
                y={70 - 40 * (1 - submergedVol / volume)}
                width="60"
                height="40"
                fill="#f59e0b"
                stroke="#d97706"
                strokeWidth="1.5"
                rx="3"
              />
            ) : objectDensity === liquidDensity ? (
              /* 懸浮 */
              <rect x="120" y="90" width="60" height="40" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" rx="3" />
            ) : (
              /* 沉底 */
              <rect x="120" y="118" width="60" height="40" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" rx="3" />
            )}

            <text x="150" y="172" fill="#38bdf8" fontSize="10" textAnchor="middle">
              {stateText}
            </text>
          </svg>
        </div>

        <div className="lab-controls-panel" style={{ background: 'var(--surface)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>物體密度 D_物：</span>
              <strong style={{ color: '#f59e0b' }}>{objectDensity.toFixed(2)} g/cm³</strong>
            </label>
            <input type="range" min="0.2" max="2.0" step="0.05" value={objectDensity} onChange={(e) => setObjectDensity(Number(e.target.value))} style={{ width: '100%', accentColor: '#f59e0b' }} />
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>液體密度 D_液：</span>
              <strong style={{ color: '#38bdf8' }}>{liquidDensity.toFixed(2)} g/cm³</strong>
            </label>
            <input type="range" min="0.6" max="1.5" step="0.05" value={liquidDensity} onChange={(e) => setLiquidDensity(Number(e.target.value))} style={{ width: '100%', accentColor: '#38bdf8' }} />
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.45rem', borderRadius: '6px', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>物體重量 W：</span>
              <strong>{weight.toFixed(1)} gw</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>所受浮力 B：</span>
              <strong style={{ color: '#10b981' }}>{buoyancy.toFixed(1)} gw</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>浸入體積比例：</span>
              <strong>{submergencePct}% ({submergedVol.toFixed(1)} cm³)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
