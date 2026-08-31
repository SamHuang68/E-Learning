import React, { useState } from 'react'

/**
 * 物理動態實驗室：幾何光學與司乃耳定律 (OpticsLab)
 * 探討光在兩種介質介面之折射、反射、全反射臨界角 θ_c = arcsin(n2/n1) 與光線強度衰減。
 */
export const OpticsLab: React.FC = () => {
  const [n1, setN1] = useState<number>(1.0) // 介質 1 折射率
  const [n2, setN2] = useState<number>(1.5) // 介質 2 折射率
  const [theta1Deg, setTheta1Deg] = useState<number>(35) // 入射角 (°)

  // 司乃耳定律計算
  const theta1Rad = (theta1Deg * Math.PI) / 180
  const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2
  const isTir = sinTheta2 > 1.0 // 是否發生全反射
  const theta2Rad = isTir ? 0 : Math.asin(sinTheta2)
  const theta2Deg = isTir ? 0 : (theta2Rad * 180) / Math.PI

  // 全反射臨界角
  const criticalAngleDeg = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null

  // SVG 視口與幾何坐標
  const svgWidth = 360
  const svgHeight = 230
  const cx = 180
  const cy = 115
  const rayLen = 95

  // 入射光起點 (介質 1 內)
  const incX = cx - rayLen * Math.sin(theta1Rad)
  const incY = cy - rayLen * Math.cos(theta1Rad)

  // 反射光終點 (介質 1 內)
  const refX = cx + rayLen * Math.sin(theta1Rad)
  const refY = cy - rayLen * Math.cos(theta1Rad)

  // 折射光終點 (介質 2 內)
  const refrX = isTir ? cx : cx + rayLen * Math.sin(theta2Rad)
  const refrY = isTir ? cy : cy + rayLen * Math.cos(theta2Rad)

  // 常用介質預設資料
  const MEDIUM_PRESETS = [
    { label: '空氣', n: 1.0 },
    { label: '水', n: 1.33 },
    { label: '玻璃', n: 1.5 },
    { label: '鑽石', n: 2.42 },
  ]

  return (
    <div className="math-lab physics-lab optics-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 頂部標題 */}
      <div className="lab-header" style={{ marginBottom: '0.6rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🌈</span> 幾何光學與司乃耳定律實驗室 (Snell's Law & Optics)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            司乃耳折射定律：$n_1 \sin\theta_1 = n_2 \sin\theta_2$。光從光密介質射向光疏介質且 $\theta_1 &gt; \theta_c$ 時發生全反射。
          </p>
        </div>
      </div>

      {/* 經典幾何光學情境快照切換 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.55rem' }}>
        <button
          type="button"
          className="pill-btn"
          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', background: n1 === 1.0 && n2 === 1.33 ? 'rgba(250, 204, 21, 0.2)' : undefined }}
          onClick={() => { setN1(1.0); setN2(1.33); setTheta1Deg(45); }}
        >
          🌊 空氣 ➜ 水折射 (n₁=1.0, n₂=1.33)
        </button>
        <button
          type="button"
          className="pill-btn"
          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', background: n1 === 1.0 && n2 === 1.5 ? 'rgba(250, 204, 21, 0.2)' : undefined }}
          onClick={() => { setN1(1.0); setN2(1.5); setTheta1Deg(30); }}
        >
          🔍 空氣 ➜ 玻璃透鏡 (n₁=1.0, n₂=1.5)
        </button>
        <button
          type="button"
          className="pill-btn"
          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', background: n1 === 1.33 && n2 === 1.0 && theta1Deg >= 48.8 ? 'rgba(239, 68, 68, 0.2)' : undefined }}
          onClick={() => { setN1(1.33); setN2(1.0); setTheta1Deg(60); }}
        >
          🚨 水中全反射 (θc=48.8°)
        </button>
        <button
          type="button"
          className="pill-btn"
          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', background: n1 === 2.42 && n2 === 1.0 ? 'rgba(250, 204, 21, 0.2)' : undefined }}
          onClick={() => { setN1(2.42); setN2(1.0); setTheta1Deg(45); }}
        >
          💎 鑽石火彩全反射 (n₁=2.42, θc=24.4°)
        </button>
      </div>

      {/* 雙欄響應式佈局 */}
      <div
        className="lab-workspace-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(285px, 1fr))',
          gap: '0.75rem',
          alignItems: 'start',
          width: '100%',
        }}
      >
        {/* 左側 SVG 折射/全反射幾何視口 */}
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
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#facc15', display: 'inline-block' }} />
              光線路徑與法線幾何
            </span>
            <span style={{ color: isTir ? '#ef4444' : '#10b981', fontWeight: 600 }}>
              {isTir ? '⚠️ 發生全反射 (TIR)' : `折射角 θ₂ = ${theta2Deg.toFixed(1)}°`}
            </span>
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: 'auto', display: 'block', overflow: 'hidden' }}
          >
            <defs>
              <marker id="ray-arrow-yellow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#facc15" />
              </marker>
              <marker id="ray-arrow-cyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
              </marker>
            </defs>

            {/* 介質 1 區域 (上方) */}
            <rect x="0" y="0" width={svgWidth} height={cy} fill="rgba(15, 23, 42, 0.6)" />
            <text x="12" y="24" fill="#94a3b8" fontSize="9.5" fontWeight="bold">介質 1 ($n_1 = {n1}$)</text>

            {/* 介質 2 區域 (下方，淡藍色水狀半透明) */}
            <rect x="0" y={cy} width={svgWidth} height={svgHeight - cy} fill="rgba(56, 189, 248, 0.16)" />
            <text x="12" y={cy + 22} fill="#38bdf8" fontSize="9.5" fontWeight="bold">介質 2 ($n_2 = {n2}$)</text>

            {/* 介面分界線 */}
            <line x1="0" y1={cy} x2={svgWidth} y2={cy} stroke="#38bdf8" strokeWidth="1.5" />

            {/* 法線 (虛線) */}
            <line x1={cx} y1="15" x2={cx} y2={svgHeight - 15} stroke="#64748b" strokeWidth="1.2" strokeDasharray="4 3" />
            <text x={cx + 5} y="22" fill="#64748b" fontSize="8">法線 (Normal)</text>

            {/* 入射光線 */}
            <line x1={incX} y1={incY} x2={cx} y2={cy} stroke="#facc15" strokeWidth="2.5" />
            {/* 入射箭頭 */}
            <line x1={incX} y1={incY} x2={(incX + cx) / 2} y2={(incY + cy) / 2} stroke="#facc15" strokeWidth="2.5" markerEnd="url(#ray-arrow-yellow)" />

            {/* 反射光線 */}
            <line
              x1={cx}
              y1={cy}
              x2={refX}
              y2={refY}
              stroke={isTir ? '#facc15' : 'rgba(250, 204, 21, 0.45)'}
              strokeWidth={isTir ? 2.5 : 1.5}
            />
            {/* 反射箭頭 */}
            <line
              x1={cx}
              y1={cy}
              x2={(cx + refX) / 2}
              y2={(cy + refY) / 2}
              stroke={isTir ? '#facc15' : 'rgba(250, 204, 21, 0.45)'}
              strokeWidth={isTir ? 2.5 : 1.5}
              markerEnd="url(#ray-arrow-yellow)"
            />

            {/* 折射光線 (若未發生全反射) */}
            {!isTir && (
              <>
                <line x1={cx} y1={cy} x2={refrX} y2={refrY} stroke="#38bdf8" strokeWidth="2.5" />
                <line x1={cx} y1={cy} x2={(cx + refrX) / 2} y2={(cy + refrY) / 2} stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#ray-arrow-cyan)" />
              </>
            )}

            {/* 入射角標籤 */}
            <text x={cx - 18} y={cy - 22} fill="#facc15" fontSize="8.5" fontWeight="bold">θ₁={theta1Deg}°</text>

            {/* 折射角標籤 */}
            {!isTir && (
              <text x={cx + 12} y={cy + 28} fill="#38bdf8" fontSize="8.5" fontWeight="bold">θ₂={theta2Deg.toFixed(1)}°</text>
            )}

            {/* 入射交點光暈 */}
            <circle cx={cx} cy={cy} r="4" fill="#ffffff" stroke="#facc15" strokeWidth="1.5" />

            {/* 全反射提示條 */}
            {isTir && (
              <g>
                <rect x={cx - 85} y={cy + 35} width="170" height="24" rx="4" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1" />
                <text x={cx} y={cy + 51} fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">
                  ⚠️ 100% 全反射 (無折射光出射)
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* 右側控制面板與司乃耳數值計算 */}
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
          {/* 介質 1 折射率 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>介質 1 折射率 $n_1$：</span>
              <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{n1.toFixed(2)}</strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.05"
              value={n1}
              onChange={(e) => setN1(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb', margin: 0 }}
            />
            <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.2rem' }}>
              {MEDIUM_PRESETS.map((m) => (
                <button
                  key={`n1-${m.label}`}
                  type="button"
                  className={`pill-btn ${n1 === m.n ? 'active' : ''}`}
                  style={{ flex: 1, padding: '0.15rem 0.25rem', fontSize: '0.65rem', textAlign: 'center' }}
                  onClick={() => setN1(m.n)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 介質 2 折射率 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>介質 2 折射率 $n_2$：</span>
              <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{n2.toFixed(2)}</strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.05"
              value={n2}
              onChange={(e) => setN2(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb', margin: 0 }}
            />
            <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.2rem' }}>
              {MEDIUM_PRESETS.map((m) => (
                <button
                  key={`n2-${m.label}`}
                  type="button"
                  className={`pill-btn ${n2 === m.n ? 'active' : ''}`}
                  style={{ flex: 1, padding: '0.15rem 0.25rem', fontSize: '0.65rem', textAlign: 'center' }}
                  onClick={() => setN2(m.n)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 入射角滑桿 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>入射角 $\theta_1$：</span>
              <strong style={{ color: '#f59e0b', fontFamily: 'monospace' }}>{theta1Deg}°</strong>
            </div>
            <input
              type="range"
              min="0"
              max="85"
              step="1"
              value={theta1Deg}
              onChange={(e) => setTheta1Deg(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f59e0b', margin: 0 }}
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
              gap: '0.25rem',
              border: '1px solid var(--line)',
              marginTop: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>折射角 θ₂ = arcsin(n₁sinθ₁ / n₂)：</span>
              <strong style={{ color: isTir ? '#ef4444' : '#10b981', fontFamily: 'monospace' }}>
                {isTir ? '無折射 (全反射)' : `${theta2Deg.toFixed(1)}°`}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>全反射臨界角 θc = arcsin(n₂ / n₁)：</span>
              <strong style={{ color: criticalAngleDeg ? '#8b5cf6' : 'var(--muted)', fontFamily: 'monospace' }}>
                {criticalAngleDeg ? `${criticalAngleDeg.toFixed(1)}°` : '無 (因 n1 ≤ n2)'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>光速比值 v₁ / v₂ = n₂ / n₁：</span>
              <strong style={{ fontFamily: 'monospace' }}>{(n2 / n1).toFixed(2)} 倍</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpticsLab
