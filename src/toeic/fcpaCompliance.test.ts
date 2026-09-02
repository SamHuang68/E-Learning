import { describe, it, expect } from 'vitest'
import { FCPA_COMPLIANCE_SCENARIOS } from './data/fcpaComplianceDialogues'

describe('TOEIC Foreign Corrupt Practices Act FCPA & Compliance Dialogue Integrity Tests', () => {
  it('contains structured FCPA Compliance scenarios with audio scripts, roles, and questions', () => {
    expect(FCPA_COMPLIANCE_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    FCPA_COMPLIANCE_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.chiefComplianceOfficer).toBeTruthy()
      expect(item.dialogueRoles.regionalSalesDirector).toBeTruthy()
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
      expect(item.fcpaComplianceKeywordsTipsJa).toBeTruthy()
    })
  })
})
