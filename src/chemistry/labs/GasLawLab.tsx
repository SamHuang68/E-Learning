import React, { useState } from 'react'

/**
 * 化學動態實驗室：理想氣體定律與分子動力學 (GasLawLab)
 * 探討 PV = nRT 與波以耳定律 (P vs 1/V)、查理定律 (V vs T)。
 */
export const GasLawLab: React.FC = () => {
  const [tempK, setTempK] = useState(300) // 溫度 (K)
  const [volL, setVolL] = useState(24.5) // 體積 (L)
  const [molN, setMolN] = useState(1.0) // 莫耳數 (mol)

  const R = 0.0821 // L·atm / (mol·K)
  const pressureAtm = (molN * R * tempK) / volL // P = nRT / V

  return (
    <div className="math-lab chemistry-lab gas-law-lab">
      <div className="lab-header">
        <div>
          <h3>🎈 理想氣體定律實驗室 (Ideal Gas Law PV=nRT)</h3>
          <p className="lab-desc">
            波以耳定律 (定溫下 P ∝ 1/V)、查理定律 (定壓下 V ∝ T)、理想氣體狀態方程式 PV = nRT。
          </p>
        </div>
      </div>

      <div className="lab-workspace-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.2fr) minmax(240px, 1fr)', gap: '0.75rem' }}>
        <div className="lab-canvas-box" style={{ background: '#0f172a', borderRadius: '8px', padding: '0.65rem', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg viewBox="0 0 240 160" style={{ width: '100%', maxWidth: '240px', height: 'auto' }}>
            {/* 活塞容器外殼 */}
            <rect x="50" y="30" width="140" height="110" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />

            {/* 活塞蓋 (隨體積上下移動) */}
            {/* vol 10L -> y=100; vol 40L -> y=40 */}
            {(() => {
              const pistonY = 120 - ((volL - 10) / 30) * 80
              return (
                <>
                  <rect x="52" y={pistonY} width="136" height="12" fill="#3b82f6" stroke="#60a5fa" strokeWidth="1" />
                  <line x1="120" y1="10" x2="120" y2={pistonY} stroke="#94a3b8" strokeWidth="4" />
                </>
              )
            })()}

            {/* 氣體粒子動態示意 */}
            <circle cx="80" cy="110" r="4" fill="#facc15" />
            <circle cx="120" cy="120" r="4" fill="#facc15" />
            <circle cx="150" cy="95" r="4" fill="#facc15" />
            <circle cx="100" cy="80" r="4" fill="#facc15" />
            <circle cx="140" cy="115" r="4" fill="#facc15" />

            <text x="120" y="152" fill="#38bdf8" fontSize="9" textAnchor="middle">
              氣壓錶 P = {pressureAtm.toFixed(2)} atm
            </text>
          </svg>
        </div>

        <div className="lab-controls-panel" style={{ background: 'var(--surface)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>容器體積 V：</span>
              <strong style={{ color: '#2563eb' }}>{volL.toFixed(1)} L</strong>
            </label>
            <input type="range" min="10" max="40" step="0.5" value={volL} onChange={(e) => setVolL(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>絕對溫度 T：</span>
              <strong style={{ color: '#ef4444' }}>{tempK} K ({(tempK - 273).toFixed(0)}°C)</strong>
            </label>
            <input type="range" min="150" max="600" step="10" value={tempK} onChange={(e) => setTempK(Number(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>氣體莫耳數 n：</span>
              <strong style={{ color: '#10b981' }}>{molN.toFixed(1)} mol</strong>
            </label>
            <input type="range" min="0.5" max="3.0" step="0.1" value={molN} onChange={(e) => setMolN(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.45rem', borderRadius: '6px', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>氣體壓力 P：</span>
              <strong style={{ color: '#f59e0b' }}>{pressureAtm.toFixed(2)} atm</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>分子平均動能：</span>
              <strong>{((3 / 2) * 8.314 * tempK).toFixed(0)} J/mol</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
