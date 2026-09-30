import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('mobile blank page guard', () => {
  it('does not cache an HTML body as a script or stylesheet', () => {
    const src = readFileSync('public/sw.js', 'utf8')
    expect(src).toContain('function canStore')
    expect(src).toContain('text/html')
    expect(src).not.toContain('cache.addAll')
  })

  it('shows a classic-script recovery when the module never paints', () => {
    const html = readFileSync('index.html', 'utf8')
    expect(html).toContain('畫面沒有載入')
    expect(html).toContain('清掉快取並重開')
    expect(html.indexOf('<script>')).toBeLessThan(html.indexOf('type="module"'))
  })
})
