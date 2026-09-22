import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('Hub prefers-reduced-motion', () => {
  it('gates Hub decorative motion behind no-preference and zeros it under reduce', () => {
    const css = readFileSync(join(process.cwd(), 'src/index.css'), 'utf8')
    expect(css).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?animation:\s*none\s*!important/,
    )
    expect(css).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?transition:\s*none\s*!important/,
    )
    expect(css).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.hub-card:hover[\s\S]*?transform:\s*none\s*!important/,
    )
    expect(css).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*no-preference\)\s*\{[\s\S]*?\.hub-hero[\s\S]*?animation:\s*rise/,
    )
    expect(css).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*no-preference\)\s*\{[\s\S]*?\.hero-art[\s\S]*?animation:\s*floaty/,
    )
  })
})
