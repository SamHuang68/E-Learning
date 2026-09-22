import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('opt-in dense layout', () => {
  it('defaults off, toggles html.layout-dense, and keeps focus/touch tokens', () => {
    const a11y = readFileSync(join(process.cwd(), 'src/components/AccessibilityControls.tsx'), 'utf8')
    expect(a11y).toContain('denseLayout: boolean')
    expect(a11y).toContain('denseLayout: false')
    expect(a11y).toContain("root.classList.add('layout-dense')")
    expect(a11y).toContain("t('a11y.dense')")

    const css = readFileSync(join(process.cwd(), 'src/index.css'), 'utf8')
    expect(css).toContain('html.layout-dense')
    expect(css).not.toMatch(/html\.layout-dense[^{]*\{[^}]*--focus-ring-width:\s*0/)
    expect(css).toContain('html.layout-dense .skip-link')
    expect(css).toContain('min-height: var(--touch-min)')

    const messages = readFileSync(join(process.cwd(), 'src/i18n/messages.ts'), 'utf8')
    expect(messages).toContain("'a11y.dense'")
    expect(messages).toContain("'a11y.denseDesc'")
  })
})
