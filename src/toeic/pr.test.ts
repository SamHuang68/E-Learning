import { describe, it, expect } from 'vitest'
import { PR_SCENARIOS } from './data/prDialogues'

describe('TOEIC Public Relations & Press Release Dialogue Integrity Tests', () => {
  it('contains structured PR scenarios with audio scripts, roles, and questions', () => {
    expect(PR_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    PR_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.prDirector).toBeTruthy()
      expect(item.dialogueRoles.mediaRelationsManager).toBeTruthy()
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
      expect(item.prKeywordsTipsJa).toBeTruthy()
    })
  })
})
