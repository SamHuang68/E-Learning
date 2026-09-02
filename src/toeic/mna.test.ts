import { describe, it, expect } from 'vitest'
import { MNA_SCENARIOS } from './data/mnaDialogues'

describe('TOEIC Mergers & Acquisitions Dialogue Integrity Tests', () => {
  it('contains structured M&A scenarios with audio scripts, roles, and questions', () => {
    expect(MNA_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    MNA_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.managingPartner).toBeTruthy()
      expect(item.dialogueRoles.leadFinancialAuditor).toBeTruthy()
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
      expect(item.mnaKeywordsTipsJa).toBeTruthy()
    })
  })
})
