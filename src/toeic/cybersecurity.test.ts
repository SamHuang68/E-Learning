import { describe, it, expect } from 'vitest'
import { CYBERSECURITY_SCENARIOS } from './data/cybersecurityDialogues'

describe('TOEIC Cybersecurity & IT Maintenance Dialogue Integrity Tests', () => {
  it('contains structured cybersecurity scenarios with audio scripts, roles, and questions', () => {
    expect(CYBERSECURITY_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    CYBERSECURITY_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.chiefSecurityOfficer).toBeTruthy()
      expect(item.dialogueRoles.networkAdmin).toBeTruthy()
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
      expect(item.itKeywordsTipsJa).toBeTruthy()
    })
  })
})
