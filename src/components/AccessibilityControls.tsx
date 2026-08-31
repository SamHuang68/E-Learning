import React, { useState, useEffect } from 'react'

export type AccessibilitySettings = {
  fontSize: 'standard' | 'large' | 'extra-large'
  distractionFree: boolean
  highContrast: boolean
  darkMode: boolean
}

const STORAGE_KEY = 'e-learning-a11y-settings'

/**
 * WCAG 2.2 AA 無障礙與認知輔助控制器 (AccessibilityControls)
 * 支援無干擾專注模式、字體縮放、高對比切換與鍵盤快捷鍵說明。
 */
export const AccessibilityControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false)
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) return JSON.parse(saved) as AccessibilitySettings
      } catch {
        // ignore
      }
    }
    return {
      fontSize: 'standard',
      distractionFree: false,
      highContrast: false,
      darkMode: false,
    }
  })

  // 同步樣式至 HTML Document Root
  useEffect(() => {
    const root = document.documentElement

    // 1. 字體大小
    root.classList.remove('font-standard', 'font-large', 'font-xlarge')
    if (settings.fontSize === 'large') root.classList.add('font-large')
    else if (settings.fontSize === 'extra-large') root.classList.add('font-xlarge')
    else root.classList.add('font-standard')

    // 2. 無干擾專注模式
    if (settings.distractionFree) root.classList.add('distraction-free')
    else root.classList.remove('distraction-free')

    // 3. 高對比模式
    if (settings.highContrast) root.classList.add('high-contrast')
    else root.classList.remove('high-contrast')

    // 4. 深色模式
    if (settings.darkMode) root.setAttribute('data-theme', 'dark')
    else root.removeAttribute('data-theme')

    // 儲存
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      } catch {
        // ignore
      }
    }
  }, [settings])

  return (
    <>
      {/* 浮動無障礙按鈕 */}
      <aside className="a11y-floating-dock" aria-label="無障礙輔助控制">
        <button
          type="button"
          className="btn-a11y-trigger"
          onClick={() => setIsOpen((prev) => !prev)}
          title="開啟無障礙與學習輔助設定"
          aria-expanded={isOpen}
        >
          <span className="a11y-icon">♿</span>
          <span className="a11y-text">無障礙輔助</span>
        </button>
      </aside>

      {/* 設定對話框 */}
      {isOpen && (
        <div className="a11y-modal-backdrop" onClick={() => setIsOpen(false)}>
          <div
            className="a11y-settings-dialog"
            role="dialog"
            aria-label="無障礙與視覺輔助設定"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="a11y-dialog-header">
              <h3>♿ 無障礙與認知輔助設定 (WCAG 2.2)</h3>
              <button
                type="button"
                className="btn-close"
                onClick={() => setIsOpen(false)}
                aria-label="關閉設定"
              >
                ✕
              </button>
            </div>

            <div className="a11y-settings-body">
              {/* 1. 字體大小 */}
              <div className="setting-row">
                <span className="setting-label">🔤 閱讀字體大小：</span>
                <div className="segmented-btn-group">
                  <button
                    type="button"
                    className={`seg-btn ${settings.fontSize === 'standard' ? 'active' : ''}`}
                    onClick={() => setSettings((s) => ({ ...s, fontSize: 'standard' }))}
                  >
                    100% 標準
                  </button>
                  <button
                    type="button"
                    className={`seg-btn ${settings.fontSize === 'large' ? 'active' : ''}`}
                    onClick={() => setSettings((s) => ({ ...s, fontSize: 'large' }))}
                  >
                    115% 舒適
                  </button>
                  <button
                    type="button"
                    className={`seg-btn ${settings.fontSize === 'extra-large' ? 'active' : ''}`}
                    onClick={() => setSettings((s) => ({ ...s, fontSize: 'extra-large' }))}
                  >
                    130% 大字
                  </button>
                </div>
              </div>

              {/* 2. 深色主題 */}
              <div className="setting-row toggle-row">
                <div>
                  <span className="setting-label">🌙 深色模式 (Dark Theme)：</span>
                  <p className="setting-desc">降低螢幕眩光，適合夜間與長時間專注學習。</p>
                </div>
                <input
                  type="checkbox"
                  className="a11y-toggle"
                  checked={settings.darkMode}
                  onChange={(e) => setSettings((s) => ({ ...s, darkMode: e.target.checked }))}
                />
              </div>

              {/* 3. 無干擾專注模式 */}
              <div className="setting-row toggle-row">
                <div>
                  <span className="setting-label">🎯 無干擾專注模式 (Distraction-Free)：</span>
                  <p className="setting-desc">隱藏背景動畫與非必要裝飾，專注於題目思考。</p>
                </div>
                <input
                  type="checkbox"
                  className="a11y-toggle"
                  checked={settings.distractionFree}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, distractionFree: e.target.checked }))
                  }
                />
              </div>

              {/* 4. 高對比模式 */}
              <div className="setting-row toggle-row">
                <div>
                  <span className="setting-label">👁️ 高對比強化 (High Contrast)：</span>
                  <p className="setting-desc">增強文字與背景明暗邊界，提升可讀性。</p>
                </div>
                <input
                  type="checkbox"
                  className="a11y-toggle"
                  checked={settings.highContrast}
                  onChange={(e) => setSettings((s) => ({ ...s, highContrast: e.target.checked }))}
                />
              </div>

              {/* 5. 鍵盤快捷鍵指南 */}
              <div className="shortcuts-info-box">
                <button
                  type="button"
                  className="btn-show-shortcuts"
                  onClick={() => setShowShortcuts((prev) => !prev)}
                >
                  ⌨️ 全站鍵盤快捷鍵速查 {showShortcuts ? '▲' : '▼'}
                </button>
                {showShortcuts && (
                  <ul className="shortcuts-list">
                    <li><code>1</code> ~ <code>4</code>：快速選擇選項 A ~ D</li>
                    <li><code>Enter</code>：提交答案或進入下一題</li>
                    <li><code>H</code>：展開蘇格拉底階梯提示</li>
                    <li><code>Space</code>：播放多益/五十音語音</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
