import { describe, it, expect } from 'vitest'
import { BOBA_DIALOGUES } from './data/bobaZhDialogues'

describe('Chinese Boba Milk Tea Customization Dialogues Integrity Tests', () => {
  it('contains structured Boba scenarios with dialogue lines and glossaries', () => {
    expect(BOBA_DIALOGUES.length).toBeGreaterThanOrEqual(1)
    BOBA_DIALOGUES.forEach((item) => {
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
      expect(item.bobaGlossary.length).toBeGreaterThan(0)
    })
  })
})
