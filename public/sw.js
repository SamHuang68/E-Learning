const CACHE_NAME = 'e-learning-v4'
const STATIC_ASSETS = [
  './',
  './index.html',
  './favicon.svg',
  './icons.svg',
  './manifest.webmanifest',
  './srs-review.html',
  './content/manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch(() => undefined),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  // 1. Navigation 頁面跳轉請求：優先從網路獲取最新 HTML，離線時回退至快取 index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => caches.match('./index.html')),
    )
    return
  }

  // 2. 靜態資源（JS/CSS/圖檔/音訊）：快取優先，並快取新抓取內容
  // 注意：若 JS 資源 404，嚴禁回退至 index.html（避免 HTML 當作 JS 解析引發語法錯誤）
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        if (response.ok && new URL(request.url).origin === self.location.origin) {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, copy)
          })
        }
        return response
      })
    }),
  )
})
