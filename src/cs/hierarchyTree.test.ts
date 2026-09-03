import { describe, it, expect } from 'vitest'
import { CS_CURRICULUM, getAllCsUnits } from './data/curriculum'

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

  it('7 大分支總計包含 98 道高品質大考真題，每單元恰好 14 道', () => {
    const totalQuestions = CS_CURRICULUM.reduce((sum, u) => sum + u.questions.length, 0)
    expect(totalQuestions).toBe(98)

    for (const unit of CS_CURRICULUM) {
      expect(unit.questions.length).toBe(14)
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
    expect(questionIds.size).toBe(98)
  })
})
