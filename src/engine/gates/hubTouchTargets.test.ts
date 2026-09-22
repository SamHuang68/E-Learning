import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('Hub 44px touch targets', () => {
  it('keeps header, icon, and dense controls at --touch-min', () => {
    const css = readFileSync(join(process.cwd(), 'src/index.css'), 'utf8')
    expect(css).toContain('--touch-min: 44px')
    expect(css).toContain('.hub-topbar-tools .hub-shortcut-trigger')
    expect(css).toContain('.hub .pill-btn.audio-toggle')
    expect(css).toContain('.a11y-settings-dialog .btn-close')
    expect(css).toContain('.a11y-settings-dialog .a11y-toggle')
    expect(css).toMatch(
      /html\.layout-dense \.hub-topbar-tools \.hub-shortcut-trigger[\s\S]*?min-width:\s*var\(--touch-min\)/,
    )
    expect(css).toMatch(
      /\.a11y-settings-dialog \.a11y-toggle\s*\{[\s\S]*?width:\s*var\(--touch-min\)/,
    )
  })
})
