import { describe, it, expect } from 'vitest'
import { MARKETING_SCENARIOS } from './data/marketingDialogues'

describe('TOEIC Marketing & PR Campaign Integrity Tests', () => {
  it('contains structured marketing scenarios with audio scripts, roles, and questions', () => {
    expect(MARKETING_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    MARKETING_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.marketingDirector).toBeTruthy()
      expect(item.dialogueRoles.brandSpecialist).toBeTruthy()
      expect(item.questions.length).toBeGreaterThan(0)
      item.questions.forEach((q) => {
        expect(q.id).toBeTruthy()
        expect(q.question).toBeTruthy()
        expect(q.options.length).toBe(4)
        expect(q.correctIndex).toBeGreaterThanOrEqual(0)
        expect(q.correctIndex).toBeLessThan(4)
        expect(q.explanationZh).toBeTruthy()
        expect(q.explanationJa).toBeTruthy()
      })
      expect(item.marketingKeywordsTipsJa).toBeTruthy()
    })
  })
})
