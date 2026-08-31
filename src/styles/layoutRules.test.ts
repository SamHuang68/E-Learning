import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

describe('CSS Layout & Sidebar Overflow Regression Guard', () => {
  const cssPath = fileURLToPath(new URL('../index.css', import.meta.url))
  const cssContent = readFileSync(cssPath, 'utf-8')

  it('ensures .sidebar has overflow-y: auto and max-height: 100vh', () => {
    expect(cssContent).toContain('.sidebar {')
    expect(cssContent).toMatch(/\.sidebar\s*\{[^}]*overflow-y:\s*auto/s)
    expect(cssContent).toMatch(/\.sidebar\s*\{[^}]*max-height:\s*100vh/s)
    expect(cssContent).toMatch(/\.sidebar\s*\{[^}]*box-sizing:\s*border-box/s)
  })

  it('ensures .math-sidebar has overflow-y: auto and max-height: 100vh', () => {
    expect(cssContent).toContain('.math-sidebar {')
    expect(cssContent).toMatch(/\.math-sidebar\s*\{[^}]*overflow-y:\s*auto/s)
    expect(cssContent).toMatch(/\.math-sidebar\s*\{[^}]*max-height:\s*100vh/s)
  })

  it('ensures .calculus-sidebar has overflow-y: auto and max-height: 100vh', () => {
    expect(cssContent).toContain('.calculus-sidebar {')
    expect(cssContent).toMatch(/\.calculus-sidebar\s*\{[^}]*overflow-y:\s*auto/s)
    expect(cssContent).toMatch(/\.calculus-sidebar\s*\{[^}]*max-height:\s*100vh/s)
  })
})
