/**
 * 臺灣 108 課綱化學 · 錯題弱點診斷與實驗室直通筆記本 (Chemistry Error Vault & Lab Teleportation)
 *
 * 核心升級：
 * 1. 雙軌全域題庫檢索池：全面納入單元練習題庫 (G7~G12) 與大考模擬試卷題庫 (會考 CAP / 學測 GSAT / 分科 AST)。
 * 2. 動態實驗室導航：僅依明確題目契約掛載「🔬 立即前往關聯動態實驗室」按鈕，直通 5 大化學實驗室。
 * 3. 5 大維度步驟深度診斷：整合「3 秒破題訊號」、「關鍵反應方程式與定量公式」、「嚴密推導步驟」、「易錯盲點警示」與「選項逐項辨析」。
 * 4. 零溢出與平滑滾動：KaTeX 化學與數學算式具備平滑滾動保護，卡片極致緊湊排版，手機端 0 橫向溢出。
 */

import React, { useState, useMemo, useEffect, useRef, useId } from 'react'
import {
  getAllChemistryUnits,
  chemistryStrandMessageKey,
  type ChemistryQuestion,
} from '../data/curriculum'
import { CHEMISTRY_MOCK_EXAMS } from '../data/mockExams'
import { MathFormula } from '../../math/components/MathFormula'
import { exportErrorVaultToAnki } from '../../utils/ankiExporter'
import { useI18n } from '../../i18n/i18n'
import type { UiLocale } from '../../i18n/locale'
import {
  localizeChemistryMockExam,
  localizeChemistryUnit,
} from '../locale/content'
import {
  resolveChemistryLab,
  type ChemistryLabDefinition,
} from './chemistryErrorVaultLabResolver'
import { findMatchingChemistrySignal } from './chemistryErrorVaultSignalMatcher'

const CHEMISTRY_LAB_EN: Readonly<Record<string, string>> = {
  '酸鹼滴定與 pH 曲線實驗室': 'Acid-base titration and pH-curve lab',
  '酸鹼中和與滴定曲線': 'Acid-base neutralization and titration curves',
  '即時模擬強弱酸鹼滴定過程，觀測指示劑顏色漸變與 pH 突變滴定曲線。':
    'Simulate strong- and weak-acid/base titrations while observing indicator color changes and the sharp pH transition.',
  '元素週期表探測器': 'Interactive periodic-table explorer',
  '元素週期規律性': 'Periodic trends',
  '全景互動探索 1~36 號元素之電子組態、原子半徑、電負度與週期性變化。':
    'Explore electron configurations, atomic radii, electronegativity, and periodic trends for elements 1 through 36.',
  'VSEPR 分子空間幾何實驗室': 'VSEPR molecular-geometry lab',
  '分子幾何與混成軌域': 'Molecular geometry and hybrid orbitals',
  '立體旋轉探索價殼層電子對互斥理論、AXE 型態、混成軌域與空間幾何鍵角。':
    'Rotate models to explore VSEPR theory, AXE notation, hybrid orbitals, molecular shapes, and bond angles.',
  '理想氣體定律 PV=nRT 實驗室': 'Ideal-gas-law PV=nRT lab',
  '氣體狀態與定律': 'Gas states and laws',
  '動態調節容器體積、溫度與氣體莫耳數，即時量測壓力變化並驗證氣體定律。':
    'Adjust volume, temperature, and gas amount to measure pressure changes and test the gas laws.',
  '溶解度與結晶析出實驗室': 'Solubility and crystallization lab',
  '溶液飽和與結晶平衡': 'Solution saturation and crystallization equilibrium',
  '升降溫動態調控水溶液飽和度，計算高低溫溶解度差異與晶體析出量。':
    'Change temperature to control saturation and calculate solubility differences and the mass crystallized.',
  '酸鹼與電化學': 'Acids, bases, and electrochemistry',
  '沉浸式檢驗酸鹼解離與滴定曲線。': 'Explore acid-base dissociation and titration curves.',
  '物質結構與週期表': 'Matter structure and the periodic table',
  '探索元素規律與原子結構。': 'Explore periodic trends and atomic structure.',
  '平衡與動力學': 'Equilibrium and kinetics',
  '動態驗證氣體與平衡定律。': 'Interactively test gas and equilibrium laws.',
  '有機分子立體結構': 'Organic-molecule geometry',
  '觀察有機化合物與碳原子混成幾何。': 'Examine organic compounds and carbon hybridization geometry.',
  '化學反應與計量': 'Chemical reactions and stoichiometry',
  '觀察化學反應物沉澱與析出變化。': 'Observe precipitation and crystallization in chemical reactions.',
}

