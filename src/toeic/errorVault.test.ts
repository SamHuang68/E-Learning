import { describe, it, expect } from 'vitest'
import { TOEIC_SOLVING_SIGNALS } from './data/solvingSignals'

describe('TOEIC Error Vault Data Integrity Tests', () => {
  it('should match signals by id for error diagnosis', () => {
    const errorIds = ['signal-causative', 'signal-preposition-gerund']
    const matched = TOEIC_SOLVING_SIGNALS.filter((s) => errorIds.includes(s.id))
    expect(matched.length).toBe(2)
    expect(matched[0].id).toBe('signal-causative')
    expect(matched[1].id).toBe('signal-preposition-gerund')
  })
})
