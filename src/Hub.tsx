import { useState, useEffect } from 'react'
import { AuthPanel } from './auth/AuthPanel'
import { DataControls } from './components/DataControls'
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
import type { MessageKey } from './i18n/messages'

type Props = {
  onChoose: (lang: LangId) => void
  onOpenPrivacy: () => void
}

type RadarTab = LangId

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

function weekStudyFlags(meta: LearningMeta): boolean[] {
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

  const handleToggleAudio = () => {
    const next = toggleAudioMute()
    setIsMuted(next)
    if (!next) playClickSound()
  }

  useEffect(() => {
    const handleUpdate = () => setTick((t) => t + 1)
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

  void tick
  const mathProgress = loadMathProgress()
  const physicsProgress = loadPhysicsProgress()
  const chemistryProgress = loadChemistryProgress()
  const csProgress = loadCsProgress()
  const jaProgress = loadProgress()
  const kanaProgress = loadKanaProgress()
  const toeicProgress = loadToeicProgress()
  const chineseProgress = loadChineseProgress()
  const learningMeta = loadLearningMeta()

  const totalXp =
    (mathProgress.xp || 0) +
    (physicsProgress.xp || 0) +
    (chemistryProgress.xp || 0) +
    (csProgress.xp || 0) +
    (jaProgress.xp || 0) +
    (toeicProgress.xp || 0) +
    (chineseProgress.xp || 0)
  const levelInfo = calculateLevelProgress(totalXp)
  const daily = dailyProgress(learningMeta)

  const mathRadar = computeMathRadar(
    mathProgress.completedQuestions,
    mathProgress.examScores,
    mathProgress.labCompleted,
  )
  const calculusDoneCount = mathProgress.completedQuestions.filter((id) => id.startsWith('calc-prob-')).length
  const calculusLabCount = mathProgress.labCompleted.includes('calculus') ? 1 : 0
  const calculusRadar = computeCalculusRadar(
    mathProgress.calculusTheta ?? 0,
    calculusDoneCount,
    calculusLabCount,
  )
  const physicsRadar = computePhysicsRadar(
    physicsProgress.completedQuestions,
    physicsProgress.examScores,
    physicsProgress.labCompleted,
  )
  const chemistryRadar = computeChemistryRadar(
    chemistryProgress.completedQuestions,
    chemistryProgress.examScores,
    chemistryProgress.labCompleted,
  )
  const csRadar = computeCsRadar(
    csProgress.completedQuestions,
    csProgress.examScores,
    csProgress.labCompleted,
  )
  const kanaCount = Object.keys(kanaProgress.mastered).length
  const jaRadar = computeAobaRadar(
    Math.max(daily.done, jaProgress.readingDone || 0),
    learningMeta.kanjiMastered.length,
    learningMeta.speakingDone,
    learningMeta.streak,
  )
  const toeicDoneCount = (toeicProgress.vocabDone || 0) + (toeicProgress.listeningDone || 0)
  const toeicRadar = computeToeicRadar(
    Math.max(daily.done, toeicDoneCount),
    toeicDoneCount,
    0,
  )
  const chineseRadar = computeChineseRadar(
    chineseProgress.xp || 0,
    chineseProgress.masteredFalseFriends?.length || 0,
    chineseProgress.masteredGrammarSignals?.length || 0,
    chineseProgress.completedDialogues?.length || 0,
    chineseProgress.errorQuestions?.length || 0,
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
  const activeRadar = radarMap[activeRadarTab]

  const mathDoneCount = mathProgress.completedQuestions.length
  const physicsDoneCount = physicsProgress.completedQuestions.length
  const chemistryDoneCount = chemistryProgress.completedQuestions.length
  const csDoneCount = csProgress.completedQuestions.length

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

  const preferred = loadPreferredTrack()
  const resumeId: LangId = preferred ?? 'math'
  const weekFlags = weekStudyFlags(learningMeta)
  const weekLabels: Array<{ key: MessageKey; day: string }> = [
    { key: 'hub.weekday.1', day: t('hub.weekday.1') },
    { key: 'hub.weekday.2', day: t('hub.weekday.2') },
    { key: 'hub.weekday.3', day: t('hub.weekday.3') },
    { key: 'hub.weekday.4', day: t('hub.weekday.4') },
    { key: 'hub.weekday.5', day: t('hub.weekday.5') },
    { key: 'hub.weekday.6', day: t('hub.weekday.6') },
    { key: 'hub.weekday.7', day: t('hub.weekday.7') },
  ]
  const longIntervalCount = Object.values(learningMeta.items).filter(
    (it) => (it.intervalDays || 0) >= 21 || (it.correctStreak || 0) >= 3,
  ).length
  const scheduledCount = Object.keys(learningMeta.items).length
  const dueByTrack = dueCountBySrsItems(learningMeta.items)
  const calculusDue = dueCountFromFsrsMap(mathProgress.calculusFsrs)
  if (calculusDue > 0) dueByTrack.calculus = (dueByTrack.calculus ?? 0) + calculusDue
  const todaySuggestion = pickTodaySuggestion({
    preferred,
    dueByTrack,
    hasProgress,
  })

  function openToeic(lang: 'zh' | 'ja') {
    saveToeicInstructionLang(lang)
    setToeicLang(lang)
    onChoose('en')
  }

  const tracks: Array<{
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
  }> = [
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
      title: t('hub.ja.title'),
      desc: t('hub.ja.desc'),
      progress: t('hub.masteredKana', { count: kanaCount }),
      catalog: t('hub.ja.catalog'),
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
      title: t('hub.en.title'),
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
      title: t('hub.zh.title'),
      desc: t('hub.zh.desc'),
      progress: t('hub.falseFriends', { count: chineseProgress.masteredFalseFriends?.length || 0 }),
      catalog: t('hub.zh.catalog'),
      cta: t('hub.zh.cta'),
      onClick: () => onChoose('zh'),
    },
  ]

  const todayId: LangId = todaySuggestion.id
  const todayTrack = tracks.find((track) => track.id === todayId) ?? tracks[0]
  const todayReason =
    todaySuggestion.reasonKey === 'due'
      ? t('today.due', { count: todaySuggestion.dueCount ?? 0 })
      : t(
          todaySuggestion.reasonKey === 'resume'
            ? 'today.resume'
            : todaySuggestion.reasonKey === 'preferred'
              ? 'today.preferred'
              : 'today.catalog',
        )
  const resumeLabel = t(TRACK_LABEL_KEYS[resumeId])

  return (
    <main className="hub unified-hub">
      <header className="hub-hero">
        <div className="hub-topbar">
          <div>
            <p className="eyebrow">{t('hub.eyebrow')}</p>
            <h1>{t('hub.title')}</h1>
          </div>
          <LocaleToggle />
        </div>
        <p className="lede">
          {t('hub.lede')}
        </p>
        <p className="section-subtext">
          {t('hub.subtext')}
        </p>
        <div className="hub-hero-actions">
          <button
            type="button"
            className="hub-primary-cta"
            onClick={() => {
              if (resumeId === 'en') openToeic(toeicLang)
              else onChoose(resumeId)
            }}
          >
            {hasProgress && preferred ? t('hub.continue', { track: resumeLabel }) : t('hub.start', { track: resumeLabel })}
          </button>
          <a className="hub-secondary-cta" href="#tracks-title">
            {t('hub.seeAll')}
          </a>
        </div>
      </header>

      <section className="hub-section-block hub-today-block" aria-label={t('hub.todayLabel')}>
        <p className="section-subtext">{t('hub.todayLabel')} · {todayReason}</p>
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

      <section className="hub-section-block" aria-labelledby="tracks-title">
        <div className="section-header-row">
          <h2 id="tracks-title">{t('hub.tracksTitle')}</h2>
          <span className="section-subtext">{t('hub.tracksCount')}</span>
        </div>

        <div className="hub-grid eight-track-grid">
          {tracks.map((track) => (
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
      </section>

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
              <button type="button" className="pill-btn audio-toggle" onClick={handleToggleAudio}>
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
                  bonus: Math.min(50, learningMeta.streak * 5),
                })}
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

          <section className="hub-section-block" aria-labelledby="radar-title">
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
          </section>

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

      <footer className="hub-footer">
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
  )
}
