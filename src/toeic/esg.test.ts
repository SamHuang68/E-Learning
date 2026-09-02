import { describe, it, expect } from 'vitest'
import { ESG_SCENARIOS } from './data/esgDialogues'

describe('TOEIC ESG & Carbon Accounting Dialogue Integrity Tests', () => {
  it('contains structured ESG scenarios with audio scripts, roles, and questions', () => {
    expect(ESG_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    ESG_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.chiefSustainabilityOfficer).toBeTruthy()
      expect(item.dialogueRoles.supplyChainDecarbonizationLead).toBeTruthy()
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
      expect(item.esgKeywordsTipsJa).toBeTruthy()
    })
  })
})
