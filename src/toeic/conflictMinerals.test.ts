import { describe, it, expect } from 'vitest'
import { CONFLICT_MINERALS_SCENARIOS } from './data/conflictMineralsDialogues'

describe('TOEIC Conflict Minerals & Labor Standards Dialogue Integrity Tests', () => {
  it('contains structured Conflict Minerals scenarios with audio scripts, roles, and questions', () => {
    expect(CONFLICT_MINERALS_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    CONFLICT_MINERALS_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.procurementDirector).toBeTruthy()
      expect(item.dialogueRoles.esgAuditLead).toBeTruthy()
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
      expect(item.conflictMineralsKeywordsTipsJa).toBeTruthy()
    })
  })
})
