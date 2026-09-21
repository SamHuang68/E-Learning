import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('HubShortcutHelp', () => {
  it('opens from ? and lists Hub keys without inventing OS shortcuts', () => {
    const src = readFileSync(join(process.cwd(), 'src/components/HubShortcutHelp.tsx'), 'utf8')
    expect(src).toContain("event.key === '?'")
    expect(src).toContain("event.key === '/'")
    expect(src).toContain('showModal')
    expect(src).toContain('hub-track-search')
    expect(src).toContain("t('hub.shortcuts.honesty')")
    expect(src).toContain('<kbd>')
    const hub = readFileSync(join(process.cwd(), 'src/Hub.tsx'), 'utf8')
    expect(hub).toContain('HubShortcutHelp')
  })
})
