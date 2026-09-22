import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('PWA theme-color follows the site accent token', () => {
  it('manifest and HTML theme-color match --accent', () => {
    const css = readFileSync(join(process.cwd(), 'src/index.css'), 'utf8')
    const accent = css.match(/--accent:\s*(#[0-9a-fA-F]{6})/)
    expect(accent?.[1]).toBe('#3f6f64')
    const manifest = readFileSync(join(process.cwd(), 'public/manifest.webmanifest'), 'utf8')
    expect(manifest).toContain(`"theme_color": "${accent?.[1]}"`)
    const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8')
    expect(html).toContain(`name="theme-color" content="${accent?.[1]}"`)
  })
})
