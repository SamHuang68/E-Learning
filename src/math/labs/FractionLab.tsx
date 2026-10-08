import React, { useState } from 'react'
import { useI18n } from '../../i18n/i18n'

type Props = {
  onXp?: (amount: number) => void
}

/**
 * 國小中高年級「分數切餅與數線實驗室 (FractionLab)」
 * 提供動態圓形切片 (Pie Chart) 與數線 (Number Line) 視覺化，探索真假分數、等值擴分與加法。
 */
export const FractionLab: React.FC<Props> = () => {
  const { locale } = useI18n()
  const copy = (zhHant: string, en: string) => locale === 'en' ? en : zhHant
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
          <h3>{copy('分數切餅與數線實驗室', 'Fraction Circles and Number-Line Lab')}</h3>
          <p className="lab-desc">
            {copy('調節分子與分母，觀察圓形切片與數線位置，理解真分數、假分數與帶分數。', 'Adjust the numerator and denominator to compare a fraction circle with its number-line position and distinguish proper, improper, and mixed fractions.')}
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
              {copy('數值：', 'Value:')}<strong>{value.toFixed(3)}</strong>
            </p>
            <p>
              {copy('類型：', 'Type:')}
              {isImproper ? (
                <span className="badge-improper">
                  {copy(
                    `假分數（可化為帶分數：${mixedWhole} 又 ${mixedRemainder}/${denominator}）`,
                    `Improper fraction; mixed form: ${mixedWhole} ${mixedRemainder}/${denominator}`,
                  )}
                </span>
              ) : (
                <span className="badge-proper">{copy('真分數（小於 1）', 'Proper fraction (less than 1)')}</span>
              )}
            </p>
          </div>
        </div>

        <div className="fraction-visuals">
          <div className="pie-visual-box">
            <svg viewBox="0 0 220 220" className="pie-svg" style={{ width: '100%', maxWidth: '220px', height: 'auto' }}>
              {renderPieSlices()}
            </svg>
            <span className="visual-caption">{copy(`圓盤切分成 ${denominator} 等份，選取 ${numerator} 份`, `Circle divided into ${denominator} equal parts; ${numerator} selected`)}</span>
          </div>

          <div className="number-line-box">
            <h4>{copy('數線位置', 'Number-line position')} (0–2)</h4>
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
            {copy('分子', 'Numerator')}: <strong>{numerator}</strong>
          </label>
          <input
            id="fraction-numerator"
            type="range"
            aria-valuetext={copy(`${numerator}，分數 ${denominator} 分之 ${numerator}`, `${numerator}; fraction ${numerator} over ${denominator}`)}
            min="0"
            max="12"
            value={numerator}
            onChange={(e) => setNumerator(Number(e.target.value))}
          />
        </div>

        <div className="slider-control">
          <label htmlFor="fraction-denominator">
            {copy('分母', 'Denominator')}: <strong>{denominator}</strong>
          </label>
          <input
            id="fraction-denominator"
            type="range"
            aria-valuetext={copy(`${denominator}，分數 ${denominator} 分之 ${numerator}`, `${denominator}; fraction ${numerator} over ${denominator}`)}
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
