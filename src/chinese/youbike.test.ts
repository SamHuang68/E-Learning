import { describe, it, expect } from 'vitest'
import { YOUBIKE_DIALOGUES } from './data/youbikeZhDialogues'

describe('Chinese YouBike 2.0 Transit & Culture Dialogues Integrity Tests', () => {
  it('contains structured YouBike scenarios with dialogue lines and glossaries', () => {
    expect(YOUBIKE_DIALOGUES.length).toBeGreaterThanOrEqual(1)
    YOUBIKE_DIALOGUES.forEach((item) => {
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
      expect(item.youbikeGlossary.length).toBeGreaterThan(0)
    })
  })
})
