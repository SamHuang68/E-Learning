import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { loadLang, saveLang, type AppView } from '../../utils/storage'

describe('Strict Review Gate: E2E Route & View State Machine Invariants', () => {
  const originalWindow = globalThis.window
  const originalLocalStorage = globalThis.localStorage

  let currentHash = ''
  let storedLang: string | null = null

  beforeEach(() => {
    currentHash = ''
    storedLang = null

    const mockStorage = {
      getItem: (key: string) => {
        if (key === 'e-learning-lang') return storedLang
        return null
      },
      setItem: (key: string, value: string) => {
        if (key === 'e-learning-lang') storedLang = value
      },
      removeItem: (key: string) => {
        if (key === 'e-learning-lang') storedLang = null
      },
      clear: () => {
        storedLang = null
      },
      length: 0,
      key: () => null,
    }

    const mockWindow = {
      location: {
        get hash() {
          return currentHash ? `#${currentHash}` : ''
        },
        set hash(val: string) {
          currentHash = val.replace('#', '')
        },
      },
      dispatchEvent: () => true,
      addEventListener: () => {},
      removeEventListener: () => {},
    }

    Object.defineProperty(globalThis, 'window', {
      value: mockWindow,
      writable: true,
      configurable: true,
    })

    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    })
  })

  const ALL_TRACKS: Array<{ view: AppView; expectedHash: string; label: string }> = [
    { view: 'physics', expectedHash: 'physics', label: '臺灣物理 (國中+高中)' },
    { view: 'chemistry', expectedHash: 'chemistry', label: '臺灣化學 (國中+高中)' },
    { view: 'math', expectedHash: 'math', label: '臺灣數學 (K-12)' },
    { view: 'calculus', expectedHash: 'calculus', label: '微積分互動專題' },
    { view: 'ja', expectedHash: 'aoba', label: 'あおば日本語' },
    { view: 'en', expectedHash: 'toeic', label: 'TOEIC 多益英語' },
    { view: 'zh', expectedHash: 'zh', label: '台湾華語・繁體中文' },
    { view: 'hub', expectedHash: 'hub', label: '統一學習主頁 (Hub)' },
  ]

  ALL_TRACKS.forEach(({ view, expectedHash, label }) => {
    it(`[GATE-ROUTE] clicking/selecting ${label} (${view}) maps strictly to #${expectedHash} and resolves to ${view}`, () => {
      saveLang(view)
      expect(currentHash, `Hash for ${label} must be ${expectedHash}`).toBe(expectedHash)
      expect(storedLang, `Stored lang for ${label} must be ${view}`).toBe(view)

      const resolved = loadLang()
      expect(resolved, `loadLang() when hash is #${expectedHash} must resolve to ${view}`).toBe(view)
    })
  })

  it('[GATE-ROUTE-ISOLATION] cross-track switching never leaks across tracks', () => {
    saveLang('physics')
    expect(loadLang()).toBe('physics')

    saveLang('chemistry')
    expect(loadLang()).toBe('chemistry')

    saveLang('math')
    expect(loadLang()).toBe('math')

    saveLang('calculus')
    expect(loadLang()).toBe('calculus')

    saveLang('ja')
    expect(loadLang()).toBe('ja')

    saveLang('en')
    expect(loadLang()).toBe('en')

    saveLang('zh')
    expect(loadLang()).toBe('zh')

    saveLang('physics')
    expect(loadLang()).toBe('physics')
  })
})
