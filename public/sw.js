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

function assetPath(url) {
  try {
    return new URL(url, self.location.href).pathname
  } catch {
    return ''
  }
}

function isCodeAsset(url) {
  return /\.(?:js|mjs|css)$/i.test(assetPath(url))
}

function isHtmlBody(response) {
  const type = (response && response.headers.get('content-type')) || ''
  return type.toLowerCase().indexOf('text/html') !== -1
}

function canStore(url, response) {
  if (!response || !response.ok) return false
  if (isCodeAsset(url) && isHtmlBody(response)) return false
  return true
}

async function precacheUrl(cache, url) {
  try {
    const response = await fetch(url, { cache: 'no-store' })
    if (!canStore(url, response)) return
    await cache.put(url, response)
  } catch {
    // One missing file must not fail install and leave the previous worker in control.
  }
}
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      const response = await fetch(PRECACHE_MANIFEST, { cache: 'no-store' })
      if (!response.ok) throw new Error(`Precache manifest unavailable: ${response.status}`)
      const manifest = await response.json()
      const generatedAssets = Array.isArray(manifest.files) ? manifest.files : []
      const urls = [...new Set([...STATIC_ASSETS, PRECACHE_MANIFEST, ...generatedAssets])]
      await Promise.all(urls.map((url) => precacheUrl(cache, url)))
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
            .filter((key) => key.startsWith('e-learning-') && key !== CACHE_NAME)
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

  // 2. 靜態資源：快取優先。JS/CSS 若被回成 HTML（自訂網域的 200 後備頁），不存也不拿來執行。
  event.respondWith(
    caches.match(request, { ignoreVary: true }).then(async (cached) => {
      if (cached && canStore(request.url, cached)) return cached
      if (cached) {
        const stale = await caches.open(CACHE_NAME)
        await stale.delete(request)
      }
      const response = await fetch(request)
      if (canStore(request.url, response) && new URL(request.url).origin === self.location.origin) {
        const copy = response.clone()
        const cache = await caches.open(CACHE_NAME)
        await cache.put(request, copy)
      }
      if (isCodeAsset(request.url) && isHtmlBody(response)) {
        return new Response('', { status: 404, headers: { 'content-type': 'text/plain' } })
      }
      return response
    }),
  )
})
