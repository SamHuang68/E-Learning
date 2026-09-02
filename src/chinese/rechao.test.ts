import { describe, it, expect } from 'vitest'
import { RECHAO_DIALOGUES } from './data/rechaoZhDialogues'

describe('Chinese Rechao Dining & Bargaining Dialogues Integrity Tests', () => {
  it('contains structured rechao dining scenarios with dialogue lines and rechao glossaries', () => {
    expect(RECHAO_DIALOGUES.length).toBeGreaterThanOrEqual(1)
    RECHAO_DIALOGUES.forEach((item) => {
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
      expect(item.rechaoGlossary.length).toBeGreaterThan(0)
    })
  })
})
