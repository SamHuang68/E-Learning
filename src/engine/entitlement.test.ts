import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defaultLearningMeta, loadLearningMeta } from '../utils/storage'
import { canAccessUnit, isPro, unlockPro } from './entitlement'

function installStorage() {
  const store = new Map<string, string>()
  const storage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
    key: (index: number) => [...store.keys()][index] ?? null,
    get length() {
      return store.size
    },
  }
  vi.stubGlobal('localStorage', storage)
}

describe('entitlement', () => {
  beforeEach(() => {
    installStorage()
  })

  it('recognizes pro status', () => {
    expect(isPro({ ...defaultLearningMeta(), proUnlocked: false })).toBe(false)
    expect(isPro({ ...defaultLearningMeta(), proUnlocked: true })).toBe(true)
  })

  it('allows only the requested free Japanese and English tiers', () => {
    const meta = defaultLearningMeta()

    expect(canAccessUnit(meta, 'ja', 'kana')).toBe(true)
    expect(canAccessUnit(meta, 'ja', 'n5n4', 1)).toBe(true)
    expect(canAccessUnit(meta, 'ja', 'n5n4', 2)).toBe(true)
    expect(canAccessUnit(meta, 'ja', 'n5n4', 3)).toBe(false)
    expect(canAccessUnit(meta, 'ja', 'n3', 1)).toBe(false)

    expect(canAccessUnit(meta, 'en', 'phonics')).toBe(true)
    expect(canAccessUnit(meta, 'en', 'orange', 1)).toBe(true)
    expect(canAccessUnit(meta, 'en', 'orange', 2)).toBe(true)
    expect(canAccessUnit(meta, 'en', 'orange', 3)).toBe(false)
    expect(canAccessUnit(meta, 'en', 'blue', 1)).toBe(false)
  })

  it('unlocks pro with the demo code or an empty demo code', () => {
    expect(unlockPro('WRONG')).toBe(false)
    expect(loadLearningMeta().proUnlocked).toBe(false)

    expect(unlockPro('AOBA-PRO')).toBe(true)
    expect(loadLearningMeta().proUnlocked).toBe(true)

    localStorage.clear()
    expect(unlockPro('')).toBe(true)
    expect(loadLearningMeta().proUnlocked).toBe(true)
  })
})
