import React from 'react'
import type { TrackRadar } from '../engine/radar'

type Props = {
  radar: TrackRadar
  size?: number
}

/**
 * 多維度練習紀錄雷達圖元件 (KnowledgeRadar)
 * 輕量級純 SVG 繪製五邊形蜘蛛網雷達圖，零第三方圖表庫依賴。
 */
export const KnowledgeRadar: React.FC<Props> = ({ radar, size = 320 }) => {
  const cx = size / 2
  const cy = size / 2
  const maxRadius = (size / 2) * 0.72

  const dimensions = radar.dimensions
  const count = dimensions.length
  const angleStep = (2 * Math.PI) / count

  // 計算特定維度與半徑長度的 SVG 坐標
  function getCoordinates(index: number, radiusRatio: number) {
    const angle = index * angleStep - Math.PI / 2
    const r = maxRadius * radiusRatio
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    }
  }

  // 繪製背景同心多邊形網格 (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0]

  // 計算數據多邊形頂點
  const polygonPoints = dimensions
    .map((d, i) => {
      const ratio = Math.max(0.1, d.score / d.fullMark)
      const p = getCoordinates(i, ratio)
      return `${p.x},${p.y}`
    })
    .join(' ')

  return (
    <div className="knowledge-radar-card">
      <div className="radar-header">
        <h4>📊 {radar.trackName} · 練習紀錄雷達</h4>
        <span className="radar-avg-badge">紀錄指標：{radar.averageScore} / 100</span>
      </div>

      <div className="radar-svg-container">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="radar-svg"
          role="img"
          aria-labelledby="knowledge-radar-title knowledge-radar-desc"
        >
          <title id="knowledge-radar-title">{radar.trackName}練習紀錄雷達</title>
          <desc id="knowledge-radar-desc">
            本機紀錄指標 {radar.averageScore}。{dimensions.map((dimension) => `${dimension.label} ${dimension.score}`).join('；')}。此圖不是能力診斷。
          </desc>
          {/* 背景同心五邊形網格 */}
          {gridLevels.map((lvl) => {
            const points = Array.from({ length: count })
              .map((_, i) => {
                const p = getCoordinates(i, lvl)
                return `${p.x},${p.y}`
              })
              .join(' ')
            return (
              <polygon
                key={`grid-${lvl}`}
                points={points}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={lvl === 1.0 ? '1.5' : '1'}
                strokeDasharray={lvl < 1.0 ? '3,3' : undefined}
              />
            )
          })}

          {/* 軸線 (Axis Lines) */}
          {Array.from({ length: count }).map((_, i) => {
            const p = getCoordinates(i, 1.0)
            return (
              <line
                key={`axis-${i}`}
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke="#cbd5e1"
                strokeWidth="1"
              />
            )
          })}

          {/* 數據覆蓋多邊形 (Data Area) */}
          <polygon
            points={polygonPoints}
            fill="rgba(59, 130, 246, 0.25)"
            stroke="#2563eb"
            strokeWidth="2.5"
          />

          {/* 數據頂點圓點 */}
          {dimensions.map((d, i) => {
            const ratio = Math.max(0.1, d.score / d.fullMark)
            const p = getCoordinates(i, ratio)
            return (
              <circle
                key={`dot-${i}`}
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth="2"
              />
            )
          })}

          {/* 維度標籤與數值 */}
          {dimensions.map((d, i) => {
            const p = getCoordinates(i, 1.18)
            const isLeft = p.x < cx - 10
            const isRight = p.x > cx + 10
            const textAnchor = isLeft ? 'end' : isRight ? 'start' : 'middle'

            return (
              <text
                key={`label-${d.key}`}
                x={p.x}
                y={p.y}
                textAnchor={textAnchor}
                fontSize="11"
                fontWeight="700"
                fill="#334155"
              >
                {d.label} ({d.score})
              </text>
            )
          })}
        </svg>
      </div>

      <ul className="sr-only">
        {dimensions.map((dimension) => (
          <li key={dimension.key}>{dimension.label}：{dimension.score} / {dimension.fullMark}</li>
        ))}
      </ul>

      <div className="radar-insights-row">
        <div className="insight-badge strong">
          <span>🌟 目前較多紀錄：</span>
          <strong>{radar.strongestDimension.label} ({radar.strongestDimension.score}分)</strong>
        </div>
        <div className="insight-badge weak">
          <span>🎯 可先探索：</span>
          <strong>{radar.weakestDimension.label} ({radar.weakestDimension.score}分)</strong>
        </div>
      </div>
    </div>
  )
}
