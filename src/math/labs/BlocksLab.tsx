import { useMathLabCopy } from '../../i18n/mathLabCopy'
import React, { useState } from 'react'

type Props = {
  onXp?: (amount: number) => void
}

/**
 * 國小低年級「十進位積木計數器 (BlocksLab)」
 * 透過動態添加「十條積木 (Tens)」與「單個積木 (Ones)」，直觀理解兩位數位值與進退位概念。
 */
export const BlocksLab: React.FC<Props> = ({ onXp }) => {
  const ml = useMathLabCopy()
  const [tens, setTens] = useState(3)
  const [ones, setOnes] = useState(5)
  const [targetNumber, setTargetNumber] = useState(42)
  const [streak, setStreak] = useState(0)

  const currentTotal = tens * 10 + ones
  const isMatch = currentTotal === targetNumber

  function handleCheck() {
    if (isMatch) {
      onXp?.(5)
      setStreak((s) => s + 1)
      setTargetNumber(Math.floor(Math.random() * 80) + 11)
      setTens(1)
      setOnes(0)
    }
  }

  function handleComposeTen() {
    if (ones >= 10) {
      setOnes((o) => o - 10)
      setTens((t) => t + 1)
    }
  }

  function handleDecomposeTen() {
    if (tens >= 1) {
      setTens((t) => t - 1)
      setOnes((o) => o + 10)
    }
  }

  return (
    <div className="math-lab blocks-lab">
      <div className="lab-header">
        <div>
          <h3>{ml("十進位積木計數器 (Base-10 Blocks)")}</h3>
          <p className="lab-desc">{ml("十個 1 可以換成一條 10！目標湊出指定數字，掌握十位與個位的進退位原理。")}</p>
        </div>
        <div className="target-badge">{ml("目標數字：")}<strong>{targetNumber}</strong>
        </div>
      </div>

      <div className="blocks-canvas">
        <div className="place-column tens-column">
          <div className="column-header">
            <h4>{ml("十位 (Tens · 10)")}</h4>
            <span className="count-pill">{tens}{ml(" 條 (")}{tens * 10})</span>
          </div>
          <div className="blocks-grid tens-grid">
            {Array.from({ length: tens }).map((_, i) => (
              <div key={i} className="block-ten" title={ml("10 積木")}>
                {Array.from({ length: 10 }).map((_, j) => (
                  <span key={j} className="segment" />
                ))}
              </div>
            ))}
            {tens === 0 && <p className="empty-hint">{ml("目前無十位積木")}</p>}
          </div>
          <div className="col-buttons">
            <button
              type="button"
              className="btn-lab"
              onClick={() => setTens((t) => Math.min(9, t + 1))}
            >{ml("+ 1條 (10)")}</button>
            <button
              type="button"
              className="btn-lab btn-sub"
              onClick={() => setTens((t) => Math.max(0, t - 1))}
              disabled={tens === 0}
            >{ml("- 1條")}</button>
          </div>
        </div>

        <div className="place-column ones-column">
          <div className="column-header">
            <h4>{ml("個位 (Ones · 1)")}</h4>
            <span className="count-pill">{ones}{ml(" 個 (")}{ones})</span>
          </div>
          <div className="blocks-grid ones-grid">
            {Array.from({ length: ones }).map((_, i) => (
              <span key={i} className="block-one" title={ml("1 積木")} />
            ))}
            {ones === 0 && <p className="empty-hint">{ml("目前無個位積木")}</p>}
          </div>
          <div className="col-buttons">
            <button
              type="button"
              className="btn-lab"
              onClick={() => setOnes((o) => Math.min(19, o + 1))}
            >{ml("+ 1個 (1)")}</button>
            <button
              type="button"
              className="btn-lab btn-sub"
              onClick={() => setOnes((o) => Math.max(0, o - 1))}
              disabled={ones === 0}
            >{ml("- 1個")}</button>
          </div>
        </div>
      </div>

      <div className="lab-controls">
        <div className="exchange-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleComposeTen}
            disabled={ones < 10}
          >{ml("滿 10 個一 ➜ 換 1 條十（進位）")}</button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleDecomposeTen}
            disabled={tens < 1}
          >{ml("借 1 條十 ➜ 換 10 個一（退位）")}</button>
        </div>

        <div className="status-box">
          <span className="current-sum">{ml("目前數值：")}<strong>{currentTotal}</strong>
          </span>
          {isMatch ? (
            <button type="button" className="btn-primary" onClick={handleCheck}>{ml("🎉 答對了！點擊領取 +5 XP")}</button>
          ) : (
            <span className="diff-hint">
              {currentTotal < targetNumber
                ? ml("還差 {v0}", [targetNumber - currentTotal])
                : ml("超過了 {v0}", [currentTotal - targetNumber])}
            </span>
          )}
        </div>
      </div>
      {streak > 0 && <p className="streak-tag">{ml("連續挑戰成功：")}{streak}{ml(" 次")}</p>}
    </div>
  )
}
