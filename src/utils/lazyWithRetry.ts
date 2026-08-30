import { lazy, type ComponentType } from 'react'

/**
 * 具備自動重試與版本熱更新之 React.lazy 包裝器 (lazyWithRetry)
 * 當網站發布新版本導致舊 Chunk Hash 404 時，自動執行一次頁面重載以獲取最新靜態檔案。
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(async () => {
    const sessionKey = 'e-learning:chunk-retry-refreshed'
    const alreadyRefreshed =
      typeof window !== 'undefined' &&
      window.sessionStorage.getItem(sessionKey) === 'true'

    try {
      const component = await factory()
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(sessionKey)
      }
      return component
    } catch (error) {
      // 若尚未重載過，執行一次強制頁面重新整理以載入最新版本的 index.html 與 chunk hashes
      if (!alreadyRefreshed && typeof window !== 'undefined') {
        window.sessionStorage.setItem(sessionKey, 'true')
        window.location.reload()
        return new Promise(() => {}) // 阻止後續拋錯，等待 reload 完成
      }
      throw error
    }
  })
}
