import { describe, expect, it } from 'vitest'
import { estimateAbilityTheta } from '../engine/adaptive'
import {
  mergeCalculusResponses,
  mergeCalculusTheta,
  mergeFsrsMaps,
  mergeJsonRecords,
  mergeStringArray,
  mergeTrackProgress,
  responseIdentity,
  trackHasProgress,
} from './progressMerge'

describe('progressMerge', () => {
  it('unions completed questions and keeps the higher xp', () => {
    const merged = mergeTrackProgress(
      { xp: 20, completedQuestions: ['b'], errorQuestions: [] },
      { xp: 10, completedQuestions: ['a'], errorQuestions: ['a'] },
    )
    expect(merged.xp).toBe(20)
    expect(merged.completedQuestions).toEqual(expect.arrayContaining(['a', 'b']))
    expect(merged.errorQuestions).toEqual(['a'])
  })

  it('merges signal mastery without dropping either side', () => {
    const merged = mergeJsonRecords(
      { algebra: 'mastered', geometry: 'review' },
      { algebra: 'review', force: true },
    )
    expect(merged.algebra).toBe('mastered')
    expect(merged.geometry).toBe('review')
    expect(merged.force).toBe(true)
  })

  it('treats empty tracks as no progress', () => {
    expect(trackHasProgress({ xp: 0, completedQuestions: [] })).toBe(false)
    expect(trackHasProgress({ xp: 3 })).toBe(true)
  })

  it('unions string arrays without duplicates', () => {
    expect(mergeStringArray(['a', 'b'], ['b', 'c'])).toEqual(['a', 'b', 'c'])
  })

  it('keeps newer cloud FSRS and unions distinct calculus history instead of demoting by |θ|', () => {
    const localItem = {
      id: 'item-1',
      difficulty: 5,
      stability: 1,
      retrievability: 0.9,
      lastReview: '2026-09-01T00:00:00.000Z',
      dueAt: '2026-09-02T00:00:00.000Z',
      reps: 1,
      lapses: 0,
      state: 'learning',
    }
    const cloudItem = {
      ...localItem,
      lastReview: '2026-09-17T00:00:00.000Z',
      dueAt: '2026-09-24T00:00:00.000Z',
      reps: 3,
      state: 'review',
    }
    const localHist = {
      itemId: 'item-1',
      isCorrect: false,
      difficulty: 0.2,
      discrimination: 1.4,
      pseudoGuessing: 0.2,
    }
    const cloudHist = {
      itemId: 'item-1',
      isCorrect: true,
      difficulty: 0.2,
      discrimination: 1.4,
      pseudoGuessing: 0.2,
    }

    const merged = mergeTrackProgress(
      {
        xp: 4,
        calculusTheta: -2,
        calculusFsrs: { 'item-1': localItem },
        calculusResponses: [localHist],
      },
      {
        xp: 4,
        calculusTheta: 0.5,
        calculusFsrs: { 'item-1': cloudItem },
        calculusResponses: [cloudHist],
      },
    )

    const fsrs = merged.calculusFsrs as Record<string, { lastReview?: string; reps?: number }>
    expect(fsrs['item-1']?.lastReview).toBe('2026-09-17T00:00:00.000Z')
    expect(fsrs['item-1']?.reps).toBe(3)
    expect(merged.calculusResponses).toEqual(expect.arrayContaining([localHist, cloudHist]))
    expect(merged.calculusResponses).toHaveLength(2)
    expect(merged.calculusTheta).not.toBe(-2)
  })

  it('prefers FSRS lastReview over the local object on shared keys', () => {
    const merged = mergeFsrsMaps(
      { a: { lastReview: '2026-01-01T00:00:00.000Z', reps: 9 } },
      { a: { lastReview: '2026-06-01T00:00:00.000Z', reps: 2 } },
    )
    expect(merged.a).toMatchObject({ lastReview: '2026-06-01T00:00:00.000Z', reps: 2 })
  })

  it('unions distinct calculus responses of equal length', () => {
    expect(
      mergeCalculusResponses(
        [{ itemId: 'local', isCorrect: true }],
        [{ itemId: 'cloud', isCorrect: true }],
      ),
    ).toHaveLength(2)
  })

  it('Codex fixture: duplicate identical responses keep θ stable and do not double-count', () => {
    const sameAttempt = {
      itemId: 'item-1',
      isCorrect: true,
      difficulty: 0.2,
      discrimination: 1.4,
      pseudoGuessing: 0.2,
    }
    const storedTheta = 0.4
    const merged = mergeTrackProgress(
      { xp: 6, calculusTheta: storedTheta, calculusResponses: [sameAttempt] },
      { xp: 6, calculusTheta: storedTheta, calculusResponses: [sameAttempt] },
    )
    expect(merged.calculusResponses).toHaveLength(1)
    expect(merged.calculusTheta).toBe(storedTheta)
    const inflated = estimateAbilityTheta(
      [
        {
          itemId: 'item-1',
          isCorrect: true,
          difficulty: 0.2,
          discrimination: 1.4,
          pseudoGuessing: 0.2,
        },
      ],
      storedTheta,
    ).theta
    expect(inflated).toBeGreaterThan(storedTheta)
    expect(merged.calculusTheta).not.toBe(inflated)
  })

  it('keeps distinct event ids even when IRT fields stringify identically', () => {
    const body = {
      itemId: 'item-1',
      isCorrect: true,
      difficulty: 0.2,
      discrimination: 1.4,
      pseudoGuessing: 0.2,
    }
    const local = { ...body, id: 'evt-local', nonce: 'n1' }
    const cloud = { ...body, id: 'evt-cloud', nonce: 'n2' }
    expect(responseIdentity(local)).not.toBe(responseIdentity(cloud))
    const merged = mergeCalculusResponses([local], [cloud])
    expect(merged).toHaveLength(2)
    const theta = mergeCalculusTheta(
      { calculusTheta: 0.2, calculusResponses: [local] },
      { calculusTheta: 0.2, calculusResponses: [cloud] },
      { calculusResponses: merged },
    )
    expect(theta).not.toBe(0.2)
  })

  it('uses timestamp / nonce as distinct evidence when id is absent', () => {
    const body = {
      itemId: 'item-2',
      isCorrect: false,
      difficulty: -0.1,
      discrimination: 1.1,
      pseudoGuessing: 0.25,
    }
    const byTime = mergeCalculusResponses(
      [{ ...body, timestamp: '2026-09-01T00:00:00.000Z' }],
      [{ ...body, timestamp: '2026-09-02T00:00:00.000Z' }],
    )
    expect(byTime).toHaveLength(2)
    const byNonce = mergeCalculusResponses(
      [{ ...body, nonce: 'aaa' }],
      [{ ...body, nonce: 'bbb' }],
    )
    expect(byNonce).toHaveLength(2)
  })
})
