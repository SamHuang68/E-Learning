import { describe, it, expect } from 'vitest'
import { FESTIVAL_DIALOGUES } from './data/festivalZhDialogues'

describe('Chinese Festivals & Temple Dialogues Integrity Tests', () => {
  it('contains structured festival/temple scenarios with dialogue lines and festival glossaries', () => {
    expect(FESTIVAL_DIALOGUES.length).toBeGreaterThanOrEqual(2)
    FESTIVAL_DIALOGUES.forEach((item) => {
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
      expect(item.festivalGlossary.length).toBeGreaterThan(0)
    })
  })
})
