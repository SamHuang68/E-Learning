import { describe, expect, it } from 'vitest'
import {
  PHYSICS_GRADES,
  physicsFormulaSheetSections,
  type PhysicsQuestion,
} from '../data/curriculum'
import { PHYSICS_MOCK_EXAMS } from '../data/mockExams'
import { PHYSICS_SOLVING_SIGNALS } from '../data/solvingSignals'
import {
  localizePhysicsFormulaSections,
  localizePhysicsGrade,
  localizePhysicsMockExam,
  localizePhysicsQuestion,
  localizePhysicsSignal,
} from './content'

const HAN = /[\u3400-\u9fff\uf900-\ufaff]/

function assertEnglishTree(value: unknown, path = 'root'): void {
  if (typeof value === 'string') {
    expect(value.trim(), path).not.toBe('')
    expect(value, path).not.toMatch(HAN)
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertEnglishTree(item, `${path}[${index}]`))
    return
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => assertEnglishTree(item, `${path}.${key}`))
  }
}

describe('physics English curriculum coverage', () => {
  it('localizes every grade, unit, question, concept, and lab without Han fallback', () => {
    const rawGrades = Object.values(PHYSICS_GRADES)
    const localized = rawGrades.map((grade) => localizePhysicsGrade(grade, 'en'))
    expect(localized).toHaveLength(6)
    expect(localized.flatMap((grade) => grade.units)).toHaveLength(30)
    expect(localized.flatMap((grade) => grade.units.flatMap((unit) => unit.questions))).toHaveLength(31)
    expect(localized.flatMap((grade) => grade.units.flatMap((unit) => unit.concepts))).toHaveLength(80)
    expect(localized.flatMap((grade) => grade.labs)).toHaveLength(30)
    assertEnglishTree(localized, 'grades')

    localized.forEach((grade, gradeIndex) => {
      const rawGrade = rawGrades[gradeIndex]
      expect(grade.id).toBe(rawGrade.id)
      grade.units.forEach((unit, unitIndex) => {
        const rawUnit = rawGrade.units[unitIndex]
        expect(unit.key).toBe(rawUnit.key)
        expect(unit.suggestedLab).toBe(rawUnit.suggestedLab)
        unit.questions.forEach((question, questionIndex) => {
          const raw = rawUnit.questions[questionIndex]
          expect(question.id).toBe(raw.id)
          expect(question.answer).toEqual(raw.answer)
          expect(question.type).toBe(raw.type)
          expect(question.strand).toBe(raw.strand)
        })
      })
    })
  })

  it('localizes all mock exams and preserves their grading contract', () => {
    const raw = Object.values(PHYSICS_MOCK_EXAMS)
    const localized = raw.map((exam) => localizePhysicsMockExam(exam, 'en'))
    expect(localized).toHaveLength(3)
    expect(localized.flatMap((exam) => exam.questions)).toHaveLength(13)
    assertEnglishTree(localized, 'mockExams')
    localized.forEach((exam, examIndex) => {
      expect(exam.id).toBe(raw[examIndex].id)
      exam.questions.forEach((question, questionIndex) => {
        expect(question.id).toBe(raw[examIndex].questions[questionIndex].id)
        expect(question.answer).toEqual(raw[examIndex].questions[questionIndex].answer)
      })
    })
  })

  it('localizes every signal card and formula-sheet entry', () => {
    const signals = PHYSICS_SOLVING_SIGNALS.map((signal) => localizePhysicsSignal(signal, 'en'))
    expect(signals).toHaveLength(20)
    assertEnglishTree(signals, 'signals')
    expect(signals.map((signal) => signal.id)).toEqual(PHYSICS_SOLVING_SIGNALS.map((signal) => signal.id))

    const sections = localizePhysicsFormulaSections(physicsFormulaSheetSections(), 'en')
    expect(sections).toHaveLength(6)
    expect(sections.flatMap((section) => section.units)).toHaveLength(30)
    expect(sections.flatMap((section) => section.units.flatMap((unit) => unit.concepts))).toHaveLength(80)
    assertEnglishTree(sections, 'formulaSections')
  })

  it('returns original zh-Hant objects and fails closed for an unknown English item', () => {
    const grade = PHYSICS_GRADES.g7
    expect(localizePhysicsGrade(grade, 'zh-Hant')).toBe(grade)
    const signal = PHYSICS_SOLVING_SIGNALS[0]
    expect(localizePhysicsSignal(signal, 'zh-Hant')).toBe(signal)
    const unknown: PhysicsQuestion = {
      ...grade.units[0].questions[0],
      id: 'missing-physics-copy',
    }
    expect(() => localizePhysicsQuestion(unknown, 'en')).toThrow('Missing English physics question copy')
  })
})
