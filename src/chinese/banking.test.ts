import { describe, it, expect } from 'vitest'
import { BANKING_DIALOGUES } from './data/bankingDialogues'

describe('Chinese Banking & Financial Dialogues Integrity Tests', () => {
  it('contains structured banking scenarios with dialogue lines and vocabulary tips', () => {
    expect(BANKING_DIALOGUES.length).toBeGreaterThanOrEqual(2)
    BANKING_DIALOGUES.forEach((item) => {
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
