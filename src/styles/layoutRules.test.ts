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

  it('ensures sidebar nav labels are not squished and allow normal text wrapping', () => {
    expect(cssContent).toContain('.sidebar nav button .nav-label')
    expect(cssContent).toMatch(/\.sidebar nav button \.nav-label[^}]*white-space:\s*normal/s)
  })

  it('ensures solution card and content have word-break and overflow-wrap', () => {
    expect(cssContent).toContain('.solution-card {')
    expect(cssContent).toMatch(/\.solution-card\s*\{[^}]*overflow-wrap:\s*break-word/s)
    expect(cssContent).toMatch(/\.solution-content\s*\{[^}]*word-break:\s*break-word/s)
  })

  it('ensures .app-shell and .math-shell enforce 100vh single-page principle', () => {
    expect(cssContent).toMatch(/\.app-shell\s*\{[^}]*height:\s*100vh/s)
    expect(cssContent).toMatch(/\.app-shell\s*\{[^}]*overflow:\s*hidden/s)
    expect(cssContent).toMatch(/\.math-shell\s*\{[^}]*height:\s*100vh/s)
    expect(cssContent).toMatch(/\.math-shell\s*\{[^}]*overflow:\s*hidden/s)
  })

  it('ensures .content has overflow-y: auto and max-height: 100vh as scroll safety net', () => {
    expect(cssContent).toContain('.content {')
    expect(cssContent).toMatch(/\.content\s*\{[^}]*overflow-y:\s*auto/s)
    expect(cssContent).toMatch(/\.content\s*\{[^}]*max-height:\s*100vh/s)
  })
})
