import { describe, it, expect } from 'vitest'
import { WEIYA_DIALOGUES } from './data/weiyaZhDialogues'

describe('Chinese Weiya Banquet & Gua Bao Dialogues Integrity Tests', () => {
  it('contains structured Weiya scenarios with dialogue lines and glossaries', () => {
    expect(WEIYA_DIALOGUES.length).toBeGreaterThanOrEqual(1)
    WEIYA_DIALOGUES.forEach((item) => {
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
      expect(item.weiyaGlossary.length).toBeGreaterThan(0)
    })
  })
})
