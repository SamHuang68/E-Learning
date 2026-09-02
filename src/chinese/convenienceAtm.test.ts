import { describe, it, expect } from 'vitest'
import { CONVENIENCE_ATM_DIALOGUES } from './data/convenienceAtmZhDialogues'

describe('Chinese Convenience Store & ATM Finance Dialogues Integrity Tests', () => {
  it('contains structured convenience store & ATM financial scenarios with dialogue lines and glossaries', () => {
    expect(CONVENIENCE_ATM_DIALOGUES.length).toBeGreaterThanOrEqual(1)
    CONVENIENCE_ATM_DIALOGUES.forEach((item) => {
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
      expect(item.convenienceGlossary.length).toBeGreaterThan(0)
    })
  })
})
