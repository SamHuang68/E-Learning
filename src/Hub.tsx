import { useState, useEffect, useMemo, useCallback } from 'react'
import { AuthPanel } from './auth/AuthPanel'
import { DataControls } from './components/DataControls'
import { WhyThisNext } from './components/WhyThisNext'
import { HubShortcutHelp } from './components/HubShortcutHelp'
import { KnowledgeRadar } from './components/KnowledgeRadar'
import {
  computeMathRadar,
  computeCalculusRadar,
  computePhysicsRadar,
  computeChemistryRadar,
  computeCsRadar,
  computeAobaRadar,
  computeToeicRadar,
  computeChineseRadar,
} from './engine/radar'
import {
  calculateLevelProgress,
  BADGE_CATALOG,
} from './engine/gamification'
import { dailyProgress, todayKey } from './engine/habits'
import {
  pickTodaySuggestion,
  dueCountBySrsItems,
  dueCountFromFsrsMap,
} from './engine/todaySuggestion'
import { isLeech } from './engine/fsrs'
import { rollupEightTrackXp, safeIdList, safeXp } from './engine/trackProgressRollup'
import {
  loadLearningMeta,
  loadProgress,
  loadKanaProgress,
  loadToeicProgress,
  loadToeicInstructionLang,
  saveToeicInstructionLang,
  loadPreferredTrack,
  type LangId,
  type LearningMeta,
} from './utils/storage'
import { loadMathProgress } from './math/utils/mathStorage'
import { loadPhysicsProgress } from './physics/utils/physicsStorage'
import { loadChemistryProgress } from './chemistry/utils/chemistryStorage'
import { loadCsProgress } from './cs/utils/csStorage'
import { loadChineseProgress } from './chinese/utils/chineseStorage'
import { isAudioMuted, toggleAudioMute, playClickSound } from './engine/audioSynthesizer'
import { LocaleToggle, useI18n } from './i18n/i18n'
import { filterHubTracks } from './hubSearch'
import type { MessageKey } from './i18n/messages'

type Props = {
  onChoose: (lang: LangId) => void
  onOpenPrivacy: () => void
}

type RadarTab = LangId

type HubSnapshot = {
  mathProgress: ReturnType<typeof loadMathProgress>
  physicsProgress: ReturnType<typeof loadPhysicsProgress>
  chemistryProgress: ReturnType<typeof loadChemistryProgress>
  csProgress: ReturnType<typeof loadCsProgress>
  jaProgress: ReturnType<typeof loadProgress>
  kanaProgress: ReturnType<typeof loadKanaProgress>
  toeicProgress: ReturnType<typeof loadToeicProgress>
  chineseProgress: ReturnType<typeof loadChineseProgress>
  learningMeta: LearningMeta
  preferred: ReturnType<typeof loadPreferredTrack>
}

type HubTrackCard = {
  id: LangId
  mark: string
  markClass: string
  extraClass: string
  pill: string
  pillClass: string
  title: string
  desc: string
  progress: string
  catalog: string
  cta: string
  onClick: () => void
}


const TRACK_LABEL_KEYS: Record<LangId, MessageKey> = {
  math: 'track.math',
  calculus: 'track.calculus',
  physics: 'track.physics',
  chemistry: 'track.chemistry',
  cs: 'track.cs',
  ja: 'track.ja',
  en: 'track.en',
  zh: 'track.zh',
}

export function weekStudyFlags(meta: LearningMeta): boolean[] {
  const today = new Date()
  const mondayOffset = (today.getDay() + 6) % 7
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - mondayOffset)
  const dates = new Set<string>()
  if (meta.lastActiveDate) dates.add(meta.lastActiveDate)
  if (meta.dailyDoneDate && meta.dailyDoneCards > 0) dates.add(meta.dailyDoneDate)
  for (const ev of meta.events ?? []) {
    if (typeof ev.t === 'string' && ev.t.length >= 10) dates.add(ev.t.slice(0, 10))
  }
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return dates.has(todayKey(d))
  })
}

