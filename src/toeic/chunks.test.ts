import { describe, it, expect } from 'vitest'
import { TOEIC_CHUNK_WEEKS } from './data/chunks'

describe('TOEIC Business Chunks Module', () => {
  it('should load at least 2 weeks with business chunks and Japanese titles', () => {
    expect(TOEIC_CHUNK_WEEKS.length).toBeGreaterThanOrEqual(2)
    TOEIC_CHUNK_WEEKS.forEach((week) => {
      expect(week.chunks.length).toBeGreaterThanOrEqual(3)
      expect(week.themeTitle).toBeTruthy()
      expect(week.themeTitleJa).toBeTruthy()
    })
  })

  it('each chunk should have valid rhythm hint, examples, variations, pitfall, and Japanese explanations', () => {
    TOEIC_CHUNK_WEEKS.forEach((week) => {
      week.chunks.forEach((c) => {
        expect(c.id).toBeTruthy()
        expect(c.chunk).toBeTruthy()
        expect(c.meaningZh).toBeTruthy()
        expect(c.meaningJa).toBeTruthy()
        expect(c.actionSignal).toBeTruthy()
        expect(c.actionSignalJa).toBeTruthy()
        expect(c.rhythmHint.stress).toBeTruthy()
        expect(c.rhythmHint.note).toBeTruthy()
        expect(c.examples.length).toBeGreaterThanOrEqual(1)
        expect(c.variations.length).toBeGreaterThanOrEqual(1)
        expect(c.pitfall.wrong).toBeTruthy()
        expect(c.pitfall.reason).toBeTruthy()
        expect(c.miniDialog.speakerA.en).toBeTruthy()
        expect(c.miniDialog.speakerB.en).toBeTruthy()
        expect(c.production.length).toBeGreaterThanOrEqual(1)
      })
    })
  })

  it('microStory should contain sentences and 3-second decision table for chunks', () => {
    TOEIC_CHUNK_WEEKS.forEach((week) => {
      expect(week.microStory.sentences.length).toBeGreaterThanOrEqual(3)
      expect(week.microStory.decisionTable.length).toBeGreaterThanOrEqual(3)
      week.microStory.decisionTable.forEach((row) => {
        expect(row.chunk).toBeTruthy()
        expect(row.signal).toBeTruthy()
        expect(row.threeSecondRule).toBeTruthy()
      })
    })
  })
})
