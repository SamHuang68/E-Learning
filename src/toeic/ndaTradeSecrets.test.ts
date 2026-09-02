import { describe, it, expect } from 'vitest'
import { NDA_TRADE_SECRETS_SCENARIOS } from './data/ndaTradeSecretsDialogues'

describe('TOEIC Mutual NDA & Trade Secrets Protection Dialogue Integrity Tests', () => {
  it('contains structured NDA scenarios with audio scripts, roles, and questions', () => {
    expect(NDA_TRADE_SECRETS_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    NDA_TRADE_SECRETS_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.corporateLegalCounsel).toBeTruthy()
      expect(item.dialogueRoles.businessDevelopmentDirector).toBeTruthy()
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
      expect(item.ndaTradeSecretsKeywordsTipsJa).toBeTruthy()
    })
  })
})
