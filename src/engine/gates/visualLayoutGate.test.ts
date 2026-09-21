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
    expect(cssContent).toMatch(/@media\s*\(max-width:\s*580px\)\s*\{[^}]*\.eight-track-grid\s*\{[^}]*grid-template-columns:\s*1fr/s)
    expect(cssContent).toMatch(/@media\s*\(max-width:\s*680px\)\s*\{[^}]*\.lab-workspace-grid\s*\{[^}]*grid-template-columns:\s*1fr\s*!important/s)
  })

  it('[GATE-VISUAL-WCAG-CONTRAST] dark mode high contrast overrides exist for all scientific and language status pills', () => {
    expect(cssContent).toContain('[data-theme="dark"] .track-status-pill.physics')
    expect(cssContent).toContain('[data-theme="dark"] .track-status-pill.chemistry')
    expect(cssContent).toContain('[data-theme="dark"] .signal-rule-box')
    expect(cssContent).toContain('[data-theme="dark"] .signal-rule-box.chemistry')
  })

  it('[GATE-VISUAL-SHARED-CHROME] STEM shells share later-track sidebar width token (260px)', () => {
    expect(cssContent).toMatch(/--track-sidebar-width:\s*260px/)
    expect(cssContent).toMatch(/\.math-shell\s*\{[^}]*var\(--track-sidebar-width\)/s)
    expect((cssContent.match(/font-weight:\s*800/g) ?? []).length).toBe(3)
  })

  it('[GATE-VISUAL-CALCULUS-CHROME] calculus topbar/content do not reintroduce leftover spacing overrides', () => {
    expect(cssContent).not.toMatch(/calculus-topbar/)
    expect(cssContent.match(/\.calculus-content\s*\{[^}]*\}/)?.[0] ?? '').not.toMatch(/padding:/)
    expect(cssContent).toMatch(/\.calculus-sidebar\s*\{[^}]*var\(--track-sidebar-padding\)/s)
    expect(cssContent).toMatch(/\.topbar\s*\{[^}]*var\(--track-topbar-gap\)/s)
    expect(cssContent).toMatch(/\.topbar\s*\{[^}]*var\(--track-header-min-height\)/s)
  })

  it('[GATE-VISUAL-HEADER-DENSITY] track headers share CS-canonical height/padding/type tokens', () => {
    expect(cssContent).toMatch(/--track-header-min-height:\s*56px/)
    expect(cssContent).toMatch(/\.topbar\s*\{[^}]*var\(--track-header-min-height\)/s)
    expect(cssContent).toMatch(/\.cs-top-nav\s*\{[^}]*var\(--track-header-min-height\)/s)
    expect(cssContent).toMatch(/\.chinese-lang-toolbar\s*\{[^}]*var\(--track-header-min-height\)/s)
    expect(cssContent).not.toMatch(/\.topbar h1\s*\{[^}]*1\.9rem/s)
  })

  it('[GATE-VISUAL-REDUCED-MOTION] decorative anim/transitions are none under prefers-reduced-motion', () => {
    expect(cssContent).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?animation:\s*none\s*!important/,
    )
    expect(cssContent).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?transition:\s*none\s*!important/,
    )
  })

  it('[GATE-VISUAL-PRIMARY-CONTRAST] Hub + track primary CTAs share AAA-minded fill/hover tokens', () => {
    expect(cssContent).toMatch(/--btn-primary-bg:\s*#2f5c4e/)
    expect(cssContent).toMatch(/--btn-primary-fg:\s*#ffffff/)
    expect(cssContent).toMatch(/\.hub-primary-cta\s*\{[^}]*var\(--btn-primary-bg\)/s)
    expect(cssContent).toMatch(/\.primary-btn:hover\s*\{[^}]*var\(--btn-primary-hover-bg\)/s)
    expect(cssContent).not.toMatch(/\.primary-btn:hover\s*\{[^}]*var\(--navy-soft\)/s)
    expect(cssContent).toMatch(/\.btn-primary\s*\{[^}]*var\(--btn-primary-bg\)/s)
    expect((cssContent.match(/font-weight:\s*800/g) ?? []).length).toBe(3)
  })

  it('[GATE-VISUAL-STEM-CS-PADDING] STEM content/shell gutters lock to CS chrome tokens', () => {
    expect(cssContent).toMatch(/--track-chrome-gutter-x:\s*1rem/)
    expect(cssContent).toMatch(/\.cs-top-nav\s*\{[^}]*var\(--track-chrome-gutter-x\)/s)
    expect(cssContent).toMatch(/\.math-content,\s*\n\.calculus-content,\s*\n\.physics-content,\s*\n\.chemistry-content\s*\{[^}]*var\(--track-content-padding\)/s)
    expect(cssContent).toMatch(
      /@media\s*\(max-width:\s*860px\)\s*\{[\s\S]*?\.cs-main-viewport\s*\{[\s\S]*?var\(--track-content-padding-mobile\)/,
    )
    expect((cssContent.match(/font-weight:\s*800/g) ?? []).length).toBe(3)
  })
})
