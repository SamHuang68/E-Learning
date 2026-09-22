import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('practice live regions stay polite', () => {
  it('announces grades and progress without stealing focus', () => {
    const session = readFileSync(join(process.cwd(), 'src/components/ExerciseSession.tsx'), 'utf8')
    expect(session).toContain('<span aria-live="polite" aria-atomic="true">')
    expect(session).toContain('aria-live="polite"')
    expect(session).not.toContain('assertive')
    expect(session).not.toMatch(/feedback[\s\S]{0,80}\.focus\(/)

    const files = [
      'src/components/ScenarioPlayer.tsx',
      'src/math/components/MathPractice.tsx',
      'src/physics/components/PhysicsPractice.tsx',
      'src/chemistry/components/ChemistryPractice.tsx',
      'src/cs/components/CsPractice.tsx',
    ]
    for (const file of files) {
      const src = readFileSync(join(process.cwd(), file), 'utf8')
      expect(src, file).toContain('aria-live="polite"')
      expect(src, file).toContain('role="status"')
      expect(src, file).not.toContain('aria-live="assertive"')
    }
  })
})
