import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { translate } from '../../i18n/messages'

describe('scratchpad icon-only button names', () => {
  it('names close and pen swatches without renaming visible text buttons', () => {
    const src = readFileSync(join(process.cwd(), 'src/components/Scratchpad.tsx'), 'utf8')
    expect(src).toContain("aria-label={t('scratch.close')}")
    expect(src).toContain('aria-label={t(pen.labelKey)}')
    expect(src).toContain('橡皮擦')
    expect(src).toContain('清空')
    expect(translate('zh-Hant', 'scratch.close')).toBe('關閉草稿紙')
    expect(translate('en', 'scratch.close')).toBe('Close scratchpad')
    expect(translate('zh-Hant', 'scratch.color.cyan')).toMatch(/青藍/)
    expect(translate('en', 'scratch.color.cyan')).toMatch(/Cyan/)
  })
})