export function loadHubSnapshot(): HubSnapshot {
  return {
    mathProgress: loadMathProgress(),
    physicsProgress: loadPhysicsProgress(),
    chemistryProgress: loadChemistryProgress(),
    csProgress: loadCsProgress(),
    jaProgress: loadProgress(),
    kanaProgress: loadKanaProgress(),
    toeicProgress: loadToeicProgress(),
    chineseProgress: loadChineseProgress(),
    learningMeta: loadLearningMeta(),
    preferred: loadPreferredTrack(),
  }
}

export function selectHubDerived(snapshot: HubSnapshot) {
  const {
    mathProgress,
    physicsProgress,
    chemistryProgress,
    csProgress,
    jaProgress,
    kanaProgress,
    toeicProgress,
    chineseProgress,
    learningMeta,
    preferred,
  } = snapshot

  const mathDone = safeIdList(mathProgress?.completedQuestions)
  const physicsDone = safeIdList(physicsProgress?.completedQuestions)
  const chemistryDone = safeIdList(chemistryProgress?.completedQuestions)
  const csDone = safeIdList(csProgress?.completedQuestions)
  const mathLabs = safeIdList(mathProgress?.labCompleted)
  const physicsLabs = safeIdList(physicsProgress?.labCompleted)
  const chemistryLabs = safeIdList(chemistryProgress?.labCompleted)
  const csLabs = safeIdList(csProgress?.labCompleted)
  const mathExams =
    mathProgress?.examScores && typeof mathProgress.examScores === 'object' ? mathProgress.examScores : {}
  const physicsExams =
    physicsProgress?.examScores && typeof physicsProgress.examScores === 'object' ? physicsProgress.examScores : {}
  const chemistryExams =
    chemistryProgress?.examScores && typeof chemistryProgress.examScores === 'object'
      ? chemistryProgress.examScores
      : {}
  const csExams =
    csProgress?.examScores && typeof csProgress.examScores === 'object' ? csProgress.examScores : {}

  const totalXp = rollupEightTrackXp({
    math: mathProgress?.xp,
    physics: physicsProgress?.xp,
    chemistry: chemistryProgress?.xp,
    cs: csProgress?.xp,
    ja: jaProgress?.xp,
    toeic: toeicProgress?.xp,
    chinese: chineseProgress?.xp,
  })
  const levelInfo = calculateLevelProgress(totalXp)
  const daily = dailyProgress(learningMeta)

  const mathRadar = computeMathRadar(mathDone, mathExams, mathLabs)
  const calculusDoneCount = mathDone.filter((id) => id.startsWith('calc-prob-')).length
  const calculusLabCount = mathLabs.includes('calculus') ? 1 : 0
  const calculusRadar = computeCalculusRadar(
    safeXp(mathProgress?.calculusTheta),
    calculusDoneCount,
    calculusLabCount,
  )
  const physicsRadar = computePhysicsRadar(physicsDone, physicsExams, physicsLabs)
  const chemistryRadar = computeChemistryRadar(chemistryDone, chemistryExams, chemistryLabs)
  const csRadar = computeCsRadar(csDone, csExams, csLabs)
  const kanaMastered =
    kanaProgress?.mastered && typeof kanaProgress.mastered === 'object' ? Object.keys(kanaProgress.mastered) : []
  const kanaCount = kanaMastered.length
  const jaRadar = computeAobaRadar(
    Math.max(daily.done, safeXp(jaProgress?.readingDone)),
    Array.isArray(learningMeta.kanjiMastered) ? learningMeta.kanjiMastered.length : 0,
    safeXp(learningMeta.speakingDone),
    safeXp(learningMeta.streak),
  )
  const toeicDoneCount = safeXp(toeicProgress?.vocabDone) + safeXp(toeicProgress?.listeningDone)
  const toeicRadar = computeToeicRadar(
    Math.max(daily.done, toeicDoneCount),
    toeicDoneCount,
    0,
  )
  const chineseRadar = computeChineseRadar(
    safeXp(chineseProgress?.xp),
    safeIdList(chineseProgress?.masteredFalseFriends).length,
    safeIdList(chineseProgress?.masteredGrammarSignals).length,
    safeIdList(chineseProgress?.completedDialogues).length,
    safeIdList(chineseProgress?.errorQuestions).length,
  )

  const radarMap: Record<RadarTab, typeof mathRadar> = {
    math: mathRadar,
    calculus: calculusRadar,
    physics: physicsRadar,
    chemistry: chemistryRadar,
    cs: csRadar,
    ja: jaRadar,
    en: toeicRadar,
    zh: chineseRadar,
  }

  const mathDoneCount = mathDone.length
  const physicsDoneCount = physicsDone.length
  const chemistryDoneCount = chemistryDone.length
  const csDoneCount = csDone.length

  const hasProgress =
    totalXp > 0 ||
    learningMeta.streak > 0 ||
    mathDoneCount > 0 ||
    physicsDoneCount > 0 ||
    chemistryDoneCount > 0 ||
    csDoneCount > 0 ||
    kanaCount > 0 ||
    toeicDoneCount > 0 ||
    (chineseProgress.xp || 0) > 0 ||
    Object.keys(learningMeta.items).length > 0

  const catalogFirst = !hasProgress
  const weekFlags = weekStudyFlags(learningMeta)
  const longIntervalCount = Object.values(learningMeta.items).filter(
    (it) => (it.intervalDays || 0) >= 21 || (it.correctStreak || 0) >= 3,
  ).length
  const scheduledCount = Object.keys(learningMeta.items).length
  const leechCount = Object.values(learningMeta.items).filter((it) =>
    isLeech(it.lapses ?? 0),
  ).length
  const dueByTrack = dueCountBySrsItems(learningMeta.items)
  const calculusDue = dueCountFromFsrsMap(mathProgress.calculusFsrs)
  if (calculusDue > 0) dueByTrack.calculus = (dueByTrack.calculus ?? 0) + calculusDue
  const todaySuggestion = pickTodaySuggestion({
    preferred,
    dueByTrack,
    hasProgress,
  })

  return {
    totalXp,
    levelInfo,
    daily,
    radarMap,
    calculusDoneCount,
    kanaCount,
    mathDoneCount,
    physicsDoneCount,
    chemistryDoneCount,
    csDoneCount,
    toeicDoneCount,
    hasProgress,
    catalogFirst,
    weekFlags,
    longIntervalCount,
    scheduledCount,
    leechCount,
    todaySuggestion,
  }
}

