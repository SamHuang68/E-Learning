import { describe, it, expect } from 'vitest'
import { DOUBLE_NINTH_DIALOGUES } from './data/doubleNinthZhDialogues'

describe('Chinese Double Ninth Hiking & Senior Reverence Dialogues Integrity Tests', () => {
  it('contains structured Double Ninth scenarios with dialogue lines and glossaries', () => {
    expect(DOUBLE_NINTH_DIALOGUES.length).toBeGreaterThanOrEqual(1)
    DOUBLE_NINTH_DIALOGUES.forEach((item) => {
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
      expect(item.doubleNinthGlossary.length).toBeGreaterThan(0)
    })
  })
})
