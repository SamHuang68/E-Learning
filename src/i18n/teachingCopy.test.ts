import { describe, expect, it } from 'vitest'
import {
  localizeMathExam,
  localizeMathGrade,
  localizeMathQuestion,
  mathTeachingCopy as teachingCopy,
} from './mathTeachingCopy'
import { jaTeachingCopy } from './jaTeachingCopy'
import { localizeMathSignal } from './mathSignalCopy'
import { getJaPractice } from '../data/practiceContent'
import { G1_DATA } from '../math/data/elementary/g1_to_g3'
import { ALL_MATH_GRADES } from '../math/data/gradeStore'
import { MOCK_EXAMS } from '../math/data/mockExams'
import type { MathQuestion } from '../math/data/curriculum'
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
  it('十二年級全部單元、題目欄位與實驗室均有嚴格英文顯示副本', () => {
    let unitCount = 0
    let questionCount = 0
    for (const sourceGrade of Object.values(ALL_MATH_GRADES)) {
      expect(localizeMathGrade(sourceGrade, 'zh-Hant')).toBe(sourceGrade)
      const grade = localizeMathGrade(sourceGrade, 'en')
      expect(grade.id).toBe(sourceGrade.id)
      expect(grade.units).toHaveLength(sourceGrade.units.length)
      expect(grade.labs).toHaveLength(sourceGrade.labs.length)
      expect([grade.name, grade.band, grade.description, grade.targetExam ?? '', ...grade.labs.flatMap((lab) => [lab.name, lab.description])].join('\n')).not.toMatch(CJK)
      for (let unitIndex = 0; unitIndex < sourceGrade.units.length; unitIndex += 1) {
        unitCount += 1
        const sourceUnit = sourceGrade.units[unitIndex]
        const unit = grade.units[unitIndex]
        expect(unit.id).toBe(sourceUnit.id)
        expect(unit.key).toBe(sourceUnit.key)
        expect(unit.totalPoints).toBe(sourceUnit.totalPoints)
        expect(unit.questions).toHaveLength(sourceUnit.questions.length)
        expect([unit.title, unit.subtitle, ...unit.concepts].join('\n')).not.toMatch(CJK)
        for (let questionIndex = 0; questionIndex < sourceUnit.questions.length; questionIndex += 1) {
          questionCount += 1
          const sourceQuestion = sourceUnit.questions[questionIndex]
          const question = unit.questions[questionIndex]
          expect(question.id).toBe(sourceQuestion.id)
          expect(question.answer).toEqual(sourceQuestion.answer)
          expect(question.type).toBe(sourceQuestion.type)
          expect(question.difficulty).toBe(sourceQuestion.difficulty)
          expect(question.strand).toBe(sourceQuestion.strand)
          expect([question.title, question.question, question.solution, question.hint ?? '', question.competency ?? '', ...(question.options ?? [])].join('\n'), question.id).not.toMatch(CJK)
        }
      }
    }
    expect(unitCount).toBe(36)
    expect(questionCount).toBe(108)
  })
  it('三張練習卷的題幹、選項、詳解與評分說明均完整英文化', () => {
    let questionCount = 0
    for (const sourceExam of Object.values(MOCK_EXAMS)) {
      expect(localizeMathExam(sourceExam, 'zh-Hant')).toBe(sourceExam)
      const exam = localizeMathExam(sourceExam, 'en')
      expect(exam.id).toBe(sourceExam.id)
      expect(exam.durationMinutes).toBe(sourceExam.durationMinutes)
      expect(exam.totalPoints).toBe(sourceExam.totalPoints)
      expect([exam.title, exam.subtitle, exam.targetGrade, exam.gradingScale].join('\n')).not.toMatch(CJK)
      for (let index = 0; index < sourceExam.questions.length; index += 1) {
        questionCount += 1
        const sourceQuestion = sourceExam.questions[index]
        const question = exam.questions[index]
        expect(question.id).toBe(sourceQuestion.id)
        expect(question.answer).toEqual(sourceQuestion.answer)
        expect([question.title, question.question, question.solution, question.hint ?? '', question.competency ?? '', ...(question.options ?? [])].join('\n'), question.id).not.toMatch(CJK)
      }
    }
    expect(questionCount).toBe(19)
  })
  it('所有解題訊號卡均有英文，缺少題目翻譯時直接失敗', () => {
    for (const item of MATH_SOLVING_SIGNALS) {
      const copy = localizeMathSignal(item, 'en')
      expect(JSON.stringify(copy), item.id).not.toMatch(CJK)
      expect(copy.id).toBe(item.id)
      expect(localizeMathSignal(item, 'zh-Hant')).toBe(item)
    }
    const missing: MathQuestion = {
      id: 'missing-translation-proof',
      title: '缺少翻譯',
      strand: 'number',
      type: 'fill',
      difficulty: 1,
      question: '題目',
      answer: 1,
      solution: '解法',
    }
    expect(() => localizeMathQuestion(missing, 'en')).toThrow(/Missing English math question/)
    expect(localizeMathQuestion(missing, 'zh-Hant')).toBe(missing)
  })
  it('日語第一單元的十三張卡片均保留識別與日語題目並翻譯中文說明', () => {
    const pack = getJaPractice('n5n4', 1)!
    const localized = Object.fromEntries(Object.entries(pack).map(([key, cards]) => [key, cards.map(card => ({
      ...card, meaning: jaTeachingCopy('en', card.meaning),
      sentenceZh: jaTeachingCopy('en', card.sentenceZh ?? ''),
      scenario: jaTeachingCopy('en', card.scenario),
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
