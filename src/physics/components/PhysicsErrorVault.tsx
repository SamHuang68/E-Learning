import { useI18n } from '../../i18n/i18n'
/**
 * 臺灣 108 課綱物理 · 錯題弱點診斷與實驗室直通筆記本 (Physics Error Vault & Lab Teleportation)
 *
 * 核心升級：
 * 1. 雙軌全域題庫檢索池：全面納入單元練習題庫 (G7~G12) 與大考模擬試卷題庫 (會考 CAP / 學測 GSAT / 分科 AST)。
 * 2. 動態實驗室智慧導航：自動識別題目領域並掛載「🔬 立即前往關聯動態實驗室」按鈕，直通 5 大物理實驗室。
 * 3. 5 大維度步驟深度診斷：整合「3 秒破題訊號」、「關鍵物理公式」、「嚴密推導步驟」、「易錯盲點警示」與「選項逐項辨析」。
 * 4. 零溢出與平滑滾動：KaTeX 數學算式具備平滑滾動保護，卡片極致緊湊排版，手機端 0 橫向溢出。
 */

import React, { useState, useMemo, useEffect, useRef, useId } from 'react'
import {
  getAllPhysicsUnits,
  type PhysicsQuestion,
  PHYSICS_STRAND_NAMES,
} from '../data/curriculum'
import { PHYSICS_MOCK_EXAMS } from '../data/mockExams'
import { PHYSICS_SOLVING_SIGNALS } from '../data/solvingSignals'
import { MathFormula } from '../../math/components/MathFormula'
import { exportErrorVaultToAnki } from '../../utils/ankiExporter'
import type { UiLocale } from '../../i18n/locale'
import {
  localizePhysicsMockExam,
  localizePhysicsQuestion,
  localizePhysicsSignal,
  localizePhysicsUnit,
} from '../locale/content'
import {
  resolvePhysicsLab,
  type PhysicsLabMatch,
} from './physicsErrorVaultLabResolver'

const PHYSICS_STRAND_EN: Record<PhysicsQuestion['strand'], string> = {
  mechanics: 'Mechanics, motion, and energy',
  thermodynamics: 'Thermodynamics and molecular motion',
  waves_optics: 'Waves and geometric optics',
  electromagnetism: 'Electromagnetism and circuits',
  modern: 'Modern and atomic physics',
}

const PHYSICS_LAB_EN: Readonly<Record<string, string>> = {
  '斜向拋體運動實驗室': 'Projectile-motion lab',
  '拋體運動學': 'Projectile kinematics',
  '調控初速、發射仰角與重力加速度，即時觀測拋物線軌跡與水平射程。':
    'Adjust launch speed, angle, and gravitational acceleration to observe the trajectory and horizontal range.',
  '簡諧運動與單擺實驗室': 'Simple-harmonic-motion and pendulum lab',
  '簡諧與力學能守恆': 'Simple harmonic motion and mechanical-energy conservation',
  '調節擺長、振幅與彈性係數，動態剖析速度、加速度與動能位能週期性轉化。':
    'Adjust pendulum length, amplitude, and spring constant to examine periodic changes in speed, acceleration, kinetic energy, and potential energy.',
  '司乃耳折射與透鏡光學實驗室': 'Snell refraction and lens-optics lab',
  '幾何光學與全反射': 'Geometric optics and total internal reflection',
  '連續變換入射角與介質折射率，實測司乃耳定律、全反射臨界角與透鏡成像規律。':
    'Vary the incident angle and refractive indices to test Snell\'s law, the critical angle, and lens imaging.',
  '直流電路歐姆定律實驗室': 'DC-circuit and Ohm\'s-law lab',
  '電路分析與歐姆定律': 'Circuit analysis and Ohm\'s law',
  '自由配置電源電壓與電阻串並聯拓撲，即時模擬迴路電流、分壓與電功率消耗。':
    'Configure source voltage and series or parallel resistors to simulate loop current, voltage division, and power.',
  '阿基米德浮力與密度實驗室': 'Archimedes buoyancy and density lab',
  '流體靜力與浮力': 'Fluid statics and buoyancy',
  '沉浸式測試固體在不同液體密度下的排開體積、浮力大小與秤重視重變化。':
    'Test displaced volume, buoyant force, and apparent weight for solids in liquids of different densities.',
  '力學動態模擬': 'Interactive mechanics simulation',
  '透過動態畫布模擬物體受力與運動軌跡。':
    'Use an interactive canvas to simulate forces and motion trajectories.',
}

