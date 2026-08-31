import React, { useState } from 'react'

/**
 * 物理動態實驗室：阿基米德浮力與密度 (BuoyancyLab)
 * 探討浮力原理 B = V_排 × D_液、物體浮沉條件 (浮體、懸浮體、沉體) 與受力平衡向量。
 */
export const BuoyancyLab: React.FC = () => {
  const [objectDensity, setObjectDensity] = useState<number>(0.8) // 物體密度 (g/cm^3)
  const [liquidDensity, setLiquidDensity] = useState<number>(1.0) // 液體密度 (g/cm^3)
  const volume = 100 // 物體體積 (cm^3)

  // 物體重量 W (gw)
  const weight = volume * objectDensity
  // 浸入體積 V_排 (cm^3)
  const submergedVol = objectDensity < liquidDensity ? weight / liquidDensity : volume
  // 浮力 B (gw)
  const buoyancy = submergedVol * liquidDensity
  // 浸入百分比
  const submergencePct = Math.min(100, Math.round((submergedVol / volume) * 100))

  // 浮沉狀態判定
  const stateInfo =
    objectDensity < liquidDensity
      ? { text: '浮體 (B = W，漂浮於液面)', color: '#10b981' }
      : Math.abs(objectDensity - liquidDensity) < 1e-4
      ? { text: '懸浮體 (B = W，停留於液體內部任一處)', color: '#38bdf8' }
      : { text: `沉體 (B < W，沉入底部，正向力 N = ${(weight - buoyancy).toFixed(1)} gw)`, color: '#ef4444' }

  // 常用物體材質預設
  const MATERIAL_PRESETS = [
    { label: '保麗龍 (0.05)', d: 0.05 },
    { label: '軟木 (0.24)', d: 0.24 },
    { label: '橡木 (0.75)', d: 0.75 },
    { label: '冰塊 (0.92)', d: 0.92 },
    { label: '鋁 (2.70)', d: 2.70 },
  ]

  // 常用液體預設
  const LIQUID_PRESETS = [
    { label: '純水 (1.00)', d: 1.0 },
    { label: '酒精 (0.80)', d: 0.8 },
    { label: '濃鹽水 (1.20)', d: 1.2 },
    { label: '甘油 (1.26)', d: 1.26 },
  ]

  // SVG 視口幾何
  const svgWidth = 360
  const svgHeight = 220
  const tankX = 60
  const tankY = 40
  const tankW = 240
  const tankH = 135
  const baseWaterLevel = 75 // 基準液面 Y

  // 物體幾何
  const blockW = 70
  const blockH = 50
  const blockX = 145

  // 根據浸入深度計算物體 Y 坐標
  let blockY = baseWaterLevel
  if (objectDensity < liquidDensity) {
    // 漂浮：浸入深度的比例
    const subH = blockH * (submergedVol / volume)
    blockY = baseWaterLevel - (blockH - subH)
  } else if (Math.abs(objectDensity - liquidDensity) < 1e-4) {
    // 懸浮：水體中央
    blockY = baseWaterLevel + 25
  } else {
    // 沉底：水槽底部
    blockY = tankY + tankH - blockH
  }

  const blockCenterY = blockY + blockH / 2

  // 受力箭頭長度 (比例尺)
  const fScale = 0.4
  const wArrowLen = Math.min(65, Math.max(15, weight * fScale))
  const bArrowLen = Math.min(65, Math.max(15, buoyancy * fScale))

  return (
    <div className="math-lab physics-lab buoyancy-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 頂部標題 */}
      <div className="lab-header" style={{ marginBottom: '0.6rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>⛵</span> 阿基米德浮力與密度實驗室 (Buoyancy & Density Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            阿基米德原理：物體在液體中所受浮力等於其排開液體的重量 (B = V排 × D液)。
          </p>
        </div>
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
        {/* 左側 SVG 浮力水槽視口 */}
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
              受力平衡與排水量視覺化
            </span>
            <span style={{ color: stateInfo.color, fontWeight: 600 }}>{stateInfo.text.split(' ')[0]}</span>
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: 'auto', display: 'block', overflow: 'hidden' }}
          >
            <defs>
              <marker id="buoyancy-arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
              </marker>
              <marker id="buoyancy-arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ef4444" />
              </marker>
            </defs>

            {/* 水槽外框 */}
            <rect x={tankX} y={tankY} width={tankW} height={tankH} rx="5" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />

            {/* 液體 (藍色半透明) */}
            <rect x={tankX + 3} y={baseWaterLevel} width={tankW - 6} height={tankY + tankH - baseWaterLevel - 3} fill="rgba(56, 189, 248, 0.25)" />
            <line x1={tankX + 3} y1={baseWaterLevel} x2={tankX + tankW - 3} y2={baseWaterLevel} stroke="#38bdf8" strokeWidth="2" />
            <text x={tankX + 10} y={baseWaterLevel - 6} fill="#38bdf8" fontSize="8">液面基準線</text>

            {/* 物體方塊 */}
            <rect
              x={blockX}
              y={blockY}
              width={blockW}
              height={blockH}
              rx="4"
              fill="rgba(245, 158, 11, 0.9)"
              stroke="#d97706"
              strokeWidth="2"
            />
            <text x={blockX + blockW / 2} y={blockY + 18} fill="#fff" fontSize="8.5" fontWeight="bold" textAnchor="middle">
              物體 ({objectDensity.toFixed(2)})
            </text>
            <text x={blockX + blockW / 2} y={blockY + 32} fill="#fef3c7" fontSize="7.5" textAnchor="middle">
              {submergencePct}% 浸入
            </text>

            {/* 受力平衡向量：浮力 B 向上 (綠色) */}
            <line
              x1={blockX + blockW / 2}
              y1={blockCenterY}
              x2={blockX + blockW / 2}
              y2={blockCenterY - bArrowLen}
              stroke="#10b981"
              strokeWidth="2.5"
              markerEnd="url(#buoyancy-arrow-green)"
            />
            <text x={blockX + blockW / 2 + 10} y={blockCenterY - bArrowLen / 2} fill="#34d399" fontSize="8" fontWeight="bold">
              B={buoyancy.toFixed(0)}gw
            </text>

            {/* 受力平衡向量：重力 W 向下 (紅色) */}
            <line
              x1={blockX + blockW / 2}
              y1={blockCenterY}
              x2={blockX + blockW / 2}
              y2={blockCenterY + wArrowLen}
              stroke="#ef4444"
              strokeWidth="2.5"
              markerEnd="url(#buoyancy-arrow-red)"
            />
            <text x={blockX + blockW / 2 + 10} y={blockCenterY + wArrowLen / 2 + 6} fill="#f87171" fontSize="8" fontWeight="bold">
              W={weight.toFixed(0)}gw
            </text>

            {/* 底部浮沉狀態提示 */}
            <text x={svgWidth / 2} y={svgHeight - 12} fill={stateInfo.color} fontSize="9" fontWeight="bold" textAnchor="middle">
              {stateInfo.text}
            </text>
          </svg>
        </div>

        {/* 右側控制面板與數據 */}
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
          {/* 物體密度 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>物體密度 D(物)：</span>
              <strong style={{ color: '#f59e0b', fontFamily: 'monospace' }}>{objectDensity.toFixed(2)} g/cm³</strong>
            </div>
            <input
              type="range"
              min="0.05"
              max="2.8"
              step="0.05"
              value={objectDensity}
              onChange={(e) => setObjectDensity(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f59e0b', margin: 0 }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem', marginTop: '0.2rem' }}>
              {MATERIAL_PRESETS.map((m) => (
                <button
                  key={m.label}
                  type="button"
                  className={`pill-btn ${objectDensity === m.d ? 'active' : ''}`}
                  style={{ padding: '0.12rem 0.25rem', fontSize: '0.64rem' }}
                  onClick={() => setObjectDensity(m.d)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 液體密度 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              <span>液體密度 D(液)：</span>
              <strong style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{liquidDensity.toFixed(2)} g/cm³</strong>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.5"
              step="0.05"
              value={liquidDensity}
              onChange={(e) => setLiquidDensity(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#38bdf8', margin: 0 }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem', marginTop: '0.2rem' }}>
              {LIQUID_PRESETS.map((l) => (
                <button
                  key={l.label}
                  type="button"
                  className={`pill-btn ${liquidDensity === l.d ? 'active' : ''}`}
                  style={{ padding: '0.12rem 0.25rem', fontSize: '0.64rem' }}
                  onClick={() => setLiquidDensity(l.d)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* 浮力數值面板 */}
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
              <span style={{ color: 'var(--muted)' }}>物體重量 W = V × D(物)：</span>
              <strong style={{ fontFamily: 'monospace' }}>{weight.toFixed(1)} gw</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>排開體積 V(排)：</span>
              <strong style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{submergedVol.toFixed(1)} cm³ ({submergencePct}%)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>所受浮力 B = V(排) × D(液)：</span>
              <strong style={{ color: '#10b981', fontFamily: 'monospace' }}>{buoyancy.toFixed(1)} gw</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuoyancyLab
