import type { CsMockExam } from '../cs/data/mockExams'
import type { CsQuestion, CsUnit } from '../cs/data/curriculum'
import type { CsSolvingSignal } from '../cs/data/solvingSignals'
import type { TextbookChapter } from '../cs/data/textbookData'
import {
  CS_EXAM_EN,
  CS_QUESTION_TITLE_EN,
  CS_SIGNAL_TOPIC_EN,
  CS_UNIT_CONCEPTS_EN,
} from './csTeachingCopyData'
import { CS_QUESTION_COPY_EN } from './csQuestionCopyRegistry'
import { CS_SIGNAL_COPY_EN } from './csSignalCopyData'
import { CS_TEXTBOOK_COPY_EN } from './csTextbookCopyData'
import type { UiLocale } from './locale'

const HAN = /[\u3400-\u9fff\uf900-\ufaff]/u
const HAN_GLOBAL = /[\u3400-\u9fff\uf900-\ufaff]+/gu

const EN: Readonly<Record<string, string>> = {
  '單元 1：軟體與硬體之本質定義與電腦系統階層':
    'Unit 1: Hardware, Software, and Computer-System Layers',
  '單元 2：馮紐曼架構與電腦傳統五大功能單元':
    'Unit 2: Von Neumann Architecture and the Five Functional Units',
  '單元 3：資料表示法、二補數與數位邏輯電路':
    "Unit 3: Data Representation, Two's Complement, and Digital Logic",
  '單元 4：作業系統核心、行程排程與記憶體管理':
    'Unit 4: Operating-System Kernels, Process Scheduling, and Memory Management',
  '單元 5：電腦網路架構、TCP/IP 與網際網路通訊協定':
    'Unit 5: Computer Networks, TCP/IP, and Internet Protocols',
  '單元 6：現代人工智慧 (AI) 運算架構與加速晶片趨勢':
    'Unit 6: Modern AI Computing Architectures and Accelerator Trends',
  '單元 7：當代前沿 AI 演算法、Transformer 與大語言模型架構':
    'Unit 7: Frontier AI Algorithms, Transformers, and Large Language Models',
  基礎核心: 'Core foundations',
  系統架構: 'Systems architecture',
  前沿AI: 'Frontier AI',
}

/**
 * Localizes an exact CS curriculum label. Missing entries fail closed so a new
 * source label cannot silently cross the English display boundary.
 */
export function csTeachingCopy(locale: UiLocale, text: string): string {
  if (locale !== 'en') return text
  if (!Object.hasOwn(EN, text)) {
    throw new Error(`Missing CS teaching English translation: ${text}`)
  }
  const translated = EN[text]
  assertEnglish(translated, text)
  return translated
}

function assertEnglish(value: unknown, context: string): void {
  const visit = (entry: unknown, path: string): void => {
    if (typeof entry === 'string') {
      if (entry.trim() === '') throw new Error(`Empty CS English translation: ${path}`)
      if (HAN.test(entry)) throw new Error(`CS English translation contains Han characters: ${path}`)
      return
    }
    if (Array.isArray(entry)) {
      entry.forEach((item, index) => visit(item, `${path}[${index}]`))
      return
    }
    if (entry && typeof entry === 'object') {
      Object.entries(entry).forEach(([key, item]) => visit(item, `${path}.${key}`))
    }
  }
  visit(value, context)
}

function englishFormula(value: string): string {
  return value
    .replace(/正規化數/g, 'normalized number')
    .replace(/在網路分區發生時/g, 'during a network partition')
    .replace(/若互有大小則/g, 'otherwise concurrent')
    .replace(/若互有大小即/g, 'otherwise concurrent')
    .replace(/存在/g, 'exists')
    .replace(/殘留或無記錄/g, 'stale or absent')
    .replace(HAN_GLOBAL, 'term')
}

function localizeQuestionEnglish(source: CsQuestion): CsQuestion {
  const title = CS_QUESTION_TITLE_EN[source.id]
  const copy = CS_QUESTION_COPY_EN[source.id]
  if (!title || !copy) throw new Error(`Missing CS question English translation: ${source.id}`)
  if (copy.options.length !== source.options?.length) {
    throw new Error(`CS question option-count mismatch: ${source.id}`)
  }
  if (copy.solution.length !== source.solution.length) {
    throw new Error(`CS question solution-step mismatch: ${source.id}`)
  }
  const localized: CsQuestion = {
    ...source,
    title,
    question: copy.question,
    options: [...copy.options],
    solution: [...copy.solution],
    explanation: copy.explanation,
    tags: [...copy.tags],
  }
  assertEnglish(
    {
      title: localized.title,
      question: localized.question,
      options: localized.options ?? [],
      solution: localized.solution,
      explanation: localized.explanation,
      tags: localized.tags,
    },
    source.id,
  )
  return localized
}

export function localizeCsQuestion(locale: UiLocale, source: CsQuestion): CsQuestion {
  if (locale !== 'en') return source
  return localizeQuestionEnglish(source)
}

