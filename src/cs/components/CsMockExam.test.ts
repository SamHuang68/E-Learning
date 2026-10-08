import { describe, expect, it } from 'vitest'
import source from './CsMockExam.tsx?raw'

describe('CsMockExam locale-reactive session contract', () => {
  it('derives localized exam content without storing it in session state', () => {
    expect(source).toContain('const currentExam = React.useMemo(')
    expect(source).toContain('() => localizeCsMockExam(locale, CS_MOCK_EXAMS[selectedExamKey])')
    expect(source).toContain('[locale, selectedExamKey]')
    expect(source).not.toContain('setCurrentExam(')
  })

  it('resets answers and timer only when the selected exam changes', () => {
    const resetEffect = source.match(
      /useEffect\(\(\) => \{\s*setActiveQuestionIdx\(0\)[\s\S]*?setIsTimerRunning\(true\)\s*\}, \[([^\]]+)\]\)/,
    )

    expect(resetEffect?.[1].trim()).toBe('selectedExamKey')
    expect(resetEffect?.[1]).not.toContain('locale')
  })
})
