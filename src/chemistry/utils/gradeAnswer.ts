import type { ChemistryQuestion } from '../data/curriculum'

export type ChemistryResponse = number | number[] | string | null

/** Match the existing chemistry mock-exam rules, including its 0.05 fill tolerance. */
export function gradeChemistryAnswer(question: ChemistryQuestion, response: ChemistryResponse): boolean {
  if (response === null || response === '' || (typeof response === 'string' && !response.trim())) return false

  if (question.type === 'multi-choice' || Array.isArray(question.answer)) {
    const letters = (values: Array<string | number>) => values
      .map(value => typeof value === 'number' ? String.fromCharCode(65 + value) : value.trim().toUpperCase())
      .sort()
    const expected = letters(Array.isArray(question.answer) ? question.answer : [question.answer])
    const actual = letters(Array.isArray(response) ? response : [response])
    return expected.length === actual.length && expected.every((value, index) => value === actual[index])
  }

  if (question.type === 'fill') {
    const actual = String(response).trim()
    const expected = String(question.answer).trim()
    const actualNumber = Number.parseFloat(actual)
    const expectedNumber = Number.parseFloat(expected)
    if (Number.isFinite(actualNumber) && Number.isFinite(expectedNumber)) {
      return Math.abs(actualNumber - expectedNumber) < 0.05
    }
    return actual.toLowerCase() === expected.toLowerCase()
  }

  if (typeof response !== 'number') return false
  return typeof question.answer === 'number'
    ? response === question.answer
    : question.answer.trim().toUpperCase() === String.fromCharCode(65 + response)
      || question.answer.trim() === String(response)
}
