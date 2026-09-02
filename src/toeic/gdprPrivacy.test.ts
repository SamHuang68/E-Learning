import { describe, it, expect } from 'vitest'
import { GDPR_PRIVACY_SCENARIOS } from './data/gdprPrivacyDialogues'

describe('TOEIC GDPR & International Data Privacy Dialogue Integrity Tests', () => {
  it('contains structured GDPR scenarios with audio scripts, roles, and questions', () => {
    expect(GDPR_PRIVACY_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    GDPR_PRIVACY_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.dataProtectionOfficer).toBeTruthy()
      expect(item.dialogueRoles.cloudInfrastructureDirector).toBeTruthy()
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
      expect(item.gdprPrivacyKeywordsTipsJa).toBeTruthy()
    })
  })
})
