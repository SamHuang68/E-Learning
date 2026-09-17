import { describe, expect, it } from 'vitest'
import { EN, translate, ZH_HANT, type MessageKey } from './messages'
import { interpolate } from './interpolate'
import { isUiLocale, loadUiLocale, saveUiLocale } from './locale'

describe('i18n dictionary', () => {
  it('keeps zh-Hant and en key sets identical', () => {
    const zhKeys = Object.keys(ZH_HANT).sort()
    const enKeys = Object.keys(EN).sort()
    expect(enKeys).toEqual(zhKeys)
  })

  it('interpolates count tokens', () => {
    expect(translate('en', 'hub.solved', { count: 4 })).toBe('You have solved 4 items')
    expect(translate('zh-Hant', 'hub.solved', { count: 4 })).toBe('你已解 4 題')
  })

  it('persists ui locale preference', () => {
    const mem = new Map<string, string>()
    ;(globalThis as unknown as { localStorage: Storage }).localStorage = {
      getItem: (key) => mem.get(key) ?? null,
      setItem: (key, value) => {
        mem.set(key, String(value))
      },
      removeItem: (key) => {
        mem.delete(key)
      },
      clear: () => mem.clear(),
      key: (index) => Array.from(mem.keys())[index] ?? null,
      get length() {
        return mem.size
      },
    } as Storage
    ;(globalThis as unknown as { document: { documentElement: { lang: string } } }).document = {
      documentElement: { lang: '' },
    }
    ;(globalThis as unknown as { window: { dispatchEvent: () => boolean } }).window = {
      dispatchEvent: () => true,
    }

    expect(isUiLocale('zh-Hant')).toBe(true)
    saveUiLocale('en')
    expect(loadUiLocale()).toBe('en')
    saveUiLocale('zh-Hant')
    expect(loadUiLocale()).toBe('zh-Hant')
  })

  it('leaves unknown placeholders intact', () => {
    expect(interpolate('Hello {name}', { other: 'x' })).toBe('Hello {name}')
    const key = 'hub.solved' satisfies MessageKey
    expect(translate('en', key, { count: 0 })).toContain('0')
  })
})
