import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { defaultMathProgress, loadMathProgress, saveMathProgress } from './mathStorage'
import { defaultFsrsItemState } from '../../engine/fsrs'

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

describe('calculus coordinator persistence on math progress', () => {
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

  it('round-trips calculus theta and FSRS map with the math store', () => {
    const fsrs = {
      'calc-prob-1': { ...defaultFsrsItemState('calc-prob-1'), reps: 2, dueAt: new Date().toISOString() },
    }
    saveMathProgress({
      ...defaultMathProgress(),
      xp: 15,
      completedQuestions: ['calc-prob-1'],
      calculusTheta: 0.42,
      calculusFsrs: fsrs,
      calculusResponses: [
        {
          itemId: 'calc-prob-1',
          isCorrect: true,
          difficulty: 0.5,
          discrimination: 1.4,
          pseudoGuessing: 0.2,
          responseTimeSec: 6,
        },
      ],
    })

    const loaded = loadMathProgress()
    expect(loaded.calculusTheta).toBe(0.42)
    expect(loaded.calculusFsrs?.['calc-prob-1']?.reps).toBe(2)
    expect(loaded.calculusResponses).toHaveLength(1)
    expect(loaded.completedQuestions).toEqual(['calc-prob-1'])
  })
})
