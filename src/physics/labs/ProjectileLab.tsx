import React, { useState, useMemo } from 'react'

/**
 * 物理動態實驗室：斜向拋體與運動學實驗室 (ProjectileLab)
 * 涵蓋運動獨立性原理、水平等速運動、鉛直等加速運動、軌跡即時探針、極值頂點與射程標記。
 */
export const ProjectileLab: React.FC = () => {
  const [v0, setV0] = useState<number>(25) // 初速 (m/s)
  const [angleDeg, setAngleDeg] = useState<number>(45) // 仰角 (°)
  const [g, setG] = useState<number>(9.8) // 重力加速度 (m/s^2)
  const [timeProbe, setTimeProbe] = useState<number>(0.5) // 即時時間探針比例 (0 ~ 1)

  // 運動學計算
  const angleRad = (angleDeg * Math.PI) / 180
  const vx = v0 * Math.cos(angleRad)
  const vy0 = v0 * Math.sin(angleRad)

  // 飛行時間 T (s)、最大高度 H (m)、水平射程 R (m)
  const flightTime = (2 * vy0) / g
  const maxHeight = (vy0 * vy0) / (2 * g)
  const range = (v0 * v0 * Math.sin(2 * angleRad)) / g

  // 當前探針時間與坐標
  const currentTime = flightTime * timeProbe
  const curX = vx * currentTime
  const curY = Math.max(0, vy0 * currentTime - 0.5 * g * currentTime * currentTime)
  const curVy = vy0 - g * currentTime
  const curV = Math.sqrt(vx * vx + curVy * curVy)

  // SVG 動態視口與比例尺計算
  const svgWidth = 460
  const svgHeight = 220
  const originX = 35
  const originY = 185

  // 自適應比例尺 (確保任意初速與角度都在視口內自適應縮放，絕不超出容器)
  const maxPlotX = Math.max(60, range * 1.12)
  const maxPlotY = Math.max(20, maxHeight * 1.35)
  const scaleX = (svgWidth - originX - 30) / maxPlotX
  const scaleY = (originY - 30) / maxPlotY

  // 軌跡採樣點 (50 點平滑曲線)
  const trajectoryPoints = useMemo(() => {
    const pts: Array<{ x: number; y: number }> = []
    const steps = 50
    for (let i = 0; i <= steps; i++) {
      const t = (flightTime * i) / steps
      const x = vx * t
      const y = Math.max(0, vy0 * t - 0.5 * g * t * t)
      pts.push({ x, y })
    }
    return pts
  }, [flightTime, g, vx, vy0])

  const svgPath = useMemo(() => {
    return trajectoryPoints
      .map((p, idx) => {
        const sx = originX + p.x * scaleX
        const sy = originY - p.y * scaleY
        return `${idx === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`
      })
      .join(' ')
  }, [trajectoryPoints, scaleX, scaleY])

  // 特徵點屏幕坐標
  const apexSx = originX + (range / 2) * scaleX
  const apexSy = originY - maxHeight * scaleY
  const rangeSx = originX + range * scaleX
  const curSx = originX + curX * scaleX
  const curSy = originY - curY * scaleY

  // 發射速度分解箭頭
  const v0VectorLen = 32
  const v0EndX = originX + v0VectorLen * Math.cos(angleRad)
  const v0EndY = originY - v0VectorLen * Math.sin(angleRad)

  return (
    <div className="math-lab physics-lab projectile-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 頂部標題 */}
      <div className="lab-header" style={{ marginBottom: '0.6rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🚀</span> 斜向拋體與運動學實驗室 (Projectile Motion Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            運動獨立性：水平方向等速度運動 ($v_x = v_0 \cos\theta$)，鉛直方向等加速度運動 ($a_y = -g$)。
          </p>
        </div>
      </div>

      {/* 雙欄響應式工作台 */}
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
        {/* 左側 SVG 動態物理視口 */}
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
              2D 向量軌跡模擬視口
            </span>
            <span style={{ fontFamily: 'monospace' }}>$t = {currentTime.toFixed(2)}$s / {flightTime.toFixed(2)}s</span>
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: 'auto', display: 'block', overflow: 'hidden' }}
          >
            <defs>
              <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
              </marker>
              <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
              </marker>
              <marker id="arrow-orange" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
              </marker>
            </defs>

            {/* 背景格線 */}
            <line x1={originX} y1={originY - maxPlotY * scaleY * 0.5} x2={svgWidth - 20} y2={originY - maxPlotY * scaleY * 0.5} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={originX + maxPlotX * scaleX * 0.5} y1={25} x2={originX + maxPlotX * scaleX * 0.5} y2={originY} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

            {/* 地面與坐標軸 */}
            <line x1={originX - 10} y1={originY} x2={svgWidth - 15} y2={originY} stroke="#475569" strokeWidth="2" />
            <line x1={originX} y1={originY + 10} x2={originX} y2={20} stroke="#475569" strokeWidth="2" />
            <rect x={originX - 10} y={originY} width={svgWidth - originX + 5} height={svgHeight - originY} fill="#131e36" />
            <text x={svgWidth - 18} y={originY - 5} fill="#64748b" fontSize="9" textAnchor="end">X (m)</text>
            <text x={originX + 6} y={28} fill="#64748b" fontSize="9">Y (m)</text>

            {/* 最高點參考輔助虛線 */}
            <line x1={originX} y1={apexSy} x2={apexSx} y2={apexSy} stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1" strokeDasharray="3 2" />
            <line x1={apexSx} y1={apexSy} x2={apexSx} y2={originY} stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1" strokeDasharray="3 2" />

            {/* 拋物線主軌跡 */}
            <path d={svgPath} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="5 3" />

            {/* 初速度分解向量 (原點) */}
            <line x1={originX} y1={originY} x2={v0EndX} y2={v0EndY} stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow-orange)" />
            <line x1={originX} y1={originY} x2={v0EndX} y2={originY} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" markerEnd="url(#arrow-blue)" />
            <line x1={originX} y1={originY} x2={originX} y2={v0EndY} stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" markerEnd="url(#arrow-green)" />
            <circle cx={originX} cy={originY} r="4" fill="#f59e0b" />

            {/* 最高點標記 */}
            <circle cx={apexSx} cy={apexSy} r="4.5" fill="#ef4444" stroke="#fff" strokeWidth="1" />
            <text x={apexSx} y={Math.max(16, apexSy - 6)} fill="#f87171" fontSize="8.5" fontWeight="bold" textAnchor="middle">
              頂點 H={maxHeight.toFixed(1)}m
            </text>

            {/* 射程終點標記 */}
            <circle cx={rangeSx} cy={originY} r="4.5" fill="#10b981" stroke="#fff" strokeWidth="1" />
            <text x={rangeSx} y={originY + 14} fill="#34d399" fontSize="8.5" fontWeight="bold" textAnchor="middle">
              射程 R={range.toFixed(1)}m
            </text>

            {/* 當前動態探針位置與速度向量 */}
            <line x1={curSx} y1={originY} x2={curSx} y2={curSy} stroke="rgba(244, 114, 182, 0.4)" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx={curSx} cy={curSy} r="6" fill="#f43f5e" stroke="#fff" strokeWidth="1.5" />
            {curV > 0.5 && (
              <line
                x1={curSx}
                y1={curSy}
                x2={curSx + (vx / v0) * 22}
                y2={curSy - (curVy / v0) * 22}
                stroke="#fbbf24"
                strokeWidth="2"
                markerEnd="url(#arrow-orange)"
              />
            )}
            <text x={curSx} y={Math.max(22, curSy - 9)} fill="#fbcfe8" fontSize="8" fontWeight="bold" textAnchor="middle">
              ({curX.toFixed(1)}m, {curY.toFixed(1)}m)
            </text>
          </svg>
        </div>

        {/* 右側控制面板與即時數據分析 */}
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
          {/* 初速度滑桿 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>初速度 $v_0$：</span>
              <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{v0} m/s</strong>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              step="1"
              value={v0}
              onChange={(e) => setV0(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb', margin: 0 }}
            />
          </div>

          {/* 發射仰角滑桿 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>發射仰角 $\theta$：</span>
              <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{angleDeg}°</strong>
            </div>
            <input
              type="range"
              min="5"
              max="85"
              step="1"
              value={angleDeg}
              onChange={(e) => setAngleDeg(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb', margin: 0 }}
            />
          </div>

          {/* 時間動態探針滑桿 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>動態時間探針 $t$：</span>
              <strong style={{ color: '#f43f5e', fontFamily: 'monospace' }}>{currentTime.toFixed(2)} s</strong>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={timeProbe}
              onChange={(e) => setTimeProbe(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f43f5e', margin: 0 }}
            />
          </div>

          {/* 重力加速度環境快速切換 */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '0.2rem' }}>
              重力加速度場 $g$：
            </div>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                type="button"
                className={`pill-btn ${g === 9.8 ? 'active' : ''}`}
                style={{ flex: 1, padding: '0.2rem 0.3rem', fontSize: '0.68rem', textAlign: 'center' }}
                onClick={() => setG(9.8)}
              >
                🌍 地球 (9.8)
              </button>
              <button
                type="button"
                className={`pill-btn ${g === 1.62 ? 'active' : ''}`}
                style={{ flex: 1, padding: '0.2rem 0.3rem', fontSize: '0.68rem', textAlign: 'center' }}
                onClick={() => setG(1.62)}
              >
                🌕 月球 (1.62)
              </button>
              <button
                type="button"
                className={`pill-btn ${g === 3.7 ? 'active' : ''}`}
                style={{ flex: 1, padding: '0.2rem 0.3rem', fontSize: '0.68rem', textAlign: 'center' }}
                onClick={() => setG(3.7)}
              >
                🪐 火星 (3.7)
              </button>
            </div>
          </div>

          {/* 數值面板與運動學公式對齊 */}
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
              <span style={{ color: 'var(--muted)' }}>飛行總時間 T = 2v₀sinθ / g：</span>
              <strong style={{ fontFamily: 'monospace' }}>{flightTime.toFixed(2)} s</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>最大高度 H = v₀y² / (2g)：</span>
              <strong style={{ color: '#ef4444', fontFamily: 'monospace' }}>{maxHeight.toFixed(2)} m</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>水平射程 R = v₀²sin(2θ) / g：</span>
              <strong style={{ color: '#10b981', fontFamily: 'monospace' }}>{range.toFixed(2)} m</strong>
            </div>
            <div style={{ borderTop: '1px dashed var(--line)', paddingTop: '0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#8b5cf6' }}>探針瞬時速率 $v(t)$：</span>
              <strong style={{ color: '#8b5cf6', fontFamily: 'monospace' }}>{curV.toFixed(1)} m/s</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectileLab
