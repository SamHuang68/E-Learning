import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { MockExam } from '../components/MockExam'
import { Onboarding } from '../components/Onboarding'
import { PlacementTest } from '../components/PlacementTest'
import { ProGate } from '../components/ProGate'
import { ScenarioPlayer } from '../components/ScenarioPlayer'
import { SpeakingLab } from '../components/SpeakingLab'
import { collectUnitCardIds, itemKey } from '../data/contentPack'
import { track } from '../engine/analytics'
import { buildScenarioMission, buildWeakReviewIds } from '../engine/aiCoach'
import { dailyProgress } from '../engine/habits'
import type { PlacementResult } from '../engine/placement'
import {
  addForcedReviewIds,
  buildReviewQueueWithForced,
  clearForcedReviewIds,
  srsProgressPct,
  weakTagsToReviewIds,
} from '../engine/reviewPlanning'
import {
  loadLearningMeta,
  loadToeicProgress,
  saveLearningMeta,
  saveToeicProgress,
  type LangId,
  type LearningMeta,
  type ToeicProgress,
} from '../utils/storage'
import { toeicCertificates } from './data/certificates'
import { getToeicPractice } from './data/practiceContent'
import { PhonicsLab } from './components/PhonicsLab'
import { ToeicBuilder } from './components/ToeicBuilder'
import { ToeicPractice } from './components/ToeicPractice'
import { ToeicSidebar, type ToeicNavId } from './components/ToeicSidebar'
import { ToeicToday } from './components/ToeicToday'

type ToeicPracticeKind = 'vocab' | 'listening' | 'grammar'
type ToeicSpecial = 'review' | 'mock' | 'placement'
type CoachMission = ReturnType<typeof buildScenarioMission>

const toeicNavIds: ToeicNavId[] = [
  'phonics',
  'today',
  'builder',
  'vocab',
  'listening',
  'grammar',
  'scenario',
  'speaking',
  'mock',
  'placement',
]
const toeicPracticeIds: ToeicPracticeKind[] = ['vocab', 'listening', 'grammar']

