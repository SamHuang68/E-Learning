import { describe, it, expect } from 'vitest'
import { ZHUAZHOU_DIALOGUES } from './data/zhuazhouZhDialogues'

describe('Chinese Zhuazhou First Birthday Dialogues Integrity Tests', () => {
  it('contains structured Zhuazhou scenarios with dialogue lines and glossaries', () => {
    expect(ZHUAZHOU_DIALOGUES.length).toBeGreaterThanOrEqual(1)
    ZHUAZHOU_DIALOGUES.forEach((item) => {
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
      expect(item.zhuazhouGlossary.length).toBeGreaterThan(0)
    })
  })
})
