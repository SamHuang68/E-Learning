import React, { useState } from 'react'
import { useI18n } from '../../i18n/i18n'

type Props = {
  onXp?: (amount: number) => void
}

/**
 * 國小低年級「十進位積木計數器 (BlocksLab)」
 * 透過動態添加「十條積木 (Tens)」與「單個積木 (Ones)」，直觀理解兩位數位值與進退位概念。
 */
export const BlocksLab: React.FC<Props> = ({ onXp }) => {
  const { locale } = useI18n()
  const copy = (zhHant: string, en: string) => locale === 'en' ? en : zhHant
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
          <h3>{copy('十進位積木計數器', 'Base-Ten Blocks')}</h3>
          <p className="lab-desc">
            {copy('十個 1 可以換成一條 10。湊出目標數字並練習十位與個位的進退位。', 'Exchange ten ones for one ten. Build the target number and practice regrouping between ones and tens.')}
          </p>
        </div>
        <div className="target-badge">
          {copy('目標數字：', 'Target:')}<strong>{targetNumber}</strong>
        </div>
      </div>

      <div className="blocks-canvas">
        <div className="place-column tens-column">
          <div className="column-header">
            <h4>{copy('十位', 'Tens')} · 10</h4>
            <span className="count-pill">
              {copy(`${tens} 條 (${tens * 10})`, `${tens} (${tens * 10})`)}
            </span>
          </div>
          <div className="blocks-grid tens-grid">
            {Array.from({ length: tens }).map((_, i) => (
              <div key={i} className="block-ten" title={copy('10 積木', 'Block of ten')}>
                {Array.from({ length: 10 }).map((_, j) => (
                  <span key={j} className="segment" />
                ))}
              </div>
            ))}
            {tens === 0 && <p className="empty-hint">{copy('目前無十位積木', 'No tens blocks')}</p>}
          </div>
          <div className="col-buttons">
            <button
              type="button"
              className="btn-lab"
              onClick={() => setTens((t) => Math.min(9, t + 1))}
            >
              {copy('+ 1條 (10)', '+ 1 ten')}
            </button>
            <button
              type="button"
              className="btn-lab btn-sub"
              onClick={() => setTens((t) => Math.max(0, t - 1))}
              disabled={tens === 0}
            >
              {copy('- 1條', '- 1 ten')}
            </button>
          </div>
        </div>

        <div className="place-column ones-column">
          <div className="column-header">
            <h4>{copy('個位', 'Ones')} · 1</h4>
            <span className="count-pill">
              {locale === 'en'
                ? ones
                : copy(`${ones} 個 (${ones})`, `${ones} blocks (${ones})`)}
            </span>
          </div>
          <div className="blocks-grid ones-grid">
            {Array.from({ length: ones }).map((_, i) => (
              <span key={i} className="block-one" title={copy('1 積木', 'One block')} />
            ))}
            {ones === 0 && <p className="empty-hint">{copy('目前無個位積木', 'No ones blocks')}</p>}
          </div>
          <div className="col-buttons">
            <button
              type="button"
              className="btn-lab"
              onClick={() => setOnes((o) => Math.min(19, o + 1))}
            >
              {copy('+ 1個 (1)', '+ 1 one')}
            </button>
            <button
              type="button"
              className="btn-lab btn-sub"
              onClick={() => setOnes((o) => Math.max(0, o - 1))}
              disabled={ones === 0}
            >
              {copy('- 1個', '- 1 one')}
            </button>
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
          >
            {copy('滿 10 個一 ➜ 換 1 條十（進位）', 'Exchange 10 ones ➜ 1 ten')}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleDecomposeTen}
            disabled={tens < 1}
          >
            {copy('借 1 條十 ➜ 換 10 個一（退位）', 'Exchange 1 ten ➜ 10 ones')}
          </button>
        </div>

        <div className="status-box">
          <span className="current-sum">
            {copy('目前數值：', 'Current value:')}<strong>{currentTotal}</strong>
          </span>
          {isMatch ? (
            <button type="button" className="btn-primary" onClick={handleCheck}>
              {copy('🎉 答對了！點擊領取 +5 XP', '🎉 Correct! Claim +5 XP')}
            </button>
          ) : (
            <span className="diff-hint">
              {currentTotal < targetNumber
                ? copy(`還差 ${targetNumber - currentTotal}`, `${targetNumber - currentTotal} more needed`)
                : copy(`超過了 ${currentTotal - targetNumber}`, `${currentTotal - targetNumber} over the target`)}
            </span>
          )}
        </div>
      </div>
      {streak > 0 && (
        <p className="streak-tag">
          {copy(`連續挑戰成功：${streak} 次`, `Successful streak:${streak}`)}
        </p>
      )}
    </div>
  )
}
