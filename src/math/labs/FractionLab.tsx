import React, { useState } from 'react'

type Props = {
  onXp?: (amount: number) => void
}

/**
 * 國小中高年級「分數切餅與數線實驗室 (FractionLab)」
 * 提供動態圓形切片 (Pie Chart) 與數線 (Number Line) 視覺化，探索真假分數、等值擴分與加法。
 */
export const FractionLab: React.FC<Props> = () => {
  const [numerator, setNumerator] = useState(3)
  const [denominator, setDenominator] = useState(4)

  const value = numerator / Math.max(1, denominator)
  const isImproper = numerator >= denominator
  const mixedWhole = Math.floor(numerator / Math.max(1, denominator))
  const mixedRemainder = numerator % Math.max(1, denominator)

  // 繪製圓形扇形切片 SVG paths
  function renderPieSlices() {
    const d = Math.max(1, denominator)
    const radius = 90
    const cx = 110
    const cy = 110

    const slices = []
    for (let i = 0; i < d; i++) {
      const startAngle = (i * 360) / d - 90
      const endAngle = ((i + 1) * 360) / d - 90
      const startRad = (startAngle * Math.PI) / 180
      const endRad = (endAngle * Math.PI) / 180

      const x1 = cx + radius * Math.cos(startRad)
      const y1 = cy + radius * Math.sin(startRad)
      const x2 = cx + radius * Math.cos(endRad)
      const y2 = cy + radius * Math.sin(endRad)

      const largeArc = 360 / d > 180 ? 1 : 0
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
      const isFilled = i < numerator

      slices.push(
        <path
          key={i}
          d={pathData}
          fill={isFilled ? 'var(--color-primary, #10b981)' : '#e2e8f0'}
          stroke="#334155"
          strokeWidth="1.5"
          className="fraction-slice"
        />
      )
    }
    return slices
  }

  return (
    <div className="math-lab fraction-lab">
      <div className="lab-header">
        <div>
          <h3>分數切餅與數線實驗室 (Fractions Lab)</h3>
          <p className="lab-desc">
            調節分子與分母，直觀觀察圓形披薩切片與數線位置，理解真分數、假分數與帶分數。
          </p>
        </div>
      </div>

      <div className="fraction-layout">
        <div className="fraction-display-card">
          <div className="fraction-math-box">
            <span className="num-val">{numerator}</span>
            <span className="fraction-bar" />
            <span className="den-val">{denominator}</span>
          </div>

          <div className="fraction-info-text">
            <p>
              數值：<strong>{value.toFixed(3)}</strong>
            </p>
            <p>
              類型：
              {isImproper ? (
                <span className="badge-improper">
                  假分數（可化為帶分數：{mixedWhole} 又 {mixedRemainder}/{denominator}）
                </span>
              ) : (
                <span className="badge-proper">真分數（小於 1）</span>
              )}
            </p>
          </div>
        </div>

        <div className="fraction-visuals">
          <div className="pie-visual-box">
            <svg viewBox="0 0 220 220" className="pie-svg" style={{ width: '100%', maxWidth: '220px', height: 'auto' }}>
              {renderPieSlices()}
            </svg>
            <span className="visual-caption">圓盤切分成 {denominator} 等份，選取 {numerator} 份</span>
          </div>

          <div className="number-line-box">
            <h4>數線位置 (0 ~ 2)</h4>
            <div className="num-line-track">
              <div
                className="num-line-marker"
                style={{ left: `${Math.min(100, (value / 2) * 100)}%` }}
              >
                <span className="marker-pin" />
                <span className="marker-label">
                  {numerator}/{denominator}
                </span>
              </div>
              <div className="num-line-ticks">
                <span>0</span>
                <span>1/2</span>
                <span>1</span>
                <span>3/2</span>
                <span>2</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lab-sliders-row">
        <div className="slider-control">
          <label htmlFor="fraction-numerator">
            分子 (Numerator): <strong>{numerator}</strong>
          </label>
          <input
            id="fraction-numerator"
            type="range"
            aria-valuetext={`${numerator}，分數 ${denominator} 分之 ${numerator}`}
            min="0"
            max="12"
            value={numerator}
            onChange={(e) => setNumerator(Number(e.target.value))}
          />
        </div>

        <div className="slider-control">
          <label htmlFor="fraction-denominator">
            分母 (Denominator): <strong>{denominator}</strong>
          </label>
          <input
            id="fraction-denominator"
            type="range"
            aria-valuetext={`${denominator}，分數 ${denominator} 分之 ${numerator}`}
            min="1"
            max="12"
            value={denominator}
            onChange={(e) => setDenominator(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  )
}
