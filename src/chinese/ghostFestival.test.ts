import { describe, it, expect } from 'vitest'
import { GHOST_FESTIVAL_DIALOGUES } from './data/ghostFestivalZhDialogues'

describe('Chinese Ghost Festival & Pudu Dialogues Integrity Tests', () => {
  it('contains structured Ghost Festival scenarios with dialogue lines and glossaries', () => {
    expect(GHOST_FESTIVAL_DIALOGUES.length).toBeGreaterThanOrEqual(1)
    GHOST_FESTIVAL_DIALOGUES.forEach((item) => {
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
      expect(item.ghostFestivalGlossary.length).toBeGreaterThan(0)
    })
  })
})
