import { describe, it, expect } from 'vitest'
import { ROAD_TRIP_DIALOGUES } from './data/roadTripZhDialogues'

describe('Chinese Road Trip & Car Rental Dialogues Integrity Tests', () => {
  it('contains structured road trip/car rental scenarios with dialogue lines and road trip glossaries', () => {
    expect(ROAD_TRIP_DIALOGUES.length).toBeGreaterThanOrEqual(2)
    ROAD_TRIP_DIALOGUES.forEach((item) => {
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
      expect(item.roadTripGlossary.length).toBeGreaterThan(0)
    })
  })
})