function localizePhysicsLab(lab: PhysicsLabMatch, locale: UiLocale): PhysicsLabMatch {
  if (locale !== 'en') return lab
  const name = PHYSICS_LAB_EN[lab.name]
  const badge = PHYSICS_LAB_EN[lab.badge]
  const description = PHYSICS_LAB_EN[lab.description]
  if (!name || !badge || !description) {
    throw new Error(`Missing physics error-vault lab copy: ${lab.id}`)
  }
  return { ...lab, name, badge, description }
}

export type PhysicsErrorVaultProps = {
  /** 答錯題目 ID 清單 (自 LocalStorage progress 載入) */
  errorQuestionIds: string[]
  /** 標記已掌握並自錯題本中移除之回呼函式 */
  onRemoveError: (qId: string) => void
  /** 前往關聯物理互動實驗室之導航回呼函式 */
  onOpenLab?: (labId: string) => void
}

/** 擴充之錯題項目結構 */
export interface EnrichedPhysicsError {
  question: PhysicsQuestion
  sourceType: 'unit' | 'mock'
  sourceLabel: string
  strandName: string
  matchedLab?: PhysicsLabMatch
}

/**
 * 取得與題目最匹配的 3 秒破題訊號資料
 */
function findMatchingSignal(q: PhysicsQuestion, locale: UiLocale) {
  const text = `${q.title} ${q.question} ${q.solution}`.toLowerCase()
  const signals = PHYSICS_SOLVING_SIGNALS.map((signal) =>
    localizePhysicsSignal(signal, locale),
  )

  if (locale === 'en') {
    const stopWords = new Set([
      'about', 'after', 'also', 'been', 'before', 'between', 'choose', 'does',
      'each', 'find', 'from', 'given', 'into', 'more', 'object', 'question',
      'should', 'than', 'that', 'their', 'then', 'there', 'these', 'they',
      'this', 'through', 'using', 'what', 'when', 'where', 'which', 'with',
    ])
    const tokens = (value: string) =>
      value
        .toLowerCase()
        .replace(/\\[a-z]+/g, ' ')
        .replace(/[^a-z0-9]+/g, ' ')
        .split(/\s+/)
        .filter((token) => token.length >= 4 && !stopWords.has(token))

    const questionTokens = new Set(tokens(text))
    const ranked = signals
      .map((signal) => {
        const signalTokens = new Set(tokens(`${signal.topic} ${signal.problemSignal}`))
        const overlap = [...signalTokens].filter((token) => questionTokens.has(token)).length
        return { signal, overlap }
      })
      .sort((left, right) => right.overlap - left.overlap)

    return ranked[0]?.overlap >= 3 ? ranked[0].signal : undefined
  }

  return (
    signals.find((s) => {
      const topicLower = s.topic.toLowerCase()
      const signalLower = s.problemSignal.toLowerCase()
      return (
        (s.strand === q.strand && text.includes(topicLower.slice(0, 4))) ||
        signalLower.split(' ').some((kw) => kw.length > 2 && text.includes(kw))
      )
    }) ||
    signals.find((s) => s.strand === q.strand)
  )
}


/**
 * 物理弱點錯題筆記本元件
 */
