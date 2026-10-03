import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { describe, expect, it, vi } from 'vitest'

const origin = 'https://example.test'
const scope = origin + '/E-Learning/'
const buildId = '0123456789abcdef'
const currentCache = 'e-learning-' + buildId
const previousCache = 'e-learning-previous'
const workerSource = readFileSync('public/sw.js', 'utf8')
  .replaceAll('__PRECACHE_VERSION__', buildId)
const shell = [
  './', './index.html', './favicon.svg', './icons.svg',
  './manifest.webmanifest', './srs-review.html', './content/manifest.json',
]
type RequestLike = { url: string; method: string; mode: string }
type Input = string | RequestLike
type WorkerEvent = {
  request?: RequestLike
  waitUntil: (promise: Promise<unknown>) => void
  respondWith?: (promise: Promise<Response>) => void
}
type Options = {
  files?: string[]
  network?: (url: string) => Response | undefined | Promise<Response | undefined>
  failPut?: (url: string) => boolean
  failOpen?: boolean
  failRead?: boolean
}

function createWorker(options: Options = {}) {
  const key = (input: Input) => new URL(typeof input === 'string' ? input : input.url, scope).href
  const stores = new Map<string, Map<string, Response>>([
    [previousCache, new Map([[key('./index.html'), new Response('previous offline shell')]])],
    ['other-app-cache', new Map()],
  ])
  const files = options.files ?? ['./assets/main.js', './assets/PhysicsApp.js']
  const manifest = { version: 1, buildId, files }
  const operations: string[] = []
  const handlers = new Map<string, (event: WorkerEvent) => void>()
  const put = vi.fn(async (name: string, input: Input, response: Response) => {
    if (options.failPut?.(key(input))) throw new DOMException('Storage full', 'QuotaExceededError')
    stores.get(name)!.set(key(input), response.clone())
  })
  const removeEntry = vi.fn(async (name: string, input: Input) => stores.get(name)!.delete(key(input)))
  const cacheStorage = {
    open: vi.fn(async (name: string) => {
      if (options.failOpen) throw new Error('Storage unavailable')
      if (!stores.has(name)) stores.set(name, new Map())
      return {
        put: (input: Input, response: Response) => put(name, input, response),
        delete: (input: Input) => removeEntry(name, input),
      }
    }),
    keys: vi.fn(async () => [...stores.keys()]),
    delete: vi.fn(async (name: string) => {
      operations.push('delete:' + name)
      return stores.delete(name)
    }),
    match: vi.fn(async (input: Input) => {
      if (options.failRead) throw new Error('Storage unavailable')
      for (const entries of stores.values()) {
        const response = entries.get(key(input))
        if (response) return response.clone()
      }
      return undefined
    }),
  }
  const fetch = vi.fn(async (input: Input) => {
    const override = await options.network?.(key(input))
    if (override) return override
    if (key(input) === key('./precache-manifest.json')) {
      return new Response(JSON.stringify(manifest), { headers: { 'content-type': 'application/json' } })
    }
    return new Response('network: ' + key(input))
  })
  let readyAtSkip: string[] = []
  const self = {
    location: { href: scope + 'sw.js', origin },
    addEventListener: (type: string, listener: (event: WorkerEvent) => void) => handlers.set(type, listener),
    skipWaiting: vi.fn(async () => {
      readyAtSkip = [...(stores.get(currentCache)?.keys() ?? [])]
      operations.push('skipWaiting')
    }),
    clients: { claim: vi.fn(async () => { operations.push('claim') }) },
  }
  runInNewContext(workerSource, { self, caches: cacheStorage, fetch, URL, Response, Promise, Set, Error }, {
    filename: 'public/sw.js',
  })
  async function lifecycle(type: 'install' | 'activate') {
    const promises: Promise<unknown>[] = []
    handlers.get(type)!({ waitUntil: (promise) => { promises.push(promise) } })
    await Promise.all(promises)
  }
  async function request(url: string, mode = 'cors', method = 'GET') {
    const promises: Promise<unknown>[] = []
    let responsePromise: Promise<Response> | undefined
    handlers.get('fetch')!({
      request: { url: key(url), mode, method },
      waitUntil: (promise) => { promises.push(promise) },
      respondWith: (promise) => { responsePromise = promise },
    })
    const response = await responsePromise
    await Promise.all(promises)
    return response
  }
  return {
    key, stores, put, removeEntry, cacheStorage, fetch, self, operations,
    readyAtSkip: () => readyAtSkip,
    install: () => lifecycle('install'),
    activate: () => lifecycle('activate'),
    request,
  }
}

