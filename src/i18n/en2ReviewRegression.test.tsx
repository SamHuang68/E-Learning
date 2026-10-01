import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { calculusCopy, loadCalculusCopy } from './calculusCopy'
import { PHYSICS_CONCEPT_CONTENT_EN } from './physicsConceptContentEn'
import { CalculusCanvas } from '../math/calculus/components/CalculusCanvas/CalculusCanvas'
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
})
