import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'katex/dist/katex.min.css'
import App from './App.tsx'

const rootEl = document.getElementById('root')

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL || '/'
    void navigator.serviceWorker.register(`${base}sw.js`).catch(() => undefined)
  })
}

try {
  if (!rootEl) throw new Error('找不到 #root')
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (err) {
  const message = err instanceof Error ? err.message : String(err)
  if (rootEl) {
    rootEl.innerHTML = `<div style="padding:2rem;font-family:sans-serif;max-width:40rem">
      <h1>應用程式啟動失敗</h1>
      <p>${message}</p>
      <p>請確認 GitHub Secrets 的 VITE_SUPABASE_URL 為 https://xxxx.supabase.co（不要含本機路徑）。</p>
    </div>`
  }
  console.error(err)
}
