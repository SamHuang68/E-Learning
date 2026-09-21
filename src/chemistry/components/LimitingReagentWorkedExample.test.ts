import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('LimitingReagentWorkedExample a11y', () => {
  it('uses a labelled section, table caption, and row headers', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/chemistry/components/LimitingReagentWorkedExample.tsx'),
      'utf8',
    )
    expect(src).toContain('aria-labelledby={titleId}')
    expect(src).toContain('<caption>')
    expect(src).toContain('scope="col"')
    expect(src).toContain('scope="row"')
    expect(src).toContain('<ol')
    expect(src).toContain("t('chemistry.limiting.honesty')")
    const view = readFileSync(
      join(process.cwd(), 'src/chemistry/components/ChemistrySignalsView.tsx'),
      'utf8',
    )
    expect(view).toContain('LimitingReagentWorkedExample')
    expect(view).toContain("sig.id === 'sig-mass-conservation-limiting'")
  })
})
