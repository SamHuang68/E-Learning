import { describe, expect, it } from 'vitest'
import { BALANCE_STEP_TEMPLATES, mathLabCopy } from '../../i18n/mathLabCopy'
import source from './BalanceScaleSolver.tsx?raw'

describe('BalanceScaleSolver locale-reactive derivation history', () => {
  it('stores canonical templates and translates them at render time', () => {
    expect(mathLabCopy('en', BALANCE_STEP_TEMPLATES.subtractConstant, [5, 'x = 7']))
      .toBe('Subtract 5 from both sides ➜ x = 7')
    expect(mathLabCopy('zh-Hant', BALANCE_STEP_TEMPLATES.subtractConstant, [5, 'x = 7']))
      .toBe('兩邊同時減去 5 ➜ x = 7')

    expect(source).toContain('text: BALANCE_STEP_TEMPLATES.subtractConstant')
    expect(source).toContain('text: BALANCE_STEP_TEMPLATES.subtractVariable')
    expect(source).toContain('text: BALANCE_STEP_TEMPLATES.divideByTwo')
    expect(source).toContain('{ml(s.text, s.values)}')
    expect(source).not.toMatch(/text:\s*copy\(/)
  })

  it('clears history only for preset selection or an explicit reset', () => {
    expect(source).not.toContain('useEffect(() => setStepHistory([]), [locale])')
    expect(source.match(/setStepHistory\(\[\]\)/g)).toHaveLength(2)
  })
})
