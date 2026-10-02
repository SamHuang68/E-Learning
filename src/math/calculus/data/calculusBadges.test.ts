import { beforeEach, describe, expect, it } from 'vitest'
import { defaultMathProgress, loadMathProgress, recordMathAnswer, saveMathProgress } from '../../utils/mathStorage'
import { AVAILABLE_CALCULUS_BADGES, getEarnedCalculusBadges } from './calculusBadges'

describe('calculus badges from persisted correct answers', () => {
  beforeEach(() => saveMathProgress(defaultMathProgress()))

  it('keeps unavailable badges out of the earned total', () => {
    expect(AVAILABLE_CALCULUS_BADGES.map((badge) => badge.id)).toEqual([
      'badge-calc-tangent-seeker', 'badge-calc-riemann-master', 'badge-calc-newton-hunter',
    ])
    expect(getEarnedCalculusBadges([])).toEqual([])
  })

  it.each([
    ['calc-prob-l1-tangent', 'badge-calc-tangent-seeker'],
    ['calc-prob-l2-riemann', 'badge-calc-riemann-master'],
    ['calc-prob-l4-newton', 'badge-calc-newton-hunter'],
    ['calc-prob-l5-prod1', 'badge-calc-tangent-seeker'],
    ['calc-prob-series5', 'badge-calc-riemann-master'],
  ])('restores %s according to the actual mode-based award rule', (question, expectedBadge) => {
    recordMathAnswer(question, true, 15)
    expect(getEarnedCalculusBadges(loadMathProgress().completedQuestions).map((badge) => badge.id)).toEqual([expectedBadge])
    expect(loadMathProgress().xp).toBe(15)
  })

  it('does not unlock on an incorrect answer or an unrelated completed item', () => {
    recordMathAnswer('calc-prob-l1-tangent', false, 15)
    recordMathAnswer('calc-prob-l3-box-opt', true, 15)
    recordMathAnswer('unknown-id', true, 15)
    expect(getEarnedCalculusBadges(loadMathProgress().completedQuestions)).toEqual([])
  })

  it('retains earned badges after subsequent mistakes and deduplicates repeated answers', () => {
    recordMathAnswer('calc-prob-l1-tangent', true, 15)
    recordMathAnswer('calc-prob-l1-tangent', false, 15)
    expect(getEarnedCalculusBadges(loadMathProgress().completedQuestions)).toHaveLength(1)
    recordMathAnswer('calc-prob-l1-tangent', true, 15)
    expect(getEarnedCalculusBadges(loadMathProgress().completedQuestions)).toHaveLength(1)
    expect(loadMathProgress().xp).toBe(30)
  })

  it('restores all available badges without creating new storage fields or granting retroactive XP', () => {
    saveMathProgress({ ...defaultMathProgress(), completedQuestions: [
      'calc-prob-l1-tangent', 'calc-prob-l2-riemann', 'calc-prob-l4-newton',
    ], xp: 45 })
    expect(getEarnedCalculusBadges(loadMathProgress().completedQuestions)).toEqual(AVAILABLE_CALCULUS_BADGES)
    expect(loadMathProgress().xp).toBe(45)
  })
})
