import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { KanaLab } from '../components/KanaLab'
import { KanjiLab } from '../components/KanjiLab'
import { LessonBuilder } from '../components/LessonBuilder'
import { MockExam } from '../components/MockExam'
import { PlacementTest } from '../components/PlacementTest'
import { PracticeView } from '../components/PracticeView'
import { ProGate } from '../components/ProGate'
import { ScenarioPlayer } from '../components/ScenarioPlayer'
import { Sidebar, type NavId } from '../components/Sidebar'
import { SpeakingLab } from '../components/SpeakingLab'
import { TodayView } from '../components/TodayView'
import { SignalDecisionView } from './components/SignalDecisionView'
import { collectUnitCardIds, itemKey } from '../data/contentPack'
import { jlptLevels, type BuilderConfig } from '../data/course'
import { flattenKana, getKanaRows } from '../data/kana'
import { getJaPractice } from '../data/practiceContent'
import { track } from '../engine/analytics'
import { dailyProgress } from '../engine/habits'
import type { PlacementResult } from '../engine/placement'
import { buildDailyQueue } from '../engine/srs'
import { decodeShare } from '../utils/prompt'
import {
  loadKanaProgress,
  loadLearningMeta,
  loadProgress,
  saveLearningMeta,
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
    'review' | 'mock' | 'placement' | null
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
    const v = (progress.vocabDone / Math.max(1, unit.words)) * 100
    const r = (progress.readingDone / Math.max(1, unit.reading)) * 100
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

  function refreshMeta() {
    setLearningMeta(loadLearningMeta())
  }

  function applyPracticeProgress(
    kind: 'vocab' | 'reading' | 'grammar',
    delta = 1,
  ) {
    const amount = Math.max(0, delta)
    refreshMeta()
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
    refreshMeta()
    if (amount <= 0) return
    setProgress((prev) => ({ ...prev, xp: prev.xp + amount * 2 }))
  }

  function handleNav(id: NavId) {
    setPractice(null)
    setSpecial(null)
    setNav(id)
  }

  function withUnitGate(node: ReactNode) {
    return (
      <ProGate
        meta={learningMeta}
        track="ja"
        levelOrCert={progress.levelId}
        unitId={progress.unitId}
        onUnlocked={() => refreshMeta()}
      >
        {node}
      </ProGate>
    )
  }

  function renderMockSession() {
    return (
      <MockExam
        lang="ja"
        onExit={() => {
          setSpecial(null)
          setNav('today')
        }}
        onComplete={(result) => {
          track('mock_submit', {
            track: 'ja',
            score: result.score,
            weakTags: result.weakTags,
          })
          const meta = loadLearningMeta()
          saveLearningMeta({
            ...meta,
            events: [
              {
                t: new Date().toISOString(),
                type: 'mock_submit',
                payload: { score: result.score, weakTags: result.weakTags },
              },
              ...meta.events,
            ].slice(0, 200),
          })
          awardReviewXp(Math.max(1, Math.round(result.score / 2)))
          setSpecial(null)
          setNav('today')
        }}
      />
    )
  }

  function handlePlacementComplete(result: PlacementResult) {
    if (!('levelId' in result)) return
    const meta = loadLearningMeta()
    saveLearningMeta({
      ...meta,
      placementJa: {
        levelId: result.levelId,
        score: result.score,
        at: new Date().toISOString(),
      },
    })
    patchProgress({
      levelId: result.levelId,
      unitId: 1,
      vocabDone: 0,
      readingDone: 0,
      grammarStarted: false,
    })
    track('placement_complete', { track: 'ja', levelId: result.levelId, score: result.score })
    refreshMeta()
  }

  function renderContent() {
    if (special === 'review') {
      return withUnitGate(
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
        />,
      )
    }

    if (special === 'mock' || nav === 'mock') {
      return withUnitGate(renderMockSession())
    }

    if (special === 'placement' || nav === 'placement') {
      return (
        <PlacementTest
          lang="ja"
          onExit={() => {
            setSpecial(null)
            setNav('today')
          }}
          onComplete={handlePlacementComplete}
        />
      )
    }

    if (nav === 'kanji') {
      return (
        <KanjiLab
          mastered={learningMeta.kanjiMastered}
          onMaster={(id) => {
            const meta = loadLearningMeta()
            if (meta.kanjiMastered.includes(id)) return
            saveLearningMeta({
              ...meta,
              kanjiMastered: [...meta.kanjiMastered, id],
            })
            patchProgress({ xp: progress.xp + 3 })
            refreshMeta()
          }}
        />
      )
    }

    if (nav === 'scenario') {
      return withUnitGate(
        <ScenarioPlayer
          track="ja"
          onExit={() => setNav('today')}
          onComplete={(result) => {
            track('scenario_complete', result)
            awardReviewXp(result.correct)
            setNav('today')
          }}
        />,
      )
    }

    if (nav === 'speaking') {
      const prompts = currentPack
        ? [...currentPack.vocab, ...currentPack.passage].slice(0, 8)
        : []
      return withUnitGate(
        <SpeakingLab
          prompts={prompts}
          lang="ja"
          onComplete={(count) => {
            const meta = loadLearningMeta()
            saveLearningMeta({
              ...meta,
              speakingDone: meta.speakingDone + count,
            })
            awardReviewXp(count)
            setNav('today')
          }}
        />,
      )
    }

    if (practice) {
      return withUnitGate(
        <PracticeView
          kind={practice}
          levelId={progress.levelId}
          unit={unit}
          onBack={() => {
            setPractice(null)
            setNav('today')
          }}
          onProgress={(delta) => applyPracticeProgress(practice, delta)}
        />,
      )
    }

    if (nav === 'signals') {
      return <SignalDecisionView onBack={() => setNav('today')} />
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
      return withUnitGate(
        <PracticeView
          kind="vocab"
          levelId={progress.levelId}
          unit={unit}
          onBack={() => setNav('today')}
          onProgress={(delta) => applyPracticeProgress('vocab', delta)}
        />,
      )
    }
    if (nav === 'grammar') {
      return withUnitGate(
        <PracticeView
          kind="grammar"
          levelId={progress.levelId}
          unit={unit}
          onBack={() => setNav('today')}
          onProgress={(delta) => applyPracticeProgress('grammar', delta)}
        />,
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
        ? '模擬測驗'
        : '分級測驗'
    : practice
      ? practice === 'vocab'
        ? '單字練習'
        : practice === 'reading'
          ? '閱讀練習'
          : '文法教室'
      : nav === 'signals'
        ? '句型動作判準 (3秒決策樹)'
        : nav === 'kana'
          ? '五十音教室'
          : nav === 'builder'
            ? '課程設計器'
            : nav === 'vocab'
              ? '單字練習'
              : nav === 'grammar'
                ? '文法教室'
                : nav === 'kanji'
                  ? '漢字實驗室'
                  : nav === 'scenario'
                    ? '情境任務'
                    : nav === 'speaking'
                      ? '口說跟讀'
                      : nav === 'mock'
                        ? '模擬測驗'
                        : nav === 'placement'
                          ? '分級測驗'
                          : '今日學習'

  const sidebarNav: NavId =
    practice || special === 'review' ? 'today' : special === 'mock' ? 'mock' : special === 'placement' ? 'placement' : nav

  return (
    <main className="app-shell">
      <Sidebar
        nav={sidebarNav}
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
        <Breadcrumbs
          items={[
            { label: 'あおば日語', onClick: () => handleNav('today') },
            { label: `${level.band} (${level.tier})`, onClick: () => handleNav('today') },
            { label: `單元 ${unit.id} · ${unit.title}`, active: nav === 'today' && !practice && !special },
            ...(nav !== 'today' || practice || special ? [{ label: title, active: true }] : []),
          ]}
        />

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
            {nav !== 'kana' && nav !== 'kanji' && (
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
            {learningMeta.proUnlocked ? ' · Pro' : ' · Free'}
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
