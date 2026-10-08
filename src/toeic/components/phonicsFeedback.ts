import type { UiLocale } from '../../i18n/locale'
import { pickUi } from '../../i18n/pickUi'

export type PhonicsQuizFeedback = 'idle' | 'correct' | 'wrong'

export function formatPhonicsListenFeedback(
  locale: UiLocale,
  feedback: PhonicsQuizFeedback,
  answerLabel: string,
): string {
  if (feedback === 'idle') return ''
  return pickUi(
    locale,
    `${feedback === 'correct' ? '答對了！' : '答錯了。'} 正確單字：${answerLabel}`,
    `${feedback === 'correct' ? 'Correct!' : 'Not quite.'} Correct word: ${answerLabel}`,
  )
}
