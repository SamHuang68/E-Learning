const CACHE_NAME = 'e-learning-__PRECACHE_VERSION__'
const PRECACHE_MANIFEST = './precache-manifest.json'
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
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      const response = await fetch(PRECACHE_MANIFEST, { cache: 'no-store' })
      if (!response.ok) throw new Error(`Precache manifest unavailable: ${response.status}`)
      const manifest = await response.json()
      const generatedAssets = Array.isArray(manifest.files) ? manifest.files : []
      await cache.addAll([...new Set([...STATIC_ASSETS, PRECACHE_MANIFEST, ...generatedAssets])])
    })(),
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
        .catch(async () => (await caches.match(request)) || caches.match('./index.html')),
    )
    return
  }

  // 2. 靜態資源（JS/CSS/圖檔/音訊）：快取優先，並快取新抓取內容
  // 注意：若 JS 資源 404，嚴禁回退至 index.html（避免 HTML 當作 JS 解析引發語法錯誤）
  event.respondWith(
    // Vite preview/CDN responses may carry `Vary: Origin`. Module-script
    // requests include an Origin header while install-time cache.addAll
    // requests may not, so a strict Vary comparison can miss an otherwise
    // identical same-origin precache entry and break lazy routes offline.
    caches.match(request, { ignoreVary: true }).then((cached) => {
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