function localizeChemistryLab(
  lab: ChemistryLabDefinition,
  locale: UiLocale,
): ChemistryLabDefinition {
  if (locale !== 'en') return lab
  const name = CHEMISTRY_LAB_EN[lab.name]
  const badge = CHEMISTRY_LAB_EN[lab.badge]
  const description = CHEMISTRY_LAB_EN[lab.description]
  if (!name || !badge || !description) {
    throw new Error(`Missing chemistry error-vault lab copy: ${lab.id}`)
  }
  return { ...lab, name, badge, description }
}

export type ChemistryErrorVaultProps = {
  /** 答錯題目 ID 清單 (自 LocalStorage progress 載入) */
  errorQuestionIds: string[]
  /** 標記已掌握並自錯題本中移除之回呼函式 */
  onRemoveError: (qId: string) => void
  /** 前往關聯化學互動實驗室之導航回呼函式 */
  onOpenLab?: (labId: string) => void
}

/** 擴充之化學錯題項目結構 */
export interface EnrichedChemistryError {
  question: ChemistryQuestion
  sourceType: 'unit' | 'mock'
  sourceLabel: string
  strandName: string
  matchedLab?: ChemistryLabDefinition
}



/**
 * 化學弱點錯題筆記本元件
 */
export const ChemistryErrorVault: React.FC<ChemistryErrorVaultProps> = ({
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
    const map = new Map<string, EnrichedChemistryError>()

    // (A) 單元練習題庫 (G7~G12 所有單元)
    const allUnits = getAllChemistryUnits()
    allUnits.forEach((rawUnit) => {
      const unit = localizeChemistryUnit(rawUnit, locale)
      unit.questions.forEach((q) => {
        const labInfo = resolveChemistryLab(q)
        map.set(q.id, {
          question: q,
          sourceType: 'unit',
          sourceLabel: `${unit.band} · ${locale === 'en' ? 'Unit' : '單元'} ${unit.id}: ${unit.title}`,

          strandName: t(chemistryStrandMessageKey(q.strand)),
          matchedLab: labInfo,
        })
      })
    })

    // (B) 大考模擬試卷題庫 (CAP / GSAT / AST)
    Object.values(CHEMISTRY_MOCK_EXAMS).forEach((rawExam) => {
      const exam = localizeChemistryMockExam(rawExam, locale)
      exam.questions.forEach((q) => {
        const labInfo = resolveChemistryLab(q)
        map.set(q.id, {
          question: q,
          sourceType: 'mock',
          sourceLabel: locale === 'en' ? `${exam.id.toUpperCase()} mock exam` : `${exam.title} (${exam.targetExam})`,
          strandName: t(chemistryStrandMessageKey(q.strand)),
          matchedLab: labInfo,
        })
      })
    })

    return map
  }, [locale, t])


  // 2. 檢索出所有待複習錯題（具備未知 ID 容錯機制）
  const errorQuestions = useMemo(() => {
    return errorQuestionIds
      .map((id) => {
        const enriched = allEnrichedQuestionsMap.get(id)
        if (enriched) return enriched

        // 容錯備援：若 ID 未能在標準池中找到，動態建構基礎物件避免渲染中斷
        const fallbackQ: ChemistryQuestion = {
          id,
          title: locale === 'en' ? `Advanced chemistry review item (${id})` : `化學進階複習題目 (${id})`,

          strand: 'reactions',
          type: 'choice',
          difficulty: 3,
          question: locale === 'en'
            ? 'Review the governing chemical equation and stoichiometric relationships for this saved item.'
            : '本題為歷次練習之重點錯題，請檢視化學反應式與計量推導。',
          answer: 'A',
          solution: locale === 'en'
            ? 'Balance the chemical equation, conserve amount of substance, and apply the relevant equilibrium definition step by step.'
            : '請回顧化學反應式配平、莫耳數計量守恆與平衡常數定義進行推導。',
        }
        return {
          question: fallbackQ,
          sourceType: 'unit' as const,
          sourceLabel: locale === 'en' ? 'Chemistry review bank' : '化學綜合強化題庫',

          strandName: t(chemistryStrandMessageKey('reactions')),
          matchedLab: resolveChemistryLab(fallbackQ),
        }
      })
      .filter(Boolean)
  }, [errorQuestionIds, allEnrichedQuestionsMap, locale, t])


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
        <h3 ref={emptyTitleRef} tabIndex={-1} style={{ margin: '0 0 0.4rem', color: '#059669' }}>{t('vault.chemistryEmptyTitle')}</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.86rem', maxWidth: '460px', margin: '0 auto' }}>
          {t('vault.chemistryEmptyBody')}
        </p>

      </div>
    )
  }

  const allExpanded = filteredQuestions.length > 0 && filteredQuestions.every((item) => expandedSteps[item.question.id])

  return (
    <div className="error-vault-container chemistry-error-vault">
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
          <span className="vault-stat-icon">🧪</span>
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
            aria-label={t('vault.chemistrySearchAria')}
            placeholder={t('vault.chemistrySearchPlaceholder')}

            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="vault-select-filter"
            aria-label={t('vault.sourceFilterAria')}

            id="chemistry-vault-source"
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

            id="chemistry-vault-difficulty"
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
            style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', borderColor: '#10b981' }}
            onClick={() => exportErrorVaultToAnki(t('vault.chemistryTrack'), filteredQuestions.map((q) => q.question))}
            title={t('vault.exportCurrentTitle')}
          >
            {t('vault.exportCurrent')}

          </button>
        </div>

        {/* 主軸領域快速篩選 Chips */}
        <div className="vault-chips-row">
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'all' ? 'chemistry-active' : ''}`}
            aria-pressed={selectedStrand === 'all'}
            onClick={() => setSelectedStrand('all')}
          >
            {t('vault.allStrands', { count: errorQuestions.length })}

          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'matter_structure' ? 'chemistry-active' : ''}`}
            aria-pressed={selectedStrand === 'matter_structure'}
            onClick={() => setSelectedStrand('matter_structure')}
          >
            🔬 {t(chemistryStrandMessageKey('matter_structure'))} ({errorQuestions.filter((q) => q.question.strand === 'matter_structure').length})
          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'reactions' ? 'chemistry-active' : ''}`}
            aria-pressed={selectedStrand === 'reactions'}
            onClick={() => setSelectedStrand('reactions')}
          >
            🔥 {t(chemistryStrandMessageKey('reactions'))} ({errorQuestions.filter((q) => q.question.strand === 'reactions').length})
          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'equilibrium_kinetics' ? 'chemistry-active' : ''}`}
            aria-pressed={selectedStrand === 'equilibrium_kinetics'}
            onClick={() => setSelectedStrand('equilibrium_kinetics')}
          >
            ⚖️ {t(chemistryStrandMessageKey('equilibrium_kinetics'))} ({errorQuestions.filter((q) => q.question.strand === 'equilibrium_kinetics').length})
          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'electrochemistry' ? 'chemistry-active' : ''}`}
            aria-pressed={selectedStrand === 'electrochemistry'}
            onClick={() => setSelectedStrand('electrochemistry')}
          >
            ⚡ {t(chemistryStrandMessageKey('electrochemistry'))} ({errorQuestions.filter((q) => q.question.strand === 'electrochemistry').length})
          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'organic' ? 'chemistry-active' : ''}`}
            aria-pressed={selectedStrand === 'organic'}
            onClick={() => setSelectedStrand('organic')}
          >
            🌿 {t(chemistryStrandMessageKey('organic'))} ({errorQuestions.filter((q) => q.question.strand === 'organic').length})
          </button>
        </div>
      </div>

      {/* 錯題卡片清單 */}
      {filteredQuestions.length === 0 ? (
        <div className="practice-card" style={{ textAlign: 'center', padding: '1.75rem' }}>
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.86rem' }}>
            {t('vault.chemistryNoFilterMatches')}
          </p>

        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {filteredQuestions.map((item, index) => {
            const q = item.question
            const isStepOpen = Boolean(expandedSteps[q.id])
            const stepsId = `${stepsIdPrefix}-${index}`
            const matchedSignal = findMatchingChemistrySignal(q, locale)

            const lab = item.matchedLab
              ? localizeChemistryLab(item.matchedLab, locale)
              : undefined

            return (
              <article key={q.id} className="vault-card-item">
                {/* 頂部標籤與掌握移出按鈕 */}
                <div className="vault-card-header">
                  <div className="vault-tag-group">
                    <span className="vault-source-badge">{item.sourceLabel}</span>
                    <span className="vault-strand-badge chemistry">{item.strandName}</span>
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
                            (q.answer.trim().toUpperCase() === optLetter ||
                              q.answer.trim() === String(optIdx))) ||
                          (Array.isArray(q.answer) &&
                            ((q.answer as unknown[]).map((a) => String(a).toUpperCase()).includes(optLetter) ||
                              (q.answer as unknown[]).includes(optIdx)))

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
                    <span className="vault-solution-title chemistry">{t('vault.chemistrySolution')}</span>

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
                        <div className="vault-step-title-line chemistry">
                          <span className="vault-step-num chemistry">1</span>
                          <span>{t('vault.stepDiagnosis')}</span>

                        </div>
                        <div className="vault-step-content-text">
                          {matchedSignal ? (
                            <p style={{ margin: 0, color: '#065f46', fontWeight: 600 }}>
                              {t('vault.cue')} {matchedSignal.problemSignal} ➜{' '}
                              <span style={{ color: '#059669' }}>{matchedSignal.threeSecondRule}</span>
                            </p>
                          ) : (
                            <p style={{ margin: 0 }}>
                              <MathFormula math={q.hint || t('vault.chemistryDiagnosisDefault', { strand: item.strandName })} />

                            </p>
                          )}
                        </div>
                      </div>

                      {/* Step 2: 關鍵反應式與定量平衡 */}
                      <div className="vault-step-card">
                        <div className="vault-step-title-line chemistry">
                          <span className="vault-step-num chemistry">2</span>
                          <span>{t('vault.chemistryFormulaStep')}</span>

                        </div>
                        <div className="vault-step-content-text katex-scroll-protection">
                          {matchedSignal?.firstStepFormula ? (
                            <MathFormula math={`$$${matchedSignal.firstStepFormula}$$`} block />
                          ) : (
                            <MathFormula math={t('vault.chemistryFormulaDefault')} />

                          )}
                        </div>
                      </div>

                      {/* Step 3: 詳細化學步驟求解 */}
                      <div className="vault-step-card">
                        <div className="vault-step-title-line chemistry">
                          <span className="vault-step-num chemistry">3</span>
                          <span>{t('vault.chemistryDerivationStep')}</span>

                        </div>
                        <div className="vault-step-content-text katex-scroll-protection">
                          <MathFormula math={q.solution} />
                        </div>
                      </div>

                      {/* Step 4: 易錯盲點警示 */}
                      <div className="vault-step-card">
                        <div className="vault-step-title-line chemistry">
                          <span className="vault-step-num chemistry">4</span>
                          <span>{t('vault.chemistryPitfallStep')}</span>
                        </div>
                        <div className="vault-pitfall-box">
                          {q.hint ? (
                            <div><strong>{t('vault.chemistryWarning')}</strong>{q.hint}</div>
                          ) : (
                            <div>
                              {t('vault.chemistryPitfallDefault')}

                            </div>
                          )}
                        </div>
                      </div>

                      {/* Step 5: 核心素養表現 */}
                      {q.competency && (
                        <div className="vault-step-card">
                          <div className="vault-step-title-line chemistry">
                            <span className="vault-step-num chemistry">5</span>
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
                      <span>{t('vault.chemistryLabHint')}</span>
                    </div>

                    <button
                      type="button"
                      className="vault-lab-teleport-btn chemistry"
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

