import { lazy, Suspense, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useI18n } from '../i18n/i18n'
import type { MessageKey } from '../i18n/messages'
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
import { ToeicSidebar, type ToeicNavId } from './components/ToeicSidebar'
import { ToeicToday } from './components/ToeicToday'

// Secondary labs and modes stay out of the ToeicApp shell chunk. Each view
// loads on navigation, matching ChineseApp / CsApp, so the route chunk stays
// under the offline JS size gate without moving code into the entry bundle.
const PhonicsLab = lazy(() =>
  import('./components/PhonicsLab').then((m) => ({ default: m.PhonicsLab })),
)
const ToeicBuilder = lazy(() =>
  import('./components/ToeicBuilder').then((m) => ({ default: m.ToeicBuilder })),
)
const ToeicPractice = lazy(() =>
  import('./components/ToeicPractice').then((m) => ({ default: m.ToeicPractice })),
)
const ToeicChunkLab = lazy(() =>
  import('./components/ToeicChunkLab').then((m) => ({ default: m.ToeicChunkLab })),
)
const ToeicStoryReview = lazy(() =>
  import('./components/ToeicStoryReview').then((m) => ({ default: m.ToeicStoryReview })),
)
const ToeicSignalsView = lazy(() =>
  import('./components/ToeicSignalsView').then((m) => ({ default: m.ToeicSignalsView })),
)
const ToeicErrorVault = lazy(() =>
  import('./components/ToeicErrorVault').then((m) => ({ default: m.ToeicErrorVault })),
)
const DoublePassageLab = lazy(() =>
  import('./components/DoublePassageLab').then((m) => ({ default: m.DoublePassageLab })),
)
const ChartAnalysisLab = lazy(() =>
  import('./components/ChartAnalysisLab').then((m) => ({ default: m.ChartAnalysisLab })),
)
const NegotiationLab = lazy(() =>
  import('./components/NegotiationLab').then((m) => ({ default: m.NegotiationLab })),
)
const EmailMasterLab = lazy(() =>
  import('./components/EmailMasterLab').then((m) => ({ default: m.EmailMasterLab })),
)
const PhoneLab = lazy(() =>
  import('./components/PhoneLab').then((m) => ({ default: m.PhoneLab })),
)
const TravelLab = lazy(() =>
  import('./components/TravelLab').then((m) => ({ default: m.TravelLab })),
)
const ConferenceLab = lazy(() =>
  import('./components/ConferenceLab').then((m) => ({ default: m.ConferenceLab })),
)
const InterviewLab = lazy(() =>
  import('./components/InterviewLab').then((m) => ({ default: m.InterviewLab })),
)
const MarketingLab = lazy(() =>
  import('./components/MarketingLab').then((m) => ({ default: m.MarketingLab })),
)
const SupplyChainLab = lazy(() =>
  import('./components/SupplyChainLab').then((m) => ({ default: m.SupplyChainLab })),
)
const CybersecurityLab = lazy(() =>
  import('./components/CybersecurityLab').then((m) => ({ default: m.CybersecurityLab })),
)
const TradeLab = lazy(() =>
  import('./components/TradeLab').then((m) => ({ default: m.TradeLab })),
)
const RealEstateLab = lazy(() =>
  import('./components/RealEstateLab').then((m) => ({ default: m.RealEstateLab })),
)
const PrLab = lazy(() =>
  import('./components/PrLab').then((m) => ({ default: m.PrLab })),
)
const MnaLab = lazy(() =>
  import('./components/MnaLab').then((m) => ({ default: m.MnaLab })),
)
const IpLab = lazy(() =>
  import('./components/IpLab').then((m) => ({ default: m.IpLab })),
)
const EsgLab = lazy(() =>
  import('./components/EsgLab').then((m) => ({ default: m.EsgLab })),
)
const AiCloudLab = lazy(() =>
  import('./components/AiCloudLab').then((m) => ({ default: m.AiCloudLab })),
)
const ColdChainLab = lazy(() =>
  import('./components/ColdChainLab').then((m) => ({ default: m.ColdChainLab })),
)
const BondedWarehouseLab = lazy(() =>
  import('./components/BondedWarehouseLab').then((m) => ({ default: m.BondedWarehouseLab })),
)
const RfpBiddingLab = lazy(() =>
  import('./components/RfpBiddingLab').then((m) => ({ default: m.RfpBiddingLab })),
)
const ForceMajeureLab = lazy(() =>
  import('./components/ForceMajeureLab').then((m) => ({ default: m.ForceMajeureLab })),
)
const TechTransferLab = lazy(() =>
  import('./components/TechTransferLab').then((m) => ({ default: m.TechTransferLab })),
)
const AntitrustLab = lazy(() =>
  import('./components/AntitrustLab').then((m) => ({ default: m.AntitrustLab })),
)
const ConflictMineralsLab = lazy(() =>
  import('./components/ConflictMineralsLab').then((m) => ({ default: m.ConflictMineralsLab })),
)
const PatentLitigationLab = lazy(() =>
  import('./components/PatentLitigationLab').then((m) => ({ default: m.PatentLitigationLab })),
)
const GdprPrivacyLab = lazy(() =>
  import('./components/GdprPrivacyLab').then((m) => ({ default: m.GdprPrivacyLab })),
)
const NdaTradeSecretsLab = lazy(() =>
  import('./components/NdaTradeSecretsLab').then((m) => ({ default: m.NdaTradeSecretsLab })),
)
const CloudSlaLab = lazy(() =>
  import('./components/CloudSlaLab').then((m) => ({ default: m.CloudSlaLab })),
)
const MarineInsuranceLab = lazy(() =>
  import('./components/MarineInsuranceLab').then((m) => ({ default: m.MarineInsuranceLab })),
)
const RoyaltyAuditLab = lazy(() =>
  import('./components/RoyaltyAuditLab').then((m) => ({ default: m.RoyaltyAuditLab })),
)
const FcpaComplianceLab = lazy(() =>
  import('./components/FcpaComplianceLab').then((m) => ({ default: m.FcpaComplianceLab })),
)
const AntitrustHhiLab = lazy(() =>
  import('./components/AntitrustHhiLab').then((m) => ({ default: m.AntitrustHhiLab })),
)
const BusinessInterruptionLab = lazy(() =>
  import('./components/BusinessInterruptionLab').then((m) => ({ default: m.BusinessInterruptionLab })),
)
const LetterOfCreditLab = lazy(() =>
  import('./components/LetterOfCreditLab').then((m) => ({ default: m.LetterOfCreditLab })),
)
const ToeicSynthesisSeries = lazy(() =>
  import('./components/ToeicSynthesisSeries').then((m) => ({ default: m.ToeicSynthesisSeries })),
)

