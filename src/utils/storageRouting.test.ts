import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { saveLang, loadLang } from './storage'

describe('Track Hash Routing and Storage Verification Gate', () => {
  const originalWindow = globalThis.window
  const originalLocalStorage = globalThis.localStorage

  beforeEach(() => {
    const store = new Map<string, string>()
    const mockStorage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
      length: 0,
      key: () => null,
    }

    const mockWindow = {
      location: {
        hash: '',
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

  it('routes physics correctly without falling back to Japanese', () => {
    saveLang('physics')
    expect(window.location.hash).toBe('physics')
    expect(loadLang()).toBe('physics')
  })

  it('routes chemistry correctly without falling back to Japanese', () => {
    saveLang('chemistry')
    expect(window.location.hash).toBe('chemistry')
    expect(loadLang()).toBe('chemistry')
  })

  it('routes math correctly', () => {
    saveLang('math')
    expect(window.location.hash).toBe('math')
    expect(loadLang()).toBe('math')
  })

  it('routes calculus correctly', () => {
    saveLang('calculus')
    expect(window.location.hash).toBe('calculus')
    expect(loadLang()).toBe('calculus')
  })

  it('routes ja to #aoba and loads ja', () => {
    saveLang('ja')
    expect(window.location.hash).toBe('aoba')
    expect(loadLang()).toBe('ja')
  })

  it('routes en to #toeic and loads en', () => {
    saveLang('en')
    expect(window.location.hash).toBe('toeic')
    expect(loadLang()).toBe('en')
  })

  it('routes hub to #hub and loads hub', () => {
    saveLang('hub')
    expect(window.location.hash).toBe('hub')
    expect(loadLang()).toBe('hub')
  })
})
