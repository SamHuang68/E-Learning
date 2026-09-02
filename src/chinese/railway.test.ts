import { describe, it, expect } from 'vitest'
import { RAILWAY_DIALOGUES } from './data/travelZhDialogues'

describe('Chinese High Speed Rail & Tourism Dialogues Integrity Tests', () => {
  it('contains structured railway/tourism scenarios with dialogue lines and railway glossaries', () => {
    expect(RAILWAY_DIALOGUES.length).toBeGreaterThanOrEqual(2)
    RAILWAY_DIALOGUES.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.locationZh).toBeTruthy()
      expect(item.locationJa).toBeTruthy()
      expect(item.dialogueLines.length).toBeGreaterThan(0)
      item.dialogueLines.forEach((line) => {
        expect(line.speaker).toBeTruthy()
        expect(line.speakerJa).toBeTruthy()
        expect(line.zh).toBeTruthy()
        expect(line.pinyin).toBeTruthy()
        expect(line.ja).toBeTruthy()
      })
      expect(item.railwayGlossary.length).toBeGreaterThan(0)
    })
  })
})
