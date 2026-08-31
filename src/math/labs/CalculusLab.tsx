import React, { useState } from 'react'
import { MathFormula } from '../components/MathFormula'

/**
 * 高中「微積分切線與定積分實驗室 (CalculusLab)」
 * 函數 f(x) = x^2 - 2x + 2，可動態移動切點 x0 觀察切線斜率 f'(x0) 與極值頂點，或調整積分上下限 [a, b] 觀察定積分面積 ∫ f(x) dx。
 */
export const CalculusLab: React.FC = () => {
  const [labMode, setLabMode] = useState<'derivative' | 'integral'>('derivative')
  const [x0, setX0] = useState<number>(2) // 切點
  const [intA, setIntA] = useState<number>(0) // 積分下限
  const [intB, setIntB] = useState<number>(3) // 積分上限

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

  // 坐標系轉換 (寬 500, 高 300, 坐標範圍 x: -1~5, y: -1~12)
  const minX = -1, maxX = 5
  const minY = -1, maxY = 12
  const svgW = 500, svgH = 300

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
    <div className="math-lab-container" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      <div className="math-lab-header" style={{ marginBottom: '0.6rem' }}>
        <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem' }}>∫ 微積分切線與定積分實驗室</h3>
        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)' }}>
          觀察拋物線 <MathFormula math="f(x) = x^2 - 2x + 2" inline /> 的切線斜率（導數）與曲線下面積（定積分）。
        </p>
      </div>

      <div className="segmented math-lab-segmented" style={{ marginBottom: '0.6rem' }}>
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

      <div
        className="calc-lab-workspace"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '0.75rem',
          alignItems: 'start',
          width: '100%',
        }}
      >
        <div
          className="calc-canvas-card"
          style={{
            background: 'linear-gradient(180deg, #0b1329 0%, #0f172a 100%)',
            borderRadius: '10px',
            padding: '0.6rem',
            border: '1px solid #1e293b',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            preserveAspectRatio="xMidYMid meet"
            className="calc-svg"
            style={{ width: '100%', height: 'auto', display: 'block', overflow: 'hidden' }}
          >
            {/* 網格與軸線 */}
            <line x1={toSx(minX)} y1={toSy(0)} x2={toSx(maxX)} y2={toSy(0)} stroke="#475569" strokeWidth="1.8" />
            <line x1={toSx(0)} y1={toSy(minY)} x2={toSx(0)} y2={toSy(maxY)} stroke="#475569" strokeWidth="1.8" />
            <text x={toSx(maxX) - 20} y={toSy(0) - 8} fontSize="11" fill="#94a3b8" fontWeight="bold">x</text>
            <text x={toSx(0) + 8} y={toSy(maxY) + 16} fontSize="11" fill="#94a3b8" fontWeight="bold">y</text>

            {/* 拋物線頂點極值點 (1, 1) */}
            <circle cx={toSx(1)} cy={toSy(1)} r="3.5" fill="#f59e0b" />
            <text x={toSx(1)} y={toSy(1) + 14} fontSize="8" fill="#fbbf24" textAnchor="middle">極小值 (1,1)</text>

            {/* 定積分面積陰影 */}
            {labMode === 'integral' && (
              <path d={areaPath} fill="rgba(34, 197, 94, 0.25)" stroke="#16a34a" strokeWidth="1.5" />
            )}

            {/* f(x) 曲線 */}
            <path d={curvePath} fill="none" stroke="#38bdf8" strokeWidth="3" />

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
                <circle cx={toSx(x0)} cy={toSy(y0)} r="5.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                <text x={toSx(x0)} y={Math.max(18, toSy(y0) - 10)} fontSize="9" fill="#f87171" fontWeight="bold" textAnchor="middle">
                  ({x0.toFixed(1)}, {y0.toFixed(2)})
                </text>
              </>
            )}
          </svg>
        </div>

        <div
          className="calc-info-card"
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
          {labMode === 'derivative' ? (
            <div>
              <h4 style={{ margin: '0 0 0.3rem', fontSize: '0.92rem' }}>
                切點坐標：<MathFormula math={`(${x0.toFixed(1)}, ${y0.toFixed(2)})`} inline />
              </h4>
              <div
                style={{
                  background: 'var(--surface-soft)',
                  padding: '0.4rem 0.5rem',
                  borderRadius: '6px',
                  marginBottom: '0.4rem',
                  fontSize: '0.74rem',
                  border: '1px solid var(--line)',
                }}
              >
                切線斜率 <MathFormula math={`m = f'(${x0}) = 2(${x0}) - 2 = `} inline />{' '}
                <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{slope.toFixed(2)}</strong>
              </div>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.74rem', color: 'var(--muted)' }}>
                切線方程式：<MathFormula math={`y - ${y0.toFixed(1)} = ${slope.toFixed(1)}(x - ${x0.toFixed(1)})`} inline />
              </p>

              <div className="slider-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
                  <span>移動切點 <MathFormula math="x_0" inline />：</span>
                  <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{x0.toFixed(1)}</strong>
                </div>
                <input
                  type="range"
                  min="-1"
                  max="5"
                  step="0.1"
                  value={x0}
                  onChange={(e) => setX0(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#2563eb', margin: 0 }}
                />
              </div>
            </div>
          ) : (
            <div>
              <h4 style={{ margin: '0 0 0.3rem', fontSize: '0.92rem' }}>
                積分區間：<MathFormula math={`[${intA}, ${intB}]`} inline />
              </h4>
              <div
                style={{
                  background: 'var(--surface-soft)',
                  padding: '0.4rem 0.5rem',
                  borderRadius: '6px',
                  marginBottom: '0.4rem',
                  fontSize: '0.74rem',
                  border: '1px solid var(--line)',
                }}
              >
                定積分面積 <MathFormula math={`\\int_{${intA}}^{${intB}} f(x)\\,dx =`} inline />{' '}
                <strong style={{ color: '#10b981', fontFamily: 'monospace' }}>{integralArea.toFixed(3)}</strong>
              </div>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.74rem', color: 'var(--muted)' }}>
                微積分基本定理 (FTC)：<MathFormula math={`F(${intB}) - F(${intA})`} inline />
              </p>

              <div className="slider-item" style={{ marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
                  <span>積分下限 <MathFormula math="a" inline />：</span>
                  <strong style={{ color: '#10b981', fontFamily: 'monospace' }}>{intA.toFixed(1)}</strong>
                </div>
                <input
                  type="range"
                  min="-1"
                  max={intB - 0.5}
                  step="0.5"
                  value={intA}
                  onChange={(e) => setIntA(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#10b981', margin: 0 }}
                />
              </div>

              <div className="slider-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: 600, marginBottom: '0.15rem' }}>
                  <span>積分上限 <MathFormula math="b" inline />：</span>
                  <strong style={{ color: '#10b981', fontFamily: 'monospace' }}>{intB.toFixed(1)}</strong>
                </div>
                <input
                  type="range"
                  min={intA + 0.5}
                  max="5"
                  step="0.5"
                  value={intB}
                  onChange={(e) => setIntB(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#10b981', margin: 0 }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CalculusLab
