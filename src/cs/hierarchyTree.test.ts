import { describe, it, expect } from 'vitest'
import { CS_CURRICULUM, getAllCsUnits, getNextCsUnit, isCsAdvancedUnit } from './data/curriculum'

describe('計算機概論：知識階層樹架構與一頁全景整合單元測試', () => {
  it('全域課綱體系精確包含 7 大知識主幹分支', () => {
    const units = getAllCsUnits()
    expect(units.length).toBe(7)
    expect(units.map((u) => u.id)).toEqual([
      'cs-unit-1-foundation',
      'cs-unit-2-von-neumann',
      'cs-unit-3-digital-logic',
      'cs-unit-4-operating-systems',
      'cs-unit-5-networking',
      'cs-unit-6-ai-hardware',
      'cs-unit-7-frontier-ai-models',
    ])
  })

  it('7 大分支總計包含 112 道高品質大考真題，每單元恰好 16 道', () => {
    const totalQuestions = CS_CURRICULUM.reduce((sum, u) => sum + u.questions.length, 0)
    expect(totalQuestions).toBe(112)

    for (const unit of CS_CURRICULUM) {
      expect(unit.questions.length).toBe(16)
      expect(unit.concepts.length).toBeGreaterThanOrEqual(4)
    }
  })

  it('所有單元皆擁有唯一的識別碼與合法的題目結構', () => {
    const questionIds = new Set<string>()
    for (const unit of CS_CURRICULUM) {
      for (const q of unit.questions) {
        expect(questionIds.has(q.id)).toBe(false)
        questionIds.add(q.id)
        if (q.options) {
          expect(q.options.length).toBe(4)
        }
        expect(q.answer).toBeGreaterThanOrEqual(0)
        expect(q.answer).toBeLessThan(4)
        expect(q.solution.length).toBeGreaterThanOrEqual(2)
      }
    }
    expect(questionIds.size).toBe(112)
  })

  it('default path stays on core units and marks AI units as advanced', () => {
    expect(getNextCsUnit([]).id).toBe('cs-unit-1-foundation')
    const unit1Done = CS_CURRICULUM[0].questions.map((q) => q.id)
    expect(getNextCsUnit(unit1Done).id).toBe('cs-unit-2-von-neumann')
    expect(CS_CURRICULUM.filter(isCsAdvancedUnit).map((u) => u.id)).toEqual([
      'cs-unit-6-ai-hardware',
      'cs-unit-7-frontier-ai-models',
    ])
    const allCoreDone = CS_CURRICULUM.filter((unit) => !isCsAdvancedUnit(unit)).flatMap((unit) =>
      unit.questions.map((q) => q.id),
    )
    expect(isCsAdvancedUnit(getNextCsUnit(allCoreDone))).toBe(false)
  })
})
