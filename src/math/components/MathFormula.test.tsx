import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CHEMISTRY_CONCEPT_CONTENT_EN } from '../../i18n/chemistryConceptContentEn'
import { STEM_VAULT_CONTENT_EN } from '../../i18n/stemVaultContentEn'
import { MathFormula } from './MathFormula'

const catalogues = import.meta.glob([
  '../data/**/*.ts',
  '../../physics/data/**/*.ts',
  '../../chemistry/data/**/*.ts',
  '!../data/**/*.test.ts',
  '!../../physics/data/**/*.test.ts',
  '!../../chemistry/data/**/*.test.ts',
], { eager: true })

function stringsIn(value: unknown, seen = new Set<object>()): string[] {
  if (typeof value === 'string') return [value]
  if (!value || typeof value !== 'object' || seen.has(value)) return []
  seen.add(value)
  return Object.values(value).flatMap(item => stringsIn(item, seen))
}

describe('STEM formula rendering', () => {
  it.each([
    ['curriculum, questions, and solving signals', catalogues],
    ['English question content', STEM_VAULT_CONTENT_EN],
    ['English chemistry concepts', CHEMISTRY_CONCEPT_CONTENT_EN],
  ])('renders %s without broken TeX escapes or KaTeX errors', (_name, catalogue) => {
    const texts = [...new Set(stringsIn(catalogue))].filter(text => text.includes('$'))
    expect(texts.length).toBeGreaterThan(0)
    for (const text of texts) {
      for (const match of text.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$\n]+?)\$/g)) {
        const formula = match[1] ?? match[2]
        // A single JS backslash turns \text and \times into tabs, and \frac
        // into a form feed. Some still parse but silently change the notation.
        const controls = [...formula].filter(char => char.charCodeAt(0) < 32 && char !== '\n' && char !== '\r')
        expect(controls, formula).toEqual([])
      }
      expect(renderToStaticMarkup(<MathFormula math={text} />), text).not.toContain('class="katex-error"')
    }
  })
})
