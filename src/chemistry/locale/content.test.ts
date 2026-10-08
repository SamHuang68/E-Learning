import { describe, expect, it } from 'vitest'
import {
  CHEMISTRY_GRADES,
  type ChemistryQuestion,
} from '../data/curriculum'
import { CHEMISTRY_MOCK_EXAMS } from '../data/mockExams'
import { CHEMISTRY_SOLVING_SIGNALS } from '../data/solvingSignals'
import {
  CHEMISTRY_ENGLISH_COVERAGE,
  localizeChemistryGrade,
  localizeChemistryMockExam,
  localizeChemistryQuestion,
  localizeChemistrySignal,
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

describe('chemistry English curriculum coverage', () => {
  it('localizes every grade, unit, question, concept, and lab without Han fallback', () => {
    const rawGrades = Object.values(CHEMISTRY_GRADES)
    const localized = rawGrades.map((grade) => localizeChemistryGrade(grade, 'en'))

    expect(localized).toHaveLength(6)
    expect(localized.flatMap((grade) => grade.units)).toHaveLength(26)
    expect(localized.flatMap((grade) => grade.units.flatMap((unit) => unit.questions))).toHaveLength(70)
    expect(localized.flatMap((grade) => grade.units.flatMap((unit) => unit.concepts))).toHaveLength(99)
    expect(localized.flatMap((grade) => grade.labs)).toHaveLength(24)
    expect(Object.keys(CHEMISTRY_ENGLISH_COVERAGE.questions)).toHaveLength(70)
    assertEnglishTree(localized, 'grades')

    localized.forEach((grade, gradeIndex) => {
      const rawGrade = rawGrades[gradeIndex]
      expect(grade.id).toBe(rawGrade.id)
      grade.units.forEach((unit, unitIndex) => {
        const rawUnit = rawGrade.units[unitIndex]
        expect(unit.id).toBe(rawUnit.id)
        expect(unit.key).toBe(rawUnit.key)
        expect(unit.strand).toBe(rawUnit.strand)
        expect(unit.totalPoints).toBe(rawUnit.totalPoints)
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

  it('localizes every mock exam and preserves its grading contract', () => {
    const raw = Object.values(CHEMISTRY_MOCK_EXAMS)
    const localized = raw.map((exam) => localizeChemistryMockExam(exam, 'en'))

    expect(localized).toHaveLength(3)
    expect(localized.flatMap((exam) => exam.questions)).toHaveLength(10)
    expect(Object.keys(CHEMISTRY_ENGLISH_COVERAGE.mockQuestions)).toHaveLength(10)
    assertEnglishTree(localized, 'mockExams')

    localized.forEach((exam, examIndex) => {
      expect(exam.id).toBe(raw[examIndex].id)
      expect(exam.targetExam).toBe(raw[examIndex].targetExam)
      expect(exam.durationMinutes).toBe(raw[examIndex].durationMinutes)
      expect(exam.totalPoints).toBe(raw[examIndex].totalPoints)
      exam.questions.forEach((question, questionIndex) => {
        const rawQuestion = raw[examIndex].questions[questionIndex]
        expect(question.id).toBe(rawQuestion.id)
        expect(question.answer).toEqual(rawQuestion.answer)
        expect(question.type).toBe(rawQuestion.type)
      })
    })
  })

  it('localizes every problem-solving signal card', () => {
    const localized = CHEMISTRY_SOLVING_SIGNALS.map((signal) =>
      localizeChemistrySignal(signal, 'en'),
    )

    expect(localized).toHaveLength(15)
    expect(Object.keys(CHEMISTRY_ENGLISH_COVERAGE.signals)).toHaveLength(15)
    expect(localized.map((signal) => signal.id)).toEqual(
      CHEMISTRY_SOLVING_SIGNALS.map((signal) => signal.id),
    )
    assertEnglishTree(localized, 'signals')
  })

  it('returns original zh-Hant objects and fails closed for an unknown English item', () => {
    const grade = CHEMISTRY_GRADES.g7
    expect(localizeChemistryGrade(grade, 'zh-Hant')).toBe(grade)
    const signal = CHEMISTRY_SOLVING_SIGNALS[0]
    expect(localizeChemistrySignal(signal, 'zh-Hant')).toBe(signal)

    const unknown: ChemistryQuestion = {
      ...grade.units[0].questions[0],
      id: 'missing-chemistry-copy',
    }
    expect(() => localizeChemistryQuestion(unknown, 'en')).toThrow(
      'Missing English chemistry question copy',
    )
  })
})