export function localizeCsUnit(locale: UiLocale, source: CsUnit): CsUnit {
  if (locale !== 'en') return source
  const concepts = CS_UNIT_CONCEPTS_EN[source.id]
  if (!concepts) throw new Error(`Missing CS unit English translation: ${source.id}`)
  if (concepts.length !== source.concepts.length) {
    throw new Error(`CS unit concept-count mismatch: ${source.id}`)
  }
  const localized: CsUnit = {
    ...source,
    title: csTeachingCopy(locale, source.title),
    concepts: [...concepts],
    questions: source.questions.map(localizeQuestionEnglish),
  }
  assertEnglish(
    {
      title: localized.title,
      subtitle: localized.subtitle,
      concepts: localized.concepts,
      questions: localized.questions.map(({ title, question, options, solution, explanation, tags }) => ({
        title,
        question,
        options: options ?? [],
        solution,
        explanation,
        tags,
      })),
    },
    source.id,
  )
  return localized
}

export function localizeCsMockExam(locale: UiLocale, source: CsMockExam): CsMockExam {
  if (locale !== 'en') return source
  const copy = CS_EXAM_EN[source.id]
  if (!copy) throw new Error(`Missing CS mock-exam English translation: ${source.id}`)
  const localized: CsMockExam = {
    ...source,
    ...copy,
    questions: source.questions.map(localizeQuestionEnglish),
  }
  assertEnglish({ title: localized.title, subtitle: localized.subtitle, questions: localized.questions }, source.id)
  return localized
}

export function localizeCsSignal(locale: UiLocale, source: CsSolvingSignal): CsSolvingSignal {
  if (locale !== 'en') return source
  const topic = CS_SIGNAL_TOPIC_EN[source.id]
  const copy = CS_SIGNAL_COPY_EN[source.id]
  if (!topic || !copy) throw new Error(`Missing CS solving-signal English translation: ${source.id}`)
  const localized: CsSolvingSignal = {
    ...source,
    topic,
    problemSignal: copy.problemSignal,
    threeSecondRule: copy.threeSecondRule,
    firstStepFormula: englishFormula(source.firstStepFormula),
    exampleProblem: {
      question: copy.exampleQuestion,
      quickSolve: copy.quickSolve,
    },
  }
  assertEnglish(
    {
      topic: localized.topic,
      problemSignal: localized.problemSignal,
      threeSecondRule: localized.threeSecondRule,
      firstStepFormula: localized.firstStepFormula,
      exampleProblem: localized.exampleProblem,
    },
    source.id,
  )
  return localized
}

export function localizeCsTextbookChapter(locale: UiLocale, source: TextbookChapter): TextbookChapter {
  if (locale !== 'en') return source
  const copy = CS_TEXTBOOK_COPY_EN[source.id]
  if (!copy) throw new Error(`Missing CS textbook English translation: ${source.id}`)
  if (copy.prerequisites.length !== source.prerequisites.length) {
    throw new Error(`CS textbook prerequisite-count mismatch: ${source.id}`)
  }
  if (copy.historicalContext.keyFigures.length !== source.historicalContext.keyFigures.length) {
    throw new Error(`CS textbook key-figure-count mismatch: ${source.id}`)
  }
  if (copy.firstPrinciples.mathematicalDerivations.length !== source.firstPrinciples.mathematicalDerivations.length) {
    throw new Error(`CS textbook derivation-count mismatch: ${source.id}`)
  }
  if (copy.architecturalDeepDive.keySubsystems.length !== source.architecturalDeepDive.keySubsystems.length) {
    throw new Error(`CS textbook subsystem-count mismatch: ${source.id}`)
  }
  if (copy.industrialCaseStudies.length !== source.industrialCaseStudies.length) {
    throw new Error(`CS textbook case-study-count mismatch: ${source.id}`)
  }
  if (copy.deepThinkingQuestions.length !== source.deepThinkingQuestions.length) {
    throw new Error(`CS textbook deep-question-count mismatch: ${source.id}`)
  }
  if (copy.classicReferences.length !== source.classicReferences.length) {
    throw new Error(`CS textbook reference-count mismatch: ${source.id}`)
  }
  const localized: TextbookChapter = {
    ...source,
    ...copy,
    prerequisites: [...copy.prerequisites],
    historicalContext: {
      ...copy.historicalContext,
      keyFigures: [...copy.historicalContext.keyFigures],
    },
    firstPrinciples: {
      ...copy.firstPrinciples,
      mathematicalDerivations: copy.firstPrinciples.mathematicalDerivations.map((item) => ({ ...item })),
    },
    architecturalDeepDive: {
      ...copy.architecturalDeepDive,
      keySubsystems: copy.architecturalDeepDive.keySubsystems.map((item) => ({ ...item })),
    },
    industrialCaseStudies: copy.industrialCaseStudies.map((item) => ({ ...item })),
    deepThinkingQuestions: copy.deepThinkingQuestions.map((item) => ({ ...item })),
    classicReferences: copy.classicReferences.map((item) => ({ ...item })),
  }
  assertEnglish(
    {
      title: localized.title,
      englishTitle: localized.englishTitle,
      prerequisites: localized.prerequisites,
      historicalContext: localized.historicalContext,
      firstPrinciples: localized.firstPrinciples,
      architecturalDeepDive: localized.architecturalDeepDive,
      industrialCaseStudies: localized.industrialCaseStudies,
      deepThinkingQuestions: localized.deepThinkingQuestions,
      classicReferences: localized.classicReferences,
    },
    source.id,
  )
  return localized
}
