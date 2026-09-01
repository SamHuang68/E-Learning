import { describe, it, expect } from 'vitest'
import { CHINESE_IDIOMS } from './data/idioms'

describe('Chinese Idioms & Taiwanese Proverbs Integrity Tests', () => {
  it('contains rich idiom data with stories, situations, and cloze quizzes', () => {
    expect(CHINESE_IDIOMS.length).toBeGreaterThanOrEqual(4)
    CHINESE_IDIOMS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.idiomZh).toBeTruthy()
      expect(item.pinyin).toBeTruthy()
      expect(item.bopomofo).toBeTruthy()
      expect(item.meaningJa).toBeTruthy()
      expect(item.originStoryJa).toBeTruthy()
      expect(item.usageSituationJa).toBeTruthy()
      expect(item.exampleSentenceZh).toBeTruthy()
      expect(item.exampleSentenceJa).toBeTruthy()
      expect(item.quiz.cloze).toBeTruthy()
      expect(item.quiz.options.length).toBe(4)
      expect(item.quiz.correctIndex).toBeGreaterThanOrEqual(0)
      expect(item.quiz.correctIndex).toBeLessThan(4)
      expect(item.quiz.explanationJa).toBeTruthy()
    })
  })
})
