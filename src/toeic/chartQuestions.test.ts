import { describe, it, expect } from 'vitest'
import { CHART_QUESTIONS } from './data/chartQuestions'

describe('TOEIC Chart Questions & Visual Analysis Integrity Tests', () => {
  it('contains valid chart data, scenario passages, and questions', () => {
    expect(CHART_QUESTIONS.length).toBeGreaterThanOrEqual(2)
    CHART_QUESTIONS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.chartType).toBeTruthy()
      expect(item.chartTitle).toBeTruthy()
      expect(item.chartData.length).toBeGreaterThan(0)
      expect(item.scenarioPassage).toBeTruthy()
      expect(item.questions.length).toBeGreaterThan(0)
      item.questions.forEach((q) => {
        expect(q.id).toBeTruthy()
        expect(q.question).toBeTruthy()
        expect(q.options.length).toBe(4)
        expect(q.correctIndex).toBeGreaterThanOrEqual(0)
        expect(q.correctIndex).toBeLessThan(4)
        expect(q.explanationZh).toBeTruthy()
        expect(q.explanationJa).toBeTruthy()
      })
    })
  })
})
