import { use, useCallback } from 'react'
import { useI18n } from './i18n'
import type { UiLocale } from './locale'
import { ChunkLoadError } from '../utils/chunkLoadError'

const CJK = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/
let content: Readonly<Record<string, string>> | undefined
let pending: Promise<Readonly<Record<string, string>>> | undefined
// Only these slots contain opaque user input; teaching copy in every other slot is translated.
const OPAQUE_SLOTS: Readonly<Record<string, readonly number[]>> = {
  '無法解析「{0}」': [0],
  '無法解析「{0}」：{1}': [0],
  '多餘字元「{0}」': [0],
  '未定義符號「{0}」': [0],
  'Undefined symbol "{0}" / 未定義符號「{1}」. Allowed: {2}': [0, 1],
  '函數 f(x)={0} 無法解析：{1}': [0],
  "求函數 f(x) = {0} 的符號導函數與臨界點": [0],
}
let patterns: { pattern: RegExp; translated: string; opaqueSlots: readonly number[] }[] = []

export function loadCalculusCopy() {
  return pending ??= import('./calculusContentEn').then(({ CALCULUS_CONTENT_EN }) => {
    content = CALCULUS_CONTENT_EN
    patterns = Object.entries(content).filter(([key]) => /\{\d+\}/.test(key))
      .sort(([a], [b]) => b.replace(/\{\d+\}/g, '').length - a.replace(/\{\d+\}/g, '').length)
      .map(([key, translated]) => ({
      pattern: new RegExp('^' + key.split(/\{\d+\}/).map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('([\\s\\S]*?)') + '$'),
      translated,
      opaqueSlots: OPAQUE_SLOTS[key] ?? [],
      }))
    return content
  }).catch(cause => {
    throw new ChunkLoadError('Unable to load English calculus content. Reload to retry.', { cause })
  })
}

/** Exact copy keys and anchored templates only; unknown teaching copy fails closed. */
export function calculusCopy(locale: UiLocale, text: string): string {
  if (locale !== 'en' || !CJK.test(text)) return text
  if (!content) throw new Error('微積分英文文案尚未載入')
  const source = text.trim()
  let translated = Object.hasOwn(content, source) ? content[source] : undefined
  if (translated === undefined) {
    for (const entry of patterns) {
      const match = entry.pattern.exec(text) ?? entry.pattern.exec(source)
      if (!match) continue
      if (!entry.translated.trim() || CJK.test(entry.translated)) throw new Error('缺少有效微積分英文文案：' + text)
      translated = entry.translated.replace(/\{(\d+)\}/g, (_, index: string) => {
        const value = match[Number(index) + 1]
        return entry.opaqueSlots.includes(Number(index)) ? value : calculusCopy(locale, value)
      })
      // The template was validated above; opaque input may legitimately contain CJK.
      return text.slice(0, text.indexOf(source)) + translated + text.slice(text.indexOf(source) + source.length)
    }
  }
  if (!translated?.trim() || CJK.test(translated)) throw new Error('缺少有效微積分英文文案：' + text)
  return text.slice(0, text.indexOf(source)) + translated + text.slice(text.indexOf(source) + source.length)
}

export function useCalculusCopy() {
  const { locale } = useI18n()
  // Keep the client promise read stable across Suspense retries. Preloaded server
  // renders stay synchronous: React has not necessarily observed the resolved promise.
  if (locale === 'en' && (typeof window !== 'undefined' || !content)) use(loadCalculusCopy())
  return useCallback((text: string) => calculusCopy(locale, text), [locale])
}
