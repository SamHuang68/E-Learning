import { describe, it, expect } from 'vitest'
import { LETTER_OF_CREDIT_SCENARIOS } from './data/letterOfCreditDialogues'

describe('TOEIC Documentary Letter of Credit & Discrepancies Dialogue Integrity Tests', () => {
  it('contains structured Letter of Credit scenarios with audio scripts, roles, and questions', () => {
    expect(LETTER_OF_CREDIT_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    LETTER_OF_CREDIT_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.tradeFinanceDirector).toBeTruthy()
      expect(item.dialogueRoles.documentaryCreditOfficer).toBeTruthy()
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
      expect(item.letterOfCreditKeywordsTipsJa).toBeTruthy()
    })
  })
})
