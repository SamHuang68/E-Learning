import { describe, it, expect } from 'vitest'
import { PET_DIALOGUES } from './data/petZhDialogues'

describe('Chinese Pet Friendly & Vet Dialogues Integrity Tests', () => {
  it('contains structured pet friendly/vet scenarios with dialogue lines and pet glossaries', () => {
    expect(PET_DIALOGUES.length).toBeGreaterThanOrEqual(1)
    PET_DIALOGUES.forEach((item) => {
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
      expect(item.petGlossary.length).toBeGreaterThan(0)
    })
  })
})
