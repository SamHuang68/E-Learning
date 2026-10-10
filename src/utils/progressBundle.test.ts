import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { clearLocalProgressCache, exportProgressBundle, importProgressBundle } from './storage'
import { LOCAL_PREFERENCE_KEYS, PROGRESS_STORAGE_KEYS } from './progressKeys'
import { CS_CURRICULUM } from '../cs/data/curriculum'
import { CS_MOCK_EXAMS } from '../cs/data/mockExams'
import { CS_SOLVING_SIGNALS } from '../cs/data/solvingSignals'

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
  it.each([
    { rate: 0.7, shadow: false },
    { rate: 0.7, shadow: false, shadowLength: 'extended' },
  ])('語音偏好不隨進度匯出、匯入或清除：%j', (preference) => {
    const preferences = JSON.stringify(preference)
    localStorage.setItem(LOCAL_PREFERENCE_KEYS.audioLesson, preferences)
    const bundle = exportProgressBundle()
    expect(bundle).not.toHaveProperty('audioLesson')
    expect(JSON.stringify(bundle)).not.toContain(LOCAL_PREFERENCE_KEYS.audioLesson)
    clearLocalProgressCache()
    expect(localStorage.getItem(LOCAL_PREFERENCE_KEYS.audioLesson)).toBe(preferences)
    expect(importProgressBundle({ ...bundle, audioLesson: { rate: 0.95, shadow: true } })).toBe(true)
    expect(localStorage.getItem(LOCAL_PREFERENCE_KEYS.audioLesson)).toBe(preferences)
  })

  it('preserves absent CS storage through export and import', () => {
    const bundle = exportProgressBundle()
    expect(bundle.cs).toBeNull()
    expect(bundle.csSignals).toBeNull()

    expect(importProgressBundle(bundle)).toBe(true)
    expect(localStorage.getItem(PROGRESS_STORAGE_KEYS.cs)).toBeNull()
    expect(localStorage.getItem(PROGRESS_STORAGE_KEYS.csSignals)).toBeNull()
  })

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
    const cs = {
      completedQuestions: [CS_CURRICULUM[0].questions[0].id],
      xp: 77,
      errorQuestions: [],
      examScores: {},
      labCompleted: [],
      lastActiveDate: '2026-10-08',
    }
    const chinese = { xp: 88, masteredPinyin: ['zh'] }
    const mathSignals = { algebra: 'mastered' }
    const physicsSignals = { force: true }
    const chemistrySignals = { mole: true }
    const csSignals = { [CS_SOLVING_SIGNALS[0].id]: true }

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
    expect(bundle.version).toBe(5)
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

  it('canonicalizes dirty CS progress and signal data on import, storage, and export', () => {
    const questionId = CS_CURRICULUM[0].questions[0].id
    const mockQuestionId = CS_MOCK_EXAMS.midterm.questions[0].id
    const signalId = CS_SOLVING_SIGNALS[0].id
    const nonBooleanSignalId = CS_SOLVING_SIGNALS[1].id
    const bundle = exportProgressBundle()
    bundle.cs = {
      completedQuestions: [questionId, mockQuestionId, 'retired-question', questionId],
      xp: Number.POSITIVE_INFINITY,
      errorQuestions: [mockQuestionId, 'retired-question'],
      examScores: { [CS_MOCK_EXAMS.midterm.id]: 125, 'retired-exam': 90 },
      labCompleted: ['von-neumann', 'retired-lab'],
      lastActiveDate: 'not-a-date',
    }
    bundle.csSignals = {
      [signalId]: true,
      [nonBooleanSignalId]: 'false',
      'retired-signal': true,
    }

    expect(importProgressBundle(bundle)).toBe(true)

    const storedCs = parseStored(PROGRESS_STORAGE_KEYS.cs)
    const storedSignals = parseStored(PROGRESS_STORAGE_KEYS.csSignals)
    expect(storedCs).toEqual(expect.objectContaining({
      completedQuestions: [questionId],
      xp: 0,
      errorQuestions: [mockQuestionId],
      examScores: { [CS_MOCK_EXAMS.midterm.id]: 100 },
      labCompleted: ['von-neumann'],
    }))
    expect(storedSignals).toEqual({ [signalId]: true })
    expect(exportProgressBundle().cs).toEqual(storedCs)
    expect(exportProgressBundle().csSignals).toEqual(storedSignals)
  })

  it('does not clear stored CS data when an imported bundle omits optional CS fields', () => {
    const questionId = CS_CURRICULUM[0].questions[0].id
    const signalId = CS_SOLVING_SIGNALS[0].id
    const existingCs = {
      completedQuestions: [questionId],
      xp: 25,
      errorQuestions: [],
      examScores: {},
      labCompleted: [],
      lastActiveDate: '2026-10-08',
    }
    const existingSignals = { [signalId]: true }
    localStorage.setItem(PROGRESS_STORAGE_KEYS.cs, JSON.stringify(existingCs))
    localStorage.setItem(PROGRESS_STORAGE_KEYS.csSignals, JSON.stringify(existingSignals))
    const bundle = exportProgressBundle()
    bundle.cs = undefined
    bundle.csSignals = undefined

    expect(importProgressBundle(bundle)).toBe(true)
    expect(parseStored(PROGRESS_STORAGE_KEYS.cs)).toEqual(existingCs)
    expect(parseStored(PROGRESS_STORAGE_KEYS.csSignals)).toEqual(existingSignals)
  })
})
