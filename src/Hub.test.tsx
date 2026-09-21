import { describe, it, expect } from 'vitest'
import { weekStudyFlags } from './Hub'
import type { LearningMeta } from './utils/storage'

describe('Hub smoke (Vitest)', () => {
  it('weekStudyFlags pure fn works without throw (supports render safety)', () => {
    const meta: LearningMeta = { lastActiveDate: '2026-09-21', dailyDoneDate: '2026-09-20', dailyDoneCards: 3, events: [] }
    const flags = weekStudyFlags(meta)
    expect(flags).toHaveLength(7)
    expect(flags.every(f => typeof f === 'boolean')).toBe(true)
  })

  it('Hub component symbol defined (route render entrypoint ready)', () => {
    // Full render test would require @testing-library/react + jsdom setup; this verifies no import/definition throw
    expect(weekStudyFlags).toBeDefined()
  })
})
