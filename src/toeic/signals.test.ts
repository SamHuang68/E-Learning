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
})
