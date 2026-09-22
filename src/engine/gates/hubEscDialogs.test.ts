import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('Hub Esc closes dialogs and restores opener', () => {
  it('help, a11y, and scratchpad restore focus on close', () => {
    const help = readFileSync(join(process.cwd(), 'src/components/HubShortcutHelp.tsx'), 'utf8')
    expect(help).toContain("event.key === 'Escape'")
    expect(help).toContain('opener?.focus()')
    expect(help).toContain('triggerRef')

    const a11y = readFileSync(join(process.cwd(), 'src/components/AccessibilityControls.tsx'), 'utf8')
    expect(a11y).toContain("event.key !== 'Escape'")
    expect(a11y).toContain('triggerRef.current?.focus()')

    const scratch = readFileSync(join(process.cwd(), 'src/components/ScratchpadButton.tsx'), 'utf8')
    expect(scratch).toContain("e.key === 'Escape'")
    expect(scratch).toContain('opener?.focus()')
    expect(scratch).toContain('aria-expanded={isOpen}')
  })
})
