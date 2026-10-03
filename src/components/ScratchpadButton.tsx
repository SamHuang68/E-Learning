import React, { useEffect, useRef, useState } from 'react'
import { Scratchpad } from './Scratchpad'
import { useI18n } from '../i18n/i18n'

interface Props {
  className?: string
  style?: React.CSSProperties
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

/**
 * 全域浮動草稿紙啟動按鈕 (Floating Scratchpad Launcher)
 * 支援點擊浮動按鈕或按快捷鍵 [S] 快速啟動/收起幾何與算式草稿紙。
 * Esc 關閉並把焦點交回開啟處。
 */
export const ScratchpadButton: React.FC<Props> = ({ className, style }) => {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  function openPad() {
    setIsOpen(true)
  }

  function closePad() {
    setIsOpen(false)
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.isComposing || e.repeat) return
      const otherModal = Array.from(document.querySelectorAll('dialog:modal, [role="dialog"][aria-modal="true"]'))
        .some((dialog) => dialog.id !== 'hub-scratchpad')
      if (otherModal) return
      if (e.key.toLowerCase() === 's' && !isTypingTarget(e.target)) {
        e.preventDefault()
        if (isOpen) closePad()
        else openPad()
      }
    }
    // Capture the launcher's own S toggle before the dialog isolates its keys.
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [isOpen])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`floating-scratchpad-btn ${className || ''}`}
        onClick={(event) => {
          // WebKit does not focus buttons on pointer activation.
          event.currentTarget.focus()
          if (isOpen) closePad()
          else openPad()
        }}
        aria-expanded={isOpen}
        aria-controls={isOpen ? 'hub-scratchpad' : undefined}
        aria-haspopup="dialog"
        aria-keyshortcuts="S"
        style={{
          position: 'fixed',
          bottom: '1.2rem',
          right: '1.2rem',
          zIndex: 9990,
          background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '999px',
          padding: '0.45rem 0.85rem',
          fontSize: '0.78rem',
          fontWeight: 700,
          boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          transition: 'all 0.2s ease',
          ...style,
        }}
        title={t('scratch.open')}
      >
        <span aria-hidden="true">✏️</span>
        <span>{t('scratch.launcher')}</span>
      </button>

      <Scratchpad isOpen={isOpen} onClose={closePad} />
    </>
  )
}
