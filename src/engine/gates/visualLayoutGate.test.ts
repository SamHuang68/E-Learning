import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Strict Review Gate: Visual Layout, 100vh Focus & Zero-Overflow Invariants', () => {
  const cssPath = path.resolve(__dirname, '../../index.css')
  const cssContent = fs.readFileSync(cssPath, 'utf-8')

  it('[GATE-VISUAL-100VH] enforces height: 100vh and overflow: hidden on all application shells', () => {
    expect(cssContent).toMatch(/\.app-shell\s*\{[^}]*height:\s*100vh/s)
    expect(cssContent).toMatch(/\.app-shell\s*\{[^}]*overflow:\s*hidden/s)
    expect(cssContent).toMatch(/\.math-shell\s*\{[^}]*height:\s*100vh/s)
    expect(cssContent).toMatch(/\.math-shell\s*\{[^}]*overflow:\s*hidden/s)
  })

  it('[GATE-VISUAL-SCROLL-CONTAINER] .content has overflow-y: auto and max-height: 100vh to trap inner scrolls', () => {
    expect(cssContent).toMatch(/\.content\s*\{[^}]*overflow-y:\s*auto/s)
    expect(cssContent).toMatch(/\.content\s*\{[^}]*max-height:\s*100vh/s)
  })

  it('[GATE-VISUAL-KATEX-PROTECTION] KaTeX equations have horizontal scroll guards and max-width 100%', () => {
    expect(cssContent).toMatch(/\.katex-block-wrapper\s*\{[^}]*overflow-x:\s*auto/s)
    expect(cssContent).toMatch(/\.katex-display\s*\{[^}]*overflow-x:\s*auto/s)
  })

  it('[GATE-VISUAL-ANTI-COLLISION] options and text containers enforce min-width: 0 and word-break to prevent text overlap', () => {
    expect(cssContent).toMatch(/\.opt-content\s*\{[^}]*min-width:\s*0/s)
    expect(cssContent).toMatch(/\.opt-content\s*\{[^}]*word-break:\s*break-word/s)
  })

  it('[GATE-VISUAL-RESPONSIVE] responsive breakpoints exist for mobile single-column folding', () => {
    expect(cssContent).toContain('.math-shell,')
    expect(cssContent).toContain('.physics-shell,')
    expect(cssContent).toContain('.chemistry-shell,')
    expect(cssContent).toMatch(/@media\s*\(max-width:\s*580px\)\s*\{[^}]*\.six-track-grid\s*\{[^}]*grid-template-columns:\s*1fr/s)
    expect(cssContent).toMatch(/@media\s*\(max-width:\s*680px\)\s*\{[^}]*\.lab-workspace-grid\s*\{[^}]*grid-template-columns:\s*1fr\s*!important/s)
  })

  it('[GATE-VISUAL-WCAG-CONTRAST] dark mode high contrast overrides exist for all scientific and language status pills', () => {
    expect(cssContent).toContain('[data-theme="dark"] .track-status-pill.physics')
    expect(cssContent).toContain('[data-theme="dark"] .track-status-pill.chemistry')
    expect(cssContent).toContain('[data-theme="dark"] .signal-rule-box')
    expect(cssContent).toContain('[data-theme="dark"] .signal-rule-box.chemistry')
  })
})
