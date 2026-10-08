import { use, useCallback } from 'react'
import { useI18n } from './i18n'
import type { UiLocale } from './locale'
import { ChunkLoadError } from '../utils/chunkLoadError'

const CJK = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/
let content: Readonly<Record<string, string>> | undefined
let pending: Promise<Readonly<Record<string, string>>> | undefined
// These slots contain opaque input or an already-localized base that may itself contain opaque input.
const OPAQUE_SLOTS: Readonly<Record<string, readonly number[]>> = {
  '無法求值：{0}': [0],
  '無法解析「{0}」': [0],
  '無法解析「{0}」：{1}': [0],
  '多餘字元「{0}」': [0],
  '未定義符號「{0}」': [0],
  'Undefined symbol "{0}" / 未定義符號「{1}」. Allowed: {2}': [0, 1],
  '函數 f(x)={0} 無法解析：{1}': [0, 1],
  '函數 f(x)={0}，顯示範圍 x 從 {1} 到 {2}，y 從 {3} 到 {4}。探索點 x={5}，f(x)={6}。': [0],
  '函數 f(x)={0}，顯示範圍 x 從 {1} 到 {2}，y 從 {3} 到 {4}。探索點 x={5}，f(x0) 未定義，數值估計 L≈{6}。': [0],
  '函數 f(x)={0}，顯示範圍 x 從 {1} 到 {2}，y 從 {3} 到 {4}。探索點 x={5}，f(x0) 未定義。': [0],
  '{0} 切線斜率 {1}；割線斜率 {2}。': [0],
  '{0} 積分區間 {1} 到 {2}，使用 {3} 個切片。': [0],
  '{0} 顯示 {1} 階泰勒多項式近似。': [0],
  '{0} epsilon 容忍度 {1}，delta x {2}。': [0],
  '{0} 牛頓法完成 {1} 次迭代。': [0],
  '{0} 旋轉體使用 {1} 個圓柱殼切片。': [0],
  '{0} 旋轉體使用 {1} 個圓盤切片。': [0],
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
  if (locale !== 'en') return text
  if (!content) {
    if (!CJK.test(text)) return text
    throw new Error('微積分英文文案尚未載入')
  }
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
  if (translated === undefined && !CJK.test(text)) return text
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
