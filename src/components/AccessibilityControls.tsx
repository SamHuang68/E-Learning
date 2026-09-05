import React, { useState, useEffect, useRef } from 'react'
import { LOCAL_PREFERENCE_KEYS } from '../utils/progressKeys'

export type AccessibilitySettings = {
  fontSize: 'standard' | 'large' | 'extra-large'
  distractionFree: boolean
  highContrast: boolean
  darkMode: boolean
}

const STORAGE_KEY = LOCAL_PREFERENCE_KEYS.accessibility
const LIGHT_MIGRATION_KEY = 'e-learning-a11y-light-v1'

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 'standard',
  distractionFree: false,
  highContrast: false,
  darkMode: false,
}

function readA11ySettings(): AccessibilitySettings {
  if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const saved = raw
      ? ({ ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AccessibilitySettings>) })
      : DEFAULT_SETTINGS
    // One-time: previously saved darkMode made the Hub look like the old black shell.
    if (!localStorage.getItem(LIGHT_MIGRATION_KEY)) {
      const next = { ...saved, darkMode: false }
      localStorage.setItem(LIGHT_MIGRATION_KEY, '1')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      if (typeof document !== 'undefined') {
        document.documentElement.removeAttribute('data-theme')
      }
      return next
    }
    return saved
  } catch {
    return DEFAULT_SETTINGS
  }
}


/**
 * WCAG 2.2 AA 無障礙與認知輔助控制器 (AccessibilityControls)
 * 支援無干擾專注模式、字體縮放、高對比切換與鍵盤快捷鍵說明。
 */
export const AccessibilityControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)
  const [settings, setSettings] = useState<AccessibilitySettings>(() => readA11ySettings())

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

    // 4. 深色模式（預設白底；僅在使用者主動開啟時套用）
    if (settings.darkMode) {
      root.setAttribute('data-theme', 'dark')
      root.style.colorScheme = 'dark'
    } else {
      root.removeAttribute('data-theme')
      root.style.colorScheme = 'light'
    }

    // 儲存
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      } catch {
        // ignore
      }
    }
  }, [settings])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen) {
      wasOpen.current = true
      if (!dialog.open) dialog.showModal()
      dialog.querySelector<HTMLElement>('button, input, select, [tabindex]:not([tabindex="-1"])')?.focus()
      return
    }
    if (dialog.open) dialog.close()
    if (wasOpen.current) {
      triggerRef.current?.focus()
      wasOpen.current = false
    }
  }, [isOpen])

  return (
    <>
      {/* 浮動無障礙按鈕 */}
      <aside className="a11y-floating-dock" aria-label="無障礙輔助控制">
        <button
          ref={triggerRef}
          type="button"
          className="btn-a11y-trigger"
          onClick={() => setIsOpen((prev) => !prev)}
          title="開啟無障礙與學習輔助設定"
          aria-expanded={isOpen}
          aria-controls="a11y-settings-dialog"
        >
          <span className="a11y-icon">♿</span>
          <span className="a11y-text">無障礙輔助</span>
        </button>
      </aside>

      {/* 設定對話框 */}
      <dialog
        ref={dialogRef}
        id="a11y-settings-dialog"
        className="a11y-settings-dialog"
        aria-modal="true"
        aria-labelledby="a11y-dialog-title"
        onCancel={(event) => {
          event.preventDefault()
          setIsOpen(false)
        }}
        onClose={() => setIsOpen(false)}
        onKeyDown={(event) => {
          if (event.key !== 'Escape') return
          event.preventDefault()
          setIsOpen(false)
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsOpen(false)
        }}
      >
            <div className="a11y-dialog-header">
              <h3 id="a11y-dialog-title">♿ 無障礙與認知輔助設定 (WCAG 2.2)</h3>
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
                    aria-pressed={settings.fontSize === 'standard'}
                    className={`seg-btn ${settings.fontSize === 'standard' ? 'active' : ''}`}
                    onClick={() => setSettings((s) => ({ ...s, fontSize: 'standard' }))}
                  >
                    100% 標準
                  </button>
                  <button
                    type="button"
                    aria-pressed={settings.fontSize === 'large'}
                    className={`seg-btn ${settings.fontSize === 'large' ? 'active' : ''}`}
                    onClick={() => setSettings((s) => ({ ...s, fontSize: 'large' }))}
                  >
                    115% 舒適
                  </button>
                  <button
                    type="button"
                    aria-pressed={settings.fontSize === 'extra-large'}
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
                  <span className="setting-label" id="a11y-dark-label">🌙 深色模式 (Dark Theme)：</span>
                  <p className="setting-desc">降低螢幕眩光，適合夜間與長時間專注學習。</p>
                </div>
                <input
                  type="checkbox"
                  aria-labelledby="a11y-dark-label"
                  className="a11y-toggle"
                  checked={settings.darkMode}
                  onChange={(e) => setSettings((s) => ({ ...s, darkMode: e.target.checked }))}
                />
              </div>

              {/* 3. 無干擾專注模式 */}
              <div className="setting-row toggle-row">
                <div>
                  <span className="setting-label" id="a11y-focus-label">🎯 無干擾專注模式 (Distraction-Free)：</span>
                  <p className="setting-desc">隱藏背景動畫與非必要裝飾，專注於題目思考。</p>
                </div>
                <input
                  type="checkbox"
                  aria-labelledby="a11y-focus-label"
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
                  <span className="setting-label" id="a11y-contrast-label">👁️ 高對比強化 (High Contrast)：</span>
                  <p className="setting-desc">增強文字與背景明暗邊界，提升可讀性。</p>
                </div>
                <input
                  type="checkbox"
                  aria-labelledby="a11y-contrast-label"
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
      </dialog>
    </>
  )
}
