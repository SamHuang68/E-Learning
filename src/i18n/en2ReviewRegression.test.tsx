import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { calculusCopy, loadCalculusCopy } from './calculusCopy'
import { PHYSICS_CONCEPT_CONTENT_EN } from './physicsConceptContentEn'
import { CalculusCanvas } from '../math/calculus/components/CalculusCanvas/CalculusCanvas'
import { StepByStepSolver } from '../math/calculus/components/CalculusSolver/StepByStepSolver'
import { generateDerivationSteps } from '../math/calculus/engine'
import { findMatchingChemistrySignal } from '../chemistry/utils/vaultSignal'
import { CHEMISTRY_MOCK_EXAMS } from '../chemistry/data/mockExams'
import { UI_LOCALE_KEY } from './locale'

beforeAll(async () => { await loadCalculusCopy() })
describe('Preserved handoff review regressions', () => {
  it('retains frequency nu in all three photon-energy concepts', () => {
    const photonCopy = Object.values(PHYSICS_CONCEPT_CONTENT_EN).filter(value => /Photon energy:|Hydrogen energy levels:|Einstein\x27s photoelectric equation:/.test(value))
    expect(photonCopy).toHaveLength(3)
    for (const text of photonCopy) {
      expect(text).toContain('h\\nu')
      expect(text).not.toContain('h\nu')
    }
  })
  it.each(['中文', '測試+1', 'x$中文'])('renders a recoverable canvas error for opaque expression %s', expression => {
    vi.stubGlobal('localStorage', { getItem: (key: string) => key === UI_LOCALE_KEY ? 'en' : null })
    try {
      const html = renderToStaticMarkup(createElement(CalculusCanvas, { expression, mode: 'tangent_secant' }))
      expect(html).toContain('Cannot parse')
      expect(html).toContain(expression)
      expect(html).toContain('Correct the expression')
      expect(calculusCopy('en', `無法解析「${expression}」：無法解析表達式`)).toBe(`Cannot parse "${expression}": Cannot parse expression`)
      expect(() => calculusCopy('en', '尚未翻譯的教學字串')).toThrow('缺少有效')
    } finally { vi.unstubAllGlobals() }
  })
  it.each(['中文', '測試+1', 'x$中文'])('preserves opaque expression in a localized solver title: %s', expression => {
    vi.stubGlobal('localStorage', { getItem: (key: string) => key === UI_LOCALE_KEY ? 'en' : null })
    try {
      const title = calculusCopy('en', "求函數 f(x) = {0} 的符號導函數與臨界點".replace('{0}', expression))
      const html = renderToStaticMarkup(createElement(StepByStepSolver, {
        problemTitle: title, steps: generateDerivationSteps(expression), currentStepIndex: 0, onStepChange: () => {},
      }))
      expect(html).toContain(expression)
      expect(html).toContain('Find the symbolic derivative')
      expect(html).toContain('Cannot parse')
    } finally { vi.unstubAllGlobals() }
  })
  it('uses the concentration-change question hint instead of a standard-potential signal', () => {
    const question = Object.values(CHEMISTRY_MOCK_EXAMS).flatMap(exam => exam.questions).find(q => q.id === 'ast_q3')
    expect(question).toBeDefined()
    expect(findMatchingChemistrySignal(question!)).toBeUndefined()
  })
})
