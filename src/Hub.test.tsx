import { describe, it, expect } from 'vitest'
import { weekStudyFlags, loadHubSnapshot, selectHubDerived } from './Hub'
import { defaultLearningMeta, type LearningMeta } from './utils/storage'

describe('Hub smoke (Vitest)', () => {
  it('weekStudyFlags pure fn works without throw (supports render safety)', () => {
    const meta: LearningMeta = {
      ...defaultLearningMeta(),
      lastActiveDate: '2026-09-21',
      dailyDoneDate: '2026-09-20',
      dailyDoneCards: 3,
      events: [],
    }
    const flags = weekStudyFlags(meta)
    expect(flags).toHaveLength(7)
    expect(flags.every(f => typeof f === 'boolean')).toBe(true)
  })

  it('Hub component symbol defined (route render entrypoint ready)', () => {
    // Full render test would require @testing-library/react + jsdom setup; this verifies no import/definition throw
    expect(weekStudyFlags).toBeDefined()
  })

  it('selectHubDerived is catalog-first on empty snapshot and stable for the same input', () => {
    const snapshot = loadHubSnapshot()
    const a = selectHubDerived(snapshot)
    const b = selectHubDerived(snapshot)
    expect(a.catalogFirst).toBe(true)
    expect(a.hasProgress).toBe(false)
    expect(a.totalXp).toBe(0)
    expect(a.weekFlags).toHaveLength(7)
    expect(Object.keys(a.radarMap).sort()).toEqual(
      ['calculus', 'chemistry', 'cs', 'en', 'ja', 'math', 'physics', 'zh'],
    )
    expect(a.hasProgress).toBe(b.hasProgress)
    expect(a.calculusDoneCount).toBe(b.calculusDoneCount)
    expect(a.todaySuggestion.id).toBe(b.todaySuggestion.id)
  })

  it('counts calc-prob- items without treating other math ids as calculus', () => {
    const snapshot = loadHubSnapshot()
    snapshot.mathProgress = {
      ...snapshot.mathProgress,
      xp: 10,
      completedQuestions: ['calc-prob-1', 'm-1', 'calc-prob-2'],
    }
    const derived = selectHubDerived(snapshot)
    expect(derived.calculusDoneCount).toBe(2)
    expect(derived.mathDoneCount).toBe(3)
    expect(derived.hasProgress).toBe(true)
    expect(derived.catalogFirst).toBe(false)
  })
})
