import { describe, it, expect } from 'vitest'
import { MARINE_INSURANCE_SCENARIOS } from './data/marineInsuranceDialogues'

describe('TOEIC Marine Cargo Insurance & General Average Dialogue Integrity Tests', () => {
  it('contains structured Marine Insurance scenarios with audio scripts, roles, and questions', () => {
    expect(MARINE_INSURANCE_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    MARINE_INSURANCE_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.maritimeClaimsDirector).toBeTruthy()
      expect(item.dialogueRoles.freightLogisticsManager).toBeTruthy()
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
      expect(item.marineInsuranceKeywordsTipsJa).toBeTruthy()
    })
  })
})
