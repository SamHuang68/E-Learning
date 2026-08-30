import { describe, it, expect } from 'vitest'
import { MATH_SOLVING_SIGNALS } from './data/solvingSignals'

describe('Math Solving Signals Module', () => {
  it('should cover elementary, junior, and senior stages', () => {
    const stages = new Set(MATH_SOLVING_SIGNALS.map((s) => s.stage))
    expect(stages.has('elementary')).toBe(true)
    expect(stages.has('junior')).toBe(true)
    expect(stages.has('senior')).toBe(true)
  })

  it('each math signal should have problemSignal, threeSecondRule, and firstStepFormula', () => {
    MATH_SOLVING_SIGNALS.forEach((sig) => {
      expect(sig.id).toBeTruthy()
      expect(sig.topic).toBeTruthy()
      expect(sig.problemSignal).toBeTruthy()
      expect(sig.threeSecondRule).toBeTruthy()
      expect(sig.firstStepFormula).toBeTruthy()
      expect(sig.exampleProblem.question).toBeTruthy()
      expect(sig.exampleProblem.quickSolve).toBeTruthy()
    })
  })
})
