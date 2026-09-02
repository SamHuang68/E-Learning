import { describe, it, expect } from 'vitest'
import { FORCE_MAJEURE_SCENARIOS } from './data/forceMajeureDialogues'

describe('TOEIC Force Majeure & Insurance Claims Dialogue Integrity Tests', () => {
  it('contains structured Force Majeure scenarios with audio scripts, roles, and questions', () => {
    expect(FORCE_MAJEURE_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    FORCE_MAJEURE_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.corporateRiskOfficer).toBeTruthy()
      expect(item.dialogueRoles.insuranceClaimsAdjuster).toBeTruthy()
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
      expect(item.forceMajeureKeywordsTipsJa).toBeTruthy()
    })
  })
})
