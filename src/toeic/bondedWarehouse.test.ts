import { describe, it, expect } from 'vitest'
import { BONDED_WAREHOUSE_SCENARIOS } from './data/bondedWarehouseDialogues'

describe('TOEIC Customs Clearance & Bonded Warehouse Dialogue Integrity Tests', () => {
  it('contains structured bonded warehouse & customs scenarios with audio scripts, roles, and questions', () => {
    expect(BONDED_WAREHOUSE_SCENARIOS.length).toBeGreaterThanOrEqual(1)
    BONDED_WAREHOUSE_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.targetAccent).toBeTruthy()
      expect(item.accentLabel).toBeTruthy()
      expect(item.audioScript).toBeTruthy()
      expect(item.dialogueRoles.importComplianceDirector).toBeTruthy()
      expect(item.dialogueRoles.customsBrokerageManager).toBeTruthy()
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
      expect(item.bondedWarehouseKeywordsTipsJa).toBeTruthy()
    })
  })
})
