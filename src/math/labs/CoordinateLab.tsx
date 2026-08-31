import React, { useState, useMemo } from 'react'
import { MathFormula } from '../components/MathFormula'

type FunctionType = 'linear' | 'quadratic'

/**
 * 國中／高中「2D 坐標幾何與函數實驗室 (CoordinateLab)」
 * 支援一次直線與二次拋物線，可即時調整斜率、截距、頂點平移並觀察圖像變化。
 */
export const CoordinateLab: React.FC = () => {
  const [mode, setMode] = useState<FunctionType>('linear')

  // 一次函數 y = ax + b
  const [linearA, setLinearA] = useState(1)
  const [linearB, setLinearB] = useState(0)

  // 二次函數 y = a(x - h)^2 + k
  const [quadA, setQuadA] = useState(1)
  const [quadH, setQuadH] = useState(0)
  const [quadK, setQuadK] = useState(0)

  const width = 360
  const height = 360
  const range = 10 // 坐標軸範圍 [-10, 10]
  const scale = width / (range * 2) // 像素 / 單位

  const toScreenX = (mathX: number) => width / 2 + mathX * scale
  const toScreenY = (mathY: number) => height / 2 - mathY * scale

  // 生成曲線取樣路徑
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
      const sx = width / 2 + x * scale
      const sy = height / 2 - y * scale
      if (points.length === 0) {
        points.push(`M ${sx} ${sy}`)
      } else {
        points.push(`L ${sx} ${sy}`)
      }
    }
    return points.join(' ')
  }, [mode, linearA, linearB, quadA, quadH, quadK, scale, width, height])

  const handleReset = () => {
    if (mode === 'linear') {
      setLinearA(1)
      setLinearB(0)
    } else {
      setQuadA(1)
      setQuadH(0)
      setQuadK(0)
    }
  }

  return (
    <div className="math-lab coord-lab">
      <div className="lab-header">
        <div>
          <h3>2D 坐標幾何與函數實驗室 (Coordinate Geometry)</h3>
          <p className="lab-desc">
            探索直線的斜率與截距，以及拋物線的開口、對稱軸與頂點坐標平移。
          </p>
        </div>
        <div className="lab-header-actions" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button type="button" className="btn-lab-reset" onClick={handleReset}>
            🔄 重設函數
          </button>
        </div>
      </div>

      <div className="lab-mode-switch" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button
          type="button"
          className={`tab-pill ${mode === 'linear' ? 'active' : ''}`}
          onClick={() => setMode('linear')}
        >
          一次直線 (<MathFormula math="$y = ax + b$" />)
        </button>
        <button
          type="button"
          className={`tab-pill ${mode === 'quadratic' ? 'active' : ''}`}
          onClick={() => setMode('quadratic')}
        >
          二次拋物線 (<MathFormula math="$y = a(x-h)^2 + k$" />)
        </button>
      </div>

      <div className="coord-layout">
        <div className="coord-canvas-box" style={{ display: 'flex', justifyContent: 'center' }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="coord-svg"
            style={{ width: '100%', maxWidth: '360px', height: 'auto' }}
          >
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
              <h4>
                <MathFormula
                  math={`直線方程式：$y = ${linearA}x ${linearB >= 0 ? `+ ${linearB}` : `- ${Math.abs(linearB)}`}$`}
                />
              </h4>
              <p>斜率 (Slope)：{linearA} ({linearA > 0 ? '向右上傾斜' : linearA < 0 ? '向右下傾斜' : '水平線'})</p>
              <p><MathFormula math={`$y$ 截距：$(0, ${linearB})$`} /></p>

              <div className="slider-item">
                <label>
                  <span><MathFormula math={`斜率 $a$: ${linearA}`} /></span>
                </label>
                <input
                  type="range"
                  aria-label="一次函數斜率 a"
                  aria-valuetext={`${linearA}`}
                  min="-5"
                  max="5"
                  step="0.5"
                  value={linearA}
                  onChange={(e) => setLinearA(Number(e.target.value))}
                />
              </div>

              <div className="slider-item">
                <label>
                  <span><MathFormula math={`截距 $b$: ${linearB}`} /></span>
                </label>
                <input
                  type="range"
                  aria-label="一次函數截距 b"
                  aria-valuetext={`${linearB}`}
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
                <MathFormula
                  math={`拋物線：$y = ${quadA}(x ${quadH >= 0 ? `- ${quadH}` : `+ ${Math.abs(quadH)}`})^2 ${quadK >= 0 ? `+ ${quadK}` : `- ${Math.abs(quadK)}`}$`}
                />
              </h4>
              <p><MathFormula math={`頂點坐標 Vertex：$(${quadH}, ${quadK})$`} /></p>
              <p><MathFormula math={`對稱軸 Axis：$x = ${quadH}$`} /></p>
              <p>
                開口方向：{quadA > 0 ? '向上 (在頂點有最小值)' : '向下 (在頂點有最大值)'}
              </p>

              <div className="slider-item">
                <label>
                  <span><MathFormula math={`開口係數 $a$: ${quadA}`} /></span>
                </label>
                <input
                  type="range"
                  aria-label="二次函數開口係數 a"
                  aria-valuetext={`${quadA}`}
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
                <label>
                  <span><MathFormula math={`水平平移 $h$: ${quadH}`} /></span>
                </label>
                <input
                  type="range"
                  aria-label="二次函數水平平移 h"
                  aria-valuetext={`${quadH}`}
                  min="-6"
                  max="6"
                  step="1"
                  value={quadH}
                  onChange={(e) => setQuadH(Number(e.target.value))}
                />
              </div>

              <div className="slider-item">
                <label>
                  <span><MathFormula math={`鉛直平移 $k$: ${quadK}`} /></span>
                </label>
                <input
                  type="range"
                  aria-label="二次函數鉛直平移 k"
                  aria-valuetext={`${quadK}`}
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
