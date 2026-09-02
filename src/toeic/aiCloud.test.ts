import { describe, it, expect } from 'vitest'
import { AI_CLOUD_SCENARIOS } from './data/aiCloudDialogues'

describe('TOEIC AI Transformation & Cloud Infrastructure Dialogue Integrity Tests', () => {
  it('contains structured AI/Cloud scenarios with audio scripts, roles, and questions', () => {
    expect(AI_CLOUD_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    AI_CLOUD_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.chiefTechnologyOfficer).toBeTruthy()
      expect(item.dialogueRoles.infrastructureArchitect).toBeTruthy()
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
      expect(item.aiCloudKeywordsTipsJa).toBeTruthy()
    })
  })
})
