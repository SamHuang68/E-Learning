import { Suspense, useEffect, useRef, useState, type ComponentType, type LazyExoticComponent } from 'react'
import { AuthProvider } from './auth/AuthProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PrivacyPage } from './components/PrivacyPage'
import { AccessibilityControls } from './components/AccessibilityControls'
import { UpdateNotification } from './components/UpdateNotification'
import { Hub } from './Hub'
import { saveLang, writeLangPreference, type LangId } from './utils/storage'
import { lazyWithRetry } from './utils/lazyWithRetry'
import { parseTopViewHash, type TopView } from './utils/topRoute'
import { LocaleProvider, useI18n } from './i18n/i18n'

type ModuleAppProps = {
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

const MODULES: Record<
  Exclude<LangId, never>,
  { labelKey: 'app.module.ja' | 'app.module.en' | 'app.module.math' | 'app.module.calculus' | 'app.module.physics' | 'app.module.chemistry' | 'app.module.cs' | 'app.module.zh'; App: LazyExoticComponent<ComponentType<ModuleAppProps>> }
> = {
  ja: {
    labelKey: 'app.module.ja',
    App: lazyWithRetry(() => import('./aoba/AobaApp').then((m) => ({ default: m.AobaApp })), 'aoba'),
  },
  en: {
    labelKey: 'app.module.en',
    App: lazyWithRetry(() => import('./toeic/ToeicApp').then((m) => ({ default: m.ToeicApp })), 'toeic'),
  },
  math: {
    labelKey: 'app.module.math',
    App: lazyWithRetry(() => import('./math/MathApp').then((m) => ({ default: m.MathApp })), 'math'),
  },
  calculus: {
    labelKey: 'app.module.calculus',
    App: lazyWithRetry(
      () => import('./calculus/CalculusApp').then((m) => ({ default: m.CalculusApp })),
      'calculus',
    ),
  },
  physics: {
    labelKey: 'app.module.physics',
    App: lazyWithRetry(
      () => import('./physics/PhysicsApp').then((m) => ({ default: m.PhysicsApp })),
      'physics',
    ),
  },
  chemistry: {
    labelKey: 'app.module.chemistry',
    App: lazyWithRetry(
      () => import('./chemistry/ChemistryApp').then((m) => ({ default: m.ChemistryApp })),
      'chemistry',
    ),
  },
  cs: {
    labelKey: 'app.module.cs',
    App: lazyWithRetry(() => import('./cs/CsApp').then((m) => ({ default: m.CsApp })), 'cs'),
  },
  zh: {
    labelKey: 'app.module.zh',
    App: lazyWithRetry(() => import('./chinese/ChineseApp').then((m) => ({ default: m.ChineseApp })), 'zh'),
  },
}

function readTopView(): TopView {
  return parseTopViewHash(window.location.hash)
}

function ModuleFallback() {
  const { t } = useI18n()
  return (
    <div className="module-fallback" role="status">
      {t('common.loadingModule')}
    </div>
  )
}

function AppShell() {
  const { t } = useI18n()
  const [view, setView] = useState<TopView>(() => readTopView())
  const focusRoute = useRef(false)

  useEffect(() => {
    const onHash = () => {
      focusRoute.current = true
      setView(readTopView())
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (view !== 'hub' && view !== 'privacy') writeLangPreference(view)
  }, [view])

  useEffect(() => {
    const titles: Record<TopView, string> = {
      hub: t('title.hub'),
      math: t('title.math'),
      calculus: t('title.calculus'),
      physics: t('title.physics'),
      chemistry: t('title.chemistry'),
      cs: t('title.cs'),
      ja: t('title.ja'),
      en: t('title.en'),
      zh: t('title.zh'),
      privacy: t('title.privacy'),
    }
    document.title = titles[view]
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    let observer: MutationObserver | null = null
    let timeoutId = 0
    const prepareMain = () => {
      const main = document.querySelector<HTMLElement>('main')
      if (!main) return false
      main.id = 'main-content'
      if (focusRoute.current) {
        main.tabIndex = -1
        main.focus({ preventScroll: true })
        focusRoute.current = false
      }
      return true
    }

    if (!prepareMain()) {
      observer = new MutationObserver(() => {
        if (prepareMain()) observer?.disconnect()
      })
      observer.observe(document.getElementById('root') ?? document.body, {
        childList: true,
        subtree: true,
      })
      timeoutId = window.setTimeout(() => observer?.disconnect(), 5000)
    }

    return () => {
      observer?.disconnect()
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [view, t])

  function choose(next: LangId | 'hub') {
    focusRoute.current = true
    saveLang(next)
    setView(next)
  }

  function openPrivacy() {
    focusRoute.current = true
    window.location.hash = 'privacy'
    setView('privacy')
  }

  if (view === 'privacy') {
    return <PrivacyPage onBack={() => choose('hub')} />
  }

  const mod = view === 'hub' ? null : MODULES[view]
  if (mod) {
    const ModuleApp = mod.App
    return (
      <ErrorBoundary label={t(mod.labelKey)}>
        <Suspense fallback={<ModuleFallback />}>
          <ModuleApp onBackHub={() => choose('hub')} onSwitchLang={(lang: LangId) => choose(lang)} />
        </Suspense>
      </ErrorBoundary>
    )
  }

  return <Hub onChoose={(lang) => choose(lang)} onOpenPrivacy={openPrivacy} />
}

export default function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <AppChrome />
      </AuthProvider>
    </LocaleProvider>
  )
}

function AppChrome() {
  const { t } = useI18n()
  return (
    <ErrorBoundary label={t('error.appLabel')}>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault()
          const main = document.querySelector<HTMLElement>('main')
          if (main) {
            main.id = 'main-content'
            main.tabIndex = -1
            main.focus()
          }
        }}
      >
        {t('common.skipToContent')}
      </a>
      <AccessibilityControls />
      <UpdateNotification />
      <AppShell />
    </ErrorBoundary>
  )
}
