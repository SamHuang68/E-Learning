import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LocaleContext, type LocaleContextValue } from '../../i18n/i18n'
import { translate } from '../../i18n/messages'
import { CS_CURRICULUM, isCsAdvancedUnit } from '../data/curriculum'
import type { CsProgress } from '../utils/csStorage'
import { CsToday } from './CsToday'

const noop = () => {}

const englishLocale: LocaleContextValue = {
  locale: 'en',
  setLocale: noop,
  t: (key, vars) => translate('en', key, vars),
}

function renderWithLocale(context: LocaleContextValue, node: ReactNode): string {
  return renderToStaticMarkup(
    <LocaleContext.Provider value={context}>{node}</LocaleContext.Provider>,
  )
}

describe('CsToday', () => {
  it('核心單元全完成時顯示完成與複習狀態，不推薦進階單元', () => {
    const completedQuestions = CS_CURRICULUM
      .filter((unit) => !isCsAdvancedUnit(unit))
      .flatMap((unit) => unit.questions.map((question) => question.id))
    const progress: CsProgress = {
      completedQuestions,
      xp: completedQuestions.length * 10,
      errorQuestions: [],
      examScores: {},
      labCompleted: [],
      lastActiveDate: '2026-10-08',
    }

    const html = renderWithLocale(
      englishLocale,
      <CsToday progress={progress} onNavigate={noop} />,
    )

    expect(html).toContain('<h1>Core path complete</h1>')
    expect(html).toContain('Review core practice')
    expect(html).toContain(`Core questions ${completedQuestions.length}/${completedQuestions.length} completed`)
    expect(html).not.toContain('<h1>Next:')
    expect(html).not.toContain('Unit 6:')
    expect(html).not.toContain('Unit 7:')
    expect(html).not.toContain('Start with the lab')
  })
})
