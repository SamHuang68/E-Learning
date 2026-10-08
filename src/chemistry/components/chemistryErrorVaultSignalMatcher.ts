import type { UiLocale } from '../../i18n/locale'
import type { ChemistryQuestion } from '../data/curriculum'
import { CHEMISTRY_SOLVING_SIGNALS } from '../data/solvingSignals'
import {
  CHEMISTRY_ENGLISH_COVERAGE,
  localizeChemistryQuestion,
  localizeChemistrySignal,
} from '../locale/content'

const STOP_WORDS = new Set([
  'about', 'after', 'also', 'before', 'between', 'choose', 'does', 'each',
  'find', 'from', 'given', 'into', 'more', 'question', 'should', 'than',
  'that', 'their', 'then', 'there', 'these', 'they', 'this', 'through',
  'using', 'what', 'when', 'where', 'which', 'with',
])

function tokens(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/\\[a-z]+/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !STOP_WORDS.has(token))
}

/**
 * 以同一份英文 canonical copy 做語義排名，再依目前語系回傳同一訊號。
 * 找不到同時具有主題與題幹線索的訊號時 fail-closed，避免任一語系硬塞第一筆訊號。
 */
export function findMatchingChemistrySignal(
  question: ChemistryQuestion,
  locale: UiLocale,
) {
  const hasCanonicalEnglishQuestion =
    Object.prototype.hasOwnProperty.call(CHEMISTRY_ENGLISH_COVERAGE.questions, question.id) ||
    Object.prototype.hasOwnProperty.call(CHEMISTRY_ENGLISH_COVERAGE.mockQuestions, question.id)
  if (!hasCanonicalEnglishQuestion) return undefined

  const englishQuestion = localizeChemistryQuestion(question, 'en')
  const text = `${englishQuestion.title} ${englishQuestion.question} ${englishQuestion.solution}`
  const questionTokens = new Set(tokens(text))
  const ranked = CHEMISTRY_SOLVING_SIGNALS
    .map((sourceSignal) => {
      const signal = localizeChemistrySignal(sourceSignal, 'en')
      const topicOverlap = tokens(signal.topic).filter((token) =>
        questionTokens.has(token),
      ).length
      const cueOverlap = new Set(tokens(signal.problemSignal))
      const cueMatches = [...cueOverlap].filter((token) =>
        questionTokens.has(token),
      ).length
      return { sourceSignal, topicOverlap, cueMatches }
    })
    .filter(
      ({ topicOverlap, cueMatches }) => topicOverlap >= 2 && cueMatches >= 4,
    )
    .sort(
      (left, right) =>
        right.topicOverlap - left.topicOverlap || right.cueMatches - left.cueMatches,
    )

  const matched = ranked[0]?.sourceSignal
  return matched ? localizeChemistrySignal(matched, locale) : undefined
}
