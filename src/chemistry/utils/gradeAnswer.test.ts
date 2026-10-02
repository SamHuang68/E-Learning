import { describe, expect, it } from 'vitest'
import { getAllChemistryUnits } from '../data/curriculum'
import { gradeChemistryAnswer } from './gradeAnswer'

const questions = getAllChemistryUnits().flatMap(unit => unit.questions)
const moleQuestion = questions.find(question => question.id === 'g8_u4_q1')!
const multipleQuestion = questions.find(question => question.type === 'multi-choice')!

describe('Chemistry practice grading', () => {
  it('allows numeric fill responses using the chemistry exam tolerance', () => {
    for (const response of ['2', ' 2.0 ', '+2.', '2e0', '20E-1', '.2e1']) {
      expect(gradeChemistryAnswer(moleQuestion, response), response).toBe(true)
    }
    expect(gradeChemistryAnswer(moleQuestion, '2.04')).toBe(true)
    expect(gradeChemistryAnswer(moleQuestion, '2.06')).toBe(false)
  })

  it('rejects empty and invalid fill responses', () => {
    for (const response of [null, '', '  ', 'not a number', 'Infinity', '-Infinity', 'NaN', '1e999']) {
      expect(gradeChemistryAnswer(moleQuestion, response)).toBe(false)
    }
  })

  it('rejects numeric prefixes followed by junk or unevaluated expressions', () => {
    for (const response of ['2oops', '2+3', '2 mol', '2,0', '2e', '2e+', '0x2']) {
      expect(gradeChemistryAnswer(moleQuestion, response), response).toBe(false)
    }
  })

  it('accepts scientific notation for the existing particle-count answer', () => {
    const question = questions.find(item => item.id === 'g8_u4_q9')!
    expect(gradeChemistryAnswer(question, '1.53e23')).toBe(true)
    expect(gradeChemistryAnswer(question, '1.53e22')).toBe(false)
  })

  it('requires the entire multiple-choice answer, independent of selection order', () => {
    const expected = (multipleQuestion.answer as string[]).map(letter => letter.charCodeAt(0) - 65)
    expect(expected.length).toBeGreaterThan(1)
    expect(gradeChemistryAnswer(multipleQuestion, [...expected].reverse())).toBe(true)
    expect(gradeChemistryAnswer(multipleQuestion, expected.slice(0, 1))).toBe(false)
    const extra = multipleQuestion.options!.findIndex((_option, index) => !expected.includes(index))
    expect(gradeChemistryAnswer(multipleQuestion, [...expected, extra])).toBe(false)
    expect(gradeChemistryAnswer(multipleQuestion, [])).toBe(false)
  })

  it('retains letter-based single-choice grading', () => {
    const question = questions.find(item => item.id === 'g8_u4_q2')!
    expect(gradeChemistryAnswer(question, 2)).toBe(true)
    expect(gradeChemistryAnswer(question, 0)).toBe(false)
  })
})
