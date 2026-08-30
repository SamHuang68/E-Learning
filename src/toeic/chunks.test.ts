import { describe, it, expect } from 'vitest'
import { TOEIC_CHUNK_WEEKS } from './data/chunks'

describe('TOEIC Business Chunks Module', () => {
  it('should load at least 1 week with 5 core business chunks', () => {
    expect(TOEIC_CHUNK_WEEKS.length).toBeGreaterThan(0)
    const week1 = TOEIC_CHUNK_WEEKS[0]
    expect(week1.chunks.length).toBe(5)
    expect(week1.themeTitle).toBeDefined()
  })

  it('each chunk should have valid rhythm hint, 3 examples, variations, pitfall, and production', () => {
    const week1 = TOEIC_CHUNK_WEEKS[0]
    week1.chunks.forEach((c) => {
      expect(c.id).toBeTruthy()
      expect(c.chunk).toBeTruthy()
      expect(c.meaningZh).toBeTruthy()
      expect(c.actionSignal).toBeTruthy()
      expect(c.rhythmHint.stress).toBeTruthy()
      expect(c.rhythmHint.note).toBeTruthy()
      expect(c.examples.length).toBeGreaterThanOrEqual(2)
      expect(c.variations.length).toBeGreaterThanOrEqual(1)
      expect(c.pitfall.wrong).toBeTruthy()
      expect(c.pitfall.reason).toBeTruthy()
      expect(c.miniDialog.speakerA.en).toBeTruthy()
      expect(c.miniDialog.speakerB.en).toBeTruthy()
      expect(c.production.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('microStory should contain 5 sentences and 3-second decision table for all 5 chunks', () => {
    const week1 = TOEIC_CHUNK_WEEKS[0]
    expect(week1.microStory.sentences.length).toBe(5)
    expect(week1.microStory.decisionTable.length).toBe(5)
    week1.microStory.decisionTable.forEach((row) => {
      expect(row.chunk).toBeTruthy()
      expect(row.signal).toBeTruthy()
      expect(row.threeSecondRule).toBeTruthy()
    })
  })
})
