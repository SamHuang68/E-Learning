import React, { useState } from 'react'

/**
 * 化學動態實驗室：理想氣體定律與分子動力學 (GasLawLab)
 * 探討 PV = nRT、波以耳定律 (等溫 P∝1/V)、查理定律 (等壓 V∝T)、給呂薩克定律 (等容 P∝T) 與分子平均動能。
 */
export const GasLawLab: React.FC = () => {
  const [tempK, setTempK] = useState<number>(300) // 溫度 (K)
  const [volL, setVolL] = useState<number>(24.5) // 體積 (L)
  const [molN, setMolN] = useState<number>(1.0) // 莫耳數 (mol)
  const [lawMode, setLawMode] = useState<'ideal' | 'boyle' | 'charles' | 'gay_lussac'>('ideal')

  const R = 0.0821 // L·atm / (mol·K)
  const pressureAtm = (molN * R * tempK) / Math.max(1, volL) // P = nRT / V

  // 氣體分子方均根速率 (以氦氣 M=4 g/mol 為例估算相對速率)
  const vRms = Math.sqrt((3 * 8.314 * tempK) / 0.004) // m/s
  const avgKeJoules = (3 / 2) * 8.314 * tempK // J/mol

  // SVG 活塞幾何
  const svgWidth = 360
  const svgHeight = 220
  const cylX = 45
  const cylY = 35
  const cylW = 160
  const cylH = 145

  // 活塞 Y 坐標 (體積 10L ~ 40L 映射到 Y: 140 ~ 50)
  const minVol = 10
  const maxVol = 40
  const pistonMinY = 50
  const pistonMaxY = 140
  const pistonY = pistonMaxY - ((volL - minVol) / (maxVol - minVol)) * (pistonMaxY - pistonMinY)

  // 壓力錶指針角度 (0 ~ 5 atm 映射到 -120° ~ 120°)
  const gaugeAngle = Math.min(120, Math.max(-120, ((pressureAtm - 0) / 5) * 240 - 120))
  const gaugeRad = (gaugeAngle * Math.PI) / 180
  const gaugeCx = 280
  const gaugeCy = 95
  const needleLen = 32
  const needleX = gaugeCx + needleLen * Math.sin(gaugeRad)
  const needleY = gaugeCy - needleLen * Math.cos(gaugeRad)

  // 粒子位置分佈 (12 顆隨機分佈但在當前活塞下方)
  const particles = [
    { rx: 0.2, ry: 0.3 },
    { rx: 0.5, ry: 0.2 },
    { rx: 0.8, ry: 0.4 },
    { rx: 0.35, ry: 0.6 },
    { rx: 0.65, ry: 0.55 },
    { rx: 0.18, ry: 0.75 },
    { rx: 0.82, ry: 0.7 },
    { rx: 0.48, ry: 0.82 },
    { rx: 0.3, ry: 0.45 },
    { rx: 0.7, ry: 0.35 },
    { rx: 0.55, ry: 0.7 },
    { rx: 0.25, ry: 0.88 },
  ]

  const chamberH = cylY + cylH - pistonY

  return (
    <div className="math-lab chemistry-lab gas-law-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 頂部標題 */}
      <div className="lab-header" style={{ marginBottom: '0.6rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🎈</span> 理想氣體定律與分子動力學實驗室 (Ideal Gas Law)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            狀態方程式：$PV = nRT$。氣體壓力源自無數分子對器壁碰撞產生的動量變化，平均動能僅與絕對溫度 $T$ 成正比。
          </p>
        </div>
      </div>

      {/* 雙欄響應式佈局 */}
      <div
        className="lab-workspace-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '0.75rem',
          alignItems: 'start',
          width: '100%',
        }}
      >
        {/* 左側 SVG 活塞氣缸與壓力錶視口 */}
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
            <span>氣體活塞微觀模擬</span>
            <span style={{ color: '#f59e0b', fontWeight: 600 }}>壓力 P = {pressureAtm.toFixed(2)} atm</span>
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: 'auto', display: 'block', overflow: 'hidden' }}
          >
            {/* 氣缸外殼 (U 型透明缸體) */}
            <rect x={cylX} y={cylY} width={cylW} height={cylH} fill="none" stroke="#94a3b8" strokeWidth="3" rx="2" />

            {/* 氣體分佈區域 (淺黃色透明) */}
            <rect x={cylX + 2} y={pistonY + 8} width={cylW - 4} height={cylY + cylH - pistonY - 10} fill="rgba(250, 204, 21, 0.08)" />

            {/* 活塞蓋與推桿 */}
            <rect x={cylX + 2} y={pistonY} width={cylW - 4} height="10" fill="#3b82f6" stroke="#60a5fa" strokeWidth="1" rx="2" />
            <line x1={cylX + cylW / 2} y1="12" x2={cylX + cylW / 2} y2={pistonY} stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
            <rect x={cylX + cylW / 2 - 16} y="8" width="32" height="6" fill="#64748b" rx="2" />

            {/* 氣體粒子動態分佈 */}
            {particles.map((p, idx) => {
              const px = cylX + 15 + p.rx * (cylW - 30)
              const py = pistonY + 16 + p.ry * Math.max(15, chamberH - 24)
              return (
                <g key={`particle-${idx}`}>
                  <circle cx={px} cy={py} r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
                  {/* 速度動態短線 (隨溫度長度增長) */}
                  <line
                    x1={px}
                    y1={py}
                    x2={px + ((idx % 2 === 0 ? 1 : -1) * tempK) / 60}
                    y2={py + ((idx % 3 === 0 ? 1 : -1) * tempK) / 70}
                    stroke="rgba(250, 204, 21, 0.6)"
                    strokeWidth="1.2"
                  />
                </g>
              )
            })}

            {/* 體積標籤 */}
            <text x={cylX + cylW / 2} y={cylY + cylH + 16} fill="#38bdf8" fontSize="8.5" fontWeight="bold" textAnchor="middle">
              當前體積 V = {volL.toFixed(1)} L
            </text>

            {/* 圓形壓力錶 (右側) */}
            <circle cx={gaugeCx} cy={gaugeCy} r="42" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
            <circle cx={gaugeCx} cy={gaugeCy} r="36" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <text x={gaugeCx} y={gaugeCy - 20} fill="#94a3b8" fontSize="7.5" textAnchor="middle">PRESSURE</text>
            <text x={gaugeCx} y={gaugeCy + 24} fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle">
              {pressureAtm.toFixed(2)} atm
            </text>

            {/* 壓力錶刻度線 */}
            {[-120, -60, 0, 60, 120].map((deg, i) => {
              const r1 = 30
              const r2 = 35
              const a = (deg * Math.PI) / 180
              return (
                <line
                  key={i}
                  x1={gaugeCx + r1 * Math.sin(a)}
                  y1={gaugeCy - r1 * Math.cos(a)}
                  x2={gaugeCx + r2 * Math.sin(a)}
                  y2={gaugeCy - r2 * Math.cos(a)}
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                />
              )
            })}

            {/* 壓力錶指針 */}
            <line x1={gaugeCx} y1={gaugeCy} x2={needleX} y2={needleY} stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            <circle cx={gaugeCx} cy={gaugeCy} r="3.5" fill="#ef4444" />
          </svg>
        </div>

        {/* 右側控制面板 */}
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
          {/* 實驗定律模式切換 */}
          <div>
            <label style={{ fontSize: '0.74rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
              氣體定律模式：
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
              <button
                type="button"
                className={`pill-btn ${lawMode === 'ideal' ? 'active' : ''}`}
                style={{ flex: 1, padding: '0.15rem 0.2rem', fontSize: '0.65rem' }}
                onClick={() => setLawMode('ideal')}
              >
                PV=nRT
              </button>
              <button
                type="button"
                className={`pill-btn ${lawMode === 'boyle' ? 'active' : ''}`}
                style={{ flex: 1, padding: '0.15rem 0.2rem', fontSize: '0.65rem' }}
                onClick={() => {
                  setLawMode('boyle')
                  setTempK(300)
                }}
              >
                波以耳 (定溫)
              </button>
              <button
                type="button"
                className={`pill-btn ${lawMode === 'charles' ? 'active' : ''}`}
                style={{ flex: 1, padding: '0.15rem 0.2rem', fontSize: '0.65rem' }}
                onClick={() => {
                  setLawMode('charles')
                }}
              >
                查理 (定壓)
              </button>
              <button
                type="button"
                className={`pill-btn ${lawMode === 'gay_lussac' ? 'active' : ''}`}
                style={{ flex: 1, padding: '0.15rem 0.2rem', fontSize: '0.65rem' }}
                onClick={() => {
                  setLawMode('gay_lussac')
                  setVolL(24.5)
                }}
              >
                給呂薩克 (定容)
              </button>
            </div>
          </div>

          {/* 容器體積滑桿 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>容器體積 $V$：</span>
              <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{volL.toFixed(1)} L</strong>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              step="0.5"
              value={volL}
              disabled={lawMode === 'gay_lussac'}
              onChange={(e) => setVolL(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb', margin: 0 }}
            />
          </div>

          {/* 絕對溫度滑桿 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>絕對溫度 $T$：</span>
              <strong style={{ color: '#ef4444', fontFamily: 'monospace' }}>{tempK} K ({(tempK - 273.15).toFixed(0)}°C)</strong>
            </div>
            <input
              type="range"
              min="150"
              max="600"
              step="10"
              value={tempK}
              disabled={lawMode === 'boyle'}
              onChange={(e) => setTempK(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#ef4444', margin: 0 }}
            />
          </div>

          {/* 莫耳數滑桿 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>氣體莫耳數 $n$：</span>
              <strong style={{ color: '#10b981', fontFamily: 'monospace' }}>{molN.toFixed(1)} mol</strong>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={molN}
              onChange={(e) => setMolN(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981', margin: 0 }}
            />
          </div>

          {/* 微觀動力學數據面板 */}
          <div
            style={{
              background: 'var(--surface-soft)',
              padding: '0.45rem 0.55rem',
              borderRadius: '8px',
              fontSize: '0.72rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.22rem',
              border: '1px solid var(--line)',
              marginTop: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>氣體壓力 P = nRT / V：</span>
              <strong style={{ color: '#f59e0b', fontFamily: 'monospace' }}>{pressureAtm.toFixed(2)} atm ({(pressureAtm * 101.3).toFixed(1)} kPa)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>分子平均平動動能 Ek = (3/2)RT：</span>
              <strong style={{ fontFamily: 'monospace' }}>{avgKeJoules.toFixed(0)} J/mol</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>氦分子方均根速率 v(rms)：</span>
              <strong style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{vRms.toFixed(0)} m/s</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GasLawLab
