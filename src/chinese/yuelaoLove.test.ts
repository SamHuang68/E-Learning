import { describe, it, expect } from 'vitest'
import { YUELAO_LOVE_DIALOGUES } from './data/yuelaoLoveZhDialogues'

describe('Chinese Yuelao Love & Red Ribbons Dialogues Integrity Tests', () => {
  it('contains structured Yuelao Love scenarios with dialogue lines and glossaries', () => {
    expect(YUELAO_LOVE_DIALOGUES.length).toBeGreaterThanOrEqual(1)
    YUELAO_LOVE_DIALOGUES.forEach((item) => {
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
      expect(item.yuelaoGlossary.length).toBeGreaterThan(0)
    })
  })
})
