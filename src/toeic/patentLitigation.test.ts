import { describe, it, expect } from 'vitest'
import { PATENT_LITIGATION_SCENARIOS } from './data/patentLitigationDialogues'

describe('TOEIC Patent Litigation & Injunction Dialogue Integrity Tests', () => {
  it('contains structured Patent Litigation scenarios with audio scripts, roles, and questions', () => {
    expect(PATENT_LITIGATION_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    PATENT_LITIGATION_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.chiefLegalOfficer).toBeTruthy()
      expect(item.dialogueRoles.ipLitigationPartner).toBeTruthy()
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
      expect(item.patentLitigationKeywordsTipsJa).toBeTruthy()
    })
  })
})
