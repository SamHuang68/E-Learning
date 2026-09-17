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

function parseStored(key: string): unknown {
  return JSON.parse(localStorage.getItem(key) ?? 'null')
}

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
    expect(parseStored(PROGRESS_STORAGE_KEYS.math)).toEqual(math)
    expect(parseStored(PROGRESS_STORAGE_KEYS.physics)).toEqual(physics)
    expect(parseStored(PROGRESS_STORAGE_KEYS.chemistry)).toEqual(chemistry)
  })

  it('export → clear → import restores all eight tracks and signal mastery keys', () => {
    const math = { gradeId: 'g4', xp: 44 }
    const physics = { gradeId: 'g9', xp: 55 }
    const chemistry = { gradeId: 'g11', xp: 66 }
    const cs = { xp: 77, completedQuestions: ['q1'] }
    const chinese = { xp: 88, masteredPinyin: ['zh'] }
    const mathSignals = { algebra: 'mastered' }
    const physicsSignals = { force: true }
    const chemistrySignals = { mole: true }
    const csSignals = { cache: true }

    localStorage.setItem(PROGRESS_STORAGE_KEYS.math, JSON.stringify(math))
    localStorage.setItem(PROGRESS_STORAGE_KEYS.physics, JSON.stringify(physics))
    localStorage.setItem(PROGRESS_STORAGE_KEYS.chemistry, JSON.stringify(chemistry))
    localStorage.setItem(PROGRESS_STORAGE_KEYS.cs, JSON.stringify(cs))
    localStorage.setItem(PROGRESS_STORAGE_KEYS.chinese, JSON.stringify(chinese))
    localStorage.setItem(PROGRESS_STORAGE_KEYS.mathSignals, JSON.stringify(mathSignals))
    localStorage.setItem(PROGRESS_STORAGE_KEYS.physicsSignals, JSON.stringify(physicsSignals))
    localStorage.setItem(PROGRESS_STORAGE_KEYS.chemistrySignals, JSON.stringify(chemistrySignals))
    localStorage.setItem(PROGRESS_STORAGE_KEYS.csSignals, JSON.stringify(csSignals))
    localStorage.setItem(LOCAL_PREFERENCE_KEYS.accessibility, JSON.stringify({ fontSize: 'large' }))

    const bundle = exportProgressBundle()
    expect(bundle.version).toBe(4)
    expect(bundle.math).toEqual(math)
    expect(bundle.physics).toEqual(physics)
    expect(bundle.chemistry).toEqual(chemistry)
    expect(bundle.cs).toEqual(cs)
    expect(bundle.chinese).toEqual(chinese)
    expect(bundle.mathSignals).toEqual(mathSignals)
    expect(bundle.physicsSignals).toEqual(physicsSignals)
    expect(bundle.chemistrySignals).toEqual(chemistrySignals)
    expect(bundle.csSignals).toEqual(csSignals)
    expect(bundle.aoba).toBeDefined()
    expect(bundle.kana).toBeDefined()
    expect(bundle.toeic).toBeDefined()

    clearLocalProgressCache()
    expect(localStorage.getItem(PROGRESS_STORAGE_KEYS.math)).toBeNull()
    expect(localStorage.getItem(PROGRESS_STORAGE_KEYS.physics)).toBeNull()
    expect(localStorage.getItem(PROGRESS_STORAGE_KEYS.chemistry)).toBeNull()
    expect(localStorage.getItem(PROGRESS_STORAGE_KEYS.cs)).toBeNull()
    expect(localStorage.getItem(PROGRESS_STORAGE_KEYS.chinese)).toBeNull()
    expect(localStorage.getItem('chinese_learning_progress_v1')).toBeNull()
    expect(localStorage.getItem(PROGRESS_STORAGE_KEYS.mathSignals)).toBeNull()
    expect(localStorage.getItem(PROGRESS_STORAGE_KEYS.physicsSignals)).toBeNull()
    expect(localStorage.getItem(PROGRESS_STORAGE_KEYS.chemistrySignals)).toBeNull()
    expect(localStorage.getItem(PROGRESS_STORAGE_KEYS.csSignals)).toBeNull()
    expect(localStorage.getItem(LOCAL_PREFERENCE_KEYS.accessibility)).not.toBeNull()

    expect(importProgressBundle(bundle)).toBe(true)
    expect(parseStored(PROGRESS_STORAGE_KEYS.math)).toEqual(math)
    expect(parseStored(PROGRESS_STORAGE_KEYS.physics)).toEqual(physics)
    expect(parseStored(PROGRESS_STORAGE_KEYS.chemistry)).toEqual(chemistry)
    expect(parseStored(PROGRESS_STORAGE_KEYS.cs)).toEqual(cs)
    expect(parseStored(PROGRESS_STORAGE_KEYS.chinese)).toEqual(chinese)
    expect(parseStored(PROGRESS_STORAGE_KEYS.mathSignals)).toEqual(mathSignals)
    expect(parseStored(PROGRESS_STORAGE_KEYS.physicsSignals)).toEqual(physicsSignals)
    expect(parseStored(PROGRESS_STORAGE_KEYS.chemistrySignals)).toEqual(chemistrySignals)
    expect(parseStored(PROGRESS_STORAGE_KEYS.csSignals)).toEqual(csSignals)
  })
})
