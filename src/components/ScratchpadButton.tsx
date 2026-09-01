import React, { useState, useEffect } from 'react'
import { Scratchpad } from './Scratchpad'

interface Props {
  className?: string
  style?: React.CSSProperties
}

/**
 * 全域浮動草稿紙啟動按鈕 (Floating Scratchpad Launcher)
 * 支援點擊浮動按鈕或按快捷鍵 [S] 快速啟動/收起幾何與算式草稿紙。
 */
export const ScratchpadButton: React.FC<Props> = ({ className, style }) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key.toLowerCase() === 's' &&
        !['input', 'textarea', 'select'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())
      ) {
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <button
        type="button"
        className={`floating-scratchpad-btn ${className || ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
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
        title="開啟推導草稿紙 (快捷鍵: S)"
      >
        <span>✏️</span>
        <span>草稿紙 [S]</span>
      </button>

      <Scratchpad isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
