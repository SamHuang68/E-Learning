import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('status is not color-only', () => {
  it('week heat and badges expose icon or text besides color', () => {
    const hub = readFileSync(join(process.cwd(), 'src/Hub.tsx'), 'utf8')
    expect(hub).toContain('week-heat-mark')
    expect(hub).toContain("t('hub.weekMarkOn')")
    expect(hub).toContain("t('hub.weekMarkOff')")
    expect(hub).toContain('badge-status-text')
    expect(hub).toContain("t('hub.badgeOn')")
    expect(hub).toContain("t('hub.badgeOff')")

    const css = readFileSync(join(process.cwd(), 'src/index.css'), 'utf8')
    expect(css).toContain('.week-heat-mark')
    expect(css).toContain('.badge-status-text')
    expect(css).not.toMatch(/\.hub-badge-item\.locked \{[^}]*grayscale/)
  })
})
