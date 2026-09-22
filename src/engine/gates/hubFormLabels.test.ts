import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('Hub search and icon-only control names', () => {
  it('associates the search label and names the icon-only a11y trigger', () => {
    const hub = readFileSync(join(process.cwd(), 'src/Hub.tsx'), 'utf8')
    expect(hub).toContain('htmlFor="hub-track-search"')
    expect(hub).toContain('id="hub-track-search-label"')
    expect(hub).toContain('aria-labelledby="hub-track-search-label"')
    expect(hub).toContain("t('hub.search.label')")
    expect(hub).toContain('aria-labelledby="radar-title"')

    const a11y = readFileSync(join(process.cwd(), 'src/components/AccessibilityControls.tsx'), 'utf8')
    expect(a11y).toContain("aria-label={t('a11y.open')}")
    expect(a11y).toContain('aria-hidden="true"')
  })
})
