import { describe, it, expect } from 'vitest'
import { STROKE_CHARACTERS } from './data/strokeOrders'

describe('Chinese Traditional Stroke Order & Bopomofo Tests', () => {
  it('contains stroke order data for high-frequency characters', () => {
    expect(STROKE_CHARACTERS.length).toBeGreaterThanOrEqual(5)
    STROKE_CHARACTERS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.char).toBeTruthy()
      expect(item.pinyin).toBeTruthy()
      expect(item.bopomofo).toBeTruthy()
      expect(item.meaningJa).toBeTruthy()
      expect(item.radical).toBeTruthy()
      expect(item.strokeCount).toBeGreaterThan(0)
      expect(item.strokeSequence.length).toBeGreaterThan(0)
      expect(item.strokeRuleJa).toBeTruthy()
      expect(item.exampleSentenceZh).toBeTruthy()
      expect(item.exampleSentenceJa).toBeTruthy()
    })
  })
})
