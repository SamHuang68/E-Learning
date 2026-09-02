import { describe, it, expect } from 'vitest'
import { INTERVIEW_SCENARIOS } from './data/interviewDialogues'

describe('TOEIC Job Interview & HR Dialogue Integrity Tests', () => {
  it('contains structured interview scenarios with audio scripts, roles, and questions', () => {
    expect(INTERVIEW_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    INTERVIEW_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.interviewer).toBeTruthy()
      expect(item.dialogueRoles.candidate).toBeTruthy()
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
      expect(item.hrKeywordsTipsJa).toBeTruthy()
    })
  })
})
