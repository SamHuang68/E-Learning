import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { clearLocalProgressCache, exportProgressBundle, importProgressBundle } from './storage'
import { LOCAL_PREFERENCE_KEYS, PROGRESS_STORAGE_KEYS } from './progressKeys'

class MemoryStorage {
  private store = new Map<string, string>()
  get length() { return this.store.size }
  key(index: number) { return Array.from(this.store.keys())[index] ?? null }
  getItem(key: string) { return this.store.get(key) ?? null }
  setItem(key: string, value: string) { this.store.set(key, String(value)) }
  removeItem(key: string) { this.store.delete(key) }
  clear() { this.store.clear() }
}

const originalLocalStorage = globalThis.localStorage
const originalWindow = globalThis.window

beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: new MemoryStorage(),
    configurable: true,
  })
  Object.defineProperty(globalThis, 'window', {
    value: { location: { hash: '' }, dispatchEvent: () => true },
    configurable: true,
  })
})

afterEach(() => {
  Object.defineProperty(globalThis, 'localStorage', { value: originalLocalStorage, configurable: true })
  Object.defineProperty(globalThis, 'window', { value: originalWindow, configurable: true })
})

describe('progress bundle', () => {
  it('round-trips canonical STEM keys and clears all learner progress', () => {
    const math = { gradeId: 'g4', xp: 44 }
    const physics = { gradeId: 'g9', xp: 55 }
    const chemistry = { gradeId: 'g11', xp: 66 }
    localStorage.setItem(PROGRESS_STORAGE_KEYS.math, JSON.stringify(math))
    localStorage.setItem(PROGRESS_STORAGE_KEYS.physics, JSON.stringify(physics))
    localStorage.setItem(PROGRESS_STORAGE_KEYS.chemistry, JSON.stringify(chemistry))
    localStorage.setItem(PROGRESS_STORAGE_KEYS.mathSignals, JSON.stringify({ algebra: 'mastered' }))
    localStorage.setItem(LOCAL_PREFERENCE_KEYS.accessibility, JSON.stringify({ fontSize: 'large' }))

    const bundle = exportProgressBundle()
    expect(bundle.math).toEqual(math)
    expect(bundle.physics).toEqual(physics)
    expect(bundle.chemistry).toEqual(chemistry)

    clearLocalProgressCache()
    expect(localStorage.getItem(PROGRESS_STORAGE_KEYS.math)).toBeNull()
    expect(localStorage.getItem(PROGRESS_STORAGE_KEYS.physics)).toBeNull()
    expect(localStorage.getItem(PROGRESS_STORAGE_KEYS.chemistry)).toBeNull()
    expect(localStorage.getItem(PROGRESS_STORAGE_KEYS.mathSignals)).toBeNull()
    expect(localStorage.getItem(LOCAL_PREFERENCE_KEYS.accessibility)).not.toBeNull()

    expect(importProgressBundle(bundle)).toBe(true)
    expect(JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEYS.math) ?? 'null')).toEqual(math)
    expect(JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEYS.physics) ?? 'null')).toEqual(physics)
    expect(JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEYS.chemistry) ?? 'null')).toEqual(chemistry)
  })
})