/**
 * 統一學習主頁
 * 八軌入口：數學、微積分、物理、化學、計算機概論、日語、多益、華語。
 */
export function Hub({ onChoose, onOpenPrivacy }: Props) {
  const { t } = useI18n()
  const [activeRadarTab, setActiveRadarTab] = useState<RadarTab>('math')
  const [tick, setTick] = useState(0)
  const [isMuted, setIsMuted] = useState(() => isAudioMuted())
  const [toeicLang, setToeicLang] = useState<'zh' | 'ja'>(() => loadToeicInstructionLang())
  const [hubQuery, setHubQuery] = useState('')

  const handleToggleAudio = useCallback(() => {
    const next = toggleAudioMute()
    setIsMuted(next)
    if (!next) playClickSound()
  }, [])

  useEffect(() => {
    const handleUpdate = () => setTick((n) => n + 1)
    window.addEventListener('physics:progress-updated', handleUpdate)
    window.addEventListener('chemistry:progress-updated', handleUpdate)
    window.addEventListener('cs:progress-updated', handleUpdate)
    window.addEventListener('math:progress-updated', handleUpdate)
    window.addEventListener('e-learning:progress-hydrated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('physics:progress-updated', handleUpdate)
      window.removeEventListener('chemistry:progress-updated', handleUpdate)
      window.removeEventListener('cs:progress-updated', handleUpdate)
      window.removeEventListener('math:progress-updated', handleUpdate)
      window.removeEventListener('e-learning:progress-hydrated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const snapshot = useMemo(() => {
    void tick
    return loadHubSnapshot()
  }, [tick])
  const derived = useMemo(() => selectHubDerived(snapshot), [snapshot])
  const { learningMeta, preferred, chineseProgress, mathProgress, physicsProgress, chemistryProgress, jaProgress, toeicProgress } = snapshot
  const {
    totalXp,
    levelInfo,
    daily,
    radarMap,
    calculusDoneCount,
    kanaCount,
    mathDoneCount,
    physicsDoneCount,
    chemistryDoneCount,
    csDoneCount,
    toeicDoneCount,
    hasProgress,
    catalogFirst,
    weekFlags,
    longIntervalCount,
    scheduledCount,
    leechCount,
    todaySuggestion,
  } = derived
  const activeRadar = radarMap[activeRadarTab]
  const calculusRadar = radarMap.calculus

  const catalogFirstTitle = catalogFirst ? t('hub.catalogFirst.title') : ''
  const catalogFirstDesc = catalogFirst ? t('hub.catalogFirst.desc') : ''

  const weekLabels = useMemo(
    (): Array<{ key: MessageKey; day: string }> => [
      { key: 'hub.weekday.1', day: t('hub.weekday.1') },
      { key: 'hub.weekday.2', day: t('hub.weekday.2') },
      { key: 'hub.weekday.3', day: t('hub.weekday.3') },
      { key: 'hub.weekday.4', day: t('hub.weekday.4') },
      { key: 'hub.weekday.5', day: t('hub.weekday.5') },
      { key: 'hub.weekday.6', day: t('hub.weekday.6') },
      { key: 'hub.weekday.7', day: t('hub.weekday.7') },
    ],
    [t],
  )

  const openToeic = useCallback((lang: 'zh' | 'ja') => {
    saveToeicInstructionLang(lang)
    setToeicLang(lang)
    onChoose('en')
  }, [onChoose])

  const tracks = useMemo(() => {
    const list: HubTrackCard[] = [
    {
      id: 'math',
      mark: '∑',
      markClass: 'math-mark',
      extraClass: 'math-track-card',
      pill: t('hub.math.pill'),
      pillClass: 'math',
      title: t('track.math'),
      desc: t('hub.math.desc'),
      progress: t('hub.solved', { count: mathDoneCount }),
      catalog: t('hub.math.catalog'),
      cta: t('hub.math.cta'),
      onClick: () => onChoose('math'),
    },
    {
      id: 'calculus',
      mark: '∫',
      markClass: 'calculus-mark',
      extraClass: 'calculus-track-card',
      pill: t('hub.calculus.pill'),
      pillClass: 'calculus',
      title: t('track.calculus'),
      desc: t('hub.calculus.desc'),
      progress: t('hub.solved', { count: calculusDoneCount }),
      catalog: t('hub.calculus.catalog'),
      cta: t('hub.calculus.cta'),
      onClick: () => onChoose('calculus'),
    },
    {
      id: 'physics',
      mark: '物',
      markClass: 'physics-mark',
      extraClass: 'physics-track-card',
      pill: t('hub.physics.pill'),
      pillClass: 'physics',
      title: t('track.physics'),
      desc: t('hub.physics.desc'),
      progress: t('hub.solved', { count: physicsDoneCount }),
      catalog: t('hub.physics.catalog'),
      cta: t('hub.physics.cta'),
      onClick: () => onChoose('physics'),
    },
    {
      id: 'chemistry',
      mark: '化',
      markClass: 'chemistry-mark',
      extraClass: 'chemistry-track-card',
      pill: t('hub.chemistry.pill'),
      pillClass: 'chemistry',
      title: t('track.chemistry'),
      desc: t('hub.chemistry.desc'),
      progress: t('hub.solved', { count: chemistryDoneCount }),
      catalog: t('hub.chemistry.catalog'),
      cta: t('hub.chemistry.cta'),
      onClick: () => onChoose('chemistry'),
    },
    {
      id: 'cs',
      mark: 'CS',
      markClass: 'cs-mark',
      extraClass: 'cs-track-card',
      pill: t('hub.cs.pill'),
      pillClass: 'cs',
      title: t('track.cs'),
      desc: t('hub.cs.desc'),
      progress: t('hub.solved', { count: csDoneCount }),
      catalog: t('hub.cs.catalog'),
      cta: t('hub.cs.cta'),
      onClick: () => onChoose('cs'),
    },
    {
      id: 'ja',
      mark: 'あ',
      markClass: '',
      extraClass: 'jp-track-card',
      pill: t('hub.ja.pill'),
      pillClass: 'ja',
      title: t('track.ja'),
      desc: t('hub.ja.desc'),
      progress: t('hub.masteredKana', { count: kanaCount }),
      catalog: t('hub.kanaSrsHonesty') + ' · ' + t('hub.ja.catalog'),
      cta: t('hub.ja.cta'),
      onClick: () => onChoose('ja'),
    },
    {
      id: 'en',
      mark: 'T',
      markClass: 'toeic',
      extraClass: 'en-track-card',
      pill: toeicLang === 'ja' ? t('hub.en.pillJa') : t('hub.en.pillZh'),
      pillClass: 'en',
      title: t('track.en'),
      desc: t('hub.en.desc'),
      progress: t('hub.practicedChunks', { count: toeicDoneCount }),
      catalog: t('hub.en.catalog'),
      cta: toeicLang === 'ja' ? t('hub.en.ctaJa') : t('hub.en.ctaZh'),
      onClick: () => openToeic(toeicLang),
    },
    {
      id: 'zh',
      mark: '華',
      markClass: 'zh-mark',
      extraClass: 'zh-track-card',
      pill: t('hub.zh.pill'),
      pillClass: 'zh',
      title: t('track.zh'),
      desc: t('hub.zh.desc'),
      progress: t('hub.falseFriends', { count: chineseProgress.masteredFalseFriends?.length || 0 }),
      catalog: t('hub.zh.catalog'),
      cta: t('hub.zh.cta'),
      onClick: () => onChoose('zh'),
    },
    ]
    return list
  }, [
    t,
    mathDoneCount,
    calculusDoneCount,
    physicsDoneCount,
    chemistryDoneCount,
    csDoneCount,
    kanaCount,
    toeicDoneCount,
    toeicLang,
    chineseProgress.masteredFalseFriends,
    onChoose,
    openToeic,
  ])
  const visibleTracks = useMemo(() => filterHubTracks(tracks, hubQuery), [tracks, hubQuery])

  const todayId: LangId = todaySuggestion.id
  const todayTrack = tracks.find((track) => track.id === todayId) ?? tracks[0]
  const resumeLabel = preferred ? t(TRACK_LABEL_KEYS[preferred]) : ''

  return (
    <>
    <main
      id="main-content"
      tabIndex={-1}
      role="main"
      aria-label={t('hub.landmark.main')}
      className="hub unified-hub"
    >
      <header role="banner" className="hub-hero">
        <div className="hub-topbar">
          <div>
            <p className="eyebrow">{t('hub.eyebrow')}</p>
            <h1>{t('hub.title')}</h1>
          </div>
          <div className="hub-topbar-tools">
            <LocaleToggle />
            <HubShortcutHelp />
          </div>
        </div>
        <p className="lede">
          {t('hub.lede')}
        </p>
        <p className="section-subtext">
          {t('hub.subtext')}
        </p>
        {catalogFirst && (
          <div className="catalog-first-banner" role="status" aria-live="polite">
            <strong>{catalogFirstTitle}</strong>
            <span>{catalogFirstDesc}</span>
          </div>
        )}
        <div className="hub-hero-actions">
          {preferred ? (
            <button
              type="button"
              className="hub-primary-cta"
              onClick={() => {
                if (preferred === 'en') openToeic(toeicLang)
                else onChoose(preferred)
              }}
            >
              {hasProgress ? t('hub.continue', { track: resumeLabel }) : t('hub.start', { track: resumeLabel })}
            </button>
          ) : (
            <a className="hub-primary-cta" href="#tracks-title">
              {t('hub.resumeEmpty')}
            </a>
          )}
          <a className="hub-secondary-cta" href="#tracks-title">
            {t('hub.seeAll')}
          </a>
        </div>
      </header>

      <section className="hub-section-block hub-today-block" aria-label={t('hub.todayLabel')}>
        <p className="section-subtext">{t('hub.todayLabel')}</p>
        <WhyThisNext kind={todaySuggestion.reasonKey} dueCount={todaySuggestion.dueCount} />
        <h2>{todayTrack.title}</h2>
        <p className="track-desc">{todayTrack.desc}</p>
        <div className="hub-hero-actions">
          <button
            type="button"
            className="hub-primary-cta"
            onClick={todayTrack.onClick}
          >
            {t('hub.todayCta', { cta: todayTrack.cta })}
          </button>
        </div>
      </section>

      <nav role="navigation" aria-label={t('hub.landmark.nav')} className="hub-section-block" aria-labelledby="tracks-title">
        <div className="section-header-row">
          <h2 id="tracks-title">{t('hub.tracksTitle')}</h2>
          <span className="section-subtext">{t('hub.tracksCount')}</span>
        </div>
        <div className="hub-search">
          <label className="practice-answer-label" htmlFor="hub-track-search">
            {t('hub.search.label')}
          </label>
          <input
            id="hub-track-search"
            type="search"
            value={hubQuery}
            onChange={(event) => setHubQuery(event.target.value)}
            placeholder={t('hub.search.placeholder')}
          />
        </div>

        {visibleTracks.length === 0 ? (
          <div className="hub-search-empty" role="status" aria-live="polite">
            <p>
              <strong>{t('hub.search.empty', { query: hubQuery.trim() })}</strong>
            </p>
            <p>{t('hub.search.emptyHint')}</p>
            <div className="hub-search-empty-links">
              <button type="button" className="hub-secondary-cta" onClick={() => setHubQuery('')}>
                {t('hub.search.showAll')}
              </button>
              {tracks.map((track) => (
                <button type="button" key={track.id} className="pill-btn" onClick={track.onClick}>
                  {track.title}
                </button>
              ))}
            </div>
          </div>
        ) : (
        <div className="hub-grid eight-track-grid">
          {visibleTracks.map((track) => (
            <article key={track.id} className={`hub-card ${track.extraClass}`}>
              <button type="button" className="hub-card-hit" onClick={track.onClick}>
                <div className="hub-card-header">
                  <div className={`hub-card-mark ${track.markClass}`}>{track.mark}</div>
                  <span className={`track-status-pill ${track.pillClass}`}>{track.pill}</span>
                </div>
                <h3>{track.title}</h3>
                <p className="track-desc">{track.desc}</p>
                <div className="track-user-progress">
                  <span>{track.catalog}</span>
                </div>
                <div className="track-user-progress">
                  <span>{track.progress}</span>
                </div>
                <b className="launch-action">{track.cta} →</b>
              </button>
              {track.id === 'en' ? (
                <div className="track-lang-toggle" role="group" aria-label={t('hub.toeicExplain')}>
                  <button
                    type="button"
                    className={toeicLang === 'zh' ? 'is-active' : ''}
                    onClick={() => {
                      saveToeicInstructionLang('zh')
                      setToeicLang('zh')
                    }}
                  >
                    {t('hub.toeicZh')}
                  </button>
                  <button
                    type="button"
                    className={toeicLang === 'ja' ? 'is-active' : ''}
                    onClick={() => {
                      saveToeicInstructionLang('ja')
                      setToeicLang('ja')
                    }}
                  >
                    {t('hub.toeicJa')}
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
        )}
      </nav>

      {hasProgress ? (
        <section className="hub-stat-banner" aria-label={t('hub.stats')}>
          <div className="stat-card level-stat">
            <span className="stat-icon" aria-hidden="true">Lv</span>
            <div className="stat-info">
              <span className="stat-label">{t('hub.level')}</span>
              <strong>Lv.{levelInfo.currentLevel}</strong>
              <small>{totalXp} XP</small>
            </div>
            <div className="stat-progress-bar">
              <i style={{ width: `${levelInfo.progressPct}%` }} />
            </div>
          </div>
          <div className="stat-card streak-stat">
            <span className="stat-icon" aria-hidden="true">日</span>
            <div className="stat-info">
              <span className="stat-label">{t('hub.streak')}</span>
              <strong>{t('hub.streakDays', { count: learningMeta.streak })}</strong>
              <small>{t('hub.streakShield')}</small>
            </div>
          </div>
          <div className="stat-card daily-stat">
            <span className="stat-icon" aria-hidden="true">今</span>
            <div className="stat-info">
              <span className="stat-label">{t('hub.dailyGoal')}</span>
              <strong>
                {t('hub.dailyCards', { done: daily.done, goal: daily.goal })}
              </strong>
              <small>{t('hub.dailyPct', { pct: daily.pct })}</small>
            </div>
            <div className="stat-progress-bar">
              <i style={{ width: `${daily.pct}%` }} />
            </div>
          </div>
          <div className="stat-card audio-stat">
            <span className="stat-icon" aria-hidden="true">
              {isMuted ? '靜' : '聲'}
            </span>
            <div className="stat-info">
              <span className="stat-label">{t('hub.audio')}</span>
              <strong>{isMuted ? t('hub.muted') : t('hub.soundOn')}</strong>
              <button type="button" className="pill-btn audio-toggle" onClick={handleToggleAudio} aria-label={t(isMuted ? 'hub.unmute' : 'hub.mute')}>
                              {isMuted ? t('hub.unmute') : t('hub.mute')}
                            </button>
            </div>
          </div>
        </section>
      ) : null}

      {hasProgress && scheduledCount > 0 ? (
        <section className="fsrs-memory-dashboard" aria-label={t('hub.review')}>
          <div className="fsrs-copy">
            <div className="fsrs-icon" aria-hidden="true">記</div>
            <div>
              <div className="fsrs-title-row">
                <strong>{t('hub.srsTitle')}</strong>
                <span className="fsrs-chip">{t('hub.scheduled', { count: scheduledCount })}</span>
              </div>
              <p>
                {t('hub.srsMeta', {
                  long: longIntervalCount,
                })}
              </p>
              <p className="leech-soft-flag" aria-label={t('hub.leechSoftFlag')}>
                {leechCount > 0
                  ? t('hub.leechCount', { count: leechCount })
                  : t('hub.leechNone')}
              </p>
            </div>
          </div>
          <div className="week-heat" aria-label={t('hub.weekHeat')}>
            {weekLabels.map((item, dIdx) => (
              <div key={item.key} className="week-heat-day">
                <div
                  className={`week-heat-cell${weekFlags[dIdx] ? ' is-active' : ''}`}
                  title={weekFlags[dIdx] ? t('hub.weekHas', { day: item.day }) : t('hub.weekNone', { day: item.day })}
                />
                <span>{item.day}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {hasProgress ? (
        <details className="hub-more">
          <summary>{t('hub.moreProgress')}</summary>

          <aside role="complementary" aria-labelledby="radar-title" aria-label={t('hub.landmark.radar')}>
            <div className="section-header-row">
              <h2 id="radar-title">{t('hub.radarTitle')}</h2>
              <div className="radar-tab-switcher">
                {(Object.keys(TRACK_LABEL_KEYS) as LangId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={`radar-tab-btn ${activeRadarTab === id ? 'active' : ''}`}
                    aria-pressed={activeRadarTab === id}
                    onClick={() => setActiveRadarTab(id)}
                  >
                    {t(TRACK_LABEL_KEYS[id])}
                  </button>
                ))}
              </div>
            </div>

            <div className="hub-radar-display-wrapper">
              <KnowledgeRadar radar={activeRadar} size={340} />
              <div className="radar-weakness-plan">
                <div className="plan-info">
                  <span className="plan-tag">{t('hub.radarTag')}</span>
                  <strong>
                    {t('hub.radarExplore', {
                      label: activeRadar.weakestDimension.label,
                      score: activeRadar.weakestDimension.score,
                    })}
                  </strong>
                  <p>{t('hub.radarNote')}</p>
                </div>
                <button type="button" className="btn-plan-action" onClick={() => onChoose(activeRadarTab)}>
                  {t('hub.goTrack', { track: t(TRACK_LABEL_KEYS[activeRadarTab]) })}
                </button>
              </div>
            </div>
          </aside>

          <section className="hub-section-block" aria-labelledby="badges-title">
            <div className="section-header-row">
              <h2 id="badges-title">{t('hub.badgesTitle')}</h2>
            </div>
            <div className="hub-badges-grid">
              {BADGE_CATALOG.map((badge) => {
                const isUnlocked =
                  learningMeta.achievements.includes(badge.id) ||
                  (badge.id === 'badge-first-step' && totalXp > 0) ||
                  (badge.id === 'badge-streak-7' && learningMeta.streak >= 7) ||
                  (badge.id === 'badge-combo-10' && (learningMeta.streak >= 3 || totalXp >= 80)) ||
                  (badge.id === 'badge-fsrs-master' && Object.keys(learningMeta.items).length >= 5) ||
                  (badge.id === 'badge-math-balance' && mathDoneCount >= 3) ||
                  (badge.id === 'badge-math-algebra-tiles' && (mathProgress.labCompleted.length > 0 || mathDoneCount >= 5)) ||
                  (badge.id === 'badge-math-matrix-warp' && (mathProgress.stage === 'senior' || mathDoneCount >= 8)) ||
                  (badge.id === 'badge-math-riemann-limit' && (mathProgress.labCompleted.includes('calculus') || mathProgress.stage === 'senior')) ||
                  (badge.id === 'badge-calc-riemann-pro' && (calculusRadar.averageScore >= 45 || mathProgress.labCompleted.includes('calculus'))) ||
                  (badge.id === 'badge-phys-projectile' && (physicsDoneCount >= 3 || physicsProgress.labCompleted.includes('projectile'))) ||
                  (badge.id === 'badge-phys-optics-master' && (physicsProgress.labCompleted.includes('optics') || physicsDoneCount >= 5)) ||
                  (badge.id === 'badge-phys-circuit-pro' && (physicsProgress.labCompleted.includes('circuit') || physicsDoneCount >= 8)) ||
                  (badge.id === 'badge-chem-periodic-explorer' && (chemistryProgress.labCompleted.includes('periodic') || chemistryDoneCount >= 3)) ||
                  (badge.id === 'badge-chem-vsepr-architect' && (chemistryProgress.labCompleted.includes('vsepr') || chemistryDoneCount >= 5)) ||
                  (badge.id === 'badge-chem-titration-pro' && (chemistryProgress.labCompleted.includes('titration') || chemistryDoneCount >= 8)) ||
                  (badge.id === 'badge-ja-kana-pro' && kanaCount >= 15) ||
                  (badge.id === 'badge-ja-signals-ace' && (jaProgress.readingDone >= 2 || jaProgress.grammarStarted)) ||
                  (badge.id === 'badge-toeic-chunk-master' && toeicDoneCount >= 3) ||
                  (badge.id === 'badge-toeic-gold-seeker' && (toeicProgress.certificateId === 'gold' || toeicProgress.certificateId === 'blue'))

                return (
                  <div
                    key={badge.id}
                    className={`hub-badge-item ${isUnlocked ? 'unlocked' : 'locked'}`}
                    title={badge.description}
                  >
                    <span className="badge-item-icon">{badge.icon}</span>
                    <div className="badge-item-text">
                      <strong>{badge.title}</strong>
                      <small>{badge.description}</small>
                    </div>
                    <span className="badge-xp-tag">+{badge.xpReward} XP</span>
                  </div>
                )
              })}
            </div>
          </section>

          <AuthPanel />
          <DataControls />
        </details>
      ) : (
        <details className="hub-more">
          <summary>{t('hub.moreAuth')}</summary>
          <AuthPanel />
          <DataControls />
        </details>
      )}

      <footer role="contentinfo" className="hub-footer">
        <a
          href="https://github.com/SamHuang68/E-Learning"
          className="hub-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <button type="button" className="hub-link" onClick={onOpenPrivacy}>
          {t('hub.privacy')}
        </button>
        <span>{t('hub.license')}</span>
        <span>{t('hub.footerNote')}</span>
      </footer>
    </main>
    <nav className="hub-bottom-nav" aria-label={t('hub.bottomNav')}>
      <a href="#hub" className="hub-bottom-nav-item is-current" aria-current="page">
        <span className="hub-bottom-nav-mark" aria-hidden="true">主</span>
        {t('hub.bottomNav.home')}
      </a>
      <a href="#tracks-title" className="hub-bottom-nav-item">
        <span className="hub-bottom-nav-mark" aria-hidden="true">軌</span>
        {t('hub.bottomNav.tracks')}
      </a>
      <a href="#privacy" className="hub-bottom-nav-item">
        <span className="hub-bottom-nav-mark" aria-hidden="true">說</span>
        {t('hub.bottomNav.about')}
      </a>
    </nav>
    </>
  )
}
