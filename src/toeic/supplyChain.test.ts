import { describe, it, expect } from 'vitest'
import { SUPPLY_CHAIN_SCENARIOS } from './data/supplyChainDialogues'

describe('TOEIC Supply Chain & Logistics Dialogue Integrity Tests', () => {
  it('contains structured supply chain scenarios with audio scripts, roles, and questions', () => {
    expect(SUPPLY_CHAIN_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    SUPPLY_CHAIN_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.logisticsManager).toBeTruthy()
      expect(item.dialogueRoles.procurementLead).toBeTruthy()
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
      expect(item.supplyChainKeywordsTipsJa).toBeTruthy()
    })
  })
})
