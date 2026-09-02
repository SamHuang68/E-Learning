import { describe, it, expect } from 'vitest'
import { COLD_CHAIN_SCENARIOS } from './data/coldChainDialogues'

describe('TOEIC Air Freight & Cold Chain Logistics Dialogue Integrity Tests', () => {
  it('contains structured cold chain air freight scenarios with audio scripts, roles, and questions', () => {
    expect(COLD_CHAIN_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    COLD_CHAIN_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.freightOperationsDirector).toBeTruthy()
      expect(item.dialogueRoles.coldChainLogisticsManager).toBeTruthy()
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
      expect(item.coldChainKeywordsTipsJa).toBeTruthy()
    })
  })
})
