import { describe, it, expect } from 'vitest'
import { SYNONYM_ITEMS } from './data/synonyms'

describe('Chinese Synonyms Distinction Integrity Tests', () => {
  it('contains structured synonym pairs with definitions, patterns, and quizzes', () => {
    expect(SYNONYM_ITEMS.length).toBeGreaterThanOrEqual(3)
    SYNONYM_ITEMS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.wordA.zh).toBeTruthy()
      expect(item.wordA.posJa).toBeTruthy()
      expect(item.wordA.patternZh).toBeTruthy()
      expect(item.wordB.zh).toBeTruthy()
      expect(item.wordB.posJa).toBeTruthy()
      expect(item.wordB.patternZh).toBeTruthy()
      expect(item.coreDifferenceJa).toBeTruthy()
      expect(item.quiz.questionZh).toBeTruthy()
      expect(item.quiz.options.length).toBe(4)
      expect(item.quiz.correctIndex).toBeGreaterThanOrEqual(0)
      expect(item.quiz.correctIndex).toBeLessThan(4)
      expect(item.quiz.explanationJa).toBeTruthy()
    })
  })
})
