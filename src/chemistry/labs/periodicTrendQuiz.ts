import type { UiLocale } from '../../i18n/locale'
import { pickUi } from '../../i18n/pickUi'

export function formatPeriodicTrendQuiz(locale: UiLocale): string {
  const copy = (zhHant: string, en: string) => pickUi(locale, zhHant, en)
  const question = copy(
    '在第 3 週期中，哪個元素的共價原子半徑最大？',
    'Which element has the largest covalent atomic radius in Period 3?',
  )
  const options = locale === 'en'
    ? ['A. Cl — reversed-trend distractor', 'B. Na — correct (left-side metal)', 'C. Ar — noble-gas edge-case distractor', 'D. S — electronegativity-trend confusion']
    : ['A. Cl（氯）— 反向趨勢陷阱', 'B. Na（鈉）— 正確（左側金屬）', 'C. Ar（氬）— 惰性氣體邊緣陷阱', 'D. S（硫）— 混淆電負度趨勢']
  const result = copy(
    '正確答案：B（原子半徑由左向右遞減，因此 Na 在第 3 週期最大）。',
    'Correct: B (atomic radius decreases from left to right, so Na is largest in the period).',
  )

  return `${question}\n\n${copy('選項：', 'Options:')}\n${options.join('\n')}\n\n${result}`
}
