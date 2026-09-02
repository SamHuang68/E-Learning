import { describe, it, expect } from 'vitest'
import { HOUSING_DIALOGUES } from './data/housingDialogues'

describe('Chinese Housing & Renting Dialogues Integrity Tests', () => {
  it('contains structured housing scenarios with dialogue lines and vocabulary tips', () => {
    expect(HOUSING_DIALOGUES.length).toBeGreaterThanOrEqual(2)
    HOUSING_DIALOGUES.forEach((item) => {
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
      expect(item.usefulVocabulary.length).toBeGreaterThan(0)
    })
  })
})