describe('service worker storage resilience', () => {
  it('delivers a successful network script even when runtime cache.put exceeds quota', async () => {
    const worker = createWorker({ failPut: () => true })
    const response = await worker.request('./assets/new-route.js')
    expect(response?.status).toBe(200)
    expect(await response?.text()).toBe('network: ' + scope + 'assets/new-route.js')
    expect(worker.put).toHaveBeenCalledOnce()
  })

  it('catches navigation cache writes without losing the successful page response', async () => {
    const worker = createWorker({ failPut: () => true })
    const response = await worker.request('./?entry=bookmark', 'navigate')
    expect(response?.status).toBe(200)
    expect(await response?.text()).toBe('network: ' + scope + '?entry=bookmark')
    expect(worker.put).toHaveBeenCalledOnce()
  })

  it('can serve the network when CacheStorage cannot be read or opened', async () => {
    const worker = createWorker({ failRead: true, failOpen: true })
    const response = await worker.request('./assets/new-route.js')
    expect(response?.status).toBe(200)
    expect(await response?.text()).toContain('network:')
  })

  it.each(['network', 'http', 'json', 'files', 'build'] as const)(
    'keeps the previous worker cache when the manifest fails (%s)',
    async (failure) => {
      const worker = createWorker({
        network: (url) => {
          if (!url.endsWith('/precache-manifest.json')) return undefined
          if (failure === 'network') throw new TypeError('Offline')
          if (failure === 'http') return new Response('', { status: 503 })
          if (failure === 'json') return new Response('not JSON')
          return new Response(JSON.stringify({
            version: 1,
            buildId: failure === 'build' ? 'different-build' : buildId,
            files: failure === 'files' ? [] : ['./assets/main.js'],
          }))
        },
      })
      await expect(worker.install()).rejects.toThrow()
      expect(worker.stores.has(previousCache)).toBe(true)
      expect(worker.stores.has(currentCache)).toBe(false)
      expect(worker.cacheStorage.delete).not.toHaveBeenCalledWith(previousCache)
      expect(worker.self.skipWaiting).not.toHaveBeenCalled()
      expect(worker.self.clients.claim).not.toHaveBeenCalled()
    },
  )

  it.each(['network', 'http', 'html', 'quota'] as const)(
    'rejects an incomplete precache and retains the previous cache (%s)',
    async (failure) => {
      const worker = createWorker({
        failPut: (url) => failure === 'quota' && url.endsWith('/assets/main.js'),
        network: (url) => {
          if (!url.endsWith('/assets/main.js')) return undefined
          if (failure === 'network') throw new TypeError('Offline')
          if (failure === 'http') return new Response('', { status: 404 })
          if (failure === 'html') return new Response('<html>Fallback</html>', {
            headers: { 'content-type': 'text/html' },
          })
          return undefined
        },
      })
      await expect(worker.install()).rejects.toThrow()
      expect(worker.stores.has(previousCache)).toBe(true)
      expect(worker.stores.has(currentCache)).toBe(false)
      expect(worker.cacheStorage.delete).not.toHaveBeenCalledWith(previousCache)
      expect(worker.self.skipWaiting).not.toHaveBeenCalled()
      expect(worker.self.clients.claim).not.toHaveBeenCalled()
    },
  )

  it('waits for every required resource before taking over, then deletes only prior app caches', async () => {
    let release!: () => void
    let requested!: () => void
    const blocked = new Promise<void>((resolve) => { release = resolve })
    const requestStarted = new Promise<void>((resolve) => { requested = resolve })
    const worker = createWorker({
      network: async (url) => {
        if (url.endsWith('/assets/PhysicsApp.js')) {
          requested()
          await blocked
        }
        return undefined
      },
    })
    const install = worker.install()
    await requestStarted
    expect(worker.self.skipWaiting).not.toHaveBeenCalled()
    expect(worker.stores.has(previousCache)).toBe(true)
    release()
    await install
    expect(worker.self.skipWaiting).toHaveBeenCalledOnce()
    expect(worker.readyAtSkip().sort()).toEqual([
      ...shell, './precache-manifest.json', './assets/main.js', './assets/PhysicsApp.js',
    ].map(worker.key).sort())
    expect(worker.stores.has(previousCache)).toBe(true)
    expect(worker.fetch.mock.calls.filter(([input]) => worker.key(input).endsWith('/precache-manifest.json'))).toHaveLength(1)
    await worker.activate()
    expect(worker.stores.has(previousCache)).toBe(false)
    expect(worker.stores.has(currentCache)).toBe(true)
    expect(worker.stores.has('other-app-cache')).toBe(true)
    expect(worker.operations.at(-1)).toBe('claim')
    expect(worker.self.clients.claim).toHaveBeenCalledOnce()
  })

  it('bounds parallel precache downloads while still caching the complete manifest', async () => {
    let active = 0
    let peak = 0
    const files = Array.from({ length: 25 }, (_, index) => './assets/course-' + index + '.js')
    const worker = createWorker({
      files,
      network: async (url) => {
        if (url.endsWith('/precache-manifest.json')) return undefined
        active += 1
        peak = Math.max(peak, active)
        await Promise.resolve()
        active -= 1
        return undefined
      },
    })
    await worker.install()
    expect(peak).toBeGreaterThan(1)
    expect(peak).toBeLessThanOrEqual(8)
    for (const file of files) expect(worker.stores.get(currentCache)?.has(worker.key(file))).toBe(true)
    expect(worker.self.skipWaiting).toHaveBeenCalledOnce()
  })

  it.each([false, true])('retains navigation offline fallback (exact cached page: %s)', async (exact) => {
    const worker = createWorker({ network: () => { throw new TypeError('Offline') } })
    const url = './?saved=lesson'
    if (exact) worker.stores.get(previousCache)!.set(worker.key(url), new Response('saved page'))
    const response = await worker.request(url, 'navigate')
    expect(await response?.text()).toBe(exact ? 'saved page' : 'previous offline shell')
  })

  it.each(['js', 'mjs', 'css'])('rejects network HTML masquerading as a %s asset', async (extension) => {
    const worker = createWorker({
      network: () => new Response('<html>Fallback</html>', { headers: { 'content-type': 'text/html' } }),
    })
    const response = await worker.request('./assets/missing.' + extension + '?v=2')
    expect(response?.status).toBe(404)
    expect(await response?.text()).toBe('')
    expect(worker.put).not.toHaveBeenCalled()
  })

  it('discards a cached HTML code response and fetches usable code', async () => {
    const worker = createWorker()
    const url = './assets/app.js'
    worker.stores.set(currentCache, new Map([[worker.key(url), new Response('<html>Fallback</html>', {
      headers: { 'content-type': 'text/html' },
    })]]))
    const response = await worker.request(url)
    expect(await response?.text()).toBe('network: ' + worker.key(url))
    expect(worker.removeEntry).toHaveBeenCalledWith(currentCache, expect.objectContaining({ url: worker.key(url) }))
  })

  it('keeps non-GET requests outside the worker and does not cache cross-origin responses', async () => {
    const worker = createWorker()
    expect(await worker.request('./save', 'cors', 'POST')).toBeUndefined()
    expect(worker.fetch).not.toHaveBeenCalled()
    const response = await worker.request('https://external.test/data.json')
    expect(response?.status).toBe(200)
    expect(worker.put).not.toHaveBeenCalled()
  })
})
