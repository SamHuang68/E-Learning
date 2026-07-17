import { describe, expect, it } from 'vitest'
import { enPlacementQuestions } from '../data/placement/en'
import { jaPlacementQuestions } from '../data/placement/ja'
import { scorePlacement } from './placement'

describe('scorePlacement', () => {
  it('places Japanese learners into JLPT bands by percent correct', () => {
    const low = scorePlacement({}, jaPlacementQuestions)
    expect(low).toEqual({ score: 0, levelId: 'n5n4', band: 'N5 / N4' })

    const midAnswers = Object.fromEntries(
      jaPlacementQuestions
        .slice(0, 9)
        .map((question) => [question.id, question.answer]),
    )
    const mid = scorePlacement(midAnswers, jaPlacementQuestions)
    expect(mid).toEqual({ score: 9, levelId: 'n3', band: 'N3' })

    const highAnswers = Object.fromEntries(
      jaPlacementQuestions
        .slice(0, 14)
        .map((question) => [question.id, question.answer]),
    )
    const high = scorePlacement(highAnswers, jaPlacementQuestions)
    expect(high).toEqual({ score: 14, levelId: 'n2n1', band: 'N2 / N1' })
  })

  it('places English learners into TOEIC certificate bands and accepts array answers', () => {
    const answers = enPlacementQuestions.map((question, index) =>
      index < 12 ? question.answer : '',
    )
    const result = scorePlacement(answers, enPlacementQuestions)
    expect(result).toEqual({ score: 12, certificateId: 'blue', band: 'Blue' })
  })
})
