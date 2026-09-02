import { describe, it, expect } from 'vitest'
import { POST_DIALOGUES } from './data/postDialogues'

describe('Chinese Post & Logistics Dialogues Integrity Tests', () => {
  it('contains structured post/logistics scenarios with dialogue lines and logistics glossaries', () => {
    expect(POST_DIALOGUES.length).toBeGreaterThanOrEqual(2)
    POST_DIALOGUES.forEach((item) => {
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
      expect(item.logisticsGlossary.length).toBeGreaterThan(0)
    })
  })
})
