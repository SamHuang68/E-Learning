import { describe, it, expect } from 'vitest'
import { TONE_DRILLS } from './data/toneDrills'

describe('Chinese Tone Listening Drills & Minimal Pairs Tests', () => {
  it('contains valid minimal pairs data for tone listening drills', () => {
    expect(TONE_DRILLS.length).toBeGreaterThanOrEqual(5)
    TONE_DRILLS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.confusionPointJa).toBeTruthy()
      expect(item.pairA.zh).toBeTruthy()
      expect(item.pairA.pinyin).toBeTruthy()
      expect(item.pairA.meaningJa).toBeTruthy()
      expect(item.pairB.zh).toBeTruthy()
      expect(item.pairB.pinyin).toBeTruthy()
      expect(item.pairB.meaningJa).toBeTruthy()
      expect(item.exampleContextZh).toBeTruthy()
      expect(item.exampleContextJa).toBeTruthy()
    })
  })
})
