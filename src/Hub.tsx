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

type Props = {
  onChoose: (lang: LangId) => void
  onOpenPrivacy: () => void
}

type RadarTab = LangId

const TRACK_LABEL: Record<LangId, string> = {
  math: '臺灣數學',
  calculus: '微積分',
  physics: '物理',
  chemistry: '化學',
  cs: '計算機概論',
  ja: '日語',
  en: '多益英語',
  zh: '台湾華語',
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
  const calculusRadar = computeCalculusRadar(0, calculusDoneCount, calculusLabCount)
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
  const weekLabels = ['一', '二', '三', '四', '五', '六', '日']
  const longIntervalCount = Object.values(learningMeta.items).filter(
    (it) => (it.intervalDays || 0) >= 21 || (it.correctStreak || 0) >= 3,
  ).length
  const scheduledCount = Object.keys(learningMeta.items).length

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
    cta: string
    onClick: () => void
  }> = [
    {
      id: 'math',
      mark: '∑',
      markClass: 'math-mark',
      extraClass: 'math-track-card',
      pill: 'K-12 全學段',
      pillClass: 'math',
      title: '臺灣數學',
      desc: '國小到高中。KaTeX 算式、幾何教具與會考／學測模考。',
      progress: `已解 ${mathDoneCount} 題 · ${mathProgress.stage.toUpperCase()}`,
      cta: '進入數學',
      onClick: () => onChoose('math'),
    },
    {
      id: 'calculus',
      mark: '∫',
      markClass: 'calculus-mark',
      extraClass: 'calculus-track-card',
      pill: '數甲 · 大一先修',
      pillClass: 'calculus',
      title: '微積分',
      desc: '切線、黎曼和、FTC 與旋轉體動態實驗室。',
      progress: `專題 ${calculusDoneCount} 題 · 實驗室 ${calculusLabCount} 項`,
      cta: '進入微積分',
      onClick: () => onChoose('calculus'),
    },
    {
      id: 'physics',
      mark: '物',
      markClass: 'physics-mark',
      extraClass: 'physics-track-card',
      pill: '國中＋高中',
      pillClass: 'physics',
      title: '物理',
      desc: '聲光力電到近代物理。拋體、光學、電路實驗室與模考。',
      progress: `已解 ${physicsDoneCount} 題 · ${physicsProgress.xp} XP`,
      cta: '進入物理',
      onClick: () => onChoose('physics'),
    },
    {
      id: 'chemistry',
      mark: '化',
      markClass: 'chemistry-mark',
      extraClass: 'chemistry-track-card',
      pill: '國中＋高中',
      pillClass: 'chemistry',
      title: '化學',
      desc: '水溶液到有機。週期表、VSEPR、滴定曲線與破題卡。',
      progress: `已解 ${chemistryDoneCount} 題 · ${chemistryProgress.xp} XP`,
      cta: '進入化學',
      onClick: () => onChoose('chemistry'),
    },
    {
      id: 'cs',
      mark: 'CS',
      markClass: 'cs-mark',
      extraClass: 'cs-track-card',
      pill: '軟硬體 · AI',
      pillClass: 'cs',
      title: '計算機概論',
      desc: '馮紐曼架構、快取與管線，接到 GPU／Transformer。',
      progress: `已解 ${csDoneCount} 題 · ${csProgress.xp} XP`,
      cta: '進入計算機概論',
      onClick: () => onChoose('cs'),
    },
    {
      id: 'ja',
      mark: 'あ',
      markClass: '',
      extraClass: 'jp-track-card',
      pill: '中文學日文',
      pillClass: 'ja',
      title: 'あおば日本語',
      desc: 'JLPT N5 到 N1。五十音、文法訊號與職場敬語。',
      progress: `JLPT ${jaProgress.levelId.toUpperCase()} · 五十音 ${kanaCount}/104`,
      cta: '進入日語',
      onClick: () => onChoose('ja'),
    },
    {
      id: 'en',
      mark: 'T',
      markClass: 'toeic',
      extraClass: 'en-track-card',
      pill: toeicLang === 'ja' ? '日本語解説' : '中文解說',
      pillClass: 'en',
      title: 'TOEIC 多益英語',
      desc: '商務語塊、四國口音與證書級距練習。',
      progress: `證書 ${toeicProgress.certificateId.toUpperCase()} · ${toeicDoneCount} 語塊`,
      cta: toeicLang === 'ja' ? '日本語で学ぶ' : '進入英語',
      onClick: () => openToeic(toeicLang),
    },
    {
      id: 'zh',
      mark: '華',
      markClass: 'zh-mark',
      extraClass: 'zh-track-card',
      pill: '日文學中文',
      pillClass: 'zh',
      title: '台湾華語',
      desc: '四聲曲線、日中偽友詞與把字句／被字句判斷。',
      progress: `${chineseProgress.xp || 0} XP · 偽友詞 ${chineseProgress.masteredFalseFriends?.length || 0}`,
      cta: '日本語で学ぶ',
      onClick: () => onChoose('zh'),
    },
  ]

  return (
    <main className="hub unified-hub">
      <header className="hub-hero">
        <div className="hub-topbar">
          <p className="eyebrow">八軌學習平台</p>
          <AuthPanel variant="compact" />
        </div>
        <h1>今天要學哪一軌？</h1>
        <p className="lede">
          數學、微積分、物理、化學、計算機概論、日語、多益與華語，同一個離線優先的練習系統。
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
            {hasProgress && preferred ? `繼續：${TRACK_LABEL[resumeId]}` : `從${TRACK_LABEL[resumeId]}開始`}
          </button>
          <a className="hub-secondary-cta" href="#tracks-title">
            看全部軌道
          </a>
        </div>
      </header>

      <section className="hub-section-block" aria-labelledby="tracks-title">
        <div className="section-header-row">
          <h2 id="tracks-title">選擇學習軌道</h2>
          <span className="section-subtext">8 軌</span>
        </div>

        <div className="hub-grid six-track-grid">
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
                  <span>{track.progress}</span>
                </div>
                <b className="launch-action">{track.cta} →</b>
              </button>
              {track.id === 'en' ? (
                <div className="track-lang-toggle" role="group" aria-label="多益解說語言">
                  <button
                    type="button"
                    className={toeicLang === 'zh' ? 'is-active' : ''}
                    onClick={() => {
                      saveToeicInstructionLang('zh')
                      setToeicLang('zh')
                    }}
                  >
                    中文解說
                  </button>
                  <button
                    type="button"
                    className={toeicLang === 'ja' ? 'is-active' : ''}
                    onClick={() => {
                      saveToeicInstructionLang('ja')
                      setToeicLang('ja')
                    }}
                  >
                    日本語
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {hasProgress ? (
        <section className="hub-stat-banner" aria-label="學習統計">
          <div className="stat-card level-stat">
            <span className="stat-icon" aria-hidden="true">Lv</span>
            <div className="stat-info">
              <span className="stat-label">等級</span>
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
              <span className="stat-label">連續學習</span>
              <strong>{learningMeta.streak} 天</strong>
              <small>有連勝防護</small>
            </div>
          </div>
          <div className="stat-card daily-stat">
            <span className="stat-icon" aria-hidden="true">今</span>
            <div className="stat-info">
              <span className="stat-label">今日目標</span>
              <strong>
                {daily.done} / {daily.goal} 卡
              </strong>
              <small>達成率 {daily.pct}%</small>
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
              <span className="stat-label">音效</span>
              <strong>{isMuted ? '已靜音' : '開啟'}</strong>
              <button type="button" className="pill-btn audio-toggle" onClick={handleToggleAudio}>
                {isMuted ? '開啟音效' : '靜音'}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {hasProgress && scheduledCount > 0 ? (
        <section className="fsrs-memory-dashboard" aria-label="語文複習">
          <div className="fsrs-copy">
            <div className="fsrs-icon" aria-hidden="true">記</div>
            <div>
              <div className="fsrs-title-row">
                <strong>語文間隔複習</strong>
                <span className="fsrs-chip">已排程 {scheduledCount} 張</span>
              </div>
              <p>
                長間隔 {longIntervalCount} 張 · 連勝加成 +{Math.min(50, learningMeta.streak * 5)}% XP
              </p>
            </div>
          </div>
          <div className="week-heat" aria-label="本週實際學習日">
            {weekLabels.map((day, dIdx) => (
              <div key={day} className="week-heat-day">
                <div
                  className={`week-heat-cell${weekFlags[dIdx] ? ' is-active' : ''}`}
                  title={weekFlags[dIdx] ? `星期${day} 有學習紀錄` : `星期${day} 無紀錄`}
                />
                <span>{day}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {hasProgress ? (
        <details className="hub-more">
          <summary>進度、雷達與資料備份</summary>

          <section className="hub-section-block" aria-labelledby="radar-title">
            <div className="section-header-row">
              <h2 id="radar-title">練習覆蓋雷達</h2>
              <div className="radar-tab-switcher">
                {(Object.keys(TRACK_LABEL) as LangId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={`radar-tab-btn ${activeRadarTab === id ? 'active' : ''}`}
                    onClick={() => setActiveRadarTab(id)}
                  >
                    {TRACK_LABEL[id]}
                  </button>
                ))}
              </div>
            </div>

            <div className="hub-radar-display-wrapper">
              <KnowledgeRadar radar={activeRadar} size={340} />
              <div className="radar-weakness-plan">
                <div className="plan-info">
                  <span className="plan-tag">本機練習紀錄 · 下一步</span>
                  <strong>
                    可先探索：{activeRadar.weakestDimension.label}（{activeRadar.weakestDimension.score}/100）
                  </strong>
                  <p>依本機作答與實驗室次數換算，不是能力測驗。</p>
                </div>
                <button type="button" className="btn-plan-action" onClick={() => onChoose(activeRadarTab)}>
                  前往{TRACK_LABEL[activeRadarTab]}
                </button>
              </div>
            </div>
          </section>

          <section className="hub-section-block" aria-labelledby="badges-title">
            <div className="section-header-row">
              <h2 id="badges-title">微認證</h2>
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

          <DataControls />
        </details>
      ) : (
        <details className="hub-more">
          <summary>匯出／匯入進度</summary>
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
          隱私與資料說明
        </button>
        <span>MIT License · Sam Huang</span>
      </footer>
    </main>
  )
}