type Props = {
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

export function ToeicApp({ onBackHub, onSwitchLang }: Props) {
  const { user, syncStatus } = useAuth()
  const { t, locale } = useI18n()
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
          awardReviewXp(Math.max(1, Math.round(result.score / 2)))
          setSpecial(null)
          setNav('today')
        }}
      />
    )
  }

  const titleKey: MessageKey = special
    ? special === 'review'
      ? 'en.nav.review'
      : special === 'mock'
        ? 'en.nav.mock'
        : 'en.nav.placement'
    : practice
      ? practice === 'vocab'
        ? 'en.nav.vocab'
        : practice === 'listening'
          ? 'en.nav.listening'
          : 'en.nav.grammar'
      : nav === 'chunks'
        ? 'en.nav.chunks'
        : nav === 'story'
          ? 'chrome.storyReview'
          : nav === 'phonics'
            ? 'en.nav.phonics'
            : nav === 'synthesis'
              ? 'en.nav.synthesis'
            : nav === 'builder'
              ? 'en.nav.builder'
              : nav === 'vocab'
                ? 'en.nav.vocab'
                : nav === 'listening'
                  ? 'en.nav.listening'
                  : nav === 'grammar'
                    ? 'en.nav.grammar'
                    : nav === 'scenario'
                      ? 'en.nav.scenario'
                      : nav === 'speaking'
                        ? 'en.nav.speaking'
                        : nav === 'mock'
                          ? 'en.nav.mock'
                          : nav === 'placement'
                            ? 'en.nav.placement'
                            : 'en.nav.today'
  const title = t(titleKey)

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
    if (nav === 'supply-chain') {
      return (
        <SupplyChainLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'cybersecurity') {
      return (
        <CybersecurityLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'trade') {
      return (
        <TradeLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'real-estate') {
      return (
        <RealEstateLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'pr') {
      return (
        <PrLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'mna') {
      return (
        <MnaLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'ip') {
      return (
        <IpLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'esg') {
      return (
        <EsgLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'ai-cloud') {
      return (
        <AiCloudLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'cold-chain') {
      return (
        <ColdChainLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'bonded-warehouse') {
      return (
        <BondedWarehouseLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'rfp-bidding') {
      return (
        <RfpBiddingLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'force-majeure') {
      return (
        <ForceMajeureLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'tech-transfer') {
      return (
        <TechTransferLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'antitrust') {
      return (
        <AntitrustLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'conflict-minerals') {
      return (
        <ConflictMineralsLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'patent-litigation') {
      return (
        <PatentLitigationLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'gdpr-privacy') {
      return (
        <GdprPrivacyLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'nda-trade-secrets') {
      return (
        <NdaTradeSecretsLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'cloud-sla') {
      return (
        <CloudSlaLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'marine-insurance') {
      return (
        <MarineInsuranceLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'royalty-audit') {
      return (
        <RoyaltyAuditLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'fcpa-compliance') {
      return (
        <FcpaComplianceLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'antitrust-hhi') {
      return (
        <AntitrustHhiLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'business-interruption') {
      return (
        <BusinessInterruptionLab
          onEarnXp={(n) => patch({ xp: progress.xp + n })}
          instructionLang={instructionLang}
        />
      )
    }
    if (nav === 'letter-of-credit') {
      return (
        <LetterOfCreditLab
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
    if (nav === 'synthesis') {
      return <ToeicSynthesisSeries instructionLang={instructionLang} />
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
    <main id="main-content" tabIndex={-1} className="app-shell toeic-shell">
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
            { label: t('en.crumb'), onClick: () => setNav('today') },
            { label: `${locale === 'en' ? cert.nameEn : cert.name} (${cert.scoreMin}–${cert.scoreMax})`, onClick: () => setNav('today') },
            { label: t('chrome.unitN', { n: unit.id, title: locale === 'en' ? unit.titleEn : unit.title }), active: nav === 'today' && !practice && !special },
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
            <label className="unit-select" htmlFor="toeic-cert-select">
              <span>{t('en.certSelect')}</span>
              <select
                id="toeic-cert-select"
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
                    {locale === 'en' ? c.nameEn : c.name}（{c.scoreMin}–{c.scoreMax}）
                  </option>
                ))}
              </select>
            </label>
            <label className="unit-select" htmlFor="toeic-unit-select">
              <span>{t('chrome.unit')}</span>
              <select
                id="toeic-unit-select"
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
                    Unit {u.id} · {locale === 'en' ? u.titleEn : u.title}
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
            {locale === 'en' ? cert.nameEn : cert.name} · {cert.scoreMin}–{cert.scoreMax}
            {learningMeta.proUnlocked ? ` · ${t('pro.badgeOn')}` : ` · ${t('pro.badgeOff')}`}
          </strong>
          <span>{cert.audience}</span>
        </div>

        <Suspense
          fallback={
            <div className="module-fallback" role="status">
              {t('common.loadingModule')}
            </div>
          }
        >
          {renderContent()}
        </Suspense>

        <footer>
          <span>
            最上層以多益四色證書分數級距分級；橘／棕級含字母與高頻字語音導讀。
          </span>
          <span>
            {user
              ? syncStatus === 'synced'
                ? t('chrome.syncOk')
                : syncStatus === 'syncing'
                  ? t('chrome.syncing')
                  : syncStatus === 'error'
                    ? t('chrome.syncFail')
                    : t('chrome.signedCache')
              : t('chrome.guestLocal')}
          </span>
        </footer>
      </section>
    </main>
  )
}
