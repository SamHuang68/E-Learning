import { describe, expect, it } from 'vitest'
import { gradeAnswer, normalizeAnswer, type Exercise } from './exercises'

const baseExercise: Exercise = {
  id: 'test-1',
  kind: 'recognize',
  card: {
    id: 'card-1',
    head: 'reservation',
    meaning: '預約',
    sentence: 'I have a reservation.',
    scenario: 'hotel',
    register: 'polite',
  },
  prompt: 'reservation',
  answer: 'I have a reservation',
  lang: 'en',
}

describe('exercise answer grading', () => {
  it('normalizes case, width, punctuation, and whitespace', () => {
    expect(normalizeAnswer('  Ｉ HAVE, a reservation!!  ')).toBe(
      'i have a reservation',
    )
  })

  it('grades normalized equivalent answers as correct', () => {
    expect(gradeAnswer(baseExercise, 'i have a reservation.')).toBe(true)
  })

  it('rejects answers with different normalized content', () => {
    expect(gradeAnswer(baseExercise, 'I have an appointment')).toBe(false)
  })
})
