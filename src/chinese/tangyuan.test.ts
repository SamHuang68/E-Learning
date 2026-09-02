import { describe, it, expect } from 'vitest'
import { TANGYUAN_DIALOGUES } from './data/tangyuanZhDialogues'

describe('Chinese Dongzhi Tangyuan Dialogues Integrity Tests', () => {
  it('contains structured Tangyuan scenarios with dialogue lines and glossaries', () => {
    expect(TANGYUAN_DIALOGUES.length).toBeGreaterThanOrEqual(1)
    TANGYUAN_DIALOGUES.forEach((item) => {
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
      expect(item.tangyuanGlossary.length).toBeGreaterThan(0)
    })
  })
})
