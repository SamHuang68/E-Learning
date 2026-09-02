import { describe, it, expect } from 'vitest'
import { DRAGON_BOAT_DIALOGUES } from './data/dragonBoatZhDialogues'

describe('Chinese Dragon Boat Festival & Zongzi Dialogues Integrity Tests', () => {
  it('contains structured Dragon Boat scenarios with dialogue lines and glossaries', () => {
    expect(DRAGON_BOAT_DIALOGUES.length).toBeGreaterThanOrEqual(1)
    DRAGON_BOAT_DIALOGUES.forEach((item) => {
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
      expect(item.dragonBoatGlossary.length).toBeGreaterThan(0)
    })
  })
})
