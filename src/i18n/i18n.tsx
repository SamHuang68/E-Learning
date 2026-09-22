import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  loadUiLocale,
  saveUiLocale,
  UI_LOCALE_EVENT,
  type UiLocale,
} from './locale'
import { translate, type MessageKey } from './messages'

type TranslateFn = (key: MessageKey, vars?: Record<string, string | number>) => string

type LocaleContextValue = {
  locale: UiLocale
  setLocale: (locale: UiLocale) => void
  t: TranslateFn
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<UiLocale>(() => loadUiLocale())

  useEffect(() => {
    const onChange = (event: Event) => {
      const next = (event as CustomEvent<UiLocale>).detail
      if (next === 'zh-Hant' || next === 'en') setLocaleState(next)
    }
    window.addEventListener(UI_LOCALE_EVENT, onChange)
    return () => window.removeEventListener(UI_LOCALE_EVENT, onChange)
  }, [])

  const setLocale = useCallback((next: UiLocale) => {
    saveUiLocale(next)
    setLocaleState(next)
  }, [])

  const t = useCallback<TranslateFn>(
    (key, vars) => translate(locale, key, vars),
    [locale],
  )

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

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

export function LocaleToggle({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useI18n()
  return (
    <div
      className={`locale-toggle${compact ? ' is-compact' : ''}`}
      role="group"
      aria-label={t('locale.toggleLabel')}
    >
      <button
        type="button"
        className={locale === 'zh-Hant' ? 'is-active' : ''}
        aria-pressed={locale === 'zh-Hant'}
        lang="zh-Hant"
        onClick={() => setLocale('zh-Hant')}
      >
        {t('locale.zh')}
      </button>
      <button
        type="button"
        className={locale === 'en' ? 'is-active' : ''}
        aria-pressed={locale === 'en'}
        lang="en"
        onClick={() => setLocale('en')}
      >
        {t('locale.en')}
      </button>
    </div>
  )
}
