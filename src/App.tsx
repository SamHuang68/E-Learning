import { Suspense, useEffect, useRef, useState, type ComponentType, type LazyExoticComponent } from 'react'
import { AuthProvider } from './auth/AuthProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PrivacyPage } from './components/PrivacyPage'
import { AccessibilityControls } from './components/AccessibilityControls'
import { Hub } from './Hub'
import { saveLang, type LangId } from './utils/storage'
import { lazyWithRetry } from './utils/lazyWithRetry'
import { parseTopViewHash, type TopView } from './utils/topRoute'

type ModuleAppProps = {
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

const MODULES: Record<
  Exclude<LangId, never>,
  { label: string; App: LazyExoticComponent<ComponentType<ModuleAppProps>> }
> = {
  ja: {
    label: '日語模組',
    App: lazyWithRetry(() => import('./aoba/AobaApp').then((m) => ({ default: m.AobaApp })), 'aoba'),
  },
  en: {
    label: '多益模組',
    App: lazyWithRetry(() => import('./toeic/ToeicApp').then((m) => ({ default: m.ToeicApp })), 'toeic'),
  },
  math: {
    label: '臺灣數學模組',
    App: lazyWithRetry(() => import('./math/MathApp').then((m) => ({ default: m.MathApp })), 'math'),
  },
  calculus: {
    label: '微積分模組',
    App: lazyWithRetry(
      () => import('./calculus/CalculusApp').then((m) => ({ default: m.CalculusApp })),
      'calculus',
    ),
  },
  physics: {
    label: '臺灣物理模組',
    App: lazyWithRetry(
      () => import('./physics/PhysicsApp').then((m) => ({ default: m.PhysicsApp })),
      'physics',
    ),
  },
  chemistry: {
    label: '臺灣化學模組',
    App: lazyWithRetry(
      () => import('./chemistry/ChemistryApp').then((m) => ({ default: m.ChemistryApp })),
      'chemistry',
    ),
  },
  cs: {
    label: '計算機概論模組',
    App: lazyWithRetry(() => import('./cs/CsApp').then((m) => ({ default: m.CsApp })), 'cs'),
  },
  zh: {
    label: '華語模組',
    App: lazyWithRetry(() => import('./chinese/ChineseApp').then((m) => ({ default: m.ChineseApp })), 'zh'),
  },
}

function readTopView(): TopView {
  return parseTopViewHash(window.location.hash)
}

function ModuleFallback() {
  return (
    <div className="module-fallback" role="status">
      載入學習模組…
    </div>
  )
}

function AppShell() {
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
    const titles: Record<TopView, string> = {
      hub: 'E-Learning Hub',
      math: '臺灣數學學習｜E-Learning Hub',
      calculus: '微積分互動專題｜E-Learning Hub',
      physics: '臺灣物理學習 (國中+高中)｜E-Learning Hub',
      chemistry: '臺灣化學學習 (國中+高中)｜E-Learning Hub',
      cs: '計算機概論 (軟硬體與現代AI)｜E-Learning Hub',
      ja: '日本語學習｜E-Learning Hub',
      en: 'TOEIC 英語學習｜E-Learning Hub',
      zh: '台湾華語・中国語學習 (日本語で学ぶ)｜E-Learning Hub',
      privacy: '隱私與資料說明｜E-Learning Hub',
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
  }, [view])

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
      <ErrorBoundary label={mod.label}>
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
    <AuthProvider>
      <ErrorBoundary label="應用程式">
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
          跳到主要內容
        </a>
        <AccessibilityControls />
        <AppShell />
      </ErrorBoundary>
    </AuthProvider>
  )
}
