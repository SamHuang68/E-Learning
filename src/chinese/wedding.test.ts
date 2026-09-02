import { describe, it, expect } from 'vitest'
import { WEDDING_DIALOGUES } from './data/weddingZhDialogues'

describe('Chinese Wedding Red Packet & Customs Dialogues Integrity Tests', () => {
  it('contains structured Wedding scenarios with dialogue lines and glossaries', () => {
    expect(WEDDING_DIALOGUES.length).toBeGreaterThanOrEqual(1)
    WEDDING_DIALOGUES.forEach((item) => {
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
      expect(item.weddingGlossary.length).toBeGreaterThan(0)
    })
  })
})
