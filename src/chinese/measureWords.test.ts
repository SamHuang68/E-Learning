import { describe, it, expect } from 'vitest'
import { MEASURE_WORDS } from './data/measureWords'

describe('Chinese Measure Words & Classifiers Integrity Tests', () => {
  it('contains structured measure word items with categories, rules, and quizzes', () => {
    expect(MEASURE_WORDS.length).toBeGreaterThanOrEqual(4)
    MEASURE_WORDS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.classifierZh).toBeTruthy()
      expect(item.pinyin).toBeTruthy()
      expect(item.bopomofo).toBeTruthy()
      expect(item.categoryJa).toBeTruthy()
      expect(item.usageRuleJa).toBeTruthy()
      expect(item.matchedNouns.length).toBeGreaterThan(0)
      item.matchedNouns.forEach((n) => {
        expect(n.nounZh).toBeTruthy()
        expect(n.pinyin).toBeTruthy()
        expect(n.meaningJa).toBeTruthy()
        expect(n.samplePhraseZh).toBeTruthy()
      })
      expect(item.quiz.nounZh).toBeTruthy()
      expect(item.quiz.options.length).toBe(4)
      expect(item.quiz.correctIndex).toBeGreaterThanOrEqual(0)
      expect(item.quiz.correctIndex).toBeLessThan(4)
      expect(item.quiz.explanationJa).toBeTruthy()
    })
  })
})
