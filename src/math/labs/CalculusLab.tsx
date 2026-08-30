import React, { useState } from 'react'

/**
 * 高中「微積分切線與定積分實驗室 (CalculusLab)」
 * 函數 $f(x) = x^2 - 2x + 2$，可動態移動切點 $x_0$ 觀察切線斜率 $f'(x_0)$，或調整積分上下限 $[a, b]$ 觀察定積分面積 $\int_a^b f(x) dx$。
 */
export const CalculusLab: React.FC = () => {
  const [labMode, setLabMode] = useState<'derivative' | 'integral'>('derivative')
  const [x0, setX0] = useState(2) // 切點
  const [intA, setIntA] = useState(0) // 積分下限
  const [intB, setIntB] = useState(3) // 積分上限

  // f(x) = x^2 - 2x + 2
  function f(x: number) {
    return x * x - 2 * x + 2
  }
  // f'(x) = 2x - 2
  function fPrime(x: number) {
    return 2 * x - 2
  }
  // F(x) = (1/3)x^3 - x^2 + 2x
  function F(x: number) {
    return (1 / 3) * Math.pow(x, 3) - Math.pow(x, 2) + 2 * x
  }

  const slope = fPrime(x0)
  const y0 = f(x0)
  const integralArea = Math.max(0, F(intB) - F(intA))

  const width = 340
  const height = 260
  function toSx(x: number) {
    return ((x + 2) / 8) * width
  }
  function toSy(y: number) {
    return height - ((y + 2) / 12) * height
  }

  // 產生多項式曲線
  const curvePoints: string[] = []
  for (let x = -2; x <= 6; x += 0.2) {
    const sx = toSx(x)
    const sy = toSy(f(x))
    curvePoints.push(x === -2 ? `M ${sx} ${sy}` : `L ${sx} ${sy}`)
  }
  const curvePath = curvePoints.join(' ')

  // 產生積分著色多邊形
  const fillPoints: string[] = []
  fillPoints.push(`M ${toSx(intA)} ${toSy(0)}`)
  for (let x = intA; x <= intB; x += 0.1) {
    fillPoints.push(`L ${toSx(x)} ${toSy(f(x))}`)
  }
  fillPoints.push(`L ${toSx(intB)} ${toSy(0)} Z`)
  const fillPath = fillPoints.join(' ')

  return (
    <div className="math-lab calculus-lab">
      <div className="lab-header">
        <div>
          <h3>微積分切線與定積分實驗室 (Calculus Dynamics)</h3>
          <p className="lab-desc">
            目標函數 $f(x) = x^2 - 2x + 2$。體驗導數作為切線斜率的幾何意義，以及定積分作為曲線下面積。
          </p>
        </div>
        <div className="tab-pills">
          <button
            type="button"
            className={`tab-pill ${labMode === 'derivative' ? 'active' : ''}`}
            onClick={() => setLabMode('derivative')}
          >
            導數與切線 (Derivative)
          </button>
          <button
            type="button"
            className={`tab-pill ${labMode === 'integral' ? 'active' : ''}`}
            onClick={() => setLabMode('integral')}
          >
            定積分與面積 (Integral)
          </button>
        </div>
      </div>

      <div className="calculus-layout">
        <div className="calc-canvas-box">
          <svg width={width} height={height} className="calculus-svg">
            {/* 坐標軸 */}
            <line x1="0" y1={toSy(0)} x2={width} y2={toSy(0)} stroke="#94a3b8" strokeWidth="1.5" />
            <line x1={toSx(0)} y1="0" x2={toSx(0)} y2={height} stroke="#94a3b8" strokeWidth="1.5" />

            {/* 定積分著色面積 */}
            {labMode === 'integral' && (
              <path d={fillPath} fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="1" />
            )}

            {/* 函數曲線 */}
            <path d={curvePath} fill="none" stroke="#2563eb" strokeWidth="2.5" />

            {/* 導數切線 */}
            {labMode === 'derivative' && (
              <>
                <line
                  x1={toSx(x0 - 2)}
                  y1={toSy(y0 - 2 * slope)}
                  x2={toSx(x0 + 2)}
                  y2={toSy(y0 + 2 * slope)}
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                <circle cx={toSx(x0)} cy={toSy(y0)} r="5" fill="#ef4444" />
              </>
            )}
          </svg>
        </div>

        <div className="calc-info-card">
          {labMode === 'derivative' ? (
            <div>
              <h4>切點坐標：$({x0.toFixed(1)}, {y0.toFixed(2)})$</h4>
              <div className="calc-result-badge">
                切線斜率 $m = f'({x0}) = 2({x0}) - 2 =$ <strong>{slope.toFixed(2)}</strong>
              </div>
              <p>切線方程式：$y - {y0.toFixed(1)} = {slope.toFixed(1)}(x - {x0.toFixed(1)})$</p>

              <div className="slider-item">
                <label>移動切點 $x_0$: {x0}</label>
                <input
                  type="range"
                  min="-1"
                  max="5"
                  step="0.2"
                  value={x0}
                  onChange={(e) => setX0(Number(e.target.value))}
                />
              </div>
            </div>
          ) : (
            <div>
              <h4>積分區間：$[{intA}, {intB}]$</h4>
              <div className="calc-result-badge green">
                定積分面積 $\int_{'{' + intA + '}'}^{'{' + intB + '}'} f(x) dx =$ <strong>{integralArea.toFixed(3)}</strong>
              </div>
              <p>微積分基本定理：$F({intB}) - F({intA})$</p>

              <div className="slider-item">
                <label>積分下限 $a$: {intA}</label>
                <input
                  type="range"
                  min="-1"
                  max={intB - 0.5}
                  step="0.5"
                  value={intA}
                  onChange={(e) => setIntA(Number(e.target.value))}
                />
              </div>

              <div className="slider-item">
                <label>積分上限 $b$: {intB}</label>
                <input
                  type="range"
                  min={intA + 0.5}
                  max="5"
                  step="0.5"
                  value={intB}
                  onChange={(e) => setIntB(Number(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
