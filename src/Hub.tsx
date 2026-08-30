import { useState } from 'react'
import { AuthPanel } from './auth/AuthPanel'
import { DataControls } from './components/DataControls'
import { KnowledgeRadar } from './components/KnowledgeRadar'
import { computeMathRadar, computeAobaRadar, computeToeicRadar } from './engine/radar'
import {
  calculateLevelProgress,
  BADGE_CATALOG,
} from './engine/gamification'
import { dailyProgress } from './engine/habits'
import {
  loadLearningMeta,
  loadProgress,
  loadKanaProgress,
  loadToeicProgress,
  type LangId,
} from './utils/storage'
import { loadMathProgress } from './math/utils/mathStorage'

type Props = {
  onChoose: (lang: LangId) => void
  onOpenPrivacy: () => void
}

type RadarTab = 'math' | 'ja' | 'en'

/**
 * 統一學習主頁 (Unified Learning Hub Home)
 * 整合臺灣 108 課綱數學、あおば日語與多益商務英語三大軌道。
 * 包含全域等級、戰力雷達、連勝紀錄、今日任務與三軌統一入口。
 */
export function Hub({ onChoose, onOpenPrivacy }: Props) {
  const [activeRadarTab, setActiveRadarTab] = useState<RadarTab>('math')

  // 讀取三軌與全域學習進度
  const mathProgress = loadMathProgress()
  const jaProgress = loadProgress()
  const kanaProgress = loadKanaProgress()
  const toeicProgress = loadToeicProgress()
  const learningMeta = loadLearningMeta()

  // 計算全域 XP 與等級
  const totalXp = (mathProgress.xp || 0) + (jaProgress.xp || 0) + (toeicProgress.xp || 0)
  const levelInfo = calculateLevelProgress(totalXp)
  const daily = dailyProgress(learningMeta)

  // 計算三軌能力雷達數據
  const mathRadar = computeMathRadar(
    mathProgress.completedQuestions,
    mathProgress.examScores,
    mathProgress.labCompleted,
  )
  const kanaCount = Object.keys(kanaProgress.mastered).length
  const jaRadar = computeAobaRadar(
    daily.done,
    learningMeta.kanjiMastered.length,
    learningMeta.speakingDone,
    learningMeta.streak,
  )
  const toeicDoneCount = (toeicProgress.vocabDone || 0) + (toeicProgress.listeningDone || 0)
  const toeicRadar = computeToeicRadar(
    daily.done,
    toeicDoneCount,
    750,
  )

  const activeRadar =
    activeRadarTab === 'math'
      ? mathRadar
      : activeRadarTab === 'ja'
        ? jaRadar
        : toeicRadar

  // 統計已掌握項目
  const mathDoneCount = mathProgress.completedQuestions.length

  return (
    <div className="hub unified-hub">
      {/* 頂部全域入口導覽列 */}
      <nav className="hub-portal-bar" aria-label="全域專案入口導覽">
        <a
          href="https://samhuang68.github.io/"
          className="portal-brand-link"
          target="_blank"
          rel="noopener noreferrer"
          title="前往 Sam Huang 矽智財與系統專案總入口"
        >
          <span className="portal-monogram">SH</span>
          <span className="portal-title-text">
            <strong>Sam Huang</strong> · PROJECT PORTAL ↗
          </span>
        </a>
        <div className="portal-links-right">
          <a
            href="https://github.com/SamHuang68/E-Learning"
            className="portal-sublink"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repository ↗
          </a>
        </div>
      </nav>

      {/* 主頁 Hero 標題與簡介 */}
      <header className="hub-hero">
        <p className="eyebrow">UNIFIED E-LEARNING PORTAL</p>
        <h1>統一學習主頁 · 三大專業學術軌道</h1>
        <p className="lede">
          同一個學習系統，三大專業軌道。臺灣 108 課綱數學（國小／國中／高中）、日語 JLPT 與多益商務英語。離線優先、FSRS 間隔重複、2PL 自適應選題與抽象視覺圖解。
        </p>
      </header>

      {/* 全域學習戰力與等級橫幅 */}
      <section className="hub-stat-banner" aria-label="全域學習統計">
        <div className="stat-card level-stat">
          <span className="stat-icon">⚡</span>
          <div className="stat-info">
            <span className="stat-label">全域等級</span>
            <strong>Lv.{levelInfo.currentLevel}</strong>
            <small>{totalXp} Total XP</small>
          </div>
          <div className="stat-progress-bar">
            <i style={{ width: `${levelInfo.progressPct}%` }} />
          </div>
        </div>

        <div className="stat-card streak-stat">
          <span className="stat-icon">🔥</span>
          <div className="stat-info">
            <span className="stat-label">連續學習</span>
            <strong>{learningMeta.streak} 天</strong>
            <small>已配置連勝防護</small>
          </div>
        </div>

        <div className="stat-card daily-stat">
          <span className="stat-icon">🎯</span>
          <div className="stat-info">
            <span className="stat-label">今日微學習目標</span>
            <strong>{daily.done} / {daily.goal} 卡</strong>
            <small>達成率 {daily.pct}%</small>
          </div>
          <div className="stat-progress-bar">
            <i style={{ width: `${daily.pct}%` }} />
          </div>
        </div>
      </section>

      {/* 帳號與雲端同步 */}
      <AuthPanel />

      {/* 三大軌道統一入口卡片 */}
      <section className="hub-section-block" aria-labelledby="tracks-title">
        <div className="section-header-row">
          <h2 id="tracks-title">選擇學習軌道</h2>
          <span className="section-subtext">3 MAJOR LEARNING TRACKS</span>
        </div>

        <div className="hub-grid three-track-grid">
          {/* 1. 臺灣 108 課綱數學 */}
          <button
            type="button"
            className="hub-card math-track-card"
            onClick={() => onChoose('math')}
          >
            <div className="hub-card-header">
              <div className="hub-card-mark math-mark">∑</div>
              <span className="track-status-pill math">K-12 全學段</span>
            </div>
            <p className="eyebrow">TAIWAN · 108 CURRICULUM</p>
            <h2>臺灣數學 (K-12)</h2>
            <p className="track-desc">
              國小 1~6 年級、國中三年、高中三年全學段。含 KaTeX 算式、6 大抽象圖示解題器、7 大幾何實驗室與會考／學測模擬考。
            </p>
            <div className="track-highlight-badges">
              <span>📐 畢氏定理</span>
              <span>🧩 代數拼圖</span>
              <span>⚖️ 天平公理</span>
              <span>📈 黎曼定積分</span>
            </div>
            <div className="track-user-progress">
              <span>進度：已解 <strong>{mathDoneCount}</strong> 題 · 當前階段 <strong>{mathProgress.stage.toUpperCase()}</strong></span>
            </div>
            <b className="launch-action">進入數學學習 →</b>
          </button>

          {/* 2. あおば日語 */}
          <button
            type="button"
            className="hub-card jp-track-card"
            onClick={() => onChoose('ja')}
          >
            <div className="hub-card-header">
              <div className="hub-card-mark">あ</div>
              <span className="track-status-pill ja">JLPT N5 ~ N1</span>
            </div>
            <p className="eyebrow">JAPANESE LANGUAGE</p>
            <h2>あおば日本語</h2>
            <p className="track-desc">
              JLPT 級距（N5/N4 基礎 → N3 中級 → N2/N1 進階）。保留五十音平／片假名、3 秒文法動作訊號決策樹與職場敬語情境。
            </p>
            <div className="track-highlight-badges">
              <span>🌸 五十音點讀</span>
              <span>⛩️ 動作訊號樹</span>
              <span>💼 職場敬語</span>
              <span>🎙️ 跟讀口說</span>
            </div>
            <div className="track-user-progress">
              <span>進度：JLPT <strong>{jaProgress.levelId.toUpperCase()}</strong> · 五十音掌握 <strong>{kanaCount}/104</strong></span>
            </div>
            <b className="launch-action">進入日語學習 →</b>
          </button>

          {/* 3. TOEIC 多益英語 */}
          <button
            type="button"
            className="hub-card en-track-card"
            onClick={() => onChoose('en')}
          >
            <div className="hub-card-header">
              <div className="hub-card-mark toeic">T</div>
              <span className="track-status-pill en">多益四色證書</span>
            </div>
            <p className="eyebrow">ENGLISH · TOEIC</p>
            <h2>TOEIC English</h2>
            <p className="track-desc">
              多益四色證書（橘／綠／藍／金）對照分數帶與職場門檻。高頻商務語塊 (Chunks) 訓練、美英澳加 4 國官方指定口音與同步字幕。
            </p>
            <div className="track-highlight-badges">
              <span>⚡ 商務語塊</span>
              <span>🎧 4 國口音切換</span>
              <span>📖 情境微故事</span>
              <span>🏆 黃金證書</span>
            </div>
            <div className="track-user-progress">
              <span>進度：證書級距 <strong>{toeicProgress.certificateId.toUpperCase()}</strong> · 已掌握 <strong>{toeicDoneCount}</strong> 語塊</span>
            </div>
            <b className="launch-action">進入英語學習 →</b>
          </button>
        </div>
      </section>

      {/* 三軌多維能力戰力雷達 */}
      <section className="hub-section-block" aria-labelledby="radar-title">
        <div className="section-header-row">
          <h2 id="radar-title">三軌能力與知識雷達</h2>
          <div className="radar-tab-switcher">
            <button
              type="button"
              className={`radar-tab-btn ${activeRadarTab === 'math' ? 'active' : ''}`}
              onClick={() => setActiveRadarTab('math')}
            >
              ∑ 臺灣數學 (5維)
            </button>
            <button
              type="button"
              className={`radar-tab-btn ${activeRadarTab === 'ja' ? 'active' : ''}`}
              onClick={() => setActiveRadarTab('ja')}
            >
              あ あおば日語 (5維)
            </button>
            <button
              type="button"
              className={`radar-tab-btn ${activeRadarTab === 'en' ? 'active' : ''}`}
              onClick={() => setActiveRadarTab('en')}
            >
              T 多益英語 (5維)
            </button>
          </div>
        </div>

        <div className="hub-radar-display-wrapper">
          <KnowledgeRadar radar={activeRadar} size={340} />
          
          <div className="radar-weakness-plan">
            <div className="plan-icon">🎯</div>
            <div className="plan-info">
              <span className="plan-tag">AI 認知調度 · 今日優先補強計畫</span>
              <strong>當前建議精進：{activeRadar.weakestDimension.label} ({activeRadar.weakestDimension.score}/100)</strong>
              <p>
                {activeRadarTab === 'math'
                  ? `系統分析您的作答軌跡，建議前往強化「${activeRadar.weakestDimension.label}」專屬具象教具與階梯式題庫。`
                  : activeRadarTab === 'ja'
                    ? `系統分析您的日語反應速率，建議前往「${activeRadar.weakestDimension.label}」透過動作訊號樹與跟讀深化記憶。`
                    : `系統分析您的英語語塊熟練度，建議前往「${activeRadar.weakestDimension.label}」進行 4 國口音沉浸跟讀。`}
              </p>
            </div>
            <button
              type="button"
              className="btn-plan-action"
              onClick={() => onChoose(activeRadarTab)}
            >
              啟動{activeRadarTab === 'math' ? '數學' : activeRadarTab === 'ja' ? '日語' : '多益'}專屬特訓 →
            </button>
          </div>
        </div>
      </section>

      {/* 微認證勳章展覽室 */}
      <section className="hub-section-block" aria-labelledby="badges-title">
        <div className="section-header-row">
          <h2 id="badges-title">微認證與成就勳章</h2>
          <span className="section-subtext">12 MICRO-CREDENTIALS</span>
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

      {/* 資料備份與控制 */}
      <DataControls />

      {/* 頁尾資訊 */}
      <footer className="hub-footer">
        <a
          href="https://samhuang68.github.io/"
          className="hub-link portal-footer-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          🏛️ Sam Huang 專案總入口 (samhuang68.github.io) ↗
        </a>
        <button type="button" className="hub-link" onClick={onOpenPrivacy}>
          隱私與資料說明
        </button>
        <span>MIT License · Sam Huang</span>
      </footer>
    </div>
  )
}
