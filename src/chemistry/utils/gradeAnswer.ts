import type { ChemistryQuestion } from '../data/curriculum'

export type ChemistryResponse = number | number[] | string | null

function parseDecimal(value: string): number {
  // Parse the entire decimal/scientific literal, not a prefix such as "2" in "2+3".
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)) return NaN
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : NaN
}

/** Keep the chemistry exam's 0.05 fill tolerance, requiring complete finite numeric input. */
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
    const actualNumber = parseDecimal(actual)
    const expectedNumber = parseDecimal(expected)
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
