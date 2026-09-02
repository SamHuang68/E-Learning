import { describe, it, expect } from 'vitest'
import { FOOD_DIALOGUES } from './data/foodZhDialogues'

describe('Chinese Food & Boba Tea Dialogues Integrity Tests', () => {
  it('contains structured food/drink scenarios with dialogue lines and food glossaries', () => {
    expect(FOOD_DIALOGUES.length).toBeGreaterThanOrEqual(2)
    FOOD_DIALOGUES.forEach((item) => {
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
      expect(item.foodGlossary.length).toBeGreaterThan(0)
    })
  })
})
