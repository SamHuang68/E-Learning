import React, { useState, useEffect } from 'react'

/**
 * PWA 離線快取更新與版本狀態指示器 (UpdateNotification)
 * 當 Service Worker 發現新版本快取完成時，跳出溫和通知條，提示使用者點擊刷新以獲取最新題庫與實驗室功能。
 */
export const UpdateNotification: React.FC = () => {
  const [hasUpdate, setHasUpdate] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    function handleControllerChange() {
      setHasUpdate(true)
    }

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
    }
  }, [])

  if (!hasUpdate) return null

  return (
    <div
      className="pwa-update-bar"
      style={{
        position: 'fixed',
        top: '0.8rem',
        right: '0.8rem',
        zIndex: 9999,
        background: 'linear-gradient(135deg, #0284c7, #10b981)',
        color: '#ffffff',
        padding: '0.5rem 0.9rem',
        borderRadius: '999px',
        boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.78rem',
        fontWeight: 600,
      }}
    >
      <span>✨ 平台已更新最新題庫與教具！</span>
      <button
        type="button"
        onClick={() => window.location.reload()}
        style={{
          background: '#ffffff',
          color: '#0284c7',
          border: 'none',
          borderRadius: '999px',
          padding: '0.2rem 0.6rem',
          fontSize: '0.74rem',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        立即套用
      </button>
      <button
        type="button"
        onClick={() => setHasUpdate(false)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.8)',
          cursor: 'pointer',
          fontSize: '0.85rem',
          padding: '0 0.2rem',
        }}
      >
        ✕
      </button>
    </div>
  )
}
