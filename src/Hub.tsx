import { useState, useEffect } from 'react'
import { AuthPanel } from './auth/AuthPanel'
import { DataControls } from './components/DataControls'
import { KnowledgeRadar } from './components/KnowledgeRadar'
import {
  computeMathRadar,
  computeCalculusRadar,
  computePhysicsRadar,
  computeChemistryRadar,
  computeAobaRadar,
  computeToeicRadar,
} from './engine/radar'
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
import { loadPhysicsProgress } from './physics/utils/physicsStorage'
import { loadChemistryProgress } from './chemistry/utils/chemistryStorage'
import { isAudioMuted, toggleAudioMute, playClickSound } from './engine/audioSynthesizer'

type Props = {
  onChoose: (lang: LangId) => void
  onOpenPrivacy: () => void
}

type RadarTab = 'math' | 'calculus' | 'physics' | 'chemistry' | 'ja' | 'en'

/**
 * 統一學習主頁 (Unified Learning Hub Home)
 * 整合臺灣 108 課綱數學、∫ 微積分專題、⚛️ 物理、🧪 化學、あおば日語與多益商務英語六大軌道。
 * 包含全域等級、戰力雷達、連勝紀錄、今日任務與六軌統一入口。
 */
export function Hub({ onChoose, onOpenPrivacy }: Props) {
  const [activeRadarTab, setActiveRadarTab] = useState<RadarTab>('math')
  const [tick, setTick] = useState(0)
  const [isMuted, setIsMuted] = useState(() => isAudioMuted())

  const handleToggleAudio = () => {
    const next = toggleAudioMute()
    setIsMuted(next)
    if (!next) {
      playClickSound()
    }
  }

  useEffect(() => {
    const handleUpdate = () => setTick((t) => t + 1)
    window.addEventListener('physics:progress-updated', handleUpdate)
    window.addEventListener('chemistry:progress-updated', handleUpdate)
    window.addEventListener('math:progress-updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('physics:progress-updated', handleUpdate)
      window.removeEventListener('chemistry:progress-updated', handleUpdate)
      window.removeEventListener('math:progress-updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  // 讀取六軌與全域學習進度 (依 tick 響應式重新讀取)
  void tick
  const mathProgress = loadMathProgress()
  const physicsProgress = loadPhysicsProgress()
  const chemistryProgress = loadChemistryProgress()
  const jaProgress = loadProgress()
  const kanaProgress = loadKanaProgress()
  const toeicProgress = loadToeicProgress()
  const learningMeta = loadLearningMeta()

  // 計算全域 XP 與等級
  const totalXp =
    (mathProgress.xp || 0) +
    (physicsProgress.xp || 0) +
    (chemistryProgress.xp || 0) +
    (jaProgress.xp || 0) +
    (toeicProgress.xp || 0) +
    150
  const levelInfo = calculateLevelProgress(totalXp)
  const daily = dailyProgress(learningMeta)

  // 計算六軌能力雷達數據
  const mathRadar = computeMathRadar(
    mathProgress.completedQuestions,
    mathProgress.examScores,
    mathProgress.labCompleted,
  )
  const calculusRadar = computeCalculusRadar(0.4, 4, 5)
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
    750,
  )

  const activeRadar =
    activeRadarTab === 'math'
      ? mathRadar
      : activeRadarTab === 'calculus'
        ? calculusRadar
        : activeRadarTab === 'physics'
          ? physicsRadar
          : activeRadarTab === 'chemistry'
            ? chemistryRadar
            : activeRadarTab === 'ja'
              ? jaRadar
              : toeicRadar

  // 統計已掌握項目
  const mathDoneCount = mathProgress.completedQuestions.length
  const physicsDoneCount = physicsProgress.completedQuestions.length
  const chemistryDoneCount = chemistryProgress.completedQuestions.length

  return (
    <main className="hub unified-hub">
      {/* 主頁 Hero 標題與簡介 */}
      <header className="hub-hero">
        <p className="eyebrow">UNIFIED E-LEARNING PLATFORM</p>
        <h1>統一學習主頁 · 六大專業學術軌道</h1>
        <p className="lede">
          同一個學習系統，六大專業軌道。臺灣 108 課綱數學、∫ 微積分互動專題、⚛️ 物理、🧪 化學、あおば日語 JLPT 與多益商務英語。離線優先、FSRS 間隔重複、2PL 自適應選題與抽象視覺圖解。
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

        <div className="stat-card audio-stat">
          <span className="stat-icon">{isMuted ? '🔇' : '🔊'}</span>
          <div className="stat-info">
            <span className="stat-label">音效激勵回饋</span>
            <strong>{isMuted ? '已靜音' : '立體聲開啟'}</strong>
            <button
              type="button"
              className="pill-btn"
              style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem', marginTop: '0.2rem' }}
              onClick={handleToggleAudio}
            >
              {isMuted ? '開啟音效 🔊' : '關閉靜音 🔇'}
            </button>
          </div>
        </div>
      </section>

      {/* FSRS 艾賓浩斯長期記憶留存與認知排程儀表 */}
      <section
        className="fsrs-memory-dashboard"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '14px',
          padding: '0.85rem 1rem',
          margin: '0.75rem 0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '220px', flex: '1' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
            }}
          >
            🧠
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <strong style={{ fontSize: '0.9rem' }}>FSRS 認知間隔記憶引擎</strong>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '999px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#10b981',
                  fontWeight: 600,
                }}
              >
                記憶留存預測 {Object.keys(learningMeta.items).length > 0 ? Math.min(99, Math.max(75, Math.round(90 + (Object.values(learningMeta.items).filter((it) => (it.intervalDays || 0) >= 21 || (it.correctStreak || 0) >= 3).length / Object.keys(learningMeta.items).length) * 9))) : 95}%
              </span>
            </div>
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.74rem', color: 'var(--muted)' }}>
              全軌道共追蹤 <strong>{Object.keys(learningMeta.items).length}</strong> 項知識點 · 已建立長期記憶 <strong>{Object.values(learningMeta.items).filter((it) => (it.intervalDays || 0) >= 21 || (it.correctStreak || 0) >= 3).length}</strong> 項 · 連勝加成 <strong>+{Math.min(50, learningMeta.streak * 5)}% XP</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {['一', '二', '三', '四', '五', '六', '日'].map((day, dIdx) => {
            const isActiveDay = dIdx <= (new Date().getDay() + 6) % 7
            return (
              <div
                key={day}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    background: isActiveDay ? '#10b981' : 'var(--surface-soft)',
                    border: '1px solid var(--line)',
                    transition: 'all 0.2s ease',
                  }}
                  title={`星期${day} 學習熱力`}
                />
                <span style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>{day}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* 帳號與雲端同步 */}
      <AuthPanel />

      {/* 六大軌道統一入口卡片 */}
      <section className="hub-section-block" aria-labelledby="tracks-title">
        <div className="section-header-row">
          <h2 id="tracks-title">選擇學習軌道</h2>
          <span className="section-subtext">6 MAJOR LEARNING TRACKS</span>
        </div>

        <div className="hub-grid six-track-grid">
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
              國小 1~6 年級、國中三年、高中三年全學段。含 KaTeX 算式、6 大幾何解題器、等量公理與會考／學測模擬考。
            </p>
            <div className="track-highlight-badges">
              <span>📐 幾何解題</span>
              <span>⚖️ 天平公理</span>
              <span>🔢 十進位積木</span>
              <span>⭕ 三角單位圓</span>
            </div>
            <div className="track-user-progress">
              <span>進度：已解 <strong>{mathDoneCount}</strong> 題 · 當前階段 <strong>{mathProgress.stage.toUpperCase()}</strong></span>
            </div>
            <b className="launch-action">進入數學學習 →</b>
          </button>

          {/* 2. ∫ 微積分互動專題 */}
          <button
            type="button"
            className="hub-card calculus-track-card"
            onClick={() => onChoose('calculus')}
          >
            <div className="hub-card-header">
              <div className="hub-card-mark calculus-mark">∫</div>
              <span className="track-status-pill calculus">數甲 · AP · 大一先修</span>
            </div>
            <p className="eyebrow">ADVANCED · CALCULUS STUDIO</p>
            <h2>微積分互動專題</h2>
            <p className="track-desc">
              7 大幾何動態實驗室（切線極限、黎曼定積分、FTC、旋轉體 3D、泰勒多項式）、符號推導解題器與 4 階 IRT 自適應挑戰。
            </p>
            <div className="track-highlight-badges">
              <span>🎨 幾何動態畫布</span>
              <span>📝 符號步驟解題</span>
              <span>🍩 旋轉體切片</span>
              <span>🏆 微認證勳章</span>
            </div>
            <div className="track-user-progress">
              <span>進度：能力值 <strong>θ: +0.40</strong> · 徽章 <strong>2/6</strong></span>
            </div>
            <b className="launch-action">進入微積分學習 →</b>
          </button>

          {/* 3. ⚛️ 臺灣 108 課綱物理 (國中+高中) */}
          <button
            type="button"
            className="hub-card physics-track-card"
            onClick={() => onChoose('physics')}
          >
            <div className="hub-card-header">
              <div className="hub-card-mark physics-mark">⚛️</div>
              <span className="track-status-pill physics">G7 ~ G12 貫通</span>
            </div>
            <p className="eyebrow">PHYSICS · 108 CURRICULUM</p>
            <h2>物理 (國中理化 + 高中)</h2>
            <p className="track-desc">
              國中聲光力電 + 高中力學熱學波動電磁近代物理 30 單元。5 大動態實驗室、19 組 3 秒破題訊號卡與會考/學測/分科模考。
            </p>
            <div className="track-highlight-badges">
              <span>🚀 斜向拋體</span>
              <span>⏱️ SHM 能量</span>
              <span>🌈 司乃耳折射</span>
              <span>⚡ 3秒破題訊號</span>
            </div>
            <div className="track-user-progress">
              <span>進度：已解 <strong>{physicsDoneCount}</strong> 題 · 累積 <strong>{physicsProgress.xp} XP</strong></span>
            </div>
            <b className="launch-action physics-action">進入物理學習 →</b>
          </button>

          {/* 4. 🧪 臺灣 108 課綱化學 (國中+高中) */}
          <button
            type="button"
            className="hub-card chemistry-track-card"
            onClick={() => onChoose('chemistry')}
          >
            <div className="hub-card-header">
              <div className="hub-card-mark chemistry-mark">🧪</div>
              <span className="track-status-pill chemistry">G7 ~ G12 貫通</span>
            </div>
            <p className="eyebrow">CHEMISTRY · 108 CURRICULUM</p>
            <h2>化學 (國中理化 + 高中)</h2>
            <p className="track-desc">
              國中水溶液酸鹼有機 + 高中物質構造平衡電化學有機 26 單元。元素週期表探測器、VSEPR 分子幾何、滴定曲線與破題卡。
            </p>
            <div className="track-highlight-badges">
              <span>🔬 週期表探測</span>
              <span>📐 VSEPR 幾何</span>
              <span>🧪 酸鹼滴定</span>
              <span>🎈 理想氣體</span>
            </div>
            <div className="track-user-progress">
              <span>進度：已解 <strong>{chemistryDoneCount}</strong> 題 · 累積 <strong>{chemistryProgress.xp} XP</strong></span>
            </div>
            <b className="launch-action chemistry-action">進入化學學習 →</b>
          </button>

          {/* 5. あおば日本語 */}
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

          {/* 6. TOEIC 多益英語 */}
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

      {/* 跨學科關聯知識圖譜與協同加速 (Cross-Disciplinary Synergy) */}
      <section className="hub-section-block" aria-labelledby="synergy-title">
        <div className="section-header-row">
          <h2 id="synergy-title">跨學科知識圖譜與協同加速</h2>
          <span className="section-subtext">CROSS-DISCIPLINARY COGNITIVE GRAPH</span>
        </div>
        <div
          className="synergy-cards-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '0.65rem',
          }}
        >
          <div
            className="synergy-card"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              minWidth: 0,
              overflowWrap: 'break-word',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.2rem' }}>∫ ⟷ ⚛️</span>
              <strong style={{ fontSize: '0.85rem' }}>微積分 ⟷ 物理運動學與力學能</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.4 }}>
              微分求切線斜率對應瞬時速度與加速度；定積分黎曼和對應曲線下面積（位移與做功）。
            </p>
            <div style={{ display: 'flex', gap: '0.3rem', marginTop: 'auto', paddingTop: '0.3rem' }}>
              <button
                type="button"
                className="pill-btn"
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                onClick={() => onChoose('calculus')}
              >
                前往微積分
              </button>
              <button
                type="button"
                className="pill-btn"
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                onClick={() => onChoose('physics')}
              >
                前往物理
              </button>
            </div>
          </div>

          <div
            className="synergy-card"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              minWidth: 0,
              overflowWrap: 'break-word',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⚛️ ⟷ 🧪</span>
              <strong style={{ fontSize: '0.85rem' }}>物理氣體動力論 ⟷ 化學理想氣體</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.4 }}>
              微觀粒子均方根速率與動能守恆，對應巨觀理想氣體狀態方程式 PV = nRT 與壓強模擬。
            </p>
            <div style={{ display: 'flex', gap: '0.3rem', marginTop: 'auto', paddingTop: '0.3rem' }}>
              <button
                type="button"
                className="pill-btn"
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                onClick={() => onChoose('physics')}
              >
                前往物理實驗室
              </button>
              <button
                type="button"
                className="pill-btn"
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                onClick={() => onChoose('chemistry')}
              >
                前往化學實驗室
              </button>
            </div>
          </div>

          <div
            className="synergy-card"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              minWidth: 0,
              overflowWrap: 'break-word',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📐 ⟷ ⚛️</span>
              <strong style={{ fontSize: '0.85rem' }}>數學三角函數 ⟷ 物理 SHM 與波動</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.4 }}>
              單位圓旋轉正弦投影對應簡諧運動位移與速度公式 x = A·sin(ωt)。
            </p>
            <div style={{ display: 'flex', gap: '0.3rem', marginTop: 'auto', paddingTop: '0.3rem' }}>
              <button
                type="button"
                className="pill-btn"
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                onClick={() => onChoose('math')}
              >
                前往數學
              </button>
              <button
                type="button"
                className="pill-btn"
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                onClick={() => onChoose('physics')}
              >
                前往簡諧實驗室
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 六軌多維能力戰力雷達 */}
      <section className="hub-section-block" aria-labelledby="radar-title">
        <div className="section-header-row">
          <h2 id="radar-title">六大軌道能力與知識雷達</h2>
          <div className="radar-tab-switcher">
            <button
              type="button"
              className={`radar-tab-btn ${activeRadarTab === 'math' ? 'active' : ''}`}
              onClick={() => setActiveRadarTab('math')}
            >
              ∑ 數學
            </button>
            <button
              type="button"
              className={`radar-tab-btn ${activeRadarTab === 'calculus' ? 'active' : ''}`}
              onClick={() => setActiveRadarTab('calculus')}
            >
              ∫ 微積分
            </button>
            <button
              type="button"
              className={`radar-tab-btn ${activeRadarTab === 'physics' ? 'active' : ''}`}
              onClick={() => setActiveRadarTab('physics')}
            >
              ⚛️ 物理
            </button>
            <button
              type="button"
              className={`radar-tab-btn ${activeRadarTab === 'chemistry' ? 'active' : ''}`}
              onClick={() => setActiveRadarTab('chemistry')}
            >
              🧪 化學
            </button>
            <button
              type="button"
              className={`radar-tab-btn ${activeRadarTab === 'ja' ? 'active' : ''}`}
              onClick={() => setActiveRadarTab('ja')}
            >
              あ 日語
            </button>
            <button
              type="button"
              className={`radar-tab-btn ${activeRadarTab === 'en' ? 'active' : ''}`}
              onClick={() => setActiveRadarTab('en')}
            >
              T 英語
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
                  : activeRadarTab === 'calculus'
                    ? `系統分析您的微積分認知模型，建議前往「${activeRadar.weakestDimension.label}」透過幾何反應式畫布與步驟推導解題器深化理解。`
                    : activeRadarTab === 'physics'
                      ? `系統分析您的物理力學與自然現象認知，建議前往「${activeRadar.weakestDimension.label}」透過動態實驗室與 3 秒破題卡深化理解。`
                      : activeRadarTab === 'chemistry'
                        ? `系統分析您的化學分子與反應計量概念，建議前往「${activeRadar.weakestDimension.label}」透過 VSEPR 幾何與滴定曲線強化掌握。`
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
              啟動{activeRadarTab === 'math' ? '臺灣數學' : activeRadarTab === 'calculus' ? '微積分專題' : activeRadarTab === 'physics' ? '臺灣物理' : activeRadarTab === 'chemistry' ? '臺灣化學' : activeRadarTab === 'ja' ? 'あおば日語' : '多益英語'}專屬特訓 →
            </button>
          </div>
        </div>
      </section>

      {/* 微認證勳章展覽室 */}
      <section className="hub-section-block" aria-labelledby="badges-title">
        <div className="section-header-row">
          <h2 id="badges-title">微認證與成就勳章</h2>
          <span className="section-subtext">18 MICRO-CREDENTIALS</span>
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

      {/* 資料備份與控制 */}
      <DataControls />

      {/* 頁尾資訊 */}
      <footer className="hub-footer">
        <a
          href="https://github.com/SamHuang68/E-Learning"
          className="hub-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub 專案開源庫 ↗
        </a>
        <button type="button" className="hub-link" onClick={onOpenPrivacy}>
          隱私與資料說明
        </button>
        <span>MIT License · Sam Huang</span>
      </footer>
    </main>
  )
}
