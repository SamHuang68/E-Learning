import { describe, it, expect } from 'vitest'
import { MEDICAL_DIALOGUES } from './data/medicalDialogues'

describe('Chinese Medical & Healthcare Dialogues Integrity Tests', () => {
  it('contains structured medical scenarios with dialogue lines and symptom glossaries', () => {
    expect(MEDICAL_DIALOGUES.length).toBeGreaterThanOrEqual(2)
    MEDICAL_DIALOGUES.forEach((item) => {
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
      expect(item.symptomGlossary.length).toBeGreaterThan(0)
    })
  })
})
