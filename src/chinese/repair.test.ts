import { describe, it, expect } from 'vitest'
import { REPAIR_DIALOGUES } from './data/repairZhDialogues'

describe('Chinese Home Repair & Landlord Dialogues Integrity Tests', () => {
  it('contains structured home repair/landlord scenarios with dialogue lines and repair glossaries', () => {
    expect(REPAIR_DIALOGUES.length).toBeGreaterThanOrEqual(2)
    REPAIR_DIALOGUES.forEach((item) => {
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
      expect(item.repairGlossary.length).toBeGreaterThan(0)
    })
  })
})
