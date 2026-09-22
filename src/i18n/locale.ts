export type UiLocale = 'zh-Hant' | 'en'
export type DocumentLang = 'zh-Hant' | 'en' | 'ja'

export const UI_LOCALE_KEY = 'e-learning-ui-locale'
export const UI_LOCALE_EVENT = 'e-learning:ui-locale'

export function isUiLocale(value: unknown): value is UiLocale {
  return value === 'zh-Hant' || value === 'en'
}

export function toDocumentLang(value: string): DocumentLang {
  if (value === 'en' || value === 'en-US' || value === 'en-GB') return 'en'
  if (value === 'ja' || value === 'ja-JP') return 'ja'
  return 'zh-Hant'
}

export function loadUiLocale(): UiLocale {
  if (typeof localStorage === 'undefined') return 'zh-Hant'
  try {
    const raw = localStorage.getItem(UI_LOCALE_KEY)
    if (isUiLocale(raw)) return raw
    if (raw === 'zh' || raw === 'zh-TW' || raw === 'zh-Hant-TW') return 'zh-Hant'
    if (raw === 'en-US' || raw === 'en-GB') return 'en'
  } catch {
    // ignore
  }
  return 'zh-Hant'
}

export function saveUiLocale(locale: UiLocale) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(UI_LOCALE_KEY, locale)
  } catch {
    // ignore
  }
  applyDocumentLang(locale)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(UI_LOCALE_EVENT, { detail: locale }))
  }
}

export function applyDocumentLang(locale: string) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = toDocumentLang(locale)
}