export const PhysicsErrorVault: React.FC<PhysicsErrorVaultProps> = ({
  errorQuestionIds,
  onRemoveError,
  onOpenLab,
}) => {
  const { t, locale } = useI18n()
  // 狀態：展開步驟診斷的卡片 ID 集合
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({})
  // 狀態：領域篩選
  const [selectedStrand, setSelectedStrand] = useState<string>('all')
  // 狀態：來源篩選 (全部 / 單元練習 / 模擬試卷)
  const [selectedSource, setSelectedSource] = useState<string>('all')
  // 狀態：關鍵字搜尋
  const [searchQuery, setSearchQuery] = useState<string>('')
  // 狀態：難度篩選
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const searchRef = useRef<HTMLInputElement>(null)
  const emptyTitleRef = useRef<HTMLHeadingElement>(null)
  const pendingRemoval = useRef<{ id: string; title: string } | null>(null)
  const [removedQuestion, setRemovedQuestion] = useState<{ id: string; title: string } | null>(null)
  const stepsIdPrefix = useId()

  useEffect(() => {
    const pending = pendingRemoval.current
    if (!pending || errorQuestionIds.includes(pending.id)) return
    pendingRemoval.current = null
    setRemovedQuestion(pending)
    // Only announce and restore focus once the parent confirms the removal.
    const focusTarget = searchRef.current ?? emptyTitleRef.current
    focusTarget?.focus()
  }, [errorQuestionIds])

  function removeQuestion(question: { id: string; title: string }) {
    pendingRemoval.current = { id: question.id, title: question.title }
    onRemoveError(question.id)
  }

  const removedTitle = removedQuestion?.title ?? ''
  const removalNotice = removedQuestion === null ? '' : locale === 'en'
    ? `Removed “${removedTitle}” from the error notebook. ${errorQuestionIds.length} items remain.`
    : `已將「${removedTitle}」移出錯題本，還有 ${errorQuestionIds.length} 題待複習。`
  const removalStatus = <div className="vault-removal-status" role="status" aria-atomic="true" style={{ overflowWrap: 'anywhere' }}>{removalNotice}</div>

  // 1. 建立全域雙軌題庫檢索池 (單元題庫 + 模擬考題庫)
  const allEnrichedQuestionsMap = useMemo(() => {
    const map = new Map<string, EnrichedPhysicsError>()

    // (A) 單元練習題庫 (G7~G12 所有單元)
    const allUnits = getAllPhysicsUnits()
    allUnits.forEach((unit) => {
      const displayUnit = localizePhysicsUnit(unit, locale)
      unit.questions.forEach((q) => {
        const labInfo = resolvePhysicsLab(q, unit.suggestedLab)
        map.set(q.id, {
          question: localizePhysicsQuestion(q, locale),
          sourceType: 'unit',
          sourceLabel: `${displayUnit.band} · ${locale === 'en' ? 'Unit' : '單元'} ${displayUnit.id}: ${displayUnit.title}`,
          strandName:
            locale === 'en'
              ? PHYSICS_STRAND_EN[q.strand]
              : PHYSICS_STRAND_NAMES[q.strand] || q.strand,
          matchedLab: labInfo ? localizePhysicsLab(labInfo, locale) : undefined,

        })
      })
    })

    // (B) 大考模擬試卷題庫 (CAP / GSAT / AST)
    Object.values(PHYSICS_MOCK_EXAMS).forEach((exam) => {
      const displayExam = localizePhysicsMockExam(exam, locale)
      exam.questions.forEach((q) => {
        const labInfo = resolvePhysicsLab(q)
        map.set(q.id, {
          question: localizePhysicsQuestion(q, locale),
          sourceType: 'mock',
          sourceLabel: `${displayExam.title} (${displayExam.targetExam})`,
          strandName:
            locale === 'en'
              ? PHYSICS_STRAND_EN[q.strand]
              : PHYSICS_STRAND_NAMES[q.strand] || q.strand,
          matchedLab: labInfo ? localizePhysicsLab(labInfo, locale) : undefined,

        })
      })
    })

    return map
  }, [locale])

  // 2. 檢索出所有待複習錯題（具備未知 ID 容錯機制）
  const errorQuestions = useMemo(() => {
    return errorQuestionIds
      .map((id) => {
        const enriched = allEnrichedQuestionsMap.get(id)
        if (enriched) return enriched

        // 容錯備援：若 ID 未能在標準池中找到，動態建構基礎物件避免渲染中斷
        const fallbackQ: PhysicsQuestion = {
          id,
          title: locale === 'en' ? `Advanced physics review item (${id})` : `物理進階複習題目 (${id})`,

          strand: 'mechanics',
          type: 'choice',
          difficulty: 3,
          question: locale === 'en'
            ? 'This saved review item could not be found in the current bank. Review the derivation and revisit the underlying concept.'
            : '本題為歷次練習之重點錯題，請檢視推導公式並重溫基礎觀念。',
          answer: 0,
          solution: locale === 'en'
            ? 'Review Newton\'s laws, conservation of energy, and the basic electromagnetic relationships before deriving an answer.'
            : '請回顧牛頓運動定律、能量守恆與電磁基本關係式進行推導。',
        }
        return {
          question: fallbackQ,
          sourceType: 'unit' as const,
          sourceLabel: locale === 'en' ? 'Physics review bank' : '物理綜合強化題庫',
          strandName: locale === 'en' ? 'Mechanics (review)' : '力學 (綜合強化)',
          matchedLab: undefined,

        }
      })
      .filter(Boolean)
  }, [errorQuestionIds, allEnrichedQuestionsMap, locale])

  // 3. 依據篩選條件過濾錯題列表
  const filteredQuestions = useMemo(() => {
    return errorQuestions.filter((item) => {
      const q = item.question

      // 領域篩選
      if (selectedStrand !== 'all' && q.strand !== selectedStrand) {
        return false
      }

      // 來源篩選
      if (selectedSource !== 'all' && item.sourceType !== selectedSource) {
        return false
      }

      // 難度篩選
      if (selectedDifficulty !== 'all' && q.difficulty !== Number(selectedDifficulty)) {
        return false
      }

      // 關鍵字搜尋
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase()
        const matchTitle = q.title.toLowerCase().includes(query)
        const matchBody = q.question.toLowerCase().includes(query)
        const matchSol = q.solution.toLowerCase().includes(query)
        const matchSource = item.sourceLabel.toLowerCase().includes(query)
        if (!matchTitle && !matchBody && !matchSol && !matchSource) {
          return false
        }
      }

      return true
    })
  }, [errorQuestions, selectedStrand, selectedSource, selectedDifficulty, searchQuery])

  // 展開 / 收起指定題目步驟拆解
  function toggleStep(qId: string) {
    setExpandedSteps((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }))
  }

  // 一鍵展開 / 收起全部步驟拆解
  function toggleAllSteps(expand: boolean) {
    const next: Record<string, boolean> = {}
    filteredQuestions.forEach((item) => {
      next[item.question.id] = expand
    })
    setExpandedSteps(next)
  }

  // 空狀態呈現
  if (errorQuestions.length === 0) {
    return (
      <div className="practice-card compact-vault-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
        {removalStatus}
        <div style={{ fontSize: '2.8rem', marginBottom: '0.6rem' }}>🎉</div>
        <h3 ref={emptyTitleRef} tabIndex={-1} style={{ margin: '0 0 0.4rem', color: '#0369a1' }}>{t('vault.physicsEmptyTitle')}</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.86rem', maxWidth: '460px', margin: '0 auto' }}>
          {t('vault.physicsEmptyBody')}
        </p>

      </div>
    )
  }

  const allExpanded = filteredQuestions.length > 0 && filteredQuestions.every((item) => expandedSteps[item.question.id])

  return (
    <div className="error-vault-container physics-error-vault">
      {removalStatus}
      {/* 頂部弱點統計數據看板 */}
      <div className="vault-stats-grid">
        <div className="vault-stat-card">
          <span className="vault-stat-icon">📖</span>
          <div className="vault-stat-meta">
            <span className="vault-stat-label">{t('vault.openTotal')}</span>
            <span className="vault-stat-value">{t('vault.itemsCount', { count: errorQuestions.length })}</span>

          </div>
        </div>

        <div className="vault-stat-card">
          <span className="vault-stat-icon">🚀</span>
          <div className="vault-stat-meta">
            <span className="vault-stat-label">{t('vault.labsAvailable')}</span>
            <span className="vault-stat-value">{t('vault.dynamicLabsCount', { count: 5 })}</span>

          </div>
        </div>

        <div className="vault-stat-card">
          <span className="vault-stat-icon">🎯</span>
          <div className="vault-stat-meta">
            <span className="vault-stat-label">{t('vault.filteredCount')}</span>
            <span className="vault-stat-value">{t('vault.itemsCount', { count: filteredQuestions.length })}</span>

          </div>
        </div>
      </div>

      {/* 篩選與搜尋工具列 */}
      <div className="vault-toolbar">
        <div className="vault-toolbar-row">
          <input
            ref={searchRef}
            type="search"
            className="vault-search-input"
            aria-label={t('vault.physicsSearchAria')}
            placeholder={t('vault.physicsSearchPlaceholder')}

            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="vault-select-filter"
            aria-label={t('vault.sourceFilterAria')}

            id="physics-vault-source"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            <option value="all">{t('vault.sourceAll')}</option>
            <option value="unit">{t('vault.sourceUnit')}</option>
            <option value="mock">{t('vault.sourceMock')}</option>

          </select>

          <select
            className="vault-select-filter"
            aria-label={t('vault.difficultyFilterAria')}

            id="physics-vault-difficulty"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="all">{t('vault.difficultyAll')}</option>
            <option value="1">{t('vault.difficulty1')}</option>
            <option value="2">{t('vault.difficulty2')}</option>
            <option value="3">{t('vault.difficulty3')}</option>
            <option value="4">{t('vault.difficulty4')}</option>
            <option value="5">{t('vault.difficulty5')}</option>

          </select>

          <button
            type="button"
            className="vault-chip-btn"
            style={{ marginLeft: 'auto', background: 'var(--surface-soft)' }}
            onClick={() => toggleAllSteps(!allExpanded)}
          >
            {allExpanded ? t('vault.collapseAll') : t('vault.expandAll')}

          </button>

          <button
            type="button"
            className="vault-chip-btn"
            style={{ background: 'rgba(37, 99, 235, 0.12)', color: '#2563eb', borderColor: '#2563eb' }}
            onClick={() => exportErrorVaultToAnki(t('vault.physicsTrack'), filteredQuestions.map((q) => q.question))}
            title={t('vault.exportCurrentTitle')}
          >
            {t('vault.exportCurrent')}

          </button>
        </div>

        {/* 主軸領域快速篩選 Chips */}
        <div className="vault-chips-row">
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'all' ? 'active' : ''}`}
            aria-pressed={selectedStrand === 'all'}
            onClick={() => setSelectedStrand('all')}
          >
            {t('vault.allStrands', { count: errorQuestions.length })}

          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'mechanics' ? 'active' : ''}`}
            aria-pressed={selectedStrand === 'mechanics'}
            onClick={() => setSelectedStrand('mechanics')}
          >
            ⚙️ {locale === 'en' ? PHYSICS_STRAND_EN.mechanics : '力學運動與能量'} ({errorQuestions.filter((q) => q.question.strand === 'mechanics').length})

          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'thermodynamics' ? 'active' : ''}`}
            aria-pressed={selectedStrand === 'thermodynamics'}
            onClick={() => setSelectedStrand('thermodynamics')}
          >
            🔥 {locale === 'en' ? PHYSICS_STRAND_EN.thermodynamics : '熱學與分子動力'} ({errorQuestions.filter((q) => q.question.strand === 'thermodynamics').length})

          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'waves_optics' ? 'active' : ''}`}
            aria-pressed={selectedStrand === 'waves_optics'}
            onClick={() => setSelectedStrand('waves_optics')}
          >
            🌈 {locale === 'en' ? PHYSICS_STRAND_EN.waves_optics : '波動與幾何光學'} ({errorQuestions.filter((q) => q.question.strand === 'waves_optics').length})

          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'electromagnetism' ? 'active' : ''}`}
            aria-pressed={selectedStrand === 'electromagnetism'}
            onClick={() => setSelectedStrand('electromagnetism')}
          >
            ⚡ {locale === 'en' ? PHYSICS_STRAND_EN.electromagnetism : '電磁學與電路'} ({errorQuestions.filter((q) => q.question.strand === 'electromagnetism').length})

          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'modern' ? 'active' : ''}`}
            aria-pressed={selectedStrand === 'modern'}
            onClick={() => setSelectedStrand('modern')}
          >
            ⚛️ {locale === 'en' ? PHYSICS_STRAND_EN.modern : '近代物理與原子'} ({errorQuestions.filter((q) => q.question.strand === 'modern').length})

          </button>
        </div>
      </div>

      {/* 錯題卡片清單 */}
      {filteredQuestions.length === 0 ? (
        <div className="practice-card" style={{ textAlign: 'center', padding: '1.75rem' }}>
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.86rem' }}>
            {t('vault.noFilterMatches')}
          </p>

        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {filteredQuestions.map((item, index) => {
            const q = item.question
            const isStepOpen = Boolean(expandedSteps[q.id])
            const stepsId = `${stepsIdPrefix}-${index}`
            const matchedSignal = findMatchingSignal(q, locale)

            const lab = item.matchedLab

            return (
              <article key={q.id} className="vault-card-item">
                {/* 頂部標籤與掌握移出按鈕 */}
                <div className="vault-card-header">
                  <div className="vault-tag-group">
                    <span className="vault-source-badge">{item.sourceLabel}</span>
                    <span className="vault-strand-badge">{item.strandName}</span>
                    <span className="vault-diff-stars">{'★'.repeat(q.difficulty)}</span>
                  </div>

                  <button
                    type="button"
                    className="vault-btn-mastered"
                    title={t('vault.removeTitle')}
                    onClick={() => removeQuestion(item.question)}
                  >
                    {t('vault.remove')}

                  </button>
                </div>

                {/* 題目內文 */}
                <div className="vault-question-content">
                  <h4 className="vault-question-title">{q.title}</h4>
                  <div className="vault-question-text katex-scroll-protection">
                    <MathFormula math={q.question} />
                  </div>

                  {/* 選項列表 (若為單選/多選題) */}
                  {q.options && q.options.length > 0 && (
                    <div className="vault-options-list">
                      {q.options.map((opt, optIdx) => {
                        const optLetter = String.fromCharCode(65 + optIdx)
                        const isCorrectOption =
                          (typeof q.answer === 'number' && q.answer === optIdx) ||
                          (typeof q.answer === 'string' &&
                            q.answer.trim().toUpperCase() === optLetter) ||
                          (Array.isArray(q.answer) &&
                            ((q.answer as unknown[]).includes(optIdx) ||
                              (q.answer as unknown[]).includes(optLetter)))

                        return (
                          <div
                            key={optIdx}
                            className={`vault-option-item ${isCorrectOption ? 'correct' : ''}`}
                          >
                            <span style={{ fontWeight: 800 }}>{optLetter}.</span>
                            <div className="katex-scroll-protection" style={{ flex: 1 }}>
                              <MathFormula math={opt.replace(/^[A-D]\.\s*/, '')} />
                            </div>
                            {isCorrectOption && <span style={{ marginLeft: 'auto' }}>{t('vault.correctOption')}</span>}

                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* 正確解析與公式推導區 */}
                <div className="vault-solution-wrapper">
                  <div className="vault-solution-header">
                    <span className="vault-solution-title">{t('vault.physicsSolution')}</span>

                    <button
                      type="button"
                      className="vault-toggle-steps-btn"
                      aria-expanded={isStepOpen}
                      aria-controls={isStepOpen ? stepsId : undefined}
                      onClick={() => toggleStep(q.id)}
                    >
                      {isStepOpen ? t('vault.collapseDetails') : t('vault.expandDetails')}

                    </button>
                  </div>

                  <div className="vault-solution-body katex-scroll-protection">
                    <MathFormula math={q.solution} />
                  </div>

                  {/* 5 步驟深度拆解面板 (展開時可視) */}
                  {isStepOpen && (
                    <div id={stepsId} className="vault-steps-accordion">
                      {/* Step 1: 核心破題訊號 */}
                      <div className="vault-step-card">
                        <div className="vault-step-title-line">
                          <span className="vault-step-num">1</span>
                          <span>{t('vault.stepDiagnosis')}</span>

                        </div>
                        <div className="vault-step-content-text">
                          {matchedSignal ? (
                            <p style={{ margin: 0, color: '#0369a1', fontWeight: 600 }}>
                              {t('vault.cue')} {matchedSignal.problemSignal} ➜{' '}
                              <span style={{ color: '#0284c7' }}>{matchedSignal.threeSecondRule}</span>
                            </p>
                          ) : (
                            <p style={{ margin: 0 }}>
                              <MathFormula math={q.hint || t('vault.physicsDiagnosisDefault', { strand: item.strandName })} />

                            </p>
                          )}
                        </div>
                      </div>

                      {/* Step 2: 關鍵公式建構 */}
                      <div className="vault-step-card">
                        <div className="vault-step-title-line">
                          <span className="vault-step-num">2</span>
                          <span>{t('vault.physicsFormulaStep')}</span>

                        </div>
                        <div className="vault-step-content-text katex-scroll-protection">
                          {matchedSignal?.firstStepFormula ? (
                            <MathFormula math={`$$${matchedSignal.firstStepFormula}$$`} block />
                          ) : (
                            <MathFormula math={t('vault.physicsFormulaDefault')} />

                          )}
                        </div>
                      </div>

                      {/* Step 3: 詳細數值計算與推導 */}
                      <div className="vault-step-card">
                        <div className="vault-step-title-line">
                          <span className="vault-step-num">3</span>
                          <span>{t('vault.physicsDerivationStep')}</span>

                        </div>
                        <div className="vault-step-content-text katex-scroll-protection">
                          <MathFormula math={q.solution} />
                        </div>
                      </div>

                      {/* Step 4: 易錯盲點警示 */}
                      <div className="vault-step-card">
                        <div className="vault-step-title-line">
                          <span className="vault-step-num">4</span>
                          <span>{t('vault.physicsPitfallStep')}</span>
                        </div>
                        <div className="vault-pitfall-box">
                          {q.hint ? (
                            <div><strong>{t('vault.warning')}</strong>{q.hint}</div>
                          ) : (
                            <MathFormula math={t('vault.physicsPitfallDefault')} />

                          )}
                        </div>
                      </div>

                      {/* Step 5: 核心素養表現 */}
                      {q.competency && (
                        <div className="vault-step-card">
                          <div className="vault-step-title-line">
                            <span className="vault-step-num">5</span>
                            <span>{t('vault.competency')}</span>

                          </div>
                          <div className="vault-step-content-text" style={{ color: 'var(--muted)' }}>
                            {q.competency}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 底部：動態關聯實驗室直通按鈕 */}
                {lab && (
                  <div className="vault-teleport-footer">
                    <div className="vault-teleport-hint">
                      <span>{t('vault.physicsLabHint')}</span>
                    </div>

                    <button
                      type="button"
                      className="vault-lab-teleport-btn"
                      onClick={() => onOpenLab?.(lab.id)}
                      disabled={!onOpenLab}
                    >
                      <span>{t('vault.openLab', { icon: lab.icon, name: lab.name })}</span>
                    </button>
                  </div>
                )}

              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

