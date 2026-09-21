import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('WhyThisNext cross-track copy', () => {
  it('is wired on Hub and STEM Today views with honest local/catalog reasons', () => {
    const src = readFileSync(join(process.cwd(), 'src/components/WhyThisNext.tsx'), 'utf8')
    expect(src).toContain("t('today.whyHonesty')")
    expect(src).toContain("t('today.whyUnit')")
    expect(src).toContain('role="note"')
    const files = [
      'src/Hub.tsx',
      'src/math/components/MathToday.tsx',
      'src/physics/components/PhysicsToday.tsx',
      'src/chemistry/components/ChemistryToday.tsx',
      'src/cs/components/CsToday.tsx',
    ]
    for (const file of files) {
      expect(readFileSync(join(process.cwd(), file), 'utf8')).toContain('WhyThisNext')
    }
  })
})
