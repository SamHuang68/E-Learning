import { describe, expect, it } from 'vitest'
import { teachingCopy } from './teachingCopy'
import { localizeMathSignal } from './mathSignalCopy'
import { getJaPractice } from '../data/practiceContent'
import { G1_DATA } from '../math/data/elementary/g1_to_g3'
import { MATH_SOLVING_SIGNALS } from '../math/data/solvingSignals'
import { sessionFromUnitPractice, gradeAnswer } from '../engine/exercises'

const CJK = /[\u3400-\u9fff]/
describe('英文驗收路徑的教材翻譯', () => {
  it('一年級 Today 的可見資料完整對應英文並保留原始教材', () => {
    const strings = [G1_DATA.name, G1_DATA.band, G1_DATA.description,
      ...G1_DATA.units.flatMap(u => [u.title, u.subtitle]),
      ...G1_DATA.units[0].concepts,
      ...G1_DATA.labs.flatMap(lab => [lab.name, lab.description])]
    for (const text of strings) {
      expect(teachingCopy('en', text), text).not.toMatch(CJK)
      expect(teachingCopy('zh-Hant', text)).toBe(text)
    }
  })
  it('六張國小訊號卡含展開例題均有英文並保留公式', () => {
    for (const item of MATH_SOLVING_SIGNALS.filter(s => s.stage === 'elementary')) {
      const copy = localizeMathSignal(item, 'en')
      expect(JSON.stringify(copy)).not.toMatch(CJK)
      expect(copy.id).toBe(item.id)
      expect(localizeMathSignal(item, 'zh-Hant')).toBe(item)
    }
  })
  it('日語第一單元的十三張卡片均保留識別與日語題目並翻譯中文說明', () => {
    const pack = getJaPractice('n5n4', 1)!
    const localized = Object.fromEntries(Object.entries(pack).map(([key, cards]) => [key, cards.map(card => ({
      ...card, meaning: teachingCopy('en', card.meaning),
      sentenceZh: teachingCopy('en', card.sentenceZh ?? ''),
      scenario: teachingCopy('en', card.scenario),
    }))])) as typeof pack
    const cards = [...localized.vocab, ...localized.passage, ...localized.grammar]
    expect(cards).toHaveLength(13)
    for (const card of cards) {
      expect([card.meaning, card.sentenceZh, card.scenario].join(' ')).not.toMatch(CJK)
    }
    const raw = sessionFromUnitPractice(pack, 'vocab', 'ja')
    const english = sessionFromUnitPractice(localized, 'vocab', 'ja')
    expect(english.map(ex => ex.id)).toEqual(raw.map(ex => ex.id))
    for (const ex of english) expect(gradeAnswer(ex, ex.answer)).toBe(true)
  })
})
