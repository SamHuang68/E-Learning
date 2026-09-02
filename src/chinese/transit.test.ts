import { describe, it, expect } from 'vitest'
import { TRANSIT_SCENARIOS } from './data/transitDialogues'

describe('Chinese Transit & Metro Dialogues Integrity Tests', () => {
  it('contains structured transit scenarios with dialogue lines and vocabulary tips', () => {
    expect(TRANSIT_SCENARIOS.length).toBeGreaterThanOrEqual(2)
    TRANSIT_SCENARIOS.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.scenarioJa).toBeTruthy()
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
      expect(item.usefulVocabulary.length).toBeGreaterThan(0)
    })
  })
})
