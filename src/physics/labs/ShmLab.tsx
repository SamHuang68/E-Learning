import React, { useState } from 'react'

/**
 * 物理動態實驗室：簡諧運動與單擺 (ShmLab)
 * 探討單擺週期 T = 2π√(L/g)、恢復力 F = -mg sinθ、切向速度向量與動能/重力位能能量守恆。
 */
export const ShmLab: React.FC = () => {
  const [length, setLength] = useState<number>(1.0) // 擺長 L (m)
  const [thetaMaxDeg, setThetaMaxDeg] = useState<number>(18) // 最大擺角 (°)
  const [angleNowDeg, setAngleNowDeg] = useState<number>(12) // 當前動態擺角 (°)
  const g = 9.8 // 重力加速度 (m/s^2)
  const mass = 1.0 // 擺錘質量 (kg)

  // 週期與頻率
  const period = 2 * Math.PI * Math.sqrt(length / g)
  const frequency = 1 / period

  // 角度弧度
  const thetaMaxRad = (thetaMaxDeg * Math.PI) / 180
  const thetaNowRad = (angleNowDeg * Math.PI) / 180

  // 能量與速度計算
  const hMax = length * (1 - Math.cos(thetaMaxRad))
  const hNow = length * (1 - Math.cos(thetaNowRad))
  const totalEnergy = mass * g * hMax
  const pe = mass * g * hNow
  const ke = Math.max(0, totalEnergy - pe)
  const speed = Math.sqrt((2 * ke) / mass)

  const pePct = totalEnergy > 1e-4 ? Math.min(100, Math.max(0, Math.round((pe / totalEnergy) * 100))) : 0
  const kePct = 100 - pePct

  // 小角度近似誤差: |(sinθ - θ) / θ|
  const approxErrorPct = Math.abs((Math.sin(thetaMaxRad) - thetaMaxRad) / thetaMaxRad) * 100

  // 恢復力與受力分解
  const fRestore = -mass * g * Math.sin(thetaNowRad)
  const tension = mass * g * Math.cos(thetaNowRad) + (mass * speed * speed) / length

  // SVG 視口與幾何坐標
  const svgWidth = 340
  const svgHeight = 230
  const pivotX = 170
  const pivotY = 28
  const visualLength = 75 + length * 45

  const bobX = pivotX + visualLength * Math.sin(thetaNowRad)
  const bobY = pivotY + visualLength * Math.cos(thetaNowRad)

  // 最大振幅邊界點
  const maxLeftX = pivotX - visualLength * Math.sin(thetaMaxRad)
  const maxLeftY = pivotY + visualLength * Math.cos(thetaMaxRad)
  const maxRightX = pivotX + visualLength * Math.sin(thetaMaxRad)
  const maxRightY = pivotY + visualLength * Math.cos(thetaMaxRad)

  // 切向速度向量與重力分解向量
  const vScale = 14
  const vDirX = Math.cos(thetaNowRad) * (angleNowDeg >= 0 ? -1 : 1)
  const vDirY = -Math.sin(thetaNowRad) * (angleNowDeg >= 0 ? -1 : 1)

  return (
    <div className="math-lab physics-lab shm-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 頂部標題 */}
      <div className="lab-header" style={{ marginBottom: '0.6rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>⏱️</span> 簡諧運動與單擺實驗室 (SHM & Pendulum Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            小角度單擺近似：T = 2π√(L/g)，恢復力 F = -mg sinθ，機械能即時守恆。
          </p>
        </div>
      </div>

      {/* 雙欄響應式佈局 */}
      <div
        className="lab-workspace-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '0.75rem',
          alignItems: 'start',
          width: '100%',
        }}
      >
        {/* 左側 SVG 擺動與受力視口 */}
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
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', display: 'inline-block' }} />
              單擺力學與能量狀態
            </span>
            <span style={{ fontFamily: 'monospace' }}>$\theta = {angleNowDeg > 0 ? `+${angleNowDeg}` : angleNowDeg}^\circ$</span>
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: 'auto', display: 'block', overflow: 'hidden' }}
          >
            <defs>
              <marker id="shm-arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ef4444" />
              </marker>
              <marker id="shm-arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
              </marker>
              <marker id="shm-arrow-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#a855f7" />
              </marker>
            </defs>

            {/* 擺動扇形輔助區域 */}
            <path
              d={`M ${pivotX} ${pivotY} L ${maxLeftX} ${maxLeftY} A ${visualLength} ${visualLength} 0 0 0 ${maxRightX} ${maxRightY} Z`}
              fill="rgba(56, 189, 248, 0.06)"
              stroke="rgba(148, 163, 184, 0.25)"
              strokeDasharray="3 3"
            />

            {/* 天花板懸掛支點 */}
            <line x1={pivotX - 50} y1={pivotY} x2={pivotX + 50} y2={pivotY} stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx={pivotX} cy={pivotY} r="4.5" fill="#64748b" stroke="#cbd5e1" strokeWidth="1" />

            {/* 鉛直平衡參考線 */}
            <line x1={pivotX} y1={pivotY} x2={pivotX} y2={pivotY + visualLength + 15} stroke="#334155" strokeWidth="1.2" strokeDasharray="4 3" />

            {/* 最大擺角極限端點虛線 */}
            <line x1={pivotX} y1={pivotY} x2={maxLeftX} y2={maxLeftY} stroke="rgba(244, 63, 94, 0.3)" strokeWidth="1" strokeDasharray="2 2" />
            <line x1={pivotX} y1={pivotY} x2={maxRightX} y2={maxRightY} stroke="rgba(244, 63, 94, 0.3)" strokeWidth="1" strokeDasharray="2 2" />

            {/* 擺繩 */}
            <line x1={pivotX} y1={pivotY} x2={bobX} y2={bobY} stroke="#e2e8f0" strokeWidth="2.5" />

            {/* 擺錘本體 */}
            <circle cx={bobX} cy={bobY} r="10" fill="#2563eb" stroke="#60a5fa" strokeWidth="2" />

            {/* 受力向量標記：重力 mg (向下紅色) */}
            <line x1={bobX} y1={bobY} x2={bobX} y2={bobY + 28} stroke="#ef4444" strokeWidth="1.8" markerEnd="url(#shm-arrow-red)" />

            {/* 恢復力切向分量 (紫色) */}
            {Math.abs(angleNowDeg) > 1 && (
              <line
                x1={bobX}
                y1={bobY}
                x2={bobX - 22 * Math.sin(thetaNowRad)}
                y2={bobY}
                stroke="#a855f7"
                strokeWidth="1.8"
                markerEnd="url(#shm-arrow-purple)"
              />
            )}

            {/* 瞬時速度向量 (綠色) */}
            {speed > 0.1 && (
              <line
                x1={bobX}
                y1={bobY}
                x2={bobX + vDirX * speed * vScale}
                y2={bobY + vDirY * speed * vScale}
                stroke="#10b981"
                strokeWidth="2"
                markerEnd="url(#shm-arrow-green)"
              />
            )}

            {/* 角度與提示標籤 */}
            <text x={pivotX} y={svgHeight - 12} fill="#38bdf8" fontSize="8.5" textAnchor="middle">
              張力 T = {tension.toFixed(2)} N · 恢復力 F = {Math.abs(fRestore).toFixed(2)} N
            </text>
          </svg>
        </div>

        {/* 右側控制面板與能量統計 */}
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
          {/* 擺長滑桿 */}
          {/* 經典物理情境快照 */}
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '0.25rem' }}>
              ⚡ 經典簡諧運動情境快照：
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.3rem' }}>
              <button
                type="button"
                className="lab-snapshot-btn"
                onClick={() => {
                  setLength(0.99)
                  setThetaMaxDeg(5)
                  setAngleNowDeg(4)
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
                🎯 <strong>標準秒擺 ($T=2.0s$)</strong>
                <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>L=0.99m · 微小振幅 5°</div>
              </button>
              <button
                type="button"
                className="lab-snapshot-btn"
                onClick={() => {
                  setLength(0.25)
                  setThetaMaxDeg(15)
                  setAngleNowDeg(10)
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
                ⚡ <strong>短擺高頻 ($1.0Hz$)</strong>
                <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>L=0.25m · T=1.0s</div>
              </button>
              <button
                type="button"
                className="lab-snapshot-btn"
                onClick={() => {
                  setLength(1.5)
                  setThetaMaxDeg(30)
                  setAngleNowDeg(25)
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
                📐 <strong>大角度近似失效</strong>
                <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>30° 擺角 · 誤差達 4.5%</div>
              </button>
              <button
                type="button"
                className="lab-snapshot-btn"
                onClick={() => {
                  setLength(2.45)
                  setThetaMaxDeg(10)
                  setAngleNowDeg(8)
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
                🌌 <strong>長擺深沉緩擺</strong>
                <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>L=2.45m · T=3.14s</div>
              </button>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>擺長 $L$：</span>
              <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{length.toFixed(2)} m</strong>
            </div>
            <input
              type="range"
              aria-label="單擺擺長"
              aria-valuetext={`${length.toFixed(2)} 公尺`}
              min="0.2"
              max="2.5"
              step="0.05"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb', margin: 0 }}
            />
          </div>

          {/* 最大擺角滑桿 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>最大擺角 θ(max)：</span>
              <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{thetaMaxDeg}°</strong>
            </div>
            <input
              type="range"
              aria-label="單擺最大擺角"
              aria-valuetext={`${thetaMaxDeg} 度`}
              min="5"
              max="35"
              step="1"
              value={thetaMaxDeg}
              onChange={(e) => {
                const val = Number(e.target.value)
                setThetaMaxDeg(val)
                if (Math.abs(angleNowDeg) > val) setAngleNowDeg(val)
              }}
              style={{ width: '100%', accentColor: '#2563eb', margin: 0 }}
            />
          </div>

          {/* 即時動態擺角滑桿 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>動態擺位 $\theta$：</span>
              <strong style={{ color: '#8b5cf6', fontFamily: 'monospace' }}>{angleNowDeg}°</strong>
            </div>
            <input
              type="range"
              aria-label="單擺目前擺角"
              aria-valuetext={`${angleNowDeg} 度`}
              min={-thetaMaxDeg}
              max={thetaMaxDeg}
              step="1"
              value={angleNowDeg}
              onChange={(e) => setAngleNowDeg(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#8b5cf6', margin: 0 }}
            />
          </div>

          {/* 能量守恆雙色動態長條圖與數據 */}
          <div
            style={{
              background: 'var(--surface-soft)',
              padding: '0.45rem 0.55rem',
              borderRadius: '8px',
              fontSize: '0.72rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              border: '1px solid var(--line)',
              marginTop: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>{'單擺週期 T = 2π√(L/g)：'}</span>
              <strong style={{ fontFamily: 'monospace' }}>{period.toFixed(2)} s ({frequency.toFixed(2)} Hz)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>瞬時切向速率 $v$：</span>
              <strong style={{ color: '#10b981', fontFamily: 'monospace' }}>{speed.toFixed(2)} m/s</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>小角度近似誤差：</span>
              <span style={{ color: approxErrorPct < 1 ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                {approxErrorPct.toFixed(2)}% ({approxErrorPct < 1 ? '極精確' : '需考慮修正'})
              </span>
            </div>

            {/* 能量對照 Bar */}
            <div style={{ marginTop: '0.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '0.15rem' }}>
                <span style={{ color: '#10b981', fontWeight: 600 }}>動能 $E_k$ ({kePct}%)</span>
                <span style={{ color: '#f59e0b', fontWeight: 600 }}>位能 $U_g$ ({pePct}%)</span>
              </div>
              <div style={{ display: 'flex', height: '7px', borderRadius: '999px', overflow: 'hidden', background: '#334155' }}>
                <div style={{ width: `${kePct}%`, background: '#10b981', transition: 'width 0.1s linear' }} />
                <div style={{ width: `${pePct}%`, background: '#f59e0b', transition: 'width 0.1s linear' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShmLab
