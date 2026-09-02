import { describe, it, expect } from 'vitest'
import { ROYALTY_AUDIT_SCENARIOS } from './data/royaltyAuditDialogues'

describe('TOEIC Patent Royalty Audit & Forensic Accounting Dialogue Integrity Tests', () => {
  it('contains structured Royalty Audit scenarios with audio scripts, roles, and questions', () => {
    expect(ROYALTY_AUDIT_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    ROYALTY_AUDIT_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.intellectualPropertyLicensingDirector).toBeTruthy()
      expect(item.dialogueRoles.seniorAuditPartner).toBeTruthy()
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
      expect(item.royaltyAuditKeywordsTipsJa).toBeTruthy()
    })
  })
})
