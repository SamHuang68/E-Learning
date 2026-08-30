import React, { useState } from 'react'
import { BALANCE_PRESETS, type BalanceEquationPreset } from '../data/diagramPresets'

/**
 * 天平平衡解題器 (BalanceScaleSolver)
 * 國小/國中代數啟蒙：透過等量公理（兩邊同時加減乘除）直觀化移項法則。
 */
export const BalanceScaleSolver: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(BALANCE_PRESETS[0].id)
  const preset = BALANCE_PRESETS.find((p) => p.id === selectedPresetId) ?? BALANCE_PRESETS[0]

  const [leftX, setLeftX] = useState<number>(preset.leftX)
  const [leftConst, setLeftConst] = useState<number>(preset.leftConst)
  const [rightX, setRightX] = useState<number>(preset.rightX)
  const [rightConst, setRightConst] = useState<number>(preset.rightConst)
  const [stepHistory, setStepHistory] = useState<string[]>([])

  // 切換預設題
  function handleSelectPreset(p: BalanceEquationPreset) {
    setSelectedPresetId(p.id)
    setLeftX(p.leftX)
    setLeftConst(p.leftConst)
    setRightX(p.rightX)
    setRightConst(p.rightConst)
    setStepHistory([])
  }

  // 重設
  function handleReset() {
    setLeftX(preset.leftX)
    setLeftConst(preset.leftConst)
    setRightX(preset.rightX)
    setRightConst(preset.rightConst)
    setStepHistory([])
  }

  // 兩邊同時扣除常數
  function handleSubtractConst(val: number) {
    if (leftConst < val && rightConst < val) return
    const newLeftC = Math.max(0, leftConst - val)
    const newRightC = Math.max(0, rightConst - val)
    setLeftConst(newLeftC)
    setRightConst(newRightC)
    setStepHistory((prev) => [...prev, `兩邊同時減去 ${val} ➜ ${formatEq(leftX, newLeftC, rightX, newRightC)}`])
  }

  // 兩邊同時扣除 X
  function handleSubtractX() {
    if (leftX <= 0 || rightX <= 0) return
    const newLeftX = leftX - 1
    const newRightX = rightX - 1
    setLeftX(newLeftX)
    setRightX(newRightX)
    setStepHistory((prev) => [...prev, `兩邊各拿掉 1 個 x ➜ ${formatEq(newLeftX, leftConst, newRightX, rightConst)}`])
  }

  // 兩邊同時除以 2
  function handleDivideBy2() {
    if (leftX % 2 === 0 && leftConst % 2 === 0 && rightX % 2 === 0 && rightConst % 2 === 0) {
      const newLeftX = leftX / 2
      const newLeftC = leftConst / 2
      const newRightX = rightX / 2
      const newRightC = rightConst / 2
      setLeftX(newLeftX)
      setLeftConst(newLeftC)
      setRightX(newRightX)
      setRightConst(newRightC)
      setStepHistory((prev) => [...prev, `兩邊同時除以 2 ➜ ${formatEq(newLeftX, newLeftC, newRightX, newRightC)}`])
    }
  }

  function formatEq(lx: number, lc: number, rx: number, rc: number): string {
    const leftPart = [lx > 0 ? (lx === 1 ? 'x' : `${lx}x`) : '', lc > 0 ? `${lc}` : '']
      .filter(Boolean)
      .join(' + ') || '0'
    const rightPart = [rx > 0 ? (rx === 1 ? 'x' : `${rx}x`) : '', rc > 0 ? `${rc}` : '']
      .filter(Boolean)
      .join(' + ') || '0'
    return `${leftPart} = ${rightPart}`
  }

  // 計算天平傾斜角度（代入 targetX 評估總重）
  const totalLeftWeight = leftX * preset.targetX + leftConst
  const totalRightWeight = rightX * preset.targetX + rightConst
  const weightDiff = totalRightWeight - totalLeftWeight
  const tiltAngle = Math.max(-12, Math.min(12, weightDiff * 1.5))
  const isSolved = leftX === 1 && leftConst === 0 && rightX === 0 && rightConst === preset.targetX

  return (
    <div className="balance-solver-card">
      <div className="solver-top-bar">
        <div className="solver-title-block">
          <h3>⚖️ 天平平衡與等量公理解題器</h3>
          <p>不講死板的移項變號！操作天平兩端「同加同減同除」，直觀感受代數平衡。</p>
        </div>

        <div className="preset-tabs">
          {BALANCE_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`pill-btn ${p.id === selectedPresetId ? 'active' : ''}`}
              onClick={() => handleSelectPreset(p)}
            >
              {p.title.split('：')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="solver-main-grid">
        {/* SVG 天平互動區 */}
        <div className="balance-visual-box">
          <div className="current-eq-badge">
            目前狀態：
            <strong>{formatEq(leftX, leftConst, rightX, rightConst)}</strong>
          </div>

          <svg viewBox="0 0 500 280" className="balance-svg">
            {/* 底座與立柱 */}
            <polygon points="250,260 210,275 290,275" fill="#475569" />
            <rect x="246" y="100" width="8" height="160" fill="#64748b" rx="4" />
            <circle cx="250" cy="100" r="10" fill="#334155" />

            {/* 旋轉橫梁 */}
            <g transform={`rotate(${tiltAngle}, 250, 100)`}>
              <rect x="50" y="96" width="400" height="8" rx="4" fill="#1e293b" />
              {/* 支點 */}
              <circle cx="70" cy="100" r="5" fill="#e2e8f0" />
              <circle cx="430" cy="100" r="5" fill="#e2e8f0" />

              {/* 左吊盤 */}
              <line x1="70" y1="100" x2="40" y2="180" stroke="#94a3b8" strokeWidth="2" />
              <line x1="70" y1="100" x2="100" y2="180" stroke="#94a3b8" strokeWidth="2" />
              <path d="M 30,180 Q 70,195 110,180 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />

              {/* 右吊盤 */}
              <line x1="430" y1="100" x2="400" y2="180" stroke="#94a3b8" strokeWidth="2" />
              <line x1="430" y1="100" x2="460" y2="180" stroke="#94a3b8" strokeWidth="2" />
              <path d="M 390,180 Q 430,195 470,180 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
            </g>

            {/* 左盤物品 (X 箱子 與 砝碼) */}
            <g className="left-items-group">
              {Array.from({ length: leftX }).map((_, i) => (
                <rect
                  key={`lx-${i}`}
                  x={45 + i * 26}
                  y="145"
                  width="24"
                  height="28"
                  rx="4"
                  fill="#3b82f6"
                  stroke="#1d4ed8"
                  strokeWidth="2"
                />
              ))}
              {Array.from({ length: Math.min(leftConst, 12) }).map((_, i) => (
                <circle
                  key={`lc-${i}`}
                  cx={45 + (i % 6) * 10}
                  cy={135 - Math.floor(i / 6) * 12}
                  r="5"
                  fill="#f59e0b"
                  stroke="#d97706"
                />
              ))}
              <text x="70" y="215" textAnchor="middle" fontSize="12" fill="#334155" fontWeight="bold">
                左盤: {leftX > 0 ? `${leftX}個 x` : ''} {leftConst > 0 ? `+ ${leftConst}砝碼` : ''}
              </text>
            </g>

            {/* 右盤物品 */}
            <g className="right-items-group">
              {Array.from({ length: rightX }).map((_, i) => (
                <rect
                  key={`rx-${i}`}
                  x={405 + i * 26}
                  y="145"
                  width="24"
                  height="28"
                  rx="4"
                  fill="#3b82f6"
                  stroke="#1d4ed8"
                  strokeWidth="2"
                />
              ))}
              {Array.from({ length: Math.min(rightConst, 15) }).map((_, i) => (
                <circle
                  key={`rc-${i}`}
                  cx={405 + (i % 6) * 10}
                  cy={150 - Math.floor(i / 6) * 12}
                  r="5"
                  fill="#f59e0b"
                  stroke="#d97706"
                />
              ))}
              <text x="430" y="215" textAnchor="middle" fontSize="12" fill="#334155" fontWeight="bold">
                右盤: {rightX > 0 ? `${rightX}個 x` : ''} {rightConst > 0 ? `${rightConst}砝碼` : ''}
              </text>
            </g>
          </svg>

          {isSolved && (
            <div className="solved-banner">
              🎉 完美解出！未知數 <strong>x = {preset.targetX}</strong>（天平維持水平平衡）
            </div>
          )}
        </div>

        {/* 等量公理操作面板 */}
        <div className="balance-controls-panel">
          <h4>🛠️ 等量公理動作 (Equal Operations)</h4>
          <p className="hint-text">💡 提示：{preset.hint}</p>

          <div className="action-buttons-stack">
            <button
              type="button"
              className="op-btn"
              onClick={() => handleSubtractConst(1)}
              disabled={leftConst < 1 || rightConst < 1}
            >
              兩邊同時 － 1 砝碼
            </button>
            <button
              type="button"
              className="op-btn"
              onClick={() => handleSubtractConst(preset.leftConst > 0 ? preset.leftConst : 2)}
              disabled={leftConst <= 0 || rightConst <= 0}
            >
              兩邊同時 － {preset.leftConst > 0 ? preset.leftConst : 2} 砝碼
            </button>
            {rightX > 0 && (
              <button
                type="button"
                className="op-btn highlight"
                onClick={handleSubtractX}
                disabled={leftX < 1 || rightX < 1}
              >
                兩邊同時 － 1 個未知數箱子 x
              </button>
            )}
            <button
              type="button"
              className="op-btn"
              onClick={handleDivideBy2}
              disabled={!(leftX % 2 === 0 && leftConst % 2 === 0 && rightConst % 2 === 0)}
            >
              兩邊同時 ÷ 2 (分兩半)
            </button>
            <button type="button" className="btn-reset" onClick={handleReset}>
              ↺ 重設天平
            </button>
          </div>

          {/* 步驟歷程 */}
          <div className="steps-history-box">
            <h5>📜 推導步驟紀錄：</h5>
            {stepHistory.length === 0 ? (
              <span className="empty-hint">尚未進行任何等量操作。</span>
            ) : (
              <ol>
                {stepHistory.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
