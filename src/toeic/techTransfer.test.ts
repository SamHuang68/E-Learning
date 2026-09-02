import { describe, it, expect } from 'vitest'
import { TECH_TRANSFER_SCENARIOS } from './data/techTransferDialogues'

describe('TOEIC Tech Transfer & Source Code Escrow Dialogue Integrity Tests', () => {
  it('contains structured Tech Transfer scenarios with audio scripts, roles, and questions', () => {
    expect(TECH_TRANSFER_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    TECH_TRANSFER_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.chiefLegalCounsel).toBeTruthy()
      expect(item.dialogueRoles.ipLicensingNegotiator).toBeTruthy()
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
      expect(item.techTransferKeywordsTipsJa).toBeTruthy()
    })
  })
})
