import { describe, it, expect } from 'vitest'
import { START_OF_WINTER_DIALOGUES } from './data/startOfWinterZhDialogues'

describe('Chinese Start of Winter & Ginger Duck Dialogues Integrity Tests', () => {
  it('contains structured Start of Winter scenarios with dialogue lines and glossaries', () => {
    expect(START_OF_WINTER_DIALOGUES.length).toBeGreaterThanOrEqual(1)
    START_OF_WINTER_DIALOGUES.forEach((item) => {
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
      expect(item.winterTonicGlossary.length).toBeGreaterThan(0)
    })
  })
})
