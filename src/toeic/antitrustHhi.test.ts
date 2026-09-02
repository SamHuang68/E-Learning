import { describe, it, expect } from 'vitest'
import { ANTITRUST_HHI_SCENARIOS } from './data/antitrustHhiDialogues'

describe('TOEIC Antitrust HHI & Merger Review Dialogue Integrity Tests', () => {
  it('contains structured Antitrust HHI scenarios with audio scripts, roles, and questions', () => {
    expect(ANTITRUST_HHI_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    ANTITRUST_HHI_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.chiefLegalCounsel).toBeTruthy()
      expect(item.dialogueRoles.seniorAntitrustEconomist).toBeTruthy()
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
      expect(item.antitrustHhiKeywordsTipsJa).toBeTruthy()
    })
  })
})
