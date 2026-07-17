import { describe, expect, it } from 'vitest'
import {
  buildDailyQueue,
  defaultItemState,
  getDueItems,
  reviewItem,
  type ItemState,
} from './srs'

const now = new Date('2026-07-17T12:00:00.000Z')

function state(overrides: Partial<ItemState> = {}): ItemState {
  return {
    ...defaultItemState('card-1'),
    ...overrides,
  }
}

describe('reviewItem', () => {
  it('applies again, hard, good, and easy scheduling rules', () => {
    const again = reviewItem(
      state({ intervalDays: 5, correctStreak: 3, seen: 2, lapses: 1 }),
      'again',
      now,
    )
    expect(again.intervalDays).toBeCloseTo(0.01)
    expect(again.ease).toBeCloseTo(2.3)
    expect(again.correctStreak).toBe(0)
    expect(again.lapses).toBe(2)
    expect(again.seen).toBe(3)
    expect(again.lastResult).toBe('again')

    const hard = reviewItem(state({ intervalDays: 10 }), 'hard', now)
    expect(hard.intervalDays).toBeCloseTo(12)
    expect(hard.ease).toBeCloseTo(2.35)
    expect(hard.correctStreak).toBe(0)

    const goodFirst = reviewItem(state(), 'good', now)
    expect(goodFirst.intervalDays).toBe(1)
    expect(goodFirst.correctStreak).toBe(1)
    expect(goodFirst.ease).toBe(2.5)

    const goodSecond = reviewItem(goodFirst, 'good', now)
    expect(goodSecond.intervalDays).toBe(3)
    expect(goodSecond.correctStreak).toBe(2)

    const goodLater = reviewItem(goodSecond, 'good', now)
    expect(goodLater.intervalDays).toBeCloseTo(7.5)
    expect(goodLater.correctStreak).toBe(3)

    const easyFirst = reviewItem(state(), 'easy', now)
    expect(easyFirst.intervalDays).toBe(2)
    expect(easyFirst.ease).toBeCloseTo(2.65)
    expect(easyFirst.correctStreak).toBe(1)

    const easyLater = reviewItem(easyFirst, 'easy', now)
    expect(easyLater.intervalDays).toBeCloseTo(6.89)
    expect(easyLater.ease).toBeCloseTo(2.8)
    expect(easyLater.correctStreak).toBe(2)
  })
})

describe('daily queue helpers', () => {
  it('sorts due reviews and fills new item ids within limits', () => {
    const olderDue = state({
      id: 'review-old',
      dueAt: '2026-07-16T12:00:00.000Z',
    })
    const newerDue = state({
      id: 'review-new',
      dueAt: '2026-07-17T11:00:00.000Z',
    })
    const future = state({
      id: 'future',
      dueAt: '2026-07-18T12:00:00.000Z',
    })
    const items = {
      'review-new': newerDue,
      future,
      'review-old': olderDue,
    }

    expect(getDueItems(items, now).map((item) => item.id)).toEqual([
      'review-old',
      'review-new',
    ])

    const queue = buildDailyQueue({
      allIds: ['review-old', 'new-1', 'future', 'new-2', 'new-3'],
      items,
      reviewLimit: 1,
      newLimit: 2,
      now,
    })

    expect(queue).toEqual({
      reviews: ['review-old'],
      news: ['new-1', 'new-2'],
      queue: ['review-old', 'new-1', 'new-2'],
    })
  })
})
