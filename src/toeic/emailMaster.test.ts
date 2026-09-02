import { describe, it, expect } from 'vitest'
import { EMAIL_TEMPLATES } from './data/emailTemplates'

describe('TOEIC Email Master Templates Integrity Tests', () => {
  it('contains structured email templates with formal/semi-formal bodies and quizzes', () => {
    expect(EMAIL_TEMPLATES.length).toBeGreaterThanOrEqual(2)
    EMAIL_TEMPLATES.forEach((item) => {
      expect(item.id).toBeTruthy()
      expect(item.category).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.titleJa).toBeTruthy()
      expect(item.subjectLine).toBeTruthy()
      expect(item.subjectLineJa).toBeTruthy()
      expect(item.formalBody).toBeTruthy()
      expect(item.semiFormalBody).toBeTruthy()
      expect(item.keyPhrases.length).toBeGreaterThan(0)
      item.keyPhrases.forEach((kp) => {
        expect(kp.phraseEn).toBeTruthy()
        expect(kp.phraseJa).toBeTruthy()
        expect(kp.phraseZh).toBeTruthy()
        expect(kp.purposeJa).toBeTruthy()
      })
      expect(item.quiz.questionZh).toBeTruthy()
      expect(item.quiz.questionJa).toBeTruthy()
      expect(item.quiz.options.length).toBe(4)
      expect(item.quiz.correctIndex).toBeGreaterThanOrEqual(0)
      expect(item.quiz.correctIndex).toBeLessThan(4)
      expect(item.quiz.clueExplanationJa).toBeTruthy()
    })
  })
})
