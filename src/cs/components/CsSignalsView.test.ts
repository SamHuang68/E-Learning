import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('CsSignalsView hydration', () => {
  it('reloads signal mastery after cloud progress hydration and removes its listener', () => {
    const source = readFileSync(
      join(process.cwd(), 'src/cs/components/CsSignalsView.tsx'),
      'utf8',
    )

    expect(source).toContain("window.addEventListener('e-learning:progress-hydrated', refreshMastery)")
    expect(source).toContain("window.addEventListener('cs:signals-mastery-updated', refreshMastery)")
    expect(source).toContain('setMastery(loadCsSignalsMastery())')
    expect(source).toContain("window.removeEventListener('e-learning:progress-hydrated', refreshMastery)")
    expect(source).toContain("window.removeEventListener('cs:signals-mastery-updated', refreshMastery)")
  })
})
