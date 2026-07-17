import { useCallback, useEffect, useMemo, useState } from 'react'
import { KanaLab } from '../components/KanaLab'
import { LessonBuilder } from '../components/LessonBuilder'
import { PracticeView } from '../components/PracticeView'
import { Sidebar, type NavId } from '../components/Sidebar'
import { TodayView } from '../components/TodayView'
import { jlptLevels, type BuilderConfig } from '../data/course'
import { flattenKana, getKanaRows } from '../data/kana'
import { decodeShare } from '../utils/prompt'
import { useAuth } from '../auth/AuthProvider'
import {
  loadKanaProgress,
  loadProgress,
  saveProgress,
  type LangId,
  type ProgressState,
} from '../utils/storage'

function initialKanaTotals() {
  const k = loadKanaProgress()
  const all = flattenKana(getKanaRows(k.script, true))
  const mastered = k.mastered.filter((ch) => all.some((c) => c.char === ch)).length
  return { mastered, total: all.length }
}

type Props = {
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

export function AobaApp({ onBackHub, onSwitchLang }: Props) {
  const { user, syncStatus } = useAuth()
  const [nav, setNav] = useState<NavId>(() => {
    if (window.location.hash.includes('builder')) return 'builder'
    return 'kana'
  })
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const [practice, setPractice] = useState<'vocab' | 'reading' | 'grammar' | null>(
    null,
  )
  const [builderSeed, setBuilderSeed] = useState<Partial<BuilderConfig>>()
  const [speakingHint, setSpeakingHint] = useState('音訊待命')
  const [kanaTotals, setKanaTotals] = useState(initialKanaTotals)
  const handleKanaProgress = useCallback((mastered: number, total: number) => {
    setKanaTotals((prev) =>
      prev.mastered === mastered && prev.total === total
        ? prev
        : { mastered, total },
    )
  }, [])

  const level =
    jlptLevels.find((l) => l.id === progress.levelId) ?? jlptLevels[0]
  const unit = level.units.find((u) => u.id === progress.unitId) ?? level.units[0]

  const progressPct = useMemo(() => {
    const v = (progress.vocabDone / unit.words) * 100
    const r = (progress.readingDone / unit.reading) * 100
    const g = progress.grammarStarted ? 40 : 0
    return Math.round((v + r + g) / 3)
  }, [progress, unit])

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  useEffect(() => {
    const onHydrated = () => {
      setProgress(loadProgress())
      setKanaTotals(initialKanaTotals())
    }
    window.addEventListener('e-learning:progress-hydrated', onHydrated)
    return () =>
      window.removeEventListener('e-learning:progress-hydrated', onHydrated)
  }, [])

  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('builder=')) {
      const encoded = hash.split('builder=')[1]
      const decoded = decodeShare(encoded)
      if (decoded) {
        setBuilderSeed(decoded)
        setNav('builder')
      }
    }
  }, [])

  function patchProgress(patch: Partial<ProgressState>) {
    setProgress((p) => ({ ...p, ...patch }))
  }

  function handleNav(id: NavId) {
    setPractice(null)
    setNav(id)
  }

  function renderContent() {
    if (practice) {
      return (
        <PracticeView
          kind={practice}
          unit={unit}
          onBack={() => {
            setPractice(null)
            setNav('today')
          }}
          onProgress={() => {
            if (practice === 'vocab') {
              patchProgress({
                vocabDone: Math.min(unit.words, progress.vocabDone + 1),
                xp: progress.xp + 5,
              })
            } else if (practice === 'reading') {
              patchProgress({
                readingDone: Math.min(unit.reading, progress.readingDone + 1),
                xp: progress.xp + 8,
              })
            } else {
              patchProgress({ grammarStarted: true, xp: progress.xp + 10 })
            }
          }}
        />
      )
    }

    if (nav === 'kana') {
      return (
        <KanaLab
          onXp={(amount) => {
            patchProgress({ xp: progress.xp + amount })
            setSpeakingHint('導讀完成 +XP')
            window.setTimeout(() => setSpeakingHint('音訊待命'), 1200)
          }}
          onProgressChange={handleKanaProgress}
        />
      )
    }
    if (nav === 'builder') return <LessonBuilder initial={builderSeed} />
    if (nav === 'vocab') {
      return (
        <PracticeView
          kind="vocab"
          unit={unit}
          onBack={() => setNav('today')}
          onProgress={() =>
            patchProgress({
              vocabDone: Math.min(unit.words, progress.vocabDone + 1),
              xp: progress.xp + 5,
            })
          }
        />
      )
    }
    if (nav === 'grammar') {
      return (
        <PracticeView
          kind="grammar"
          unit={unit}
          onBack={() => setNav('today')}
          onProgress={() =>
            patchProgress({ grammarStarted: true, xp: progress.xp + 10 })
          }
        />
      )
    }

    return (
      <TodayView
        level={level}
        unit={unit}
        progress={progress}
        onOpenBuilder={() => setNav('builder')}
        onOpenKana={() => setNav('kana')}
        onStartVocab={() => setPractice('vocab')}
        onStartReading={() => setPractice('reading')}
        onStartGrammar={() => setPractice('grammar')}
        onSelectUnit={(id) =>
          patchProgress({
            unitId: id,
            vocabDone: 0,
            readingDone: 0,
            grammarStarted: false,
          })
        }
      />
    )
  }

  const title = practice
    ? practice === 'vocab'
      ? '單字練習'
      : practice === 'reading'
        ? '閱讀練習'
        : '文法教室'
    : nav === 'kana'
      ? '五十音教室'
      : nav === 'builder'
        ? '課程設計器'
        : nav === 'vocab'
          ? '單字練習'
          : nav === 'grammar'
            ? '文法教室'
            : '今日學習'

  return (
    <main className="app-shell">
      <Sidebar
        nav={practice ? 'today' : nav}
        onNav={handleNav}
        level={level}
        unit={unit}
        progressPct={progressPct}
        kanaMastered={kanaTotals.mastered}
        kanaTotal={kanaTotals.total}
        onBackHub={onBackHub}
        onSwitchLang={onSwitchLang}
      />

      <section className="content">
        <div className="mobile-brand">
          <div className="brand-mark">あ</div>
          <strong>あおば Aoba</strong>
        </div>

        <header className="topbar">
          <div>
            <p className="eyebrow">JLPT · {level.tier}</p>
            <h1>{title}</h1>
          </div>

          <div className="header-actions">
            <div
              className={`audio-status ${speakingHint.includes('導讀') ? 'live' : 'idle'}`}
              aria-live="polite"
            >
              <span>{speakingHint}</span>
            </div>
            {nav !== 'kana' && (
              <>
                <label className="unit-select">
                  <span>JLPT 級距</span>
                  <select
                    value={progress.levelId}
                    onChange={(e) =>
                      patchProgress({
                        levelId: e.target.value,
                        unitId: 1,
                        vocabDone: 0,
                        readingDone: 0,
                        grammarStarted: false,
                      })
                    }
                  >
                    {jlptLevels.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.band} · {l.tier}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="unit-select">
                  <span>選擇單元</span>
                  <select
                    value={progress.unitId}
                    onChange={(e) =>
                      patchProgress({
                        unitId: Number(e.target.value),
                        vocabDone: 0,
                        readingDone: 0,
                        grammarStarted: false,
                      })
                    }
                  >
                    {level.units.map((u) => (
                      <option key={u.id} value={u.id}>
                        Unit {u.id} · {u.title}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}
            <div className="xp">
              <span>★</span>
              <strong>{progress.xp} XP</strong>
            </div>
          </div>
        </header>

        <div className="alignment-note">
          <strong>
            級距：{level.band}（{level.tier}）
          </strong>
          <span>{level.audience}</span>
        </div>

        {renderContent()}

        <footer>
          <span>
            最上層以 JLPT 難度與適合對象分級；五十音為非必修補強的零基礎層，含語音導讀。
          </span>
          <span>
            {user
              ? syncStatus === 'synced'
                ? '進度已同步至雲端'
                : syncStatus === 'syncing'
                  ? '進度同步中…'
                  : syncStatus === 'error'
                    ? '雲端同步失敗（本機仍可用）'
                    : '已登入・本機快取'
              : '未登入・進度僅保存在這台裝置'}
          </span>
        </footer>
      </section>
    </main>
  )
}
