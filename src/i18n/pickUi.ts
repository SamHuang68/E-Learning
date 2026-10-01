import type { UiLocale } from './locale'

export type Bilingual = { zh: string; en: string }

/** Pick the UI string for the active interface language. */
export function pickUi(locale: UiLocale, zh: string, en: string): string {
  return locale === 'en' ? en : zh
}

export function pickBilingual(locale: UiLocale, pair: Bilingual): string {
  return locale === 'en' ? pair.en : pair.zh
}

/**
 * Chrome language for labs that also offer a Japanese instruction track.
 * UI English wins over Chinese instruction copy; Japanese instruction stays.
 */
export function chromeLang(
  locale: UiLocale,
  instructionLang?: 'zh' | 'ja' | 'en',
): 'zh' | 'ja' | 'en' {
  if (instructionLang === 'ja') return 'ja'
  if (instructionLang === 'en' || locale === 'en') return 'en'
  return 'zh'
}

export function pickChrome(
  lang: 'zh' | 'ja' | 'en',
  copy: { zh: string; ja?: string; en: string },
): string {
  if (lang === 'ja') return copy.ja ?? copy.en
  if (lang === 'en') return copy.en
  return copy.zh
}
