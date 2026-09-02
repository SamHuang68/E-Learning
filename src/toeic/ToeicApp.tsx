import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { MockExam } from '../components/MockExam'
import { PlacementTest } from '../components/PlacementTest'
import { ProGate } from '../components/ProGate'
import { ScenarioPlayer } from '../components/ScenarioPlayer'
import { SpeakingLab } from '../components/SpeakingLab'
import { collectUnitCardIds, itemKey } from '../data/contentPack'
import { track } from '../engine/analytics'
import { dailyProgress } from '../engine/habits'
import type { PlacementResult } from '../engine/placement'
import { buildDailyQueue } from '../engine/srs'
import {
  loadLearningMeta,
  loadToeicProgress,
  loadToeicInstructionLang,
  saveToeicInstructionLang,
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
import { ToeicChunkLab } from './components/ToeicChunkLab'
import { ToeicStoryReview } from './components/ToeicStoryReview'
import { ToeicSignalsView } from './components/ToeicSignalsView'
import { ToeicErrorVault } from './components/ToeicErrorVault'
import { DoublePassageLab } from './components/DoublePassageLab'
import { ChartAnalysisLab } from './components/ChartAnalysisLab'
import { NegotiationLab } from './components/NegotiationLab'
import { EmailMasterLab } from './components/EmailMasterLab'
import { PhoneLab } from './components/PhoneLab'
import { TravelLab } from './components/TravelLab'
import { ConferenceLab } from './components/ConferenceLab'
import { InterviewLab } from './components/InterviewLab'
import { MarketingLab } from './components/MarketingLab'

type Props = {
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

export function ToeicApp({ onBackHub, onSwitchLang }: Props) {
  const { user, syncStatus } = useAuth()
  const [nav, setNav] = useState<ToeicNavId>('today')
  const [progress, setProgress] = useState<ToeicProgress>(() => loadToeicProgress())
  const [instructionLang, setInstructionLang] = useState<'zh' | 'ja'>(() => loadToeicInstructionLang())
  const [practice, setPractice] = useState<
    'vocab' | 'listening' | 'grammar' | null
  >(null)
  const [special, setSpecial] = useState<'review' | 'mock' | 'placement' | null>(
    null,
  )
  const [learningMeta, setLearningMeta] = useState<LearningMeta>(() =>
    loadLearningMeta(),
  )

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
      buildDailyQueue({
        allIds: unitItemIds,
        items: learningMeta.items,
      }),
    [learningMeta.items, unitItemIds],
  )
  const daily = useMemo(() => dailyProgress(learningMeta), [learningMeta])

  const progressPct = useMemo(() => {
    const v = (progress.vocabDone / Math.max(1, unit.words)) * 100
    const l = (progress.listeningDone / Math.max(1, unit.listening)) * 100
    const g = progress.grammarStarted ? 40 : 0
    return Math.round((v + l + g) / 3)
  }, [progress, unit])

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

  function patch(p: Partial<ToeicProgress>) {
    setProgress((prev) => ({ ...prev, ...p }))
  }

  function refreshMeta() {
    setLearningMeta(loadLearningMeta())
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
    setNav(id)
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
        }}
        onComplete={(result) => {
          track('mock_submit', {
            track: 'en',
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
      : nav === 'chunks'
        ? '商務語塊 (Business Chunks)'
        : nav === 'story'
          ? '微故事對照複習'
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
    if (special === 'review') {
      return withUnitGate(
        <ToeicPractice
          kind="vocab"
          certificateId={progress.certificateId}
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
          lang="en"
          onExit={() => {
            setSpecial(null)
            setNav('today')
          }}
          onComplete={handlePlacementComplete}
        />
      )
    }

    if (nav === 'scenario') {
      return withUnitGate(
        <ScenarioPlayer
          track="en"
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
          lang="en"
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
        <ToeicPractice
          kind={practice}
          certificateId={progress.certificateId}
          unit={unit}
          onBack={() => {
            setPractice(null)
            setNav('today')
          }}
          onProgress={(delta) => applyPracticeProgress(practice, delta)}
        />,
      )
    }
    if (nav === 'chunks') {
      return (
        <ToeicChunkLab
          onBack={() => setNav('today')}
          onOpenStoryReview={() => setNav('story')}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'signals') {
      return (
        <ToeicSignalsView
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'double-passage') {
      return (
        <DoublePassageLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'charts') {
      return (
        <ChartAnalysisLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'negotiation') {
      return (
        <NegotiationLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'email-master') {
      return (
        <EmailMasterLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'phone') {
      return (
        <PhoneLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'travel') {
      return (
        <TravelLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'conference') {
      return (
        <ConferenceLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'interview') {
      return (
        <InterviewLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'marketing') {
      return (
        <MarketingLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'errors') {
      return (
        <ToeicErrorVault
          errorQuestionIds={['signal-causative', 'signal-preposition-gerund']}
          onRemoveError={() => {
            /* 標記掌握 */
          }}
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          onOpenSignals={() => setNav('signals')}
          onOpenChunks={() => setNav('chunks')}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'story') {
      return (
        <ToeicStoryReview
          onBack={() => setNav('today')}
          onOpenChunkLab={() => setNav('chunks')}
        />
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
          onBack={() => setNav('today')}
          onProgress={(delta) => applyPracticeProgress(kind, delta)}
        />,
      )
    }

    return (
      <ToeicToday
        cert={cert}
        unit={unit}
        progress={progress}
        onOpenPhonics={() => setNav('phonics')}
        onOpenBuilder={() => setNav('builder')}
        onStartVocab={() => {
          setSpecial(null)
          setPractice('vocab')
        }}
        onStartListening={() => {
          setSpecial(null)
          setPractice('listening')
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
          patch({
            unitId: id,
            vocabDone: 0,
            listeningDone: 0,
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
        instructionLang={instructionLang}
        onToggleInstructionLang={(lang) => {
          setInstructionLang(lang)
          saveToeicInstructionLang(lang)
        }}
        onBackHub={onBackHub}
        onSwitchLang={onSwitchLang}
      />

      <section className="content">
        <Breadcrumbs
          items={[
            { label: 'TOEIC 多益', onClick: () => setNav('today') },
            { label: `${cert.name} (${cert.scoreMin}–${cert.scoreMax})`, onClick: () => setNav('today') },
            { label: `單元 ${unit.id} · ${unit.title}`, active: nav === 'today' && !practice && !special },
            ...(nav !== 'today' || practice || special ? [{ label: title, active: true }] : []),
          ]}
        />

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
                onChange={(e) =>
                  patch({
                    certificateId: e.target
                      .value as ToeicProgress['certificateId'],
                    unitId: 1,
                    vocabDone: 0,
                    listeningDone: 0,
                    grammarStarted: false,
                  })
                }
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
                onChange={(e) =>
                  patch({
                    unitId: Number(e.target.value),
                    vocabDone: 0,
                    listeningDone: 0,
                    grammarStarted: false,
                  })
                }
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
