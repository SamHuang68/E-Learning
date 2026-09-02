import { describe, it, expect } from 'vitest'
import { NEGOTIATION_CHUNKS } from './data/negotiationChunks'

describe('TOEIC Negotiation & Networking Chunks Integrity Tests', () => {
  it('contains structured negotiation chunks with business context and example sentences', () => {
    expect(NEGOTIATION_CHUNKS.length).toBeGreaterThanOrEqual(4)
    NEGOTIATION_CHUNKS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.chunk).toBeTruthy()
      expect(item.phonetic).toBeTruthy()
      expect(item.category).toBeTruthy()
      expect(item.meaningZh).toBeTruthy()
      expect(item.meaningJa).toBeTruthy()
      expect(item.businessContextZh).toBeTruthy()
      expect(item.businessContextJa).toBeTruthy()
      expect(item.exampleSentenceEn).toBeTruthy()
      expect(item.exampleSentenceZh).toBeTruthy()
      expect(item.exampleSentenceJa).toBeTruthy()
    })
  })
})
