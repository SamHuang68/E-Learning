import React, { useState } from 'react'

/**
 * 物理動態實驗室：簡諧運動與單擺 (ShmLab)
 * 探討單擺週期 T = 2π√(L/g) 與動能/重力位能的即時互換。
 */
export const ShmLab: React.FC = () => {
  const [length, setLength] = useState(1.0) // 擺長 L (m)
  const [thetaMaxDeg, setThetaMaxDeg] = useState(15) // 最大擺角 (°)
  const [g] = useState(9.8) // 重力加速度 (m/s^2)
  const [angleNowDeg, setAngleNowDeg] = useState(10) // 當前動態擺角

  const period = 2 * Math.PI * Math.sqrt(length / g)
  const frequency = 1 / period

  // 計算能量比例
  const thetaMaxRad = (thetaMaxDeg * Math.PI) / 180
  const thetaNowRad = (angleNowDeg * Math.PI) / 180
  const hMax = length * (1 - Math.cos(thetaMaxRad))
  const hNow = length * (1 - Math.cos(thetaNowRad))
  const pePct = Math.min(100, Math.round((hNow / Math.max(1e-4, hMax)) * 100))
  const kePct = 100 - pePct

  // SVG 擺動坐標
  const pivotX = 150
  const pivotY = 30
  const visualLength = 100 + length * 35
  const bobX = pivotX + visualLength * Math.sin(thetaNowRad)
  const bobY = pivotY + visualLength * Math.cos(thetaNowRad)

  return (
    <div className="math-lab physics-lab shm-lab">
      <div className="lab-header">
        <div>
          <h3>⏱️ 簡諧運動與單擺實驗室 (SHM & Pendulum Lab)</h3>
          <p className="lab-desc">
            小角度單擺週期僅與擺長 L 及重力加速度 g 相關，與擺錘質量及振幅無關。
          </p>
        </div>
      </div>

      <div className="lab-workspace-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.3fr) minmax(240px, 1fr)', gap: '0.75rem' }}>
        <div className="lab-canvas-box" style={{ background: '#0f172a', borderRadius: '8px', padding: '0.65rem', border: '1px solid #1e293b' }}>
          <svg viewBox="0 0 300 200" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* 天花板固定端 */}
            <line x1="100" y1={pivotY} x2="200" y2={pivotY} stroke="#94a3b8" strokeWidth="3" />
            <circle cx={pivotX} cy={pivotY} r="4" fill="#64748b" />

            {/* 鉛直線基準 */}
            <line x1={pivotX} y1={pivotY} x2={pivotX} y2={pivotY + visualLength + 20} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

            {/* 擺繩與擺錘 */}
            <line x1={pivotX} y1={pivotY} x2={bobX} y2={bobY} stroke="#e2e8f0" strokeWidth="2" />
            <circle cx={bobX} cy={bobY} r="10" fill="#3b82f6" stroke="#60a5fa" strokeWidth="2" />

            {/* 擺動幅度弧線 */}
            <path
              d={`M ${pivotX - visualLength * Math.sin(thetaMaxRad)} ${pivotY + visualLength * Math.cos(thetaMaxRad)} A ${visualLength} ${visualLength} 0 0 0 ${pivotX + visualLength * Math.sin(thetaMaxRad)} ${pivotY + visualLength * Math.cos(thetaMaxRad)}`}
              fill="none"
              stroke="rgba(148, 163, 184, 0.3)"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          </svg>
        </div>

        <div className="lab-controls-panel" style={{ background: 'var(--surface)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>擺長 L：</span>
              <strong style={{ color: '#2563eb' }}>{length.toFixed(2)} m</strong>
            </label>
            <input type="range" min="0.2" max="2.5" step="0.05" value={length} onChange={(e) => setLength(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>最大擺角 θ_max：</span>
              <strong style={{ color: '#2563eb' }}>{thetaMaxDeg}°</strong>
            </label>
            <input type="range" min="5" max="30" step="1" value={thetaMaxDeg} onChange={(e) => {
              const val = Number(e.target.value)
              setThetaMaxDeg(val)
              if (Math.abs(angleNowDeg) > val) setAngleNowDeg(val)
            }} style={{ width: '100%', accentColor: '#2563eb' }} />
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>動態擺動位置：</span>
              <strong style={{ color: '#8b5cf6' }}>{angleNowDeg}°</strong>
            </label>
            <input type="range" min={-thetaMaxDeg} max={thetaMaxDeg} step="1" value={angleNowDeg} onChange={(e) => setAngleNowDeg(Number(e.target.value))} style={{ width: '100%', accentColor: '#8b5cf6' }} />
          </div>

          {/* 能量柱狀圖 */}
          <div style={{ background: 'var(--surface-soft)', padding: '0.45rem', borderRadius: '6px', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>單擺週期 T：</span>
              <strong>{period.toFixed(2)} 秒 (頻率 {frequency.toFixed(2)} Hz)</strong>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                <span style={{ color: '#10b981' }}>動能 $E_k$ ({kePct}%)</span>
                <span style={{ color: '#f59e0b' }}>重力位能 $U_g$ ({pePct}%)</span>
              </div>
              <div style={{ display: 'flex', height: '6px', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${kePct}%`, background: '#10b981' }} />
                <div style={{ width: `${pePct}%`, background: '#f59e0b' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
