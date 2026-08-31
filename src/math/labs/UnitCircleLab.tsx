import React, { useState } from 'react'

/**
 * 高中「三角函數單位圓實驗室 (UnitCircleLab)」
 * 透過旋轉單位圓角度 $\theta$ (0° ~ 360° / 0 ~ 2π)，即時計算 $\sin\theta, \cos\theta, \tan\theta$ 坐標與象限符號。
 */
export const UnitCircleLab: React.FC = () => {
  const [angleDeg, setAngleDeg] = useState(45)

  const angleRad = (angleDeg * Math.PI) / 180
  const sinVal = Math.sin(angleRad)
  const cosVal = Math.cos(angleRad)
  const tanVal = Math.abs(cosVal) < 1e-4 ? Infinity : Math.tan(angleRad)

  // 判斷象限
  const quadrant =
    angleDeg > 0 && angleDeg < 90
      ? '第一象限 (I: +, +)'
      : angleDeg > 90 && angleDeg < 180
      ? '第二象限 (II: -, +)'
      : angleDeg > 180 && angleDeg < 270
      ? '第三象限 (III: -, -)'
      : angleDeg > 270 && angleDeg < 360
      ? '第四象限 (IV: +, -)'
      : '坐標軸上'

  const cx = 140
  const cy = 140
  const r = 100
  const px = cx + r * cosVal
  const py = cy - r * sinVal

  return (
    <div className="math-lab unit-circle-lab">
      <div className="lab-header">
        <div>
          <h3>三角函數單位圓實驗室 (Unit Circle & Trigonometry)</h3>
          <p className="lab-desc">
            在半徑為 1 的單位圓上，動徑端點坐標即為 $(\cos\theta, \sin\theta)$。
          </p>
        </div>
      </div>

      <div className="unit-circle-layout">
        <div className="circle-canvas-box" style={{ display: 'flex', justifyContent: 'center' }}>
          <svg viewBox="0 0 280 280" className="unit-circle-svg" style={{ width: '100%', maxWidth: '280px', height: 'auto' }}>
            {/* 坐標軸 */}
            <line x1="20" y1={cy} x2="260" y2={cy} stroke="#94a3b8" strokeWidth="1.5" />
            <line x1={cx} y1="20" x2={cx} y2="260" stroke="#94a3b8" strokeWidth="1.5" />

            {/* 單位圓 */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#3b82f6" strokeWidth="2" />

            {/* 動徑三角形 */}
            <polygon
              points={`${cx},${cy} ${px},${cy} ${px},${py}`}
              fill="rgba(59, 130, 246, 0.15)"
              stroke="#2563eb"
              strokeWidth="1.5"
            />

            {/* 動徑射線 */}
            <line x1={cx} y1={cy} x2={px} y2={py} stroke="#ef4444" strokeWidth="2.5" />

            {/* 點標記 */}
            <circle cx={px} cy={py} r="5" fill="#ef4444" />
          </svg>
        </div>

        <div className="circle-data-card">
          <div className="angle-heading">
            <h4>
              旋轉角 $\theta$ = {angleDeg}°（{(angleDeg / 180).toFixed(2)}$\pi$ rad）
            </h4>
            <span className="quad-badge">{quadrant}</span>
          </div>

          <div className="trig-values-grid">
            <div className="trig-val-item sin-item">
              <span className="trig-name">$\sin\theta$ (高度 / y坐標)</span>
              <strong>{sinVal.toFixed(4)}</strong>
            </div>
            <div className="trig-val-item cos-item">
              <span className="trig-name">$\cos\theta$ (底寬 / x坐標)</span>
              <strong>{cosVal.toFixed(4)}</strong>
            </div>
            <div className="trig-val-item tan-item">
              <span className="trig-name">$\tan\theta$ (斜率)</span>
              <strong>{Number.isFinite(tanVal) ? tanVal.toFixed(4) : '無意義'}</strong>
            </div>
          </div>

          <div style={{ marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '0.25rem' }}>
              ⚡ 經典特別角快照：
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.3rem' }}>
              <button
                type="button"
                className="lab-snapshot-btn"
                onClick={() => setAngleDeg(30)}
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
                📐 <strong>30° (π/6)</strong>
                <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>sin=1/2 · cos=√3/2</div>
              </button>
              <button
                type="button"
                className="lab-snapshot-btn"
                onClick={() => setAngleDeg(45)}
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
                📐 <strong>45° (π/4)</strong>
                <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>sin=cos=√2/2 · tan=1</div>
              </button>
              <button
                type="button"
                className="lab-snapshot-btn"
                onClick={() => setAngleDeg(60)}
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
                📐 <strong>60° (π/3)</strong>
                <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>sin=√3/2 · cos=1/2</div>
              </button>
              <button
                type="button"
                className="lab-snapshot-btn"
                onClick={() => setAngleDeg(90)}
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
                ⭕ <strong>90° (π/2) 頂點</strong>
                <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>sin=1 · cos=0 · tan無窮</div>
              </button>
            </div>
          </div>

          <div className="slider-item">
            <label>調整旋轉角度: {angleDeg}°</label>
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              value={angleDeg}
              onChange={(e) => setAngleDeg(Number(e.target.value))}
            />
          </div>

          <div className="quick-angles">
            {[0, 30, 45, 60, 90, 120, 135, 150, 180, 270, 360].map((deg) => (
              <button
                key={deg}
                type="button"
                className="btn-angle-quick"
                onClick={() => setAngleDeg(deg)}
              >
                {deg}°
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
