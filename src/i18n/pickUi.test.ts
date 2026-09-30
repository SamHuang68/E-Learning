import { describe, expect, it } from 'vitest'
import { chromeLang, pickChrome, pickUi } from './pickUi'

describe('pickUi', () => {
  it('returns English only in en mode', () => {
    expect(pickUi('en', '錯題本', 'Error notebook')).toBe('Error notebook')
    expect(pickUi('zh-Hant', '錯題本', 'Error notebook')).toBe('錯題本')
  })

  it('keeps Japanese instruction chrome and otherwise follows UI locale', () => {
    expect(chromeLang('en', 'zh')).toBe('en')
    expect(chromeLang('zh-Hant', 'zh')).toBe('zh')
    expect(chromeLang('en', 'ja')).toBe('ja')
    expect(
      pickChrome('en', { zh: '商務差旅實驗室', ja: '出張ラボ', en: 'Travel lab' }),
    ).toBe('Travel lab')
  })
})
