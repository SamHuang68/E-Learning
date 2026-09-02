import { describe, it, expect } from 'vitest'
import { PHONE_SCENARIOS } from './data/phoneDialogues'

describe('TOEIC Phone & Voicemail Dialogue Integrity Tests', () => {
  it('contains structured voicemail scenarios with audio scripts and questions', () => {
    expect(PHONE_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    PHONE_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.callerName).toBeTruthy()
      expect(item.callerCompany).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
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
    })
  })
})
