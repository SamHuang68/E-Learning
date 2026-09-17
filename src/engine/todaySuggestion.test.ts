import { describe, expect, it } from 'vitest'
import { dueCountBySrsItems, pickTodaySuggestion } from './todaySuggestion'

describe('pickTodaySuggestion', () => {
  it('prefers due reviews over an incomplete first unit', () => {
    const suggestion = pickTodaySuggestion({
      preferred: 'math',
      dueByTrack: { en: 3, ja: 1 },
      hasProgress: true,
    })
    expect(suggestion.id).toBe('en')
    expect(suggestion.reasonKey).toBe('due')
    expect(suggestion.dueCount).toBe(3)
    expect(suggestion.reason).toContain('到期複習')
  })

  it('resumes the last track instead of shoving math then calculus', () => {
    const suggestion = pickTodaySuggestion({
      preferred: 'physics',
      dueByTrack: {},
      hasProgress: true,
    })
    expect(suggestion.id).toBe('physics')
    expect(suggestion.reasonKey).toBe('resume')
    expect(suggestion.reason).toBe('繼續上次軌道')
  })

  it('uses catalog start only when there is no last track and no due reviews', () => {
    const suggestion = pickTodaySuggestion({
      preferred: null,
      dueByTrack: {},
      hasProgress: false,
    })
    expect(suggestion.id).toBe('math')
    expect(suggestion.reasonKey).toBe('catalog')
    expect(suggestion.reason).toContain('目錄起點')
  })
})

describe('dueCountBySrsItems', () => {
  it('counts only overdue ja/en/zh keys', () => {
    const now = new Date('2026-09-17T12:00:00.000Z')
    const counts = dueCountBySrsItems(
      {
        'ja:card-1': { id: 'ja:card-1', dueAt: '2026-09-16T00:00:00.000Z' },
        'en:card-1': { id: 'en:card-1', dueAt: '2026-09-18T00:00:00.000Z' },
        'other': { id: 'misc', dueAt: '2026-09-01T00:00:00.000Z' },
      },
      now,
    )
    expect(counts.ja).toBe(1)
    expect(counts.en).toBeUndefined()
  })
})
