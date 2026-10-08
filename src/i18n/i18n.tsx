import { createContext, useContext } from 'react'
import { loadUiLocale, saveUiLocale, type UiLocale } from './locale'
import { translate, type MessageKey } from './messages'

export type TranslateFn = (key: MessageKey, vars?: Record<string, string | number>) => string

export type LocaleContextValue = {
  locale: UiLocale
  setLocale: (locale: UiLocale) => void
  t: TranslateFn
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)

export function useI18n(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    const locale = loadUiLocale()
    return {
      locale,
      setLocale: saveUiLocale,
      t: (key, vars) => translate(locale, key, vars),
    }
  }
  return ctx
}
