import { Suspense, useEffect, useState } from 'react'
import { AuthProvider } from './auth/AuthProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PrivacyPage } from './components/PrivacyPage'
import { AccessibilityControls } from './components/AccessibilityControls'
import { Hub } from './Hub'
import { saveLang, type AppView, type LangId } from './utils/storage'
import { lazyWithRetry } from './utils/lazyWithRetry'

const AobaApp = lazyWithRetry(() =>
  import('./aoba/AobaApp').then((m) => ({ default: m.AobaApp })),
)
const ToeicApp = lazyWithRetry(() =>
  import('./toeic/ToeicApp').then((m) => ({ default: m.ToeicApp })),
)
const MathApp = lazyWithRetry(() =>
  import('./math/MathApp').then((m) => ({ default: m.MathApp })),
)
const CalculusApp = lazyWithRetry(() =>
  import('./calculus/CalculusApp').then((m) => ({ default: m.CalculusApp })),
)
const PhysicsApp = lazyWithRetry(() =>
  import('./physics/PhysicsApp').then((m) => ({ default: m.PhysicsApp })),
)
const ChemistryApp = lazyWithRetry(() =>
  import('./chemistry/ChemistryApp').then((m) => ({ default: m.ChemistryApp })),
)

type TopView = AppView | 'privacy'

function readTopView(): TopView {
  const hash = window.location.hash.replace('#', '').trim()
  if (hash === 'privacy') return 'privacy'
  if (hash === 'en' || hash.startsWith('toeic')) return 'en'
  if (hash === 'calculus' || hash.startsWith('calc')) return 'calculus'
  if (hash === 'physics' || hash.startsWith('phys')) return 'physics'
  if (hash === 'chemistry' || hash.startsWith('chem')) return 'chemistry'
  if (hash === 'math' || hash.startsWith('math')) return 'math'
  if (hash === 'ja' || hash.startsWith('aoba') || hash.startsWith('builder')) return 'ja'
  return 'hub'
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

  useEffect(() => {
    const onHash = () => setView(readTopView())
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
      ja: '日本語學習｜E-Learning Hub',
      en: 'TOEIC 英語學習｜E-Learning Hub',
      privacy: '隱私與資料說明｜E-Learning Hub',
    }
    document.title = titles[view]
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [view])

  function choose(next: AppView) {
    saveLang(next)
    setView(next)
  }

  function openPrivacy() {
    window.location.hash = 'privacy'
    setView('privacy')
  }

  if (view === 'privacy') {
    return <PrivacyPage onBack={() => choose('hub')} />
  }

  if (view === 'ja') {
    return (
      <ErrorBoundary label="日語模組">
        <Suspense fallback={<ModuleFallback />}>
          <AobaApp
            onBackHub={() => choose('hub')}
            onSwitchLang={(lang: LangId) => choose(lang)}
          />
        </Suspense>
      </ErrorBoundary>
    )
  }
  if (view === 'en') {
    return (
      <ErrorBoundary label="多益模組">
        <Suspense fallback={<ModuleFallback />}>
          <ToeicApp
            onBackHub={() => choose('hub')}
            onSwitchLang={(lang: LangId) => choose(lang)}
          />
        </Suspense>
      </ErrorBoundary>
    )
  }
  if (view === 'math') {
    return (
      <ErrorBoundary label="臺灣數學模組">
        <Suspense fallback={<ModuleFallback />}>
          <MathApp
            onBackHub={() => choose('hub')}
            onSwitchLang={(lang: LangId) => choose(lang)}
          />
        </Suspense>
      </ErrorBoundary>
    )
  }
  if (view === 'calculus') {
    return (
      <ErrorBoundary label="微積分模組">
        <Suspense fallback={<ModuleFallback />}>
          <CalculusApp
            onBackHub={() => choose('hub')}
            onSwitchLang={(lang: LangId) => choose(lang)}
          />
        </Suspense>
      </ErrorBoundary>
    )
  }
  if (view === 'physics') {
    return (
      <ErrorBoundary label="臺灣物理模組">
        <Suspense fallback={<ModuleFallback />}>
          <PhysicsApp
            onBackHub={() => choose('hub')}
            onSwitchLang={(lang: LangId) => choose(lang)}
          />
        </Suspense>
      </ErrorBoundary>
    )
  }
  if (view === 'chemistry') {
    return (
      <ErrorBoundary label="臺灣化學模組">
        <Suspense fallback={<ModuleFallback />}>
          <ChemistryApp
            onBackHub={() => choose('hub')}
            onSwitchLang={(lang: LangId) => choose(lang)}
          />
        </Suspense>
      </ErrorBoundary>
    )
  }
  return (
    <Hub onChoose={(lang) => choose(lang)} onOpenPrivacy={openPrivacy} />
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary label="應用程式">
        <AppShell />
        <AccessibilityControls />
      </ErrorBoundary>
    </AuthProvider>
  )
}
