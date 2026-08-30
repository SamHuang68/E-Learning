import React, { useState, useMemo } from 'react'

/**
 * 國中／高中「2D 坐標平面與函數繪圖實驗室 (CoordinateLab)」
 * 支援一次函數直線 $y = ax + b$ 與二次函數拋物線 $y = a(x-h)^2 + k$，提供即時幾何畫布與頂點/根分析。
 */
export const CoordinateLab: React.FC = () => {
  const [mode, setMode] = useState<'linear' | 'quadratic'>('quadratic')

  // 一次函數 y = ax + b
  const [linearA, setLinearA] = useState(1)
  const [linearB, setLinearB] = useState(0)

  // 二次函數 y = a(x - h)^2 + k
  const [quadA, setQuadA] = useState(1)
  const [quadH, setQuadH] = useState(2)
  const [quadK, setQuadK] = useState(-3)

  // 畫布尺寸與坐標範圍 (-10 ~ 10)
  const width = 360
  const height = 360
  const range = 10

  function toScreenX(x: number) {
    return ((x + range) / (2 * range)) * width
  }
  function toScreenY(y: number) {
    return height - ((y + range) / (2 * range)) * height
  }

  // 生成曲線 path
  const curvePath = useMemo(() => {
    const points: string[] = []
    const step = 0.2
    for (let x = -range; x <= range; x += step) {
      let y = 0
      if (mode === 'linear') {
        y = linearA * x + linearB
      } else {
        y = quadA * Math.pow(x - quadH, 2) + quadK
      }
      const sx = toScreenX(x)
      const sy = toScreenY(y)
      if (x === -range) {
        points.push(`M ${sx} ${sy}`)
      } else {
        points.push(`L ${sx} ${sy}`)
      }
    }
    return points.join(' ')
  }, [mode, linearA, linearB, quadA, quadH, quadK])

  return (
    <div className="math-lab coordinate-lab">
      <div className="lab-header">
        <div>
          <h3>2D 坐標幾何與函數實驗室 (Coordinate & Functions)</h3>
          <p className="lab-desc">
            調節係數動態觀察直線斜率與截距，或二次函數頂點 $(h, k)$ 與開口方向。
          </p>
        </div>
        <div className="tab-pills">
          <button
            type="button"
            className={`tab-pill ${mode === 'linear' ? 'active' : ''}`}
            onClick={() => setMode('linear')}
          >
            一次直線 ($y = ax + b$)
          </button>
          <button
            type="button"
            className={`tab-pill ${mode === 'quadratic' ? 'active' : ''}`}
            onClick={() => setMode('quadratic')}
          >
            二次拋物線 ($y = a(x-h)^2 + k$)
          </button>
        </div>
      </div>

      <div className="coord-layout">
        <div className="coord-canvas-box">
          <svg width={width} height={height} className="coord-svg">
            {/* 網格線 */}
            {Array.from({ length: range * 2 + 1 }).map((_, i) => {
              const val = -range + i
              const sx = toScreenX(val)
              const sy = toScreenY(val)
              return (
                <React.Fragment key={i}>
                  <line
                    x1={sx}
                    y1={0}
                    x2={sx}
                    y2={height}
                    stroke={val === 0 ? '#475569' : '#e2e8f0'}
                    strokeWidth={val === 0 ? 2 : 1}
                  />
                  <line
                    x1={0}
                    y1={sy}
                    x2={width}
                    y2={sy}
                    stroke={val === 0 ? '#475569' : '#e2e8f0'}
                    strokeWidth={val === 0 ? 2 : 1}
                  />
                </React.Fragment>
              )
            })}

            {/* 函數曲線 */}
            <path
              d={curvePath}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              className="function-curve"
            />

            {/* 二次函數頂點標記 */}
            {mode === 'quadratic' && (
              <circle
                cx={toScreenX(quadH)}
                cy={toScreenY(quadK)}
                r="6"
                fill="#ef4444"
                stroke="#fff"
                strokeWidth="2"
              />
            )}
          </svg>
        </div>

        <div className="coord-controls-card">
          {mode === 'linear' ? (
            <div className="control-group">
              <h4>直線方程式：$y = {linearA}x {linearB >= 0 ? `+ ${linearB}` : `- ${Math.abs(linearB)}`}$</h4>
              <p>斜率 (Slope)：{linearA} ({linearA > 0 ? '向右上傾斜' : linearA < 0 ? '向右下傾斜' : '水平線'})</p>
              <p>$y$ 截距：$(0, {linearB})$</p>

              <div className="slider-item">
                <label>斜率 $a$: {linearA}</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={linearA}
                  onChange={(e) => setLinearA(Number(e.target.value))}
                />
              </div>

              <div className="slider-item">
                <label>截距 $b$: {linearB}</label>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="1"
                  value={linearB}
                  onChange={(e) => setLinearB(Number(e.target.value))}
                />
              </div>
            </div>
          ) : (
            <div className="control-group">
              <h4>
                拋物線：$y = {quadA}(x {quadH >= 0 ? `- ${quadH}` : `+ ${Math.abs(quadH)}`})^2 {quadK >= 0 ? `+ ${quadK}` : `- ${Math.abs(quadK)}`}$
              </h4>
              <p>頂點坐標 Vertex：$({quadH}, {quadK})$</p>
              <p>對稱軸 Axis：$x = {quadH}$</p>
              <p>
                開口方向：{quadA > 0 ? '向上 (在頂點有最小值)' : '向下 (在頂點有最大值)'}
              </p>

              <div className="slider-item">
                <label>開口係數 $a$: {quadA}</label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.5"
                  value={quadA}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setQuadA(val === 0 ? 0.5 : val)
                  }}
                />
              </div>

              <div className="slider-item">
                <label>水平平移 $h$: {quadH}</label>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="1"
                  value={quadH}
                  onChange={(e) => setQuadH(Number(e.target.value))}
                />
              </div>

              <div className="slider-item">
                <label>鉛直平移 $k$: {quadK}</label>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="1"
                  value={quadK}
                  onChange={(e) => setQuadK(Number(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
