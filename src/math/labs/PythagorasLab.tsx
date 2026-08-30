import React, { useState } from 'react'

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

  return (
    <div className="math-lab pythagoras-lab">
      <div className="lab-header">
        <div>
          <h3>畢氏定理幾何證明實驗室 (Pythagorean Theorem)</h3>
          <p className="lab-desc">
            直角三角形中：兩股的平方和等於斜邊的平方（$a^2 + b^2 = c^2$）。
          </p>
        </div>
      </div>

      <div className="pythagoras-layout">
        <div className="pythagoras-visual-box">
          <svg width="320" height="320" viewBox="0 0 320 320" className="pyth-svg">
            {/* 繪製直角三角形與三邊正方形 */}
            <g transform="translate(100, 160)">
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
              <text x={legA * 10} y={legA * 10 + 5} textAnchor="middle" fill="#1e3a8a" fontWeight="bold">
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
              <text x={-legB * 10} y={-legB * 10 + 5} textAnchor="middle" fill="#064e3b" fontWeight="bold">
                b² = {areaB}
              </text>
            </g>
          </svg>
        </div>

        <div className="pythagoras-calc-card">
          <div className="calc-row">
            <span>股 $a$ 長度：</span>
            <strong>{legA}</strong> ➜ 面積 $a^2 = {areaA}$
          </div>
          <div className="calc-row">
            <span>股 $b$ 長度：</span>
            <strong>{legB}</strong> ➜ 面積 $b^2 = {areaB}$
          </div>
          <div className="calc-divider" />
          <div className="calc-sum-row">
            <span>兩股平方和 ($a^2 + b^2$)：</span>
            <strong>{areaA + areaB}</strong>
          </div>
          <div className="calc-sum-row">
            <span>斜邊 $c$ 長度：</span>
            <strong>{hypC.toFixed(2)}</strong> ➜ 面積 $c^2 = {areaC}$
          </div>

          <div className="slider-item">
            <label>調整股 $a$: {legA}</label>
            <input
              type="range"
              min="2"
              max="6"
              step="1"
              value={legA}
              onChange={(e) => setLegA(Number(e.target.value))}
            />
          </div>

          <div className="slider-item">
            <label>調整股 $b$: {legB}</label>
            <input
              type="range"
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
