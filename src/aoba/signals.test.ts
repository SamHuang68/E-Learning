import { describe, it, expect } from 'vitest'
import { JAPANESE_SIGNAL_GROUPS } from './data/grammarSignals'

describe('Japanese Grammar Signals Module', () => {
  it('should have groups for auxiliary verbs and giving/receiving', () => {
    expect(JAPANESE_SIGNAL_GROUPS.length).toBeGreaterThanOrEqual(2)
    const auxGroup = JAPANESE_SIGNAL_GROUPS.find((g) => g.id === 'auxiliary-verbs')
    expect(auxGroup).toBeDefined()
    expect(auxGroup?.signals.length).toBe(3)
  })

  it('each grammar signal should have trigger, 3-second rule, formula, example, pitfall and quiz', () => {
    JAPANESE_SIGNAL_GROUPS.forEach((group) => {
      group.signals.forEach((sig) => {
        expect(sig.pattern).toBeTruthy()
        expect(sig.signalTrigger).toBeTruthy()
        expect(sig.threeSecondRule).toBeTruthy()
        expect(sig.formula).toBeTruthy()
        expect(sig.contrastExample.ja).toBeTruthy()
        expect(sig.contrastExample.zh).toBeTruthy()
        expect(sig.pitfall.wrong).toBeTruthy()
        expect(sig.quiz.options.length).toBe(4)
        expect(sig.quiz.correctIndex).toBeGreaterThanOrEqual(0)
        expect(sig.quiz.correctIndex).toBeLessThan(4)
      })
    })
  })
})
