import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('formula sheet print stylesheet', () => {
  it('hides chrome and keeps formula cards from splitting across pages', () => {
    const css = readFileSync(join(process.cwd(), 'src/index.css'), 'utf8')
    expect(css).toContain('@media print')
    expect(css).toContain('body:has(.formula-sheet)')
    expect(css).toContain('break-inside: avoid')
    expect(css).toContain('.btn-back')
    expect(css).toContain('.physics-sidebar')
    const sheet = readFileSync(
      join(process.cwd(), 'src/physics/components/PhysicsFormulaSheet.tsx'),
      'utf8',
    )
    expect(sheet).toContain('formula-sheet physics-formula-sheet')
  })
})
