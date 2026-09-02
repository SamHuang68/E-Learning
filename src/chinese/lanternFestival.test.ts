import { describe, it, expect } from 'vitest'
import { LANTERN_FESTIVAL_DIALOGUES } from './data/lanternFestivalZhDialogues'

describe('Chinese Lantern Festival Dialogues Integrity Tests', () => {
  it('contains structured Lantern Festival scenarios with dialogue lines and glossaries', () => {
    expect(LANTERN_FESTIVAL_DIALOGUES.length).toBeGreaterThanOrEqual(1)
    LANTERN_FESTIVAL_DIALOGUES.forEach((item) => {
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
      expect(item.lanternFestivalGlossary.length).toBeGreaterThan(0)
    })
  })
})
