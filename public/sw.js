const CACHE_NAME = 'e-learning-__PRECACHE_VERSION__'
const PRECACHE_MANIFEST = './precache-manifest.json'
const PRECACHE_CONCURRENCY = 8
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
  const response = await fetch(url, { cache: 'no-store' })
  if (!canStore(url, response)) throw new Error(`Required precache resource unavailable: ${url}`)
  await cache.put(url, response)
}

async function precacheUrls(cache, urls) {
  for (let offset = 0; offset < urls.length; offset += PRECACHE_CONCURRENCY) {
    // Finish the current writes before cleaning up a failed candidate cache.
    const results = await Promise.allSettled(
      urls.slice(offset, offset + PRECACHE_CONCURRENCY).map((url) => precacheUrl(cache, url)),
    )
    const failure = results.find((result) => result.status === 'rejected')
    if (failure) throw failure.reason
  }
}

// Runtime caching is optional: a storage failure must not discard a good response.
async function cacheRuntimeResponse(request, response) {
  try {
    const cache = await caches.open(CACHE_NAME)
    await cache.put(request, response)
  } catch {
    // The network response remains available even when storage is unavailable.
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME)
        const response = await fetch(PRECACHE_MANIFEST, { cache: 'no-store' })
        if (!response.ok) throw new Error(`Precache manifest unavailable: ${response.status}`)
        const manifest = await response.clone().json()
        if (
          manifest.version !== 1 ||
          CACHE_NAME !== `e-learning-${manifest.buildId}` ||
          !Array.isArray(manifest.files) ||
          manifest.files.length === 0 ||
          manifest.files.some((file) => typeof file !== 'string' || file.length === 0)
        ) {
          throw new Error('Invalid precache manifest')
        }
        // Cache the exact manifest used for this install, not a second network copy.
        await cache.put(PRECACHE_MANIFEST, response)
        const urls = [...new Set([...STATIC_ASSETS, ...manifest.files])]
        await precacheUrls(cache, urls)
        await self.skipWaiting()
      } catch (error) {
        // A failed install leaves the previous worker and its complete cache intact.
        await caches.delete(CACHE_NAME).catch(() => undefined)
        throw error
      }
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((key) => key.startsWith('e-learning-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      )
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  // Navigation remains network-first, with the previous offline shell as fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            event.waitUntil(cacheRuntimeResponse(request, response.clone()))
          }
          return response
        })
        .catch(async () => (await caches.match(request)) || caches.match('./index.html')),
    )
    return
  }

  // Never serve or store an HTML fallback as executable JavaScript or CSS.
  event.respondWith(
    caches.match(request, { ignoreVary: true }).catch(() => undefined).then(async (cached) => {
      if (cached && canStore(request.url, cached)) return cached
      if (cached) {
        try {
          const stale = await caches.open(CACHE_NAME)
          await stale.delete(request)
        } catch {
          // A stale-cache cleanup failure must not block the network request.
        }
      }
      const response = await fetch(request)
      if (canStore(request.url, response) && new URL(request.url).origin === self.location.origin) {
        await cacheRuntimeResponse(request, response.clone())
      }
      if (isCodeAsset(request.url) && isHtmlBody(response)) {
        return new Response('', { status: 404, headers: { 'content-type': 'text/plain' } })
      }
      return response
    }),
  )
})
