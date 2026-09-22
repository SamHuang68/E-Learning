import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('skip-to-main link', () => {
  it('is first in AppChrome, visible on focus, and targets #main-content on Hub and tracks', () => {
    const app = readFileSync(join(process.cwd(), 'src/App.tsx'), 'utf8')
    const chrome = app.slice(app.indexOf('function AppChrome'))
    expect(chrome.indexOf('className="skip-link"')).toBeGreaterThan(-1)
    expect(chrome.indexOf('className="skip-link"')).toBeLessThan(chrome.indexOf('AccessibilityControls'))
    expect(app).toContain('href="#main-content"')
    expect(app).toContain("t('common.skipToContent')")
    expect(app).toContain("getElementById('main-content')")

    const css = readFileSync(join(process.cwd(), 'src/index.css'), 'utf8')
    expect(css).toMatch(/\.skip-link:focus,\s*\.skip-link:focus-visible/)
    expect(css).toMatch(/\.skip-link:focus[\s\S]*?transform:\s*translateY\(0\)/)

    const files = [
      'src/Hub.tsx',
      'src/components/PrivacyPage.tsx',
      'src/aoba/AobaApp.tsx',
      'src/toeic/ToeicApp.tsx',
      'src/math/MathApp.tsx',
      'src/calculus/CalculusApp.tsx',
      'src/physics/PhysicsApp.tsx',
      'src/chemistry/ChemistryApp.tsx',
      'src/cs/CsApp.tsx',
      'src/chinese/ChineseApp.tsx',
    ]
    for (const file of files) {
      const src = readFileSync(join(process.cwd(), file), 'utf8')
      expect(src, file).toContain('id="main-content"')
    }
  })
})
