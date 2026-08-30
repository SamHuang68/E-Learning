import React, { useState } from 'react'
import { MathFormula } from '../components/MathFormula'

/**
 * 高中「微積分切線與定積分實驗室 (CalculusLab)」
 * 函數 <MathFormula math="f(x) = x^2 - 2x + 2" inline />，可動態移動切點 <MathFormula math="x_0" inline /> 觀察切線斜率 <MathFormula math="f'(x_0)" inline />，或調整積分上下限 <MathFormula math="[a, b]" inline /> 觀察定積分面積 <MathFormula math="\int_a^b f(x) dx" inline />。
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

  const y0 = f(x0)
  const slope = fPrime(x0)
  const integralArea = F(intB) - F(intA)

  // 坐標系轉換 (寬 500, 高 320, 坐標範圍 x: -1~5, y: -1~12)
  const minX = -1, maxX = 5
  const minY = -1, maxY = 12
  const svgW = 500, svgH = 320

  function toSx(x: number) {
    return ((x - minX) / (maxX - minX)) * svgW
  }
  function toSy(y: number) {
    return svgH - ((y - minY) / (maxY - minY)) * svgH
  }

  // 繪製函數曲線路徑
  const curvePoints: string[] = []
  for (let x = minX; x <= maxX; x += 0.1) {
    const y = f(x)
    curvePoints.push(`${toSx(x).toFixed(1)},${toSy(y).toFixed(1)}`)
  }
  const curvePath = `M ${curvePoints.join(' L ')}`

  // 繪製切線 (在 x0 附近)
  const tanX1 = x0 - 1.5
  const tanY1 = y0 - 1.5 * slope
  const tanX2 = x0 + 1.5
  const tanY2 = y0 + 1.5 * slope

  // 繪製定積分陰影梯形路徑
  const areaPoints: string[] = []
  areaPoints.push(`${toSx(intA).toFixed(1)},${toSy(0).toFixed(1)}`)
  for (let x = intA; x <= intB; x += 0.05) {
    areaPoints.push(`${toSx(x).toFixed(1)},${toSy(f(x)).toFixed(1)}`)
  }
  areaPoints.push(`${toSx(intB).toFixed(1)},${toSy(0).toFixed(1)}`)
  const areaPath = `M ${areaPoints.join(' L ')} Z`

  return (
    <div className="math-lab-container">
      <div className="math-lab-header">
        <h3>∫ 微積分切線與定積分實驗室</h3>
        <p>觀察拋物線 <MathFormula math="f(x) = x^2 - 2x + 2" /> 的切線斜率（導數）與曲線下面積（定積分）。</p>
      </div>

      <div className="segmented math-lab-segmented">
        <button
          type="button"
          className={labMode === 'derivative' ? 'active' : ''}
          onClick={() => setLabMode('derivative')}
        >
          📈 切線斜率 (導數)
        </button>
        <button
          type="button"
          className={labMode === 'integral' ? 'active' : ''}
          onClick={() => setLabMode('integral')}
        >
          📊 定積分面積
        </button>
      </div>

      <div className="calc-lab-workspace">
        <div className="calc-canvas-card">
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="calc-svg">
            {/* 網格與軸線 */}
            <line x1={toSx(minX)} y1={toSy(0)} x2={toSx(maxX)} y2={toSy(0)} stroke="#94a3b8" strokeWidth="2" />
            <line x1={toSx(0)} y1={toSy(minY)} x2={toSx(0)} y2={toSy(maxY)} stroke="#94a3b8" strokeWidth="2" />
            <text x={toSx(maxX) - 20} y={toSy(0) - 8} fontSize="12" fill="#64748b">x</text>
            <text x={toSx(0) + 8} y={toSy(maxY) + 20} fontSize="12" fill="#64748b">y</text>

            {/* 定積分面積陰影 */}
            {labMode === 'integral' && (
              <path d={areaPath} fill="rgba(34, 197, 94, 0.3)" stroke="#16a34a" strokeWidth="1.5" />
            )}

            {/* f(x) 曲線 */}
            <path d={curvePath} fill="none" stroke="#2563eb" strokeWidth="3" />

            {/* 切線與切點 */}
            {labMode === 'derivative' && (
              <>
                <line
                  x1={toSx(tanX1)}
                  y1={toSy(tanY1)}
                  x2={toSx(tanX2)}
                  y2={toSy(tanY2)}
                  stroke="#ef4444"
                  strokeWidth="2.5"
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
              <h4>切點坐標：<MathFormula math={`(${x0.toFixed(1)}, ${y0.toFixed(2)})`} /></h4>
              <div className="calc-result-badge">
                切線斜率 <MathFormula math={`m = f'(${x0}) = 2(${x0}) - 2 = `} /> <strong>{slope.toFixed(2)}</strong>
              </div>
              <p>切線方程式：<MathFormula math={`y - ${y0.toFixed(1)} = ${slope.toFixed(1)}(x - ${x0.toFixed(1)})`} /></p>

              <div className="slider-item">
                <label>移動切點 <MathFormula math="x_0" />: {x0}</label>
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
              <h4>積分區間：<MathFormula math={`[${intA}, ${intB}]`} /></h4>
              <div className="calc-result-badge green">
                定積分面積 <MathFormula math={`\\int_{${intA}}^{${intB}} f(x)\\,dx =`} /> <strong>{integralArea.toFixed(3)}</strong>
              </div>
              <p>微積分基本定理：<MathFormula math={`F(${intB}) - F(${intA})`} /></p>

              <div className="slider-item">
                <label>積分下限 <MathFormula math="a" />: {intA}</label>
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
                <label>積分上限 <MathFormula math="b" />: {intB}</label>
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
