import { describe, it, expect } from 'vitest'
import { CS_TEXTBOOK_CHAPTERS } from './data/textbookData'

describe('計算機概論：教科書深度研讀體系單元測試', () => {
  it('7 大章節涵蓋計算機科學完整體系且內容充實嚴謹', () => {
    expect(CS_TEXTBOOK_CHAPTERS.length).toBe(7)
    for (const ch of CS_TEXTBOOK_CHAPTERS) {
      expect(ch.title).toBeTruthy()
      expect(ch.readingTimeMinutes).toBeGreaterThanOrEqual(20)
      expect(ch.historicalContext.keyFigures.length).toBeGreaterThanOrEqual(2)
      expect(ch.firstPrinciples.mathematicalDerivations.length).toBeGreaterThanOrEqual(2)
      expect(ch.architecturalDeepDive.keySubsystems.length).toBeGreaterThanOrEqual(3)
      expect(ch.industrialCaseStudies.length).toBeGreaterThanOrEqual(1)
      expect(ch.deepThinkingQuestions.length).toBeGreaterThanOrEqual(1)
      expect(ch.classicReferences.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('每一章節皆包含實質的歷史脈絡、數學公式與第一性原理推導', () => {
    for (const ch of CS_TEXTBOOK_CHAPTERS) {
      expect(ch.historicalContext.breakthroughStory.length).toBeGreaterThan(50)
      for (const math of ch.firstPrinciples.mathematicalDerivations) {
        expect(math.formula).toBeTruthy()
        expect(math.explanation.length).toBeGreaterThan(15)
      }
    }
  })
})
