import React, { useState, useMemo } from 'react'

/**
 * 物理動態實驗室：斜向拋體與自由落體實驗室 (ProjectileLab)
 * 即時計算與動態繪製拋物線軌跡、飛行時間、最大高度與水平射程。
 */
export const ProjectileLab: React.FC = () => {
  const [v0, setV0] = useState(25) // 初速 m/s
  const [angleDeg, setAngleDeg] = useState(45) // 仰角 °
  const [g, setG] = useState(9.8) // 重力加速度 m/s^2

  const angleRad = (angleDeg * Math.PI) / 180
  const vx = v0 * Math.cos(angleRad)
  const vy = v0 * Math.sin(angleRad)

  // 飛行時間 (s)
  const flightTime = (2 * vy) / g
  // 最大高度 (m)
  const maxHeight = (vy * vy) / (2 * g)
  // 水平射程 (m)
  const range = (v0 * v0 * Math.sin(2 * angleRad)) / g

  // 軌跡採樣點
  const trajectoryPoints = useMemo(() => {
    const pts: Array<{ x: number; y: number }> = []
    const steps = 40
    for (let i = 0; i <= steps; i++) {
      const t = (flightTime * i) / steps
      const x = vx * t
      const y = Math.max(0, vy * t - 0.5 * g * t * t)
      pts.push({ x, y })
    }
    return pts
  }, [flightTime, g, vx, vy])

  const scaleX = 4.2
  const scaleY = 3.6
  const originX = 30
  const originY = 180

  const svgPath = trajectoryPoints
    .map((p, idx) => {
      const sx = originX + p.x * scaleX
      const sy = originY - p.y * scaleY
      return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`
    })
    .join(' ')

  return (
    <div className="math-lab physics-lab projectile-lab">
      <div className="lab-header">
        <div>
          <h3>🚀 斜向拋體與運動學實驗室 (Projectile Motion Lab)</h3>
          <p className="lab-desc">
            水平方向為等速度運動 (v_x = v_0 cosθ)，鉛直方向為等加速度運動 (a_y = -g)。
          </p>
        </div>
      </div>

      <div className="lab-workspace-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.4fr) minmax(240px, 1fr)', gap: '0.75rem' }}>
        <div className="lab-canvas-box" style={{ background: '#0f172a', borderRadius: '8px', padding: '0.65rem', border: '1px solid #1e293b' }}>
          <svg viewBox="0 0 400 200" style={{ width: '100%', height: 'auto', display: 'block' }}>
            <line x1="20" y1={originY} x2="380" y2={originY} stroke="#475569" strokeWidth="2" />
            <rect x="20" y={originY} width="360" height="15" fill="#1e293b" />
            <path d={svgPath} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 2" />
            <circle cx={originX} cy={originY} r="5" fill="#f59e0b" />
            <line
              x1={originX}
              y1={originY}
              x2={originX + 25 * Math.cos(angleRad)}
              y2={originY - 25 * Math.sin(angleRad)}
              stroke="#f59e0b"
              strokeWidth="2.5"
            />
            <circle cx={originX + (range / 2) * scaleX} cy={originY - maxHeight * scaleY} r="4" fill="#ef4444" />
            <text x={originX + (range / 2) * scaleX} y={originY - maxHeight * scaleY - 6} fill="#f87171" fontSize="9" textAnchor="middle">
              最高點 H={maxHeight.toFixed(1)}m
            </text>
            <circle cx={originX + range * scaleX} cy={originY} r="4" fill="#10b981" />
            <text x={originX + range * scaleX} y={originY + 12} fill="#34d399" fontSize="9" textAnchor="middle">
              射程 R={range.toFixed(1)}m
            </text>
          </svg>
        </div>

        <div className="lab-controls-panel" style={{ background: 'var(--surface)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>初速度 v_0：</span>
              <strong style={{ color: '#2563eb' }}>{v0} m/s</strong>
            </label>
            <input type="range" min="5" max="40" step="1" value={v0} onChange={(e) => setV0(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>發射仰角 θ：</span>
              <strong style={{ color: '#2563eb' }}>{angleDeg}°</strong>
            </label>
            <input type="range" min="5" max="85" step="1" value={angleDeg} onChange={(e) => setAngleDeg(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
          </div>

          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>重力加速度 g：</span>
              <strong style={{ color: '#2563eb' }}>{g} m/s²</strong>
            </label>
            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.2rem' }}>
              <button type="button" className={`pill-btn ${g === 9.8 ? 'active' : ''}`} style={{ padding: '0.15rem 0.45rem', fontSize: '0.68rem' }} onClick={() => setG(9.8)}>地球 (9.8)</button>
              <button type="button" className={`pill-btn ${g === 1.62 ? 'active' : ''}`} style={{ padding: '0.15rem 0.45rem', fontSize: '0.68rem' }} onClick={() => setG(1.62)}>月球 (1.62)</button>
              <button type="button" className={`pill-btn ${g === 3.7 ? 'active' : ''}`} style={{ padding: '0.15rem 0.45rem', fontSize: '0.68rem' }} onClick={() => setG(3.7)}>火星 (3.7)</button>
            </div>
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.45rem', borderRadius: '6px', fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>飛行時間 T：</span>
              <strong>{flightTime.toFixed(2)} 秒</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>最大高度 H：</span>
              <strong style={{ color: '#ef4444' }}>{maxHeight.toFixed(2)} 公尺</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>水平射程 R：</span>
              <strong style={{ color: '#10b981' }}>{range.toFixed(2)} 公尺</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
