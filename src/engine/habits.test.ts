import { describe, it, expect } from 'vitest'
import { todayKey, nextStreak, computeDueReviewSummary } from './habits'

describe('Smart Study Habits & Retention Reminder Tests', () => {
  it('formats todayKey as YYYY-MM-DD', () => {
    const key = todayKey(new Date('2026-09-02T08:00:00Z'))
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('calculates next streaks correctly for consecutive days', () => {
    expect(nextStreak(3, '2026-09-01', '2026-09-02')).toBe(4)
    expect(nextStreak(5, '2026-09-02', '2026-09-02')).toBe(5)
    expect(nextStreak(5, '2026-08-20', '2026-09-02')).toBe(1)
  })

  it('computes due review items accurately with urgency levels', () => {
    const mockItems = {
      card1: { due: '2026-09-01T00:00:00Z', repetitions: 2 },
      card2: { due: '2026-09-02T00:00:00Z', repetitions: 3 },
      card3: { due: '2026-09-10T00:00:00Z', repetitions: 5 },
    }
    const result = computeDueReviewSummary(mockItems, new Date('2026-09-02T12:00:00Z'))
    expect(result.dueCount).toBe(2)
    expect(result.freshCount).toBe(1)
    expect(result.totalCount).toBe(3)
    expect(result.urgencyLevel).toBe('low')
  })
})
