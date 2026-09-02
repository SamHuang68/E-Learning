import { describe, it, expect } from 'vitest'
import { GUABAO_SISHEN_DIALOGUES } from './data/guabaoSishenZhDialogues'

describe('Chinese Guabao Tiger Bites Pig & Sishen Soup Dialogues Integrity Tests', () => {
  it('contains structured Guabao & Sishen Soup scenarios with dialogue lines and glossaries', () => {
    expect(GUABAO_SISHEN_DIALOGUES.length).toBeGreaterThanOrEqual(1)
    GUABAO_SISHEN_DIALOGUES.forEach((item) => {
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
      expect(item.guabaoGlossary.length).toBeGreaterThan(0)
    })
  })
})
