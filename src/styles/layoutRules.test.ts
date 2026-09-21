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

  it('ensures KaTeX equations and display wrappers have overflow-x: auto and max-width protections', () => {
    expect(cssContent).toContain('.katex-block-wrapper {')
    expect(cssContent).toMatch(/\.katex-block-wrapper\s*\{[^}]*overflow-x:\s*auto/s)
    expect(cssContent).toMatch(/\.katex-display\s*\{[^}]*overflow-x:\s*auto/s)
  })

  it('ensures option-btn and opt-content have min-width: 0 and word-break for anti-collision', () => {
    expect(cssContent).toContain('.opt-content {')
    expect(cssContent).toMatch(/\.opt-content\s*\{[^}]*min-width:\s*0/s)
    expect(cssContent).toMatch(/\.opt-content\s*\{[^}]*word-break:\s*break-word/s)
  })

  it('ensures @media (max-width: 860px) responsive override exists for all shells', () => {
    expect(cssContent).toContain('.math-shell,')
    expect(cssContent).toContain('.physics-shell,')
    expect(cssContent).toContain('.chemistry-shell,')
    expect(cssContent).toContain('.grades-nav-group,')
  })

  it('ensures .eight-track-grid has responsive 1-col collapse on mobile', () => {
    expect(cssContent).toContain('.eight-track-grid {')
    expect(cssContent).toMatch(/@media\s*\(max-width:\s*580px\)\s*\{[^}]*\.eight-track-grid\s*\{[^}]*grid-template-columns:\s*1fr/s)
  })

  it('ensures .lab-workspace-grid has single column collapse and svg max-width protection', () => {
    expect(cssContent).toContain('.lab-workspace-grid {')
    expect(cssContent).toMatch(/@media\s*\(max-width:\s*680px\)\s*\{[^}]*\.lab-workspace-grid\s*\{[^}]*grid-template-columns:\s*1fr\s*!important/s)
    expect(cssContent).toMatch(/\.lab-workspace-grid\s*svg[^}]*max-width:\s*100%/s)
  })

  it('ensures dark mode WCAG AA high-contrast rules exist for physics & chemistry elements', () => {
    expect(cssContent).toContain('[data-theme="dark"] .track-status-pill.physics')
    expect(cssContent).toContain('[data-theme="dark"] .track-status-pill.chemistry')
    expect(cssContent).toContain('[data-theme="dark"] .signal-rule-box')
    expect(cssContent).toContain('[data-theme="dark"] .signal-rule-box.chemistry')
    expect(cssContent).toContain('[data-theme="dark"] .physics-today-view .unit-seq')
    expect(cssContent).toContain('[data-theme="dark"] .chemistry-today-view .unit-seq')
  })

  it('unifies STEM / later-track chrome via shared sidebar width and padding tokens', () => {
    expect(cssContent).toMatch(/--track-sidebar-width:\s*260px/)
    expect(cssContent).toMatch(/--track-sidebar-padding:/)
    expect(cssContent).toMatch(/--track-nav-item-padding:/)
    expect(cssContent).toMatch(/--track-content-padding:/)
    expect(cssContent).toMatch(/--track-title-size:/)
    expect(cssContent).toMatch(/\.app-shell\s*\{[^}]*grid-template-columns:\s*var\(--track-sidebar-width\)/s)
    expect(cssContent).toMatch(/\.math-shell\s*\{[^}]*grid-template-columns:\s*var\(--track-sidebar-width\)/s)
    expect(cssContent).toMatch(/\.calculus-shell\s*\{[^}]*grid-template-columns:\s*var\(--track-sidebar-width\)/s)
    expect(cssContent).toMatch(/\.physics-shell,\s*\n\.chemistry-shell\s*\{[^}]*var\(--track-sidebar-width\)/s)
    expect(cssContent).toMatch(/\.chinese-sidebar,\s*\n\.cs-sidebar\s*\{[^}]*width:\s*var\(--track-sidebar-width\)/s)
    expect(cssContent).not.toMatch(/\.math-shell\s*\{[^}]*220px/s)
  })

  it('keeps font-weight: 800 count in src/index.css at 3', () => {
    const matches = cssContent.match(/font-weight:\s*800/g) ?? []
    expect(matches).toHaveLength(3)
  })

  it('puts calculus topbar spacing on the shared topbar tokens', () => {
    expect(cssContent).toMatch(/--track-topbar-gap:\s*0\.75rem/)
    expect(cssContent).toMatch(/--track-topbar-margin:\s*0\.75rem/)
    expect(cssContent).toMatch(/\.topbar\s*\{[^}]*gap:\s*var\(--track-topbar-gap\)/s)
    expect(cssContent).toMatch(/\.topbar\s*\{[^}]*margin-bottom:\s*var\(--track-topbar-margin\)/s)
    const leftover = cssContent.match(/\.calculus-topbar\s*\{[^}]*\}/g) ?? []
    for (const block of leftover) {
      expect(block).not.toMatch(/1\.25rem/)
      expect(block).not.toMatch(/gap:\s*1rem/)
      expect(block).not.toMatch(/margin-bottom:\s*1/)
    }
    expect(cssContent).toMatch(
      /@media\s*\(max-width:\s*860px\)\s*\{[\s\S]*?\.topbar,\s*\n\s*\.calculus-topbar\s*\{/,
    )
  })

  it('keeps calculus mobile padding on the same STEM content/sidebar tokens', () => {
    expect(cssContent).toMatch(/--track-content-padding-mobile:\s*1rem/)
    expect(cssContent).toMatch(/\.calculus-sidebar\s*\{[^}]*padding:\s*var\(--track-sidebar-padding\)/s)
    const contentBlock = cssContent.match(/\.calculus-content\s*\{[^}]*\}/)?.[0] ?? ''
    expect(contentBlock).not.toMatch(/padding:/)
    expect(cssContent).toMatch(
      /@media\s*\(max-width:\s*860px\)\s*\{[\s\S]*?\.content,\s*\n\s*\.calculus-content,[\s\S]*?padding:\s*var\(--track-content-padding-mobile\)/,
    )
  })

  it('ensures Hub mobile bottom nav uses the 44px touch token', () => {
    expect(cssContent).toMatch(/--touch-min:\s*44px/)
    expect(cssContent).toContain('.hub-bottom-nav')
    expect(cssContent).toMatch(/\.hub-bottom-nav-item[^}]*min-height:\s*var\(--touch-min\)/s)
    expect(cssContent).toMatch(/\.hub-bottom-nav-item[^}]*min-width:\s*var\(--touch-min\)/s)
  })

  it('unifies track header density (height, padding, type scale) via PR#10 tokens', () => {
    expect(cssContent).toMatch(/--track-header-min-height:\s*56px/)
    expect(cssContent).toMatch(/--track-header-padding-y:\s*0\.35rem/)
    expect(cssContent).toMatch(/--track-title-size:\s*clamp\(1\.35rem,\s*2\.4vw,\s*1\.75rem\)/)
    expect(cssContent).toMatch(/\.topbar\s*\{[^}]*min-height:\s*var\(--track-header-min-height\)/s)
    expect(cssContent).toMatch(/\.topbar\s*\{[^}]*padding-block:\s*var\(--track-header-padding-y\)/s)
    expect(cssContent).toMatch(/\.topbar h1\s*\{[^}]*font-size:\s*var\(--track-title-size\)/s)
    expect(cssContent).toMatch(/\.cs-top-nav\s*\{[^}]*min-height:\s*var\(--track-header-min-height\)/s)
    expect(cssContent).toMatch(/\.cs-top-nav\s*\{[^}]*padding:\s*var\(--track-header-padding-y\)/s)
    expect(cssContent).toMatch(/\.chinese-lang-toolbar\s*\{[^}]*min-height:\s*var\(--track-header-min-height\)/s)
    expect(cssContent).toMatch(/\.chinese-lang-toolbar\s*\{[^}]*gap:\s*var\(--track-topbar-gap\)/s)
    expect(cssContent).not.toMatch(/\.topbar h1\s*\{[^}]*1\.9rem/s)
  })

  it('honors prefers-reduced-motion by disabling decorative animation and transitions', () => {
    expect(cssContent).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?animation:\s*none\s*!important/,
    )
    expect(cssContent).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?transition:\s*none\s*!important/,
    )
    expect(cssContent).not.toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?animation-duration:\s*0\.01ms/,
    )
  })

  it('unifies Hub + track primary CTAs on shared WCAG-minded contrast tokens', () => {
    expect(cssContent).toMatch(/--btn-primary-bg:\s*#2f5c4e/)
    expect(cssContent).toMatch(/--btn-primary-fg:\s*#ffffff/)
    expect(cssContent).toMatch(/--btn-primary-hover-bg:\s*color-mix/)
    expect(cssContent).toMatch(/\.hub-primary-cta\s*\{[^}]*background:\s*var\(--btn-primary-bg\)/s)
    expect(cssContent).toMatch(/\.hub-primary-cta\s*\{[^}]*color:\s*var\(--btn-primary-fg\)/s)
    expect(cssContent).toMatch(/\.primary-btn\s*\{[^}]*background:\s*var\(--btn-primary-bg\)/s)
    expect(cssContent).toMatch(/\.primary-btn:hover\s*\{[^}]*background:\s*var\(--btn-primary-hover-bg\)/s)
    expect(cssContent).not.toMatch(/\.primary-btn:hover\s*\{[^}]*var\(--navy-soft\)/s)
    expect(cssContent).toMatch(/\.btn-primary\s*\{[^}]*background:\s*var\(--btn-primary-bg\)/s)
    expect(cssContent).toMatch(/\.btn-plan-action\s*\{[^}]*background:\s*var\(--btn-primary-bg\)/s)
    expect(cssContent).toMatch(/\.btn-play-primary\s*\{[^}]*background:\s*var\(--btn-primary-bg\)/s)
    expect(cssContent).toMatch(/\.speak-big\s*\{[^}]*background:\s*var\(--btn-primary-bg\)/s)
    expect(cssContent).not.toMatch(/\.speak-big:hover\s*\{[^}]*var\(--navy-soft\)/s)
  })
})
