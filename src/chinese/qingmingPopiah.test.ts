import { describe, it, expect } from 'vitest'
import { QINGMING_POPIAH_DIALOGUES } from './data/qingmingPopiahZhDialogues'

describe('Chinese Qingming Tomb Sweeping & Popiah Dialogues Integrity Tests', () => {
  it('contains structured Qingming Popiah scenarios with dialogue lines and glossaries', () => {
    expect(QINGMING_POPIAH_DIALOGUES.length).toBeGreaterThanOrEqual(1)
    QINGMING_POPIAH_DIALOGUES.forEach((item) => {
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
      expect(item.qingmingGlossary.length).toBeGreaterThan(0)
    })
  })
})
