import { describe, it, expect } from 'vitest'
import { DOUBLE_PASSAGE_SETS } from './data/doublePassages'

describe('TOEIC Double Passage Reading Integrity Tests', () => {
  it('contains structured double passage reading sets with cross-referencing questions', () => {
    expect(DOUBLE_PASSAGE_SETS.length).toBeGreaterThanOrEqual(1)
    DOUBLE_PASSAGE_SETS.forEach((set) => {
      expect(set.id).toBeTruthy()
      expect(set.title).toBeTruthy()
      expect(set.titleJa).toBeTruthy()
      expect(set.passage1.content).toBeTruthy()
      expect(set.passage2.content).toBeTruthy()
      expect(set.questions.length).toBeGreaterThan(0)
      set.questions.forEach((q) => {
        expect(q.id).toBeTruthy()
        expect(q.question).toBeTruthy()
        expect(q.options.length).toBe(4)
        expect(q.correctIndex).toBeGreaterThanOrEqual(0)
        expect(q.correctIndex).toBeLessThan(4)
        expect(q.clueLocation).toBeTruthy()
        expect(q.explanationZh).toBeTruthy()
        expect(q.explanationJa).toBeTruthy()
      })
      expect(set.synonymMatches.length).toBeGreaterThan(0)
    })
  })
})
