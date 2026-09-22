import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function relativeLuminance(hex: string): number {
  const n = hex.replace('#', '')
  const to = (s: string) => {
    const c = Number.parseInt(s, 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const r = to(n.slice(0, 2))
  const g = to(n.slice(2, 4))
  const b = to(n.slice(4, 6))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const L1 = relativeLuminance(a)
  const L2 = relativeLuminance(b)
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1]
  return (hi + 0.05) / (lo + 0.05)
}

describe('Hub muted/badge contrast tokens', () => {
  it('meets WCAG AA for Hub secondary text on light and dark surfaces', () => {
    const css = readFileSync(join(process.cwd(), 'src/index.css'), 'utf8')
    expect(css).toContain('--navy-soft: #46766a')
    expect(css).toContain('--on-navy: #fffcf7')
    expect(css).toContain('--on-navy: #0f172a')
    expect(css).toContain('--hub-badge-status: #1d4ed8')
    expect(css).toContain('--hub-badge-status: #93c5fd')
    expect(css).toContain('--week-heat-on: #022c22')
    expect(css).toContain('color: var(--on-navy)')
    expect(css).toContain('color: var(--hub-badge-status)')

    expect(contrast('#6d6256', '#f6f0e6')).toBeGreaterThanOrEqual(4.5)
    expect(contrast('#6d6256', '#fffcf7')).toBeGreaterThanOrEqual(4.5)
    expect(contrast('#46766a', '#f6f0e6')).toBeGreaterThanOrEqual(4.5)
    expect(contrast('#9ca3af', '#111827')).toBeGreaterThanOrEqual(4.5)
    expect(contrast('#0f172a', '#38bdf8')).toBeGreaterThanOrEqual(4.5)
    expect(contrast('#93c5fd', '#111827')).toBeGreaterThanOrEqual(4.5)
    expect(contrast('#1d4ed8', '#fffcf7')).toBeGreaterThanOrEqual(4.5)
    expect(contrast('#022c22', '#10b981')).toBeGreaterThanOrEqual(4.5)
  })
})
