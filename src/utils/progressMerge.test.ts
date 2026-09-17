import { describe, expect, it } from 'vitest'
import {
  mergeJsonRecords,
  mergeStringArray,
  mergeTrackProgress,
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
})
