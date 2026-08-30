import { describe, it, expect } from 'vitest'
import {
  calculateRetrievability,
  calculateNextInterval,
  defaultFsrsItemState,
  reviewFsrsItem,
  isFsrsDue,
  migrateSm2ToFsrs,
} from './fsrs'

describe('FSRS (Free Spaced Repetition Scheduler) Engine', () => {
  it('calculates retrievability decaying over time following power law', () => {
    const stability = 10 // S = 10 天
    const r0 = calculateRetrievability(0, stability)
    const r5 = calculateRetrievability(5, stability)
    const r10 = calculateRetrievability(10, stability)
    const r30 = calculateRetrievability(30, stability)

    expect(r0).toBe(1.0)
    expect(r5).toBeLessThan(r0)
    expect(r10).toBeLessThan(r5)
    expect(r30).toBeLessThan(r10)
    expect(r10).toBeGreaterThan(0.7) // 10 天時保留率約 80%~90%
  })

  it('calculates next interval based on target retention', () => {
    const s10 = 10
    const i90 = calculateNextInterval(s10, 0.9)
    const i80 = calculateNextInterval(s10, 0.8)

    // 目標保留率越低，允許的間隔時間越長
    expect(i80).toBeGreaterThan(i90)
    expect(i90).toBeGreaterThanOrEqual(1)
  })

  it('handles first learning session properly', () => {
    const item = defaultFsrsItemState('card-1')
    const reviewed = reviewFsrsItem(item, 'good')

    expect(reviewed.reps).toBe(1)
    expect(reviewed.stability).toBeGreaterThan(0)
    expect(reviewed.state).toBe('review')
    expect(reviewed.lapses).toBe(0)
    expect(isFsrsDue(reviewed)).toBe(false)
  })

  it('handles forget (again) by increasing lapses and decreasing stability', () => {
    const item = defaultFsrsItemState('card-2')
    const learned = reviewFsrsItem(item, 'good')
    const forgotten = reviewFsrsItem(learned, 'again')

    expect(forgotten.lapses).toBe(1)
    expect(forgotten.state).toBe('relearning')
    expect(forgotten.difficulty).toBeGreaterThan(learned.difficulty)
  })

  it('rewards easy grade with higher stability than hard grade', () => {
    const item = defaultFsrsItemState('card-3')
    const learned = reviewFsrsItem(item, 'good')

    const hardReviewed = reviewFsrsItem(learned, 'hard')
    const easyReviewed = reviewFsrsItem(learned, 'easy')

    expect(easyReviewed.stability).toBeGreaterThan(hardReviewed.stability)
    expect(easyReviewed.difficulty).toBeLessThan(hardReviewed.difficulty)
  })

  it('smoothly migrates SM-2 ItemState to FSRS', () => {
    const sm2Item = {
      id: 'sm2-card',
      ease: 2.5,
      intervalDays: 7,
      dueAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      seen: 5,
      lapses: 1,
    }

    const fsrs = migrateSm2ToFsrs(sm2Item)
    expect(fsrs.id).toBe('sm2-card')
    expect(fsrs.difficulty).toBeCloseTo(5.0, 1)
    expect(fsrs.stability).toBe(7)
    expect(fsrs.reps).toBe(5)
    expect(fsrs.lapses).toBe(1)
    expect(fsrs.state).toBe('review')
  })
})
