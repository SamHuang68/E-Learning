import { describe, it, expect } from 'vitest'
import { TOEIC_SOLVING_SIGNALS } from './data/solvingSignals'

describe('TOEIC 3-Second Solving Signals Tests', () => {
  it('should load solving signals with bilingual explanations', () => {
    expect(TOEIC_SOLVING_SIGNALS.length).toBeGreaterThanOrEqual(4)
    TOEIC_SOLVING_SIGNALS.forEach((sig) => {
      expect(sig.id).toBeTruthy()
      expect(sig.title).toBeTruthy()
      expect(sig.titleJa).toBeTruthy()
      expect(sig.threeSecondRule).toBeTruthy()
      expect(sig.threeSecondRuleJa).toBeTruthy()
      expect(sig.formula).toBeTruthy()
      expect(sig.exampleQuestion.question).toBeTruthy()
      expect(sig.exampleQuestion.options.length).toBe(4)
      expect(sig.exampleQuestion.correctIndex).toBeGreaterThanOrEqual(0)
      expect(sig.exampleQuestion.correctIndex).toBeLessThan(4)
      expect(sig.exampleQuestion.explanationZh).toBeTruthy()
      expect(sig.exampleQuestion.explanationJa).toBeTruthy()
    })
  })

  it('adds eight Part 5 grammar-trap explanations as teaching, not official ETS scores', () => {
    const trapIds = [
      'signal-sva-neither',
      'signal-adj-adv',
      'signal-parallel-not-only',
      'signal-relative-who-which',
      'signal-subjunctive-suggest',
      'signal-look-forward-to',
      'signal-so-such',
      'signal-for-since',
    ]
    expect(trapIds).toHaveLength(8)
    const traps = trapIds.map((id) => {
      const sig = TOEIC_SOLVING_SIGNALS.find((s) => s.id === id)
      expect(sig, id).toBeDefined()
      return sig!
    })
    traps.forEach((sig) => {
      expect(sig.category).toBe('Grammar')
      expect(sig.exampleQuestion.options.length).toBe(4)
      expect(sig.exampleQuestion.explanationZh).toMatch(/教學/)
      expect(sig.exampleQuestion.explanationZh).toMatch(/非正式 ETS/)
      expect(sig.exampleQuestion.explanationJa).toMatch(/学習用/)
      expect(sig.exampleQuestion.explanationJa).toMatch(/公式ETS/)
    })
    expect(TOEIC_SOLVING_SIGNALS.length).toBeGreaterThanOrEqual(12)
  })
})
