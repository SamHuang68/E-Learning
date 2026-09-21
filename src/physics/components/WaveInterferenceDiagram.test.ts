import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('WaveInterferenceDiagram a11y', () => {
  it('exposes a meaningful img label and description, not a decorative svg', () => {
    const src = readFileSync(join(process.cwd(), 'src/physics/components/WaveInterferenceDiagram.tsx'), 'utf8')
    expect(src).toContain('role="img"')
    expect(src).toContain('aria-labelledby="wave-int-title"')
    expect(src).toContain('aria-describedby="wave-int-desc"')
    expect(src).toContain('<title id="wave-int-title">')
    expect(src).toContain('<desc id="wave-int-desc">')
    expect(src).toContain("t('physics.interference.altTitle')")
    expect(src).toContain("t('physics.interference.altDesc')")
    expect(src).not.toContain('alt=""')
    const sheet = readFileSync(join(process.cwd(), 'src/physics/components/PhysicsFormulaSheet.tsx'), 'utf8')
    expect(sheet).toContain('WaveInterferenceDiagram')
  })
})
