import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'katex/dist/katex.min.css'
import App from './App.tsx'
import { loadUiLocale } from './i18n/locale'
import { translate } from './i18n/messages'
import { sanitizeClientError } from './utils/sanitizeClientError'

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
  if (rootEl) {
    const locale = loadUiLocale()
    const title = translate(locale, 'error.bootTitle')
    const body = translate(locale, 'error.bootBody')
    const detail = sanitizeClientError(err, translate(locale, 'error.safeDetail'))
    rootEl.replaceChildren()
    const wrap = document.createElement('div')
    wrap.className = 'error-boundary'
    wrap.setAttribute('role', 'alert')
    wrap.style.padding = '2rem'
    wrap.style.maxWidth = '40rem'
    const h1 = document.createElement('h1')
    h1.textContent = title
    const p = document.createElement('p')
    p.textContent = body
    const extra = document.createElement('p')
    extra.className = 'error-boundary-detail'
    extra.textContent = detail
    wrap.append(h1, p, extra)
    rootEl.append(wrap)
  }
  console.error(err)
}
