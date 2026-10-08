import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { CS_CURRICULUM } from '../cs/data/curriculum'
import { CS_MOCK_EXAMS } from '../cs/data/mockExams'
import { CS_SOLVING_SIGNALS } from '../cs/data/solvingSignals'
import { CS_TEXTBOOK_CHAPTERS } from '../cs/data/textbookData'
import readerSource from '../cs/components/CsTextbookReader.tsx?raw'
import { CS_QUESTION_COPY_EN } from './csQuestionCopyRegistry'
import { CS_SIGNAL_COPY_EN } from './csSignalCopyData'
import { CS_TEXTBOOK_COPY_EN } from './csTextbookCopyData'
import {
  csTeachingCopy,
  localizeCsMockExam,
  localizeCsQuestion,
  localizeCsSignal,
  localizeCsTextbookChapter,
  localizeCsUnit,
} from './csTeachingCopy'

const HAN = /[㐀-鿿豈-﫿]/

describe('CS teaching content in English mode', () => {
  it('does not claim that the localized textbook is still Chinese-only', () => {
    expect(readerSource).toContain('English edition shown for the English interface.')
    expect(readerSource).not.toContain('Chapter content is currently in Traditional Chinese.')
  })

  it('has exact structured records for every question, signal, and textbook chapter', () => {
    const questionIds = [
      ...CS_CURRICULUM.flatMap((unit) => unit.questions.map((question) => question.id)),
      ...Object.values(CS_MOCK_EXAMS).flatMap((exam) => exam.questions.map((question) => question.id)),
    ]
    expect(Object.keys(CS_QUESTION_COPY_EN).sort()).toEqual([...questionIds].sort())
    expect(Object.keys(CS_SIGNAL_COPY_EN).sort()).toEqual(CS_SOLVING_SIGNALS.map((signal) => signal.id).sort())
    expect(Object.keys(CS_TEXTBOOK_COPY_EN).sort()).toEqual(CS_TEXTBOOK_CHAPTERS.map((chapter) => chapter.id).sort())

    for (const id of questionIds) {
      const copy = CS_QUESTION_COPY_EN[id]
      expect(copy.solution.length, `${id}.solution`).toBeGreaterThan(0)
      expect(JSON.stringify(copy), id).not.toMatch(HAN)
    }
    for (const signal of CS_SOLVING_SIGNALS) {
      expect(JSON.stringify(CS_SIGNAL_COPY_EN[signal.id]), signal.id).not.toMatch(HAN)
    }
    for (const chapter of CS_TEXTBOOK_CHAPTERS) {
      expect(JSON.stringify(CS_TEXTBOOK_COPY_EN[chapter.id]), chapter.id).not.toMatch(HAN)
    }
  })

  it('covers all seven units and 112 questions without changing identity or grading fields', () => {
    expect(CS_CURRICULUM).toHaveLength(7)
    expect(CS_CURRICULUM.flatMap((unit) => unit.questions)).toHaveLength(112)
    for (const unit of CS_CURRICULUM) {
      const localized = localizeCsUnit('en', unit)
      expect(localized.id).toBe(unit.id)
      expect(localized.strand).toBe(unit.strand)
      expect(localized.band).toBe(unit.band)
      expect(localized.suggestedLab).toBe(unit.suggestedLab)
      expect(localized.title, unit.id).not.toMatch(HAN)
      expect(localized.subtitle, unit.id).not.toMatch(HAN)
      expect(localized.concepts).toHaveLength(unit.concepts.length)
      expect(JSON.stringify(localized.concepts), unit.id).not.toMatch(HAN)
      expect(localized.questions).toHaveLength(unit.questions.length)
      for (const [index, question] of localized.questions.entries()) {
        const source = unit.questions[index]
        expect(question.id).toBe(source.id)
        expect(question.answer).toBe(source.answer)
        expect(question.type).toBe(source.type)
        expect(question.difficulty).toBe(source.difficulty)
        expect(question.options).toHaveLength(source.options?.length ?? 0)
        expect(question.solution).toHaveLength(source.solution.length)
        expect(
          JSON.stringify({
            title: question.title,
            question: question.question,
            options: question.options,
            solution: question.solution,
            explanation: question.explanation,
            tags: question.tags,
          }),
          question.id,
        ).not.toMatch(HAN)
      }
      expect(localizeCsUnit('zh-Hant', unit)).toBe(unit)
    }
  })

  it('uses a distinct blind-spot explanation instead of repeating a solution step', () => {
    const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ')
    const repeatedBlindSpots = Object.entries(CS_QUESTION_COPY_EN)
      .filter(([, copy]) =>
        copy.solution.some((step) => normalize(step) === normalize(copy.explanation)),
      )
      .map(([id]) => id)

    expect(repeatedBlindSpots).toEqual([])
  })

  it('保留公式命令並拒絕 JavaScript 跳脫字元破壞 LaTeX', () => {
    const sourceQuestions = [
      ...CS_CURRICULUM.flatMap((unit) => unit.questions),
      ...Object.values(CS_MOCK_EXAMS).flatMap((exam) => exam.questions),
    ]
    const sourceStrings = sourceQuestions.flatMap((question) => [
      question.question,
      ...(question.options ?? []),
      ...question.solution,
      question.explanation,
    ])
    const sourceCommands = new Set(
      sourceStrings.flatMap((value) =>
        [...value.matchAll(/\\([A-Za-z]+)/g)].map((match) => match[1]),
      ),
    )
    const broken: string[] = []

    for (const [id, copy] of Object.entries(CS_QUESTION_COPY_EN)) {
      const values = [copy.question, ...copy.options, ...copy.solution, copy.explanation]
      for (const [valueIndex, value] of values.entries()) {
        for (const math of value.matchAll(/\$([^$]+)\$/g)) {
          const expression = math[1]
          const hasControlCharacter = [...expression].some((character) => {
            const codePoint = character.codePointAt(0) ?? 0
            return codePoint <= 0x1f || codePoint === 0x7f
          })
          if (hasControlCharacter) {
            broken.push(`${id}[${valueIndex}]:control-character`)
          }
          for (const command of sourceCommands) {
            const bareCommand = new RegExp(`(^|[^\\\\A-Za-z])${command}\\b`)
            if (bareCommand.test(expression)) {
              broken.push(`${id}[${valueIndex}]:${command}`)
            }
          }
          try {
            katex.renderToString(expression, { throwOnError: true })
          } catch {
            broken.push(`${id}[${valueIndex}]:katex-parse`)
          }
        }
      }
    }

    expect(broken).toEqual([])
  })

  it('保留訊號卡公式命令並確保所有 runtime 數學片段可由 KaTeX 解析', () => {
    const sourceStrings = CS_SOLVING_SIGNALS.flatMap((signal) => [
      signal.problemSignal,
      signal.threeSecondRule,
      signal.firstStepFormula,
      signal.exampleProblem.question,
      signal.exampleProblem.quickSolve,
    ])
    const sourceCommands = new Set(
      sourceStrings.flatMap((value) =>
        [...value.matchAll(/\\([A-Za-z]+)/g)].map((match) => match[1]),
      ),
    )
    const broken: string[] = []

    for (const signal of CS_SOLVING_SIGNALS) {
      const localized = localizeCsSignal('en', signal)
      const values = [
        localized.problemSignal,
        localized.threeSecondRule,
        localized.firstStepFormula,
        localized.exampleProblem.question,
        localized.exampleProblem.quickSolve,
      ]
      for (const [valueIndex, value] of values.entries()) {
        const expressions = valueIndex === 2
          ? [value]
          : [...value.matchAll(/\$([^$]+)\$/g)].map((math) => math[1])
        for (const expression of expressions) {
          const hasControlCharacter = [...expression].some((character) => {
            const codePoint = character.codePointAt(0) ?? 0
            return codePoint <= 0x1f || codePoint === 0x7f
          })
          if (hasControlCharacter) {
            broken.push(`${signal.id}[${valueIndex}]:control-character`)
          }
          for (const command of sourceCommands) {
            const bareCommand = new RegExp(`(^|[^\\\\A-Za-z])${command}\\b`)
            if (bareCommand.test(expression)) {
              broken.push(`${signal.id}[${valueIndex}]:${command}`)
            }
          }
          try {
            katex.renderToString(expression, { throwOnError: true })
          } catch {
            broken.push(`${signal.id}[${valueIndex}]:katex-parse`)
          }
        }
      }
    }

    expect(broken).toEqual([])
  })

  it('covers both mock exams, all signals, and all textbook display fields', () => {
    const exams = Object.values(CS_MOCK_EXAMS)
    expect(exams).toHaveLength(2)
    expect(exams.flatMap((exam) => exam.questions)).toHaveLength(8)
    for (const exam of exams) {
      const localized = localizeCsMockExam('en', exam)
      expect(localized.id).toBe(exam.id)
      expect(localized.targetExam).toBe(exam.targetExam)
      expect(localized.durationMinutes).toBe(exam.durationMinutes)
      expect(localized.totalPoints).toBe(exam.totalPoints)
      expect(JSON.stringify({ title: localized.title, subtitle: localized.subtitle, questions: localized.questions }), exam.id).not.toMatch(HAN)
    }

    expect(CS_SOLVING_SIGNALS).toHaveLength(44)
    for (const signal of CS_SOLVING_SIGNALS) {
      const localized = localizeCsSignal('en', signal)
      expect(localized.id).toBe(signal.id)
      expect(localized.strand).toBe(signal.strand)
      expect(JSON.stringify({ ...localized, strand: undefined }), signal.id).not.toMatch(HAN)
      expect(localizeCsSignal('zh-Hant', signal)).toBe(signal)
    }

    expect(CS_TEXTBOOK_CHAPTERS).toHaveLength(7)
    for (const chapter of CS_TEXTBOOK_CHAPTERS) {
      const localized = localizeCsTextbookChapter('en', chapter)
      expect(localized.id).toBe(chapter.id)
      expect(localized.chapterNumber).toBe(chapter.chapterNumber)
      expect(localized.strand).toBe(chapter.strand)
      expect(localized.readingTimeMinutes).toBe(chapter.readingTimeMinutes)
      expect(JSON.stringify({ ...localized, strand: undefined }), chapter.id).not.toMatch(HAN)
      expect(localizeCsTextbookChapter('zh-Hant', chapter)).toBe(chapter)
    }
  })

  it('fails closed when a new label or structured record has no English copy', () => {
    expect(() => csTeachingCopy('en', '尚未收錄的計算機教材字串')).toThrow(
      'Missing CS teaching English translation',
    )
    expect(() => csTeachingCopy('en', 'toString')).toThrow(
      'Missing CS teaching English translation',
    )
    expect(() => localizeCsQuestion('en', { ...CS_CURRICULUM[0].questions[0], id: 'cs-new-question' })).toThrow(
      'Missing CS question English translation',
    )
    expect(() => localizeCsUnit('en', { ...CS_CURRICULUM[0], id: 'cs-unit-8-untranslated' })).toThrow(
      'Missing CS unit English translation: cs-unit-8-untranslated',
    )
  })
})
