import { describe, it, expect } from 'vitest'
import { MID_AUTUMN_DIALOGUES } from './data/midAutumnZhDialogues'

describe('Chinese Mid-Autumn BBQ & Pomelo Dialogues Integrity Tests', () => {
  it('contains structured Mid-Autumn scenarios with dialogue lines and glossaries', () => {
    expect(MID_AUTUMN_DIALOGUES.length).toBeGreaterThanOrEqual(1)
    MID_AUTUMN_DIALOGUES.forEach((item) => {
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
      expect(item.midAutumnGlossary.length).toBeGreaterThan(0)
    })
  })
})
