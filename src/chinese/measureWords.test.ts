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

  it('adds twelve teaching measure-word drills, not a fluency or TOCFL pass claim', () => {
    const drillIds = [
      'mw-ben',
      'mw-jian-clothes',
      'mw-zhi-animal',
      'mw-zhi-pen',
      'mw-bei',
      'mw-liang',
      'mw-tai',
      'mw-jian-room',
      'mw-jia',
      'mw-wei',
      'mw-shuang',
      'mw-ke-round',
    ]
    expect(drillIds).toHaveLength(12)
    const drills = drillIds.map((id) => {
      const item = MEASURE_WORDS.find((mw) => mw.id === id)
      expect(item, id).toBeDefined()
      return item!
    })
    drills.forEach((item) => {
      expect(item.quiz.options.length).toBe(4)
      expect(item.quiz.correctIndex).toBe(0)
      expect(item.quiz.explanationZh).toMatch(/教學/)
      expect(item.quiz.explanationJa).toMatch(/学習用/)
    })
    expect(MEASURE_WORDS.map((mw) => mw.classifierZh)).toEqual(
      expect.arrayContaining(['本', '件', '隻', '支', '杯', '輛', '台', '間', '家', '位', '雙', '顆']),
    )
    expect(new Set(MEASURE_WORDS.map((mw) => mw.id)).size).toBe(MEASURE_WORDS.length)
  })
})
