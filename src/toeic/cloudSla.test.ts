import { describe, it, expect } from 'vitest'
import { CLOUD_SLA_SCENARIOS } from './data/cloudSlaDialogues'

describe('TOEIC Enterprise Cloud SLA & Service Credits Dialogue Integrity Tests', () => {
  it('contains structured Cloud SLA scenarios with audio scripts, roles, and questions', () => {
    expect(CLOUD_SLA_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    CLOUD_SLA_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.chiefInformationOfficer).toBeTruthy()
      expect(item.dialogueRoles.cloudAccountExecutive).toBeTruthy()
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
      expect(item.cloudSlaKeywordsTipsJa).toBeTruthy()
    })
  })
})