function writeToeicHash(path = 'toeic') {
  const next = `#${path}`
  if (window.location.hash === next) return
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${next}`)
}

function parseToeicHash(hash: string): {
  unitId?: number
  nav?: ToeicNavId
  practice?: ToeicPracticeKind
  special?: ToeicSpecial
} | null {
  const parts = hash.replace(/^#/, '').split('?')[0].split('/').filter(Boolean)
  if (parts[0] !== 'toeic') return null
  const route = parts[1]
  if (!route) return { nav: 'today' }
  if (route === 'unit') {
    const unitId = Number(parts[2])
    const section = parts[3]
    const next = Number.isFinite(unitId) ? { unitId } : {}
    if (toeicPracticeIds.includes(section as ToeicPracticeKind)) {
      return { ...next, practice: section as ToeicPracticeKind }
    }
    if (section === 'review' || section === 'mock' || section === 'placement') {
      return { ...next, special: section }
    }
    return next
  }
  if (route === 'review' || route === 'mock' || route === 'placement') {
    return { special: route }
  }
  if (toeicPracticeIds.includes(route as ToeicPracticeKind)) {
    return { practice: route as ToeicPracticeKind }
  }
  if (toeicNavIds.includes(route as ToeicNavId)) return { nav: route as ToeicNavId }
  return null
}

type Props = {
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

export function ToeicApp({ onBackHub, onSwitchLang }: Props) {
  const { user, syncStatus } = useAuth()
  const [nav, setNav] = useState<ToeicNavId>('today')
  const [progress, setProgress] = useState<ToeicProgress>(() => loadToeicProgress())
  const [practice, setPractice] = useState<ToeicPracticeKind | null>(null)
  const [special, setSpecial] = useState<ToeicSpecial | null>(null)
  const [learningMeta, setLearningMeta] = useState<LearningMeta>(() =>
    loadLearningMeta(),
  )
  const [activeReviewIds, setActiveReviewIds] = useState<string[] | null>(null)
  const [coachMission, setCoachMission] = useState<CoachMission | null>(null)

  const cert =
    toeicCertificates.find((c) => c.id === progress.certificateId) ??
    toeicCertificates[0]
  const unit = cert.units.find((u) => u.id === progress.unitId) ?? cert.units[0]
  const currentPack = useMemo(
    () => getToeicPractice(progress.certificateId, unit.id),
    [progress.certificateId, unit.id],
  )
  const unitItemIds = useMemo(
    () =>
      currentPack
        ? collectUnitCardIds(currentPack).map((id) => itemKey('en', id))
        : [],
    [currentPack],
  )
  const reviewQueue = useMemo(
    () =>
      buildReviewQueueWithForced({
        allIds: unitItemIds,
        meta: learningMeta,
      }),
    [learningMeta, unitItemIds],
  )
  const daily = useMemo(() => dailyProgress(learningMeta), [learningMeta])

  const progressPct = useMemo(() => {
    const v = (progress.vocabDone / Math.max(1, unit.words)) * 100
    const l = (progress.listeningDone / Math.max(1, unit.listening)) * 100
    const g = progress.grammarStarted ? 40 : 0
    return srsProgressPct(unitItemIds, learningMeta.items, Math.round((v + l + g) / 3))
  }, [learningMeta.items, progress, unit, unitItemIds])

  useEffect(() => {
    saveToeicProgress(progress)
  }, [progress])

  useEffect(() => {
    const onHydrated = () => {
      setProgress(loadToeicProgress())
      setLearningMeta(loadLearningMeta())
    }
    window.addEventListener('e-learning:progress-hydrated', onHydrated)
    return () =>
      window.removeEventListener('e-learning:progress-hydrated', onHydrated)
  }, [])

  useEffect(() => {
    function applyDeepLink() {
      const route = parseToeicHash(window.location.hash)
      if (!route) return
      if (route.unitId) {
        setProgress((prev) =>
          prev.unitId === route.unitId
            ? prev
            : {
                ...prev,
                unitId: route.unitId ?? prev.unitId,
                vocabDone: 0,
                listeningDone: 0,
                grammarStarted: false,
              },
        )
      }
      setActiveReviewIds(null)
      if (route.special) {
        setPractice(null)
        setSpecial(route.special)
        setNav('today')
        return
      }
      if (route.practice) {
        setSpecial(null)
        setPractice(route.practice)
        setNav('today')
        return
      }
      if (route.nav) {
        setSpecial(null)
        setPractice(null)
        setNav(route.nav)
      }
    }

    applyDeepLink()
    window.addEventListener('hashchange', applyDeepLink)
    return () => window.removeEventListener('hashchange', applyDeepLink)
  }, [])

  function patch(p: Partial<ToeicProgress>) {
    setProgress((prev) => ({ ...prev, ...p }))
  }

  function refreshMeta() {
    setLearningMeta(loadLearningMeta())
  }

  function clearCurrentForcedReviews() {
    const meta = loadLearningMeta()
    const currentIds = meta.forcedReviewIds.filter((id) => unitItemIds.includes(id))
    if (currentIds.length === 0) return
    saveLearningMeta(clearForcedReviewIds(meta, currentIds))
    refreshMeta()
  }

  function finishReview() {
    clearCurrentForcedReviews()
    setActiveReviewIds(null)
    setSpecial(null)
    setNav('today')
    writeToeicHash()
  }

  function startWeakTask() {
    const mission = buildScenarioMission('en')
    setCoachMission(mission)
    const weakIds = buildWeakReviewIds(learningMeta, 8).filter((id) =>
      unitItemIds.includes(id),
    )
    setPractice(null)
    if (weakIds.length > 0) {
      setActiveReviewIds(weakIds)
      setSpecial('review')
      writeToeicHash('toeic/review')
      return
    }
    setSpecial(null)
    setNav('scenario')
    writeToeicHash('toeic/scenario')
  }

  function applyPracticeProgress(
    kind: 'vocab' | 'listening' | 'grammar',
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
      if (kind === 'listening') {
        return {
          ...prev,
          listeningDone: Math.min(unit.listening, prev.listeningDone + amount),
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

  function handleNav(id: ToeicNavId) {
    setPractice(null)
    setSpecial(null)
    setActiveReviewIds(null)
    setNav(id)
    writeToeicHash(id === 'today' ? 'toeic' : `toeic/${id}`)
  }

  function withUnitGate(node: ReactNode) {
    return (
      <ProGate
        meta={learningMeta}
        track="en"
        levelOrCert={progress.certificateId}
        unitId={progress.unitId}
        onUnlocked={() => refreshMeta()}
      >
        {node}
      </ProGate>
    )
  }

  function handlePlacementComplete(result: PlacementResult) {
    if (!('certificateId' in result)) return
    const meta = loadLearningMeta()
    saveLearningMeta({
      ...meta,
      placementEn: {
        certificateId: result.certificateId,
        score: result.score,
        band: result.band,
        at: new Date().toISOString(),
      },
    })
    patch({
      certificateId: result.certificateId,
      unitId: 1,
      vocabDone: 0,
      listeningDone: 0,
      grammarStarted: false,
    })
    track('placement_complete', {
      track: 'en',
      certificateId: result.certificateId,
      score: result.score,
    })
    refreshMeta()
  }

  function renderMockSession() {
    return (
      <MockExam
        lang="en"
        onExit={() => {
          setSpecial(null)
          setNav('today')
          writeToeicHash()
        }}
        onComplete={(result) => {
          track('mock_submit', {
            track: 'en',
            score: result.score,
            weakTags: result.weakTags,
          })
          const meta = loadLearningMeta()
          const forcedIds = weakTagsToReviewIds('en', currentPack, result.weakTags)
          const nextMeta = addForcedReviewIds({
            ...meta,
            events: [
              ...meta.events,
              {
                t: new Date().toISOString(),
                type: 'mock_submit',
                payload: { score: result.score, weakTags: result.weakTags },
              },
            ].slice(-200),
          }, forcedIds)
          saveLearningMeta(nextMeta)
          awardReviewXp(Math.max(1, Math.round(result.score / 2)))
          setSpecial(null)
          setNav('today')
          writeToeicHash()
        }}
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
        : practice === 'listening'
          ? '聽力練習'
          : '文法教室'
      : nav === 'phonics'
        ? '發音基礎'
        : nav === 'builder'
          ? '課程設計器'
          : nav === 'vocab'
            ? '單字練習'
            : nav === 'listening'
              ? '聽力練習'
              : nav === 'grammar'
                ? '文法教室'
                : nav === 'scenario'
                  ? '情境任務'
                  : nav === 'speaking'
                    ? '口說跟讀'
                    : nav === 'mock'
                      ? '模擬測驗'
                      : nav === 'placement'
                        ? '分級測驗'
                        : '今日學習'

  function renderContent() {
    if (!learningMeta.onboardingDone) {
      return (
        <Onboarding
          track="en"
          meta={learningMeta}
          onComplete={(meta) => {
            saveLearningMeta(meta)
            refreshMeta()
          }}
          onRunPlacement={() => {
            setPractice(null)
            setSpecial('placement')
            writeToeicHash('toeic/placement')
          }}
        />
      )
    }

    if (special === 'review') {
      return withUnitGate(
        <ToeicPractice
          kind="vocab"
          certificateId={progress.certificateId}
          unit={unit}
          mode="quiz"
          reviewIds={activeReviewIds ?? reviewQueue.queue}
          onBack={finishReview}
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
          lang="en"
          onExit={() => {
            setSpecial(null)
            setNav('today')
            writeToeicHash()
          }}
          onComplete={handlePlacementComplete}
        />
      )
    }

    if (nav === 'scenario') {
      return withUnitGate(
        <>
          {coachMission ? (
            <div className="daily-review coach-mission">
              <div>
                <p className="eyebrow">AI COACH · 弱項任務</p>
                <h2>{coachMission.title}</h2>
                <span>{coachMission.checklist.join(' · ')}</span>
              </div>
            </div>
          ) : null}
          <ScenarioPlayer
            track="en"
            onExit={() => {
              setNav('today')
              writeToeicHash()
            }}
            onComplete={(result) => {
              track('scenario_complete', result)
              awardReviewXp(result.correct)
              setNav('today')
              writeToeicHash()
            }}
          />
        </>,
      )
    }

    if (nav === 'speaking') {
      const prompts = currentPack
        ? [...currentPack.vocab, ...currentPack.passage].slice(0, 8)
        : []
      return withUnitGate(
        <SpeakingLab
          prompts={prompts}
          lang="en"
          onComplete={(count) => {
            const meta = loadLearningMeta()
            saveLearningMeta({
              ...meta,
              speakingDone: meta.speakingDone + count,
            })
            awardReviewXp(count)
            setNav('today')
            writeToeicHash()
          }}
        />,
      )
    }

    if (practice) {
      return withUnitGate(
        <ToeicPractice
          kind={practice}
          certificateId={progress.certificateId}
          unit={unit}
          onBack={() => {
            setPractice(null)
            setNav('today')
            writeToeicHash()
          }}
          onProgress={(delta) => applyPracticeProgress(practice, delta)}
        />,
      )
    }
    if (nav === 'phonics') {
      return (
        <PhonicsLab
          mastered={progress.phonicsMastered}
          onMaster={(id) => {
            if (progress.phonicsMastered.includes(id)) return
            patch({ phonicsMastered: [...progress.phonicsMastered, id] })
          }}
          onXp={(n) => patch({ xp: progress.xp + n })}
        />
      )
    }
    if (nav === 'builder') return <ToeicBuilder />
    if (nav === 'vocab' || nav === 'listening' || nav === 'grammar') {
      const kind =
        nav === 'vocab' ? 'vocab' : nav === 'listening' ? 'listening' : 'grammar'
      return withUnitGate(
        <ToeicPractice
          kind={kind}
          certificateId={progress.certificateId}
          unit={unit}
          onBack={() => {
            setNav('today')
            writeToeicHash()
          }}
          onProgress={(delta) => applyPracticeProgress(kind, delta)}
        />,
      )
    }

    return (
      <ToeicToday
        cert={cert}
        unit={unit}
        progress={progress}
        progressPct={progressPct}
        events={learningMeta.events}
        onOpenPhonics={() => {
          setNav('phonics')
          writeToeicHash('toeic/phonics')
        }}
        onOpenBuilder={() => {
          setNav('builder')
          writeToeicHash('toeic/builder')
        }}
        onStartVocab={() => {
          setSpecial(null)
          setActiveReviewIds(null)
          setPractice('vocab')
          writeToeicHash(`toeic/unit/${unit.id}/vocab`)
        }}
        onStartListening={() => {
          setSpecial(null)
          setActiveReviewIds(null)
          setPractice('listening')
          writeToeicHash(`toeic/unit/${unit.id}/listening`)
        }}
        onStartGrammar={() => {
          setSpecial(null)
          setActiveReviewIds(null)
          setPractice('grammar')
          writeToeicHash(`toeic/unit/${unit.id}/grammar`)
        }}
        onStartReview={() => {
          setPractice(null)
          setActiveReviewIds(null)
          setSpecial('review')
          writeToeicHash('toeic/review')
        }}
        onStartWeakTask={startWeakTask}
        onStartMock={() => {
          setPractice(null)
          setActiveReviewIds(null)
          setSpecial('mock')
          writeToeicHash('toeic/mock')
        }}
        onStartPlacement={() => {
          setPractice(null)
          setActiveReviewIds(null)
          setSpecial('placement')
          writeToeicHash('toeic/placement')
        }}
        onSelectUnit={(id) => {
          patch({
            unitId: id,
            vocabDone: 0,
            listeningDone: 0,
            grammarStarted: false,
          })
          writeToeicHash(`toeic/unit/${id}`)
        }}
        dueCount={reviewQueue.reviews.length}
        newCount={reviewQueue.news.length}
        streak={learningMeta.streak}
        dailyDone={daily.done}
        dailyGoal={daily.goal}
      />
    )
  }

  const sidebarNav: ToeicNavId =
    practice || special === 'review'
      ? 'today'
      : special === 'mock'
        ? 'mock'
        : special === 'placement'
          ? 'placement'
          : nav

  return (
    <main className="app-shell toeic-shell">
      <ToeicSidebar
        nav={sidebarNav}
        onNav={handleNav}
        cert={cert}
        unit={unit}
        progressPct={progressPct}
        phonicsCount={progress.phonicsMastered.length}
        onBackHub={onBackHub}
        onSwitchLang={onSwitchLang}
      />

      <section className="content">
        <div className="mobile-brand">
          <div className="brand-mark">T</div>
          <strong>TOEIC Path</strong>
        </div>

        <header className="topbar">
          <div>
            <p className="eyebrow">TOEIC · {cert.nameEn.toUpperCase()}</p>
            <h1>{title}</h1>
          </div>
          <div className="header-actions">
            <label className="unit-select">
              <span>證書級距</span>
              <select
                value={progress.certificateId}
                onChange={(e) => {
                  patch({
                    certificateId: e.target
                      .value as ToeicProgress['certificateId'],
                    unitId: 1,
                    vocabDone: 0,
                    listeningDone: 0,
                    grammarStarted: false,
                  })
                  writeToeicHash('toeic/unit/1')
                }}
              >
                {toeicCertificates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}（{c.scoreMin}–{c.scoreMax}）
                  </option>
                ))}
              </select>
            </label>
            <label className="unit-select">
              <span>單元</span>
              <select
                value={progress.unitId}
                onChange={(e) => {
                  const unitId = Number(e.target.value)
                  patch({
                    unitId,
                    vocabDone: 0,
                    listeningDone: 0,
                    grammarStarted: false,
                  })
                  writeToeicHash(`toeic/unit/${unitId}`)
                }}
              >
                {cert.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    Unit {u.id} · {u.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="xp">
              <span>★</span>
              <strong>{progress.xp} XP</strong>
            </div>
          </div>
        </header>

        <div className="alignment-note">
          <strong>
            {cert.name} · {cert.scoreMin}–{cert.scoreMax}
            {learningMeta.proUnlocked ? ' · Pro' : ' · Free'}
          </strong>
          <span>{cert.audience}</span>
        </div>

        {renderContent()}

        <footer>
          <span>
            最上層以多益四色證書分數級距分級；橘／棕級含字母與高頻字語音導讀。
          </span>
          <span>
            {user
              ? syncStatus === 'synced'
                ? 'Progress synced to cloud'
                : syncStatus === 'syncing'
                  ? 'Syncing…'
                  : syncStatus === 'error'
                    ? 'Cloud sync failed (local still works)'
                    : 'Signed in · local cache'
              : 'Guest · progress saved on this device'}
          </span>
        </footer>
      </section>
    </main>
  )
}
