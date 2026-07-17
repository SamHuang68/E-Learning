import { useCallback, useEffect, useMemo, useState } from 'react'
import { KanaLab } from '../components/KanaLab'
import { ExerciseSession } from '../components/ExerciseSession'
import { LessonBuilder } from '../components/LessonBuilder'
import { PracticeView } from '../components/PracticeView'
import { Sidebar, type NavId } from '../components/Sidebar'
import { TodayView } from '../components/TodayView'
import { collectUnitCardIds, itemKey } from '../data/contentPack'
import { jlptLevels, type BuilderConfig } from '../data/course'
import { flattenKana, getKanaRows } from '../data/kana'
import { getJaPractice } from '../data/practiceContent'
import { cardsToExercises } from '../engine/exercises'
import { dailyProgress } from '../engine/habits'
import { buildDailyQueue } from '../engine/srs'
import { applyExerciseSessionResult } from '../engine/sessionResults'
import { decodeShare } from '../utils/prompt'
import { useAuth } from '../auth/AuthProvider'
import {
  loadKanaProgress,
  loadLearningMeta,
  loadProgress,
  saveProgress,
  type LangId,
  type LearningMeta,
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
  const [special, setSpecial] = useState<
    'review' | 'mock' | 'placement' | 'kanji' | 'scenario' | 'speaking' | null
  >(null)
  const [learningMeta, setLearningMeta] = useState<LearningMeta>(() =>
    loadLearningMeta(),
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
  const currentPack = useMemo(
    () => getJaPractice(progress.levelId, unit.id),
    [progress.levelId, unit.id],
  )
  const unitItemIds = useMemo(
    () =>
      currentPack
        ? collectUnitCardIds(currentPack).map((id) => itemKey('ja', id))
        : [],
    [currentPack],
  )
  const reviewQueue = useMemo(
    () =>
      buildDailyQueue({
        allIds: unitItemIds,
        items: learningMeta.items,
      }),
    [learningMeta.items, unitItemIds],
  )
  const daily = useMemo(() => dailyProgress(learningMeta), [learningMeta])

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
      setLearningMeta(loadLearningMeta())
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

  function applyPracticeProgress(
    kind: 'vocab' | 'reading' | 'grammar',
    delta = 1,
  ) {
    const amount = Math.max(0, delta)
    setLearningMeta(loadLearningMeta())
    if (amount <= 0) return

    setProgress((prev) => {
      if (kind === 'vocab') {
        return {
          ...prev,
          vocabDone: Math.min(unit.words, prev.vocabDone + amount),
          xp: prev.xp + amount * 5,
        }
      }
      if (kind === 'reading') {
        return {
          ...prev,
          readingDone: Math.min(unit.reading, prev.readingDone + amount),
          xp: prev.xp + amount * 8,
        }
      }
      return {
        ...prev,
        grammarStarted: true,
        xp: prev.xp + amount * 10,
      }
    })
  }

  function awardReviewXp(delta = 1) {
    const amount = Math.max(0, delta)
    setLearningMeta(loadLearningMeta())
    if (amount <= 0) return
    setProgress((prev) => ({ ...prev, xp: prev.xp + amount * 2 }))
  }

  function handleNav(id: NavId) {
    setPractice(null)
    setSpecial(null)
    setNav(id)
  }

  function renderMockSession() {
    const cards = currentPack
      ? [...currentPack.vocab, ...currentPack.passage, ...currentPack.grammar]
      : []
    const exercises = cardsToExercises(cards, 'ja', cards).slice(0, 15)
    return (
      <ExerciseSession
        title={`單元總測驗 · Unit ${unit.id}`}
        lang="ja"
        exercises={exercises}
        onExit={() => {
          setSpecial(null)
          setNav('today')
        }}
        onComplete={(result) => {
          const saved = applyExerciseSessionResult(result, {
            track: 'ja',
            kind: 'mock',
          })
          awardReviewXp(saved.correctCards)
          setSpecial(null)
          setNav('today')
        }}
      />
    )
  }

  function renderContent() {
    if (special === 'review') {
      return (
        <PracticeView
          kind="vocab"
          levelId={progress.levelId}
          unit={unit}
          mode="quiz"
          reviewIds={reviewQueue.queue}
          onBack={() => {
            setSpecial(null)
            setNav('today')
          }}
          onProgress={awardReviewXp}
        />
      )
    }

    if (special === 'mock') return renderMockSession()

    if (special === 'placement') {
      return (
        <div className="result-panel">
          <div>
            <strong>Placement</strong>
            <span>分級測驗準備中</span>
          </div>
          <p>目前可先用今日複習與單元總測驗校準學習進度。</p>
          <button
            type="button"
            className="primary-btn inline"
            onClick={() => {
              setSpecial(null)
              setNav('today')
            }}
          >
            返回今日學習
          </button>
        </div>
      )
    }

    if (practice) {
      return (
        <PracticeView
          kind={practice}
          levelId={progress.levelId}
          unit={unit}
          onBack={() => {
            setPractice(null)
            setNav('today')
          }}
          onProgress={(delta) => applyPracticeProgress(practice, delta)}
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
          levelId={progress.levelId}
          unit={unit}
          onBack={() => setNav('today')}
          onProgress={(delta) => applyPracticeProgress('vocab', delta)}
        />
      )
    }
    if (nav === 'grammar') {
      return (
        <PracticeView
          kind="grammar"
          levelId={progress.levelId}
          unit={unit}
          onBack={() => setNav('today')}
          onProgress={(delta) => applyPracticeProgress('grammar', delta)}
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
        onStartVocab={() => {
          setSpecial(null)
          setPractice('vocab')
        }}
        onStartReading={() => {
          setSpecial(null)
          setPractice('reading')
        }}
        onStartGrammar={() => {
          setSpecial(null)
          setPractice('grammar')
        }}
        onStartReview={() => {
          setPractice(null)
          setSpecial('review')
        }}
        onStartMock={() => {
          setPractice(null)
          setSpecial('mock')
        }}
        onStartPlacement={() => {
          setPractice(null)
          setSpecial('placement')
        }}
        onSelectUnit={(id) =>
          patchProgress({
            unitId: id,
            vocabDone: 0,
            readingDone: 0,
            grammarStarted: false,
          })
        }
        dueCount={reviewQueue.queue.length}
        streak={learningMeta.streak}
        dailyDone={daily.done}
        dailyGoal={daily.goal}
      />
    )
  }

  const title = special
    ? special === 'review'
      ? '今日複習'
      : special === 'mock'
        ? '單元總測驗'
        : '分級測驗'
    : practice
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
        nav={practice || special ? 'today' : nav}
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
