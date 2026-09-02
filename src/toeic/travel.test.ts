import { describe, it, expect } from 'vitest'
import { TRAVEL_SCENARIOS } from './data/travelDialogues'

describe('TOEIC Business Travel & Flight Integrity Tests', () => {
  it('contains structured travel scenarios with audio scripts, roles, and questions', () => {
    expect(TRAVEL_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    TRAVEL_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.traveler).toBeTruthy()
      expect(item.dialogueRoles.agent).toBeTruthy()
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
      expect(item.businessExpenseTipsJa).toBeTruthy()
    })
  })
})
