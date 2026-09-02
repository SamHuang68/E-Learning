import { describe, it, expect } from 'vitest'
import { UTILITIES_DIALOGUES } from './data/utilitiesZhDialogues'

describe('Chinese Utilities & Relocation Dialogues Integrity Tests', () => {
  it('contains structured utilities/moving scenarios with dialogue lines and utilities glossaries', () => {
    expect(UTILITIES_DIALOGUES.length).toBeGreaterThanOrEqual(2)
    UTILITIES_DIALOGUES.forEach((item) => {
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
      expect(item.utilitiesGlossary.length).toBeGreaterThan(0)
    })
  })
})
