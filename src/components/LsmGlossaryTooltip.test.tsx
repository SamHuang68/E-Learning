import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LocaleContext, type LocaleContextValue } from '../i18n/i18n'
import { translate } from '../i18n/messages'
import { getLsmGlossaryCopy, isLsmTooltipVisible } from './lsmGlossaryCopy'
import { LsmGlossaryTooltip } from './LsmGlossaryTooltip'

const noop = () => {}
const HAN = /[\u3400-\u9fff\uf900-\ufaff]/

function context(locale: 'en' | 'zh-Hant'): LocaleContextValue {
  return {
    locale,
    setLocale: noop,
    t: (key, vars) => translate(locale, key, vars),
  }
}

describe('LsmGlossaryTooltip locale and accessibility contract', () => {
  it('remains visible while either hover or focus is active and Escape dismisses it', () => {
    expect(isLsmTooltipVisible({ hovered: false, focused: true, dismissed: false })).toBe(true)
    expect(isLsmTooltipVisible({ hovered: true, focused: false, dismissed: false })).toBe(true)
    expect(isLsmTooltipVisible({ hovered: true, focused: true, dismissed: false })).toBe(true)
    expect(isLsmTooltipVisible({ hovered: true, focused: true, dismissed: true })).toBe(false)
  })

  it('keeps the English accessible name and tooltip copy English-only', () => {
    const html = renderToStaticMarkup(
      <LocaleContext.Provider value={context('en')}>
        <LsmGlossaryTooltip termKey="memtable">MemTable (SkipList)</LsmGlossaryTooltip>
      </LocaleContext.Provider>,
    )
    const copy = getLsmGlossaryCopy('en', 'memtable')

    expect(html).toContain('aria-label="MemTable"')
    expect(html).toContain('tabindex="0"')
    expect(html).not.toMatch(HAN)
    expect(copy).toEqual({
      label: 'MemTable',
      heading: 'MemTable',
      definitions: [
        'In-memory SkipList buffer for O(log N) writes/queries, acting as write buffer before flush to SSTable.',
      ],
    })
    expect(JSON.stringify(copy)).not.toMatch(HAN)
  })

  it('preserves the existing bilingual Traditional-Chinese presentation', () => {
    const copy = getLsmGlossaryCopy('zh-Hant', 'wal')

    expect(copy.label).toBe('預寫日誌 / Write-Ahead Log')
    expect(copy.heading).toBe('預寫日誌 / Write-Ahead Log')
    expect(copy.definitions).toEqual([
      '順序追加的持久性日誌，保證崩潰恢復，寫入先記錄 WAL 再更新 MemTable。',
      'Sequential durability log; writes are appended to WAL before MemTable update for crash safety.',
    ])
  })
})
