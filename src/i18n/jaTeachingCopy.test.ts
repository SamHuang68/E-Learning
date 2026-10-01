import { describe, expect, it } from 'vitest'
import { JA_TEACHING_EN, jaTeachingCopy, localizeJaPractice } from './jaTeachingCopy'
import { jaPracticeContent } from '../data/practiceContent'
import { jlptLevels } from '../data/course'
import { sessionFromUnitPractice, gradeAnswer } from '../engine/exercises'

const HAN = /[\u3400-\u9fff\uf900-\ufaff]/
const fields = ['meaning', 'sentenceZh', 'scenario'] as const

describe('日語完整教材的英文翻譯覆蓋', () => {
  for (const level of jlptLevels) {
    for (const unit of level.units) {
      const id = `${level.id}:${unit.id}`
      it(`${id} 的每個教學字串都有明確且無漢字的英文對應`, () => {
        const pack = jaPracticeContent[id]
        expect(pack, id).toBeDefined()
        const strings = [unit.title, level.scoreHint, level.audience,
          ...[...pack.vocab, ...pack.passage, ...pack.grammar].flatMap(card => fields.map(field => card[field]).filter((text): text is string => text !== undefined))]
        for (const text of strings) {
          expect(Object.hasOwn(JA_TEACHING_EN, text), `${id}: ${text}`).toBe(true)
          expect(jaTeachingCopy('en', text), `${id}: ${text}`).not.toMatch(HAN)
          expect(jaTeachingCopy('en', text).trim()).not.toBe('')
          expect(jaTeachingCopy('zh-Hant', text)).toBe(text)
        }
      })
    }
  }
  it('缺漏字串明確失敗，不能用原文悄悄回退', () => {
    expect(() => jaTeachingCopy('en', '尚未收錄的教學字串')).toThrow('缺少日語教材英文翻譯')
    expect(() => jaTeachingCopy('en', 'toString')).toThrow('缺少日語教材英文翻譯')
  })
  it('整張英文表沒有漢字或空白譯文', () => {
    for (const [source, translated] of Object.entries(JA_TEACHING_EN)) {
      expect(translated, source).not.toMatch(HAN)
      expect(translated.trim(), source).not.toBe('')
    }
  })
  it('十八包二百三十四張卡片保留日語題目、識別及作答能力', () => {
    let cardCount = 0
    for (const [id, raw] of Object.entries(jaPracticeContent)) {
      const copy = localizeJaPractice(raw, 'en')!
      expect(localizeJaPractice(raw, 'zh-Hant')).toBe(raw)
      const originalCards = [...raw.vocab, ...raw.passage, ...raw.grammar]
      const cards = [...copy.vocab, ...copy.passage, ...copy.grammar]
      cardCount += cards.length
      cards.forEach((card, index) => {
        expect(card.id, id).toBe(originalCards[index].id)
        expect(card.head).toBe(originalCards[index].head)
        expect(card.sentence).toBe(originalCards[index].sentence)
        for (const field of fields) expect(card[field] ?? '', `${id}: ${card.id}.${field}`).not.toMatch(HAN)
      })
      for (const kind of ['vocab', 'reading', 'grammar'] as const) {
        const exercises = sessionFromUnitPractice(copy, kind, 'ja')
        expect(exercises.map(ex => ex.id)).toEqual(sessionFromUnitPractice(raw, kind, 'ja').map(ex => ex.id))
        for (const ex of exercises) expect(gradeAnswer(ex, ex.answer)).toBe(true)
      }
    }
    expect(Object.keys(jaPracticeContent)).toHaveLength(18)
    expect(cardCount).toBe(234)
  })
})
