import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { translate } from '../../i18n/messages'

describe('scratchpad icon-only button names', () => {
  it('names close and pen swatches without renaming visible text buttons', () => {
    const src = readFileSync(join(process.cwd(), 'src/components/Scratchpad.tsx'), 'utf8')
    expect(src).toContain("aria-label={t('scratch.close')}")
    expect(src).toContain('aria-label={t(pen.labelKey)}')
    expect(src).toContain("t('scratch.eraser')")
    expect(src).toContain("t('scratch.clear')")
    expect(translate('zh-Hant', 'scratch.eraser')).toBe('橡皮擦')
    expect(translate('en', 'scratch.eraser')).toBe('Eraser')
    expect(translate('zh-Hant', 'scratch.clear')).toBe('清空')
    expect(translate('en', 'scratch.clear')).toBe('Clear')
    expect(translate('zh-Hant', 'scratch.close')).toBe('關閉草稿紙')
    expect(translate('en', 'scratch.close')).toBe('Close scratchpad')
    expect(translate('zh-Hant', 'scratch.color.cyan')).toMatch(/青藍/)
    expect(translate('en', 'scratch.color.cyan')).toMatch(/Cyan/)
  })
})
