import { describe, it, expect } from 'vitest'
import { CRAFTS_DIALOGUES } from './data/craftsZhDialogues'

describe('Chinese Crafts & Tea Culture Dialogues Integrity Tests', () => {
  it('contains structured crafts/tea scenarios with dialogue lines and crafts glossaries', () => {
    expect(CRAFTS_DIALOGUES.length).toBeGreaterThanOrEqual(2)
    CRAFTS_DIALOGUES.forEach((item) => {
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
      expect(item.craftsGlossary.length).toBeGreaterThan(0)
    })
  })
})
