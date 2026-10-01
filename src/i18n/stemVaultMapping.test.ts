import { describe, expect, it } from 'vitest'
import { getAllPhysicsUnits, PHYSICS_GRADES, type PhysicsQuestion } from '../physics/data/curriculum'
import { getAllChemistryUnits, CHEMISTRY_GRADES, type ChemistryQuestion } from '../chemistry/data/curriculum'
import { PHYSICS_MOCK_EXAMS } from '../physics/data/mockExams'
import { CHEMISTRY_MOCK_EXAMS } from '../chemistry/data/mockExams'
import { findMatchingSignal, PHYSICS_VAULT_SIGNALS } from '../physics/utils/vaultSignal'
import { findMatchingChemistrySignal, CHEMISTRY_VAULT_SIGNALS } from '../chemistry/utils/vaultSignal'

describe('錯題庫訊號與主軸回歸', () => {
  it('G7 直尺題及 G10 單位測量屬於力學基礎，不借用光電效應訊號', () => {
    for (const key of ['g7_u1', 'g10_u1']) {
      const unit = getAllPhysicsUnits().find(unit => unit.key === key)!
      expect(unit.strand).toBe('mechanics')
      for (const q of unit.questions) {
        expect(q.strand).toBe('mechanics')
        expect(findMatchingSignal(q)).toBeUndefined()
      }
    }
    expect(getAllPhysicsUnits()[0].questions[0].hint).toContain('最小刻度')
  })

  it('濾紙層析題保留物質結構主軸，不借用結晶訊號', () => {
    const q = getAllChemistryUnits().flatMap(unit => unit.questions).find(q => q.id === 'g10_u1_q1')!
    expect(q.strand).toBe('matter_structure')
    expect(q.title).toContain('層析')
    expect(findMatchingChemistrySignal(q)).toBeUndefined()
    expect(q.hint).toContain('R_f')
  })

  it('全部物理題只使用逐題核對的訊號，學段及主軸一致', () => {
    const questions: Array<{ q: PhysicsQuestion; stage: string }> = [
      ...Object.values(PHYSICS_GRADES).flatMap(g => g.units.flatMap(u => u.questions.map(q => ({ q, stage: g.stage })))),
      ...Object.values(PHYSICS_MOCK_EXAMS).flatMap(e => e.questions.map(q => ({ q, stage: e.id === 'cap' ? 'junior' : 'senior' }))),
    ]
    const seen = new Set<string>()
    for (const { q, stage } of questions) {
      const signal = findMatchingSignal(q)
      if (signal) {
        expect(signal.id, q.id).toBe(PHYSICS_VAULT_SIGNALS[q.id])
        expect(signal.strand, q.id).toBe(q.strand)
        expect(signal.stage, q.id).toBe(stage)
        seen.add(q.id)
      } else expect(PHYSICS_VAULT_SIGNALS[q.id], q.id).toBeUndefined()
      expect(findMatchingSignal({ ...q, id: 'unreviewed-question' }), q.id).toBeUndefined()
      expect(findMatchingSignal({ ...q, strand: q.strand === 'modern' ? 'mechanics' : 'modern' }), q.id).toBeUndefined()
    }
    expect([...seen].sort()).toEqual(Object.keys(PHYSICS_VAULT_SIGNALS).sort())
  })

  it('全部化學題只使用逐題核對的訊號，學段及主軸一致', () => {
    const questions: Array<{ q: ChemistryQuestion; stage: string }> = [
      ...Object.values(CHEMISTRY_GRADES).flatMap(g => g.units.flatMap(u => u.questions.map(q => ({ q, stage: g.stage })))),
      ...Object.values(CHEMISTRY_MOCK_EXAMS).flatMap(e => e.questions.map(q => ({ q, stage: e.id === 'cap' ? 'junior' : 'senior' }))),
    ]
    const seen = new Set<string>()
    for (const { q, stage } of questions) {
      const signal = findMatchingChemistrySignal(q)
      if (signal) {
        expect(signal.id, q.id).toBe(CHEMISTRY_VAULT_SIGNALS[q.id])
        expect(signal.strand, q.id).toBe(q.strand)
        expect(signal.stage, q.id).toBe(stage)
        seen.add(q.id)
      } else expect(CHEMISTRY_VAULT_SIGNALS[q.id], q.id).toBeUndefined()
      expect(findMatchingChemistrySignal({ ...q, id: 'unreviewed-question' }), q.id).toBeUndefined()
      expect(findMatchingChemistrySignal({ ...q, strand: q.strand === 'organic' ? 'reactions' : 'organic' }), q.id).toBeUndefined()
    }
    expect([...seen].sort()).toEqual(Object.keys(CHEMISTRY_VAULT_SIGNALS).sort())
  })
})
