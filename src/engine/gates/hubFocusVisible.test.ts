import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('Hub focus-visible rings', () => {
  it('keeps rings on Hub controls in light/dark and dense mode', () => {
    const css = readFileSync(join(process.cwd(), 'src/index.css'), 'utf8')
    expect(css).toContain('.hub-card:has(.hub-card-hit:focus-visible)')
    expect(css).toContain('.hub .locale-toggle button:focus-visible')
    expect(css).toContain('.hub .hub-primary-cta:focus-visible')
    expect(css).toContain('.a11y-settings-dialog .a11y-toggle:focus-visible')
    expect(css).toContain('[data-theme="dark"]')
    expect(css).toMatch(/\[data-theme="dark"\][\s\S]*--focus-ring-color:\s*#7dd3fc/)
    expect(css).toContain('html.layout-dense')
    expect(css).toContain('--focus-ring-width: 3px')
    expect(css).not.toMatch(/html\.layout-dense[^{]*\{[^}]*outline:\s*none/)
    expect(css).not.toMatch(/html\.layout-dense \.hub[^{]*\{[^}]*outline:\s*none/)
  })
})
