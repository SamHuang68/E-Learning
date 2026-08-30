import React, { useState } from 'react'
import { MathFormula } from './MathFormula'

export type KeypadTab = 'numbers' | 'algebra' | 'geometry' | 'calculus'

type Props = {
  value: string
  onChange: (nextValue: string) => void
  onSubmit?: () => void
  isOpen?: boolean
  onClose?: () => void
}

type KeyDef = {
  label: string
  latex?: string
  insertValue?: string
  action?: 'backspace' | 'clear' | 'submit'
  isSpecial?: boolean
  isAction?: boolean
}

/**
 * 行動端專用虛擬數學符號鍵盤 (MathKeypad)
 * 借鏡 Khan Academy Perseus，解決行動裝置輸入分數、根號、幾何與微積分符號之難題。
 */
export const MathKeypad: React.FC<Props> = ({
  value,
  onChange,
  onSubmit,
  isOpen = true,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<KeypadTab>('numbers')

  if (!isOpen) return null

  function handleKeyClick(key: KeyDef) {
    if (key.action === 'clear') {
      onChange('')
      return
    }
    if (key.action === 'backspace') {
      onChange(value.slice(0, -1))
      return
    }
    if (key.action === 'submit') {
      if (onSubmit) onSubmit()
      return
    }

    const snippet = key.insertValue ?? key.label
    onChange(value + snippet)
  }

  // 1. 數字與基礎運算
  const numberKeys: KeyDef[][] = [
    [
      { label: '7' },
      { label: '8' },
      { label: '9' },
      { label: '÷', insertValue: ' \\div ' },
      { label: '(', insertValue: '(' },
      { label: ')', insertValue: ')' },
    ],
    [
      { label: '4' },
      { label: '5' },
      { label: '6' },
      { label: '×', insertValue: ' \\times ' },
      { label: 'x', insertValue: 'x' },
      { label: 'y', insertValue: 'y' },
    ],
    [
      { label: '1' },
      { label: '2' },
      { label: '3' },
      { label: '－', insertValue: ' - ' },
      { label: '＋', insertValue: ' + ' },
      { label: '＝', insertValue: ' = ' },
    ],
    [
      { label: '0' },
      { label: '.' },
      { label: '±', insertValue: ' \\pm ' },
      { label: 'C', action: 'clear', isAction: true },
      { label: '⌫', action: 'backspace', isAction: true },
      { label: '↵ 確定', action: 'submit', isSpecial: true },
    ],
  ]

  // 2. 代數與多項式
  const algebraKeys: KeyDef[][] = [
    [
      { label: 'x', insertValue: 'x' },
      { label: 'y', insertValue: 'y' },
      { label: 'z', insertValue: 'z' },
      { label: 'a', insertValue: 'a' },
      { label: 'b', insertValue: 'b' },
      { label: 'c', insertValue: 'c' },
    ],
    [
      { label: 'x²', insertValue: '^2' },
      { label: 'xⁿ', insertValue: '^{' },
      { label: '√x', insertValue: '\\sqrt{' },
      { label: '∛x', insertValue: '\\sqrt[3]{' },
      { label: '|x|', insertValue: '|' },
      { label: '1/x', insertValue: '\\frac{1}{' },
    ],
    [
      { label: 'a/b', insertValue: '\\frac{' },
      { label: '≤', insertValue: ' \\le ' },
      { label: '≥', insertValue: ' \\ge ' },
      { label: '≠', insertValue: ' \\neq ' },
      { label: '⌫', action: 'backspace', isAction: true },
      { label: '↵ 確定', action: 'submit', isSpecial: true },
    ],
  ]

  // 3. 幾何與三角函數
  const geometryKeys: KeyDef[][] = [
    [
      { label: 'π', insertValue: '\\pi ' },
      { label: 'θ', insertValue: '\\theta ' },
      { label: 'α', insertValue: '\\alpha ' },
      { label: 'β', insertValue: '\\beta ' },
      { label: '°', insertValue: '^{\\circ}' },
      { label: '△', insertValue: '\\triangle ' },
    ],
    [
      { label: 'sin', insertValue: '\\sin(' },
      { label: 'cos', insertValue: '\\cos(' },
      { label: 'tan', insertValue: '\\tan(' },
      { label: '∠', insertValue: '\\angle ' },
      { label: '⊥', insertValue: ' \\perp ' },
      { label: '∥', insertValue: ' \\parallel ' },
    ],
    [
      { label: '≅', insertValue: ' \\cong ' },
      { label: '∼', insertValue: ' \\sim ' },
      { label: '∞', insertValue: '\\infty ' },
      { label: 'C', action: 'clear', isAction: true },
      { label: '⌫', action: 'backspace', isAction: true },
      { label: '↵ 確定', action: 'submit', isSpecial: true },
    ],
  ]

  // 4. 微積分與極限
  const calculusKeys: KeyDef[][] = [
    [
      { label: '∫', insertValue: '\\int ' },
      { label: '∫_a^b', insertValue: '\\int_{a}^{b} ' },
      { label: 'd/dx', insertValue: '\\frac{d}{dx}' },
      { label: 'lim', insertValue: '\\lim_{x \\to 0} ' },
      { label: '∑', insertValue: '\\sum ' },
      { label: '∏', insertValue: '\\prod ' },
    ],
    [
      { label: 'dx', insertValue: ' dx' },
      { label: 'dy', insertValue: ' dy' },
      { label: 'dt', insertValue: ' dt' },
      { label: 'Δx', insertValue: '\\Delta x' },
      { label: 'ln', insertValue: '\\ln(' },
      { label: 'e^x', insertValue: 'e^{' },
    ],
    [
      { label: '≈', insertValue: ' \\approx ' },
      { label: '∈', insertValue: ' \\in ' },
      { label: '⊂', insertValue: ' \\subset ' },
      { label: 'C', action: 'clear', isAction: true },
      { label: '⌫', action: 'backspace', isAction: true },
      { label: '↵ 確定', action: 'submit', isSpecial: true },
    ],
  ]

  const activeKeyRows =
    activeTab === 'numbers'
      ? numberKeys
      : activeTab === 'algebra'
        ? algebraKeys
        : activeTab === 'geometry'
          ? geometryKeys
          : calculusKeys

  return (
    <div className="math-keypad-panel">
      {/* 頂部即時預覽與收合列 */}
      <div className="keypad-top-bar">
        <div className="keypad-preview-box">
          <span className="preview-label">即時算式預覽：</span>
          <div className="rendered-math">
            {value.trim().length > 0 ? (
              <MathFormula math={`$${value}$`} />
            ) : (
              <span className="empty-preview">（請點選下方鍵盤輸入）</span>
            )}
          </div>
        </div>
        {onClose && (
          <button type="button" className="btn-close-keypad" onClick={onClose}>
            ✕ 收起鍵盤
          </button>
        )}
      </div>

      {/* 4 大功能分頁 */}
      <div className="keypad-tabs-row">
        <button
          type="button"
          className={`keypad-tab-btn ${activeTab === 'numbers' ? 'active' : ''}`}
          onClick={() => setActiveTab('numbers')}
        >
          123 數字運算
        </button>
        <button
          type="button"
          className={`keypad-tab-btn ${activeTab === 'algebra' ? 'active' : ''}`}
          onClick={() => setActiveTab('algebra')}
        >
          x² 代數多項式
        </button>
        <button
          type="button"
          className={`keypad-tab-btn ${activeTab === 'geometry' ? 'active' : ''}`}
          onClick={() => setActiveTab('geometry')}
        >
          π/θ 幾何三角
        </button>
        <button
          type="button"
          className={`keypad-tab-btn ${activeTab === 'calculus' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculus')}
        >
          ∫dx 微積分極限
        </button>
      </div>

      {/* 虛擬按鍵矩陣 */}
      <div className="keypad-keys-grid">
        {activeKeyRows.map((row, rIdx) => (
          <div key={`row-${rIdx}`} className="keypad-row">
            {row.map((k, cIdx) => (
              <button
                key={`k-${rIdx}-${cIdx}`}
                type="button"
                className={`key-btn ${k.isSpecial ? 'special' : ''} ${k.isAction ? 'action' : ''}`}
                onClick={() => handleKeyClick(k)}
              >
                {k.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
