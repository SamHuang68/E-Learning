import React, { useState } from 'react'
import { MathFormula } from '../components/MathFormula'

/**
 * 國中八年級「畢氏定理幾何證明實驗室 (PythagorasLab)」
 * 透過可調節的直角三角形兩股 $a, b$，動態展示 $a^2$ 面積、$b^2$ 面積與斜邊 $c^2$ 面積之和諧相等關係。
 */
export const PythagorasLab: React.FC = () => {
  const [legA, setLegA] = useState(3)
  const [legB, setLegB] = useState(4)

  const hypC = Math.sqrt(legA * legA + legB * legB)
  const areaA = legA * legA
  const areaB = legB * legB
  const areaC = Math.round(hypC * hypC * 10) / 10

  const handleReset = () => {
    setLegA(3)
    setLegB(4)
  }

  const applyTriple = (a: number, b: number) => {
    setLegA(a)
    setLegB(b)
  }

  return (
    <div className="math-lab pythagoras-lab">
      <div className="lab-header">
        <div>
          <h3>畢氏定理幾何證明實驗室 (Pythagorean Theorem)</h3>
          <p className="lab-desc">
            直角三角形中：兩股平方和等於斜邊平方（<MathFormula math="$a^2 + b^2 = c^2$" />）。
          </p>
        </div>
        <div className="lab-header-actions">
          <button type="button" className="btn-lab-reset" onClick={handleReset}>
            🔄 重設預設 (3-4-5)
          </button>
        </div>
      </div>

      <div className="pythagoras-layout">
        <div className="pythagoras-visual-box">
          <svg width="340" height="340" viewBox="0 0 340 340" className="pyth-svg">
            {/* 繪製直角三角形與三邊正方形，原點平移至 (145, 155) 防裁切 */}
            <g transform="translate(145, 155)">
              {/* 三角形 */}
              <polygon
                points={`0,0 ${legA * 20},0 0,${-legB * 20}`}
                fill="#cbd5e1"
                stroke="#334155"
                strokeWidth="2"
              />
              {/* 直角標記 */}
              <rect x="0" y="-12" width="12" height="12" fill="none" stroke="#64748b" strokeWidth="1.5" />

              {/* a^2 正方形 */}
              <rect
                x="0"
                y="0"
                width={legA * 20}
                height={legA * 20}
                fill="rgba(59, 130, 246, 0.4)"
                stroke="#2563eb"
                strokeWidth="2"
              />
              <text x={legA * 10} y={legA * 10 + 5} textAnchor="middle" fill="#1e3a8a" fontWeight="bold" fontSize="13">
                a² = {areaA}
              </text>

              {/* b^2 正方形 */}
              <rect
                x={-legB * 20}
                y={-legB * 20}
                width={legB * 20}
                height={legB * 20}
                fill="rgba(16, 185, 129, 0.4)"
                stroke="#059669"
                strokeWidth="2"
              />
              <text x={-legB * 10} y={-legB * 10 + 5} textAnchor="middle" fill="#064e3b" fontWeight="bold" fontSize="13">
                b² = {areaB}
              </text>
            </g>
          </svg>
        </div>

        <div className="pythagoras-calc-card">
          <div className="calc-row">
            <span>股 <MathFormula math="$a$" /> 長度：</span>
            <strong>{legA}</strong> ➜ 面積 <MathFormula math={`$a^2 = ${areaA}$`} />
          </div>
          <div className="calc-row">
            <span>股 <MathFormula math="$b$" /> 長度：</span>
            <strong>{legB}</strong> ➜ 面積 <MathFormula math={`$b^2 = ${areaB}$`} />
          </div>
          <div className="calc-divider" />
          <div className="calc-sum-row">
            <span>兩股平方和 (<MathFormula math="$a^2 + b^2$" />)：</span>
            <strong>{areaA + areaB}</strong>
          </div>
          <div className="calc-sum-row">
            <span>斜邊 <MathFormula math="$c$" /> 長度：</span>
            <strong>{hypC.toFixed(2)}</strong> ➜ 面積 <MathFormula math={`$c^2 = ${areaC}$`} />
          </div>

          <div className="quick-triples-row" style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted)', alignSelf: 'center' }}>常用勾股數：</span>
            <button type="button" className="btn-preset-pill" onClick={() => applyTriple(3, 4)}>3-4-5</button>
            <button type="button" className="btn-preset-pill" onClick={() => applyTriple(6, 8)}>6-8-10</button>
            <button type="button" className="btn-preset-pill" onClick={() => applyTriple(5, 12)}>5-12-13</button>
          </div>

          <div className="slider-item">
            <label>
              <span>調整股 <MathFormula math={`$a$: ${legA}`} /></span>
            </label>
            <input
              type="range"
              aria-label="畢氏定理股長 a"
              aria-valuetext={`${legA} 長度單位`}
              min="2"
              max="6"
              step="1"
              value={legA}
              onChange={(e) => setLegA(Number(e.target.value))}
            />
          </div>

          <div className="slider-item">
            <label>
              <span>調整股 <MathFormula math={`$b$: ${legB}`} /></span>
            </label>
            <input
              type="range"
              aria-label="畢氏定理股長 b"
              aria-valuetext={`${legB} 長度單位`}
              min="2"
              max="6"
              step="1"
              value={legB}
              onChange={(e) => setLegB(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
