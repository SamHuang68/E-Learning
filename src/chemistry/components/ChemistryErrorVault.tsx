/**
 * 臺灣 108 課綱化學 · 錯題弱點診斷與實驗室直通筆記本 (Chemistry Error Vault & Lab Teleportation)
 *
 * 核心升級：
 * 1. 雙軌全域題庫檢索池：全面納入單元練習題庫 (G7~G12) 與大考模擬試卷題庫 (會考 CAP / 學測 GSAT / 分科 AST)。
 * 2. 動態實驗室智慧導航：自動識別題目領域並掛載「🔬 立即前往關聯動態實驗室」按鈕，直通 5 大化學實驗室。
 * 3. 5 大維度步驟深度診斷：整合「3 秒破題訊號」、「關鍵反應方程式與定量公式」、「嚴密推導步驟」、「易錯盲點警示」與「選項逐項辨析」。
 * 4. 零溢出與平滑滾動：KaTeX 化學與數學算式具備平滑滾動保護，卡片極致緊湊排版，手機端 0 橫向溢出。
 */

import React, { useState, useMemo } from 'react'
import {
  getAllChemistryUnits,
  type ChemistryQuestion,
  type ChemistryStrand,
} from '../data/curriculum'
import { CHEMISTRY_MOCK_EXAMS } from '../data/mockExams'
import { CHEMISTRY_SOLVING_SIGNALS } from '../data/solvingSignals'
import { MathFormula } from '../../math/components/MathFormula'

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
  matchedLab: {
    id: string
    name: string
    icon: string
    badge: string
    description: string
  }
}

/** 108 課綱化學五大主軸中文名稱對照 */
const CHEMISTRY_STRAND_NAMES: Record<ChemistryStrand, string> = {
  matter_structure: '物質結構 (原子、週期表與化學鍵)',
  reactions: '化學反應 (反應式、質量守恆與反應熱)',
  equilibrium_kinetics: '平衡動力 (氣體、溶液與化學平衡)',
  electrochemistry: '酸鹼電化 (酸鹼鹽、滴定與氧化還原)',
  organic: '生活有機 (有機分子、聚合物與綠色化學)',
}

/**
 * 智慧匹配題目所屬之化學互動實驗室
 *
 * @param q 化學題目物件
 * @param unitSuggestedLab 單元建議實驗室代碼
 * @returns 實驗室詳細定義 (包含 ID、名稱、圖標、特徵與說明)
 */
function resolveChemistryLab(
  q: ChemistryQuestion,
  unitSuggestedLab?: string,
): { id: string; name: string; icon: string; badge: string; description: string } {
  const textToScan = `${q.title} ${q.question} ${q.solution} ${q.hint || ''} ${unitSuggestedLab || ''}`.toLowerCase()

  // 1. 酸鹼滴定與 pH 曲線實驗室 (TitrationLab)
  if (
    textToScan.includes('titration') ||
    textToScan.includes('acid') ||
    textToScan.includes('滴定') ||
    textToScan.includes('酸鹼') ||
    textToScan.includes('ph') ||
    textToScan.includes('中和') ||
    textToScan.includes('指示劑') ||
    textToScan.includes('酚酞') ||
    textToScan.includes('鹽酸') ||
    textToScan.includes('氫氧化鈉') ||
    textToScan.includes('緩衝') ||
    textToScan.includes('解離') ||
    textToScan.includes('當量點') ||
    textToScan.includes('水解')
  ) {
    return {
      id: 'titration',
      name: '酸鹼滴定與 pH 曲線實驗室',
      icon: '🧪',
      badge: '酸鹼中和與滴定曲線',
      description: '即時模擬強弱酸鹼滴定過程，觀測指示劑顏色漸變與 pH 突變滴定曲線。',
    }
  }

  // 2. 元素週期表探測器 (PeriodicTableLab)
  if (
    textToScan.includes('periodic') ||
    textToScan.includes('element') ||
    textToScan.includes('週期表') ||
    textToScan.includes('週期') ||
    textToScan.includes('族') ||
    textToScan.includes('原子序') ||
    textToScan.includes('電子組態') ||
    textToScan.includes('游離能') ||
    textToScan.includes('電負度') ||
    textToScan.includes('金屬性') ||
    textToScan.includes('價電子') ||
    textToScan.includes('原子半徑') ||
    textToScan.includes('同位素') ||
    textToScan.includes('金屬活性')
  ) {
    return {
      id: 'periodic',
      name: '元素週期表探測器',
      icon: '🔬',
      badge: '元素週期規律性',
      description: '全景互動探索 1~36 號元素之電子組態、原子半徑、電負度與週期性變化。',
    }
  }

  // 3. VSEPR 分子空間幾何實驗室 (VseprGeometryLab)
  if (
    textToScan.includes('vsepr') ||
    textToScan.includes('geometry') ||
    textToScan.includes('幾何') ||
    textToScan.includes('混成') ||
    textToScan.includes('分子形狀') ||
    textToScan.includes('鍵角') ||
    textToScan.includes('四面體') ||
    textToScan.includes('直線型') ||
    textToScan.includes('雙三角錐') ||
    textToScan.includes('極性') ||
    textToScan.includes('路易斯') ||
    textToScan.includes('共價鍵') ||
    textToScan.includes('孤對電子') ||
    textToScan.includes('八面體')
  ) {
    return {
      id: 'vsepr',
      name: 'VSEPR 分子空間幾何實驗室',
      icon: '📐',
      badge: '分子幾何與混成軌域',
      description: '立體旋轉探索價殼層電子對互斥理論、AXE 型態、混成軌域與空間幾何鍵角。',
    }
  }

  // 4. 理想氣體定律 PV=nRT 實驗室 (GasLawLab)
  if (
    textToScan.includes('gas') ||
    textToScan.includes('pressure') ||
    textToScan.includes('volume') ||
    textToScan.includes('氣體') ||
    textToScan.includes('理想氣體') ||
    textToScan.includes('pv=nrt') ||
    textToScan.includes('波以耳') ||
    textToScan.includes('查理') ||
    textToScan.includes('分壓') ||
    textToScan.includes('大氣壓') ||
    textToScan.includes('道耳吞') ||
    textToScan.includes('莫耳數') ||
    textToScan.includes('擴散')
  ) {
    return {
      id: 'gas',
      name: '理想氣體定律 PV=nRT 實驗室',
      icon: '🎈',
      badge: '氣體狀態與定律',
      description: '動態調節容器體積、溫度與氣體莫耳數，即時量測壓力變化並驗證氣體定律。',
    }
  }

  // 5. 溶解度與結晶析出實驗室 (SolubilityLab)
  if (
    textToScan.includes('solubility') ||
    textToScan.includes('solution') ||
    textToScan.includes('precipitate') ||
    textToScan.includes('溶解度') ||
    textToScan.includes('飽和') ||
    textToScan.includes('結晶') ||
    textToScan.includes('析出') ||
    textToScan.includes('沉澱') ||
    textToScan.includes('溶解') ||
    textToScan.includes('重量百分濃度') ||
    textToScan.includes('容度積') ||
    textToScan.includes('ksp') ||
    textToScan.includes('過飽和') ||
    textToScan.includes('水溶液')
  ) {
    return {
      id: 'solubility',
      name: '溶解度與結晶析出實驗室',
      icon: '🧊',
      badge: '溶液飽和與結晶平衡',
      description: '升降溫動態調控水溶液飽和度，計算高低溫溶解度差異與晶體析出量。',
    }
  }

  // 預設依據主軸分派
  switch (q.strand) {
    case 'electrochemistry':
      return {
        id: 'titration',
        name: '酸鹼滴定與 pH 曲線實驗室',
        icon: '🧪',
        badge: '酸鹼與電化學',
        description: '沉浸式檢驗酸鹼解離與滴定曲線。',
      }
    case 'matter_structure':
      return {
        id: 'periodic',
        name: '元素週期表探測器',
        icon: '🔬',
        badge: '物質結構與週期表',
        description: '探索元素規律與原子結構。',
      }
    case 'equilibrium_kinetics':
      return {
        id: 'gas',
        name: '理想氣體定律 PV=nRT 實驗室',
        icon: '🎈',
        badge: '平衡與動力學',
        description: '動態驗證氣體與平衡定律。',
      }
    case 'organic':
      return {
        id: 'vsepr',
        name: 'VSEPR 分子空間幾何實驗室',
        icon: '📐',
        badge: '有機分子立體結構',
        description: '觀察有機化合物與碳原子混成幾何。',
      }
    case 'reactions':
    default:
      return {
        id: 'solubility',
        name: '溶解度與結晶析出實驗室',
        icon: '🧊',
        badge: '化學反應與計量',
        description: '觀察化學反應物沉澱與析出變化。',
      }
  }
}

/**
 * 取得與化學題目最匹配的 3 秒破題訊號資料
 */
function findMatchingChemistrySignal(q: ChemistryQuestion) {
  const text = `${q.title} ${q.question} ${q.solution}`.toLowerCase()
  return (
    CHEMISTRY_SOLVING_SIGNALS.find((s) => {
      const topicLower = s.topic.toLowerCase()
      const signalLower = s.problemSignal.toLowerCase()
      return (
        text.includes(topicLower.slice(0, 4)) ||
        signalLower.split(' ').some((kw) => kw.length > 2 && text.includes(kw))
      )
    }) ||
    CHEMISTRY_SOLVING_SIGNALS[0]
  )
}

/**
 * 化學弱點錯題筆記本元件
 */
export const ChemistryErrorVault: React.FC<ChemistryErrorVaultProps> = ({
  errorQuestionIds,
  onRemoveError,
  onOpenLab,
}) => {
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

  // 1. 建立全域雙軌題庫檢索池 (單元題庫 + 模擬考題庫)
  const allEnrichedQuestionsMap = useMemo(() => {
    const map = new Map<string, EnrichedChemistryError>()

    // (A) 單元練習題庫 (G7~G12 所有單元)
    const allUnits = getAllChemistryUnits()
    allUnits.forEach((unit) => {
      unit.questions.forEach((q) => {
        const labInfo = resolveChemistryLab(q, unit.suggestedLab)
        map.set(q.id, {
          question: q,
          sourceType: 'unit',
          sourceLabel: `${unit.band} · 單元 ${unit.id}: ${unit.title}`,
          strandName: CHEMISTRY_STRAND_NAMES[q.strand] || q.strand,
          matchedLab: labInfo,
        })
      })
    })

    // (B) 大考模擬試卷題庫 (CAP / GSAT / AST)
    Object.values(CHEMISTRY_MOCK_EXAMS).forEach((exam) => {
      exam.questions.forEach((q) => {
        const labInfo = resolveChemistryLab(q)
        map.set(q.id, {
          question: q,
          sourceType: 'mock',
          sourceLabel: `${exam.title} (${exam.targetExam})`,
          strandName: CHEMISTRY_STRAND_NAMES[q.strand] || q.strand,
          matchedLab: labInfo,
        })
      })
    })

    return map
  }, [])

  // 2. 檢索出所有待複習錯題（具備未知 ID 容錯機制）
  const errorQuestions = useMemo(() => {
    return errorQuestionIds
      .map((id) => {
        const enriched = allEnrichedQuestionsMap.get(id)
        if (enriched) return enriched

        // 容錯備援：若 ID 未能在標準池中找到，動態建構基礎物件避免渲染中斷
        const fallbackQ: ChemistryQuestion = {
          id,
          title: `化學進階複習題目 (${id})`,
          strand: 'reactions',
          type: 'choice',
          difficulty: 3,
          question: '本題為歷次練習之重點錯題，請檢視化學反應式與計量推導並前往實驗室重溫觀念。',
          answer: 'A',
          solution: '請回顧化學反應式配平、莫耳數計量守恆與平衡常數定義進行推導。',
        }
        return {
          question: fallbackQ,
          sourceType: 'unit' as const,
          sourceLabel: '化學綜合強化題庫',
          strandName: '化學反應 (綜合強化)',
          matchedLab: resolveChemistryLab(fallbackQ),
        }
      })
      .filter(Boolean)
  }, [errorQuestionIds, allEnrichedQuestionsMap])

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
        <div style={{ fontSize: '2.8rem', marginBottom: '0.6rem' }}>🎉</div>
        <h3 style={{ margin: '0 0 0.4rem', color: '#059669' }}>太棒了！化學錯題本目前空空如也</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.86rem', maxWidth: '460px', margin: '0 auto' }}>
          你在單元基礎練習與大考模擬試卷中答錯的化學考題都會自動歸納在此。隨時歡迎透過模擬考或單元練習挑戰自我！
        </p>
      </div>
    )
  }

  const allExpanded = filteredQuestions.length > 0 && filteredQuestions.every((item) => expandedSteps[item.question.id])

  return (
    <div className="error-vault-container chemistry-error-vault">
      {/* 頂部弱點統計數據看板 */}
      <div className="vault-stats-grid">
        <div className="vault-stat-card">
          <span className="vault-stat-icon">📖</span>
          <div className="vault-stat-meta">
            <span className="vault-stat-label">待強化錯題總數</span>
            <span className="vault-stat-value">{errorQuestions.length} 題</span>
          </div>
        </div>

        <div className="vault-stat-card">
          <span className="vault-stat-icon">🧪</span>
          <div className="vault-stat-meta">
            <span className="vault-stat-label">可直通實驗室</span>
            <span className="vault-stat-value">5 大動態模擬</span>
          </div>
        </div>

        <div className="vault-stat-card">
          <span className="vault-stat-icon">🎯</span>
          <div className="vault-stat-meta">
            <span className="vault-stat-label">目前篩選顯示</span>
            <span className="vault-stat-value">{filteredQuestions.length} 題</span>
          </div>
        </div>
      </div>

      {/* 篩選與搜尋工具列 */}
      <div className="vault-toolbar">
        <div className="vault-toolbar-row">
          <input
            type="text"
            className="vault-search-input"
            placeholder="🔍 搜尋化學錯題關鍵字、反應式或考點..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="vault-select-filter"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            <option value="all">全部來源 (單元練習 + 模擬考)</option>
            <option value="unit">僅單元練習題目</option>
            <option value="mock">僅大考模擬試卷</option>
          </select>

          <select
            className="vault-select-filter"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="all">全難度星級</option>
            <option value="1">★ 難度 1 (基礎題)</option>
            <option value="2">★★ 難度 2 (會考標準)</option>
            <option value="3">★★★ 難度 3 (學測素養)</option>
            <option value="4">★★★★ 難度 4 (分科進階)</option>
            <option value="5">★★★★★ 難度 5 (競賽挑戰)</option>
          </select>

          <button
            type="button"
            className="vault-chip-btn"
            style={{ marginLeft: 'auto', background: 'var(--surface-soft)' }}
            onClick={() => toggleAllSteps(!allExpanded)}
          >
            {allExpanded ? '🔼 全部收起步驟' : '📖 全部展開步驟'}
          </button>
        </div>

        {/* 主軸領域快速篩選 Chips */}
        <div className="vault-chips-row">
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'all' ? 'chemistry-active' : ''}`}
            onClick={() => setSelectedStrand('all')}
          >
            全部主軸 ({errorQuestions.length})
          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'matter_structure' ? 'chemistry-active' : ''}`}
            onClick={() => setSelectedStrand('matter_structure')}
          >
            🔬 物質結構 ({errorQuestions.filter((q) => q.question.strand === 'matter_structure').length})
          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'reactions' ? 'chemistry-active' : ''}`}
            onClick={() => setSelectedStrand('reactions')}
          >
            🔥 化學反應 ({errorQuestions.filter((q) => q.question.strand === 'reactions').length})
          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'equilibrium_kinetics' ? 'chemistry-active' : ''}`}
            onClick={() => setSelectedStrand('equilibrium_kinetics')}
          >
            ⚖️ 平衡動力 ({errorQuestions.filter((q) => q.question.strand === 'equilibrium_kinetics').length})
          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'electrochemistry' ? 'chemistry-active' : ''}`}
            onClick={() => setSelectedStrand('electrochemistry')}
          >
            ⚡ 酸鹼電化 ({errorQuestions.filter((q) => q.question.strand === 'electrochemistry').length})
          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'organic' ? 'chemistry-active' : ''}`}
            onClick={() => setSelectedStrand('organic')}
          >
            🌿 生活有機 ({errorQuestions.filter((q) => q.question.strand === 'organic').length})
          </button>
        </div>
      </div>

      {/* 錯題卡片清單 */}
      {filteredQuestions.length === 0 ? (
        <div className="practice-card" style={{ textAlign: 'center', padding: '1.75rem' }}>
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.86rem' }}>
            沒有符合當前篩選條件的化學錯題項目。
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {filteredQuestions.map((item) => {
            const q = item.question
            const isStepOpen = Boolean(expandedSteps[q.id])
            const matchedSignal = findMatchingChemistrySignal(q)
            const lab = item.matchedLab

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
                    title="移出錯題筆記本"
                    onClick={() => onRemoveError(q.id)}
                  >
                    ✓ 我已掌握 (移出)
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
                            {isCorrectOption && <span style={{ marginLeft: 'auto' }}>✓ 正確</span>}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* 正確解析與公式推導區 */}
                <div className="vault-solution-wrapper">
                  <div className="vault-solution-header">
                    <span className="vault-solution-title chemistry">💡 正確解析與化學步驟推導</span>
                    <button
                      type="button"
                      className="vault-toggle-steps-btn"
                      onClick={() => toggleStep(q.id)}
                    >
                      {isStepOpen ? '🔼 收起深度拆解' : '📖 展開 5 步深度拆解與盲點診斷 ▾'}
                    </button>
                  </div>

                  <div className="vault-solution-body katex-scroll-protection">
                    <MathFormula math={q.solution} />
                  </div>

                  {/* 5 步驟深度拆解面板 (展開時可視) */}
                  {isStepOpen && (
                    <div className="vault-steps-accordion">
                      {/* Step 1: 核心破題訊號 */}
                      <div className="vault-step-card">
                        <div className="vault-step-title-line chemistry">
                          <span className="vault-step-num chemistry">1</span>
                          <span>🎯 審題與 3 秒破題訊號 (Diagnosis)</span>
                        </div>
                        <div className="vault-step-content-text">
                          {matchedSignal ? (
                            <p style={{ margin: 0, color: '#065f46', fontWeight: 600 }}>
                              【破題特徵】{matchedSignal.problemSignal} ➜{' '}
                              <span style={{ color: '#059669' }}>{matchedSignal.threeSecondRule}</span>
                            </p>
                          ) : (
                            <p style={{ margin: 0 }}>
                              鎖定本題化學主軸【{item.strandName}】，精確分析化學反應平衡與物質莫耳關係。
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Step 2: 關鍵反應式與定量平衡 */}
                      <div className="vault-step-card">
                        <div className="vault-step-title-line chemistry">
                          <span className="vault-step-num chemistry">2</span>
                          <span>📐 關鍵反應方程式與定量公式 (Chemical Formulas)</span>
                        </div>
                        <div className="vault-step-content-text katex-scroll-protection">
                          {matchedSignal?.firstStepFormula ? (
                            <MathFormula math={`$$${matchedSignal.firstStepFormula}$$`} block />
                          ) : (
                            <MathFormula math="列出平衡化學方程式與計量關係（如 $n = \frac{W}{M} = C_M \times V$, $PV = nRT$, $K_c = \frac{[C]^c[D]^d}{[A]^a[B]^b}$）。" />
                          )}
                        </div>
                      </div>

                      {/* Step 3: 詳細化學步驟求解 */}
                      <div className="vault-step-card">
                        <div className="vault-step-title-line chemistry">
                          <span className="vault-step-num chemistry">3</span>
                          <span>🔍 步驟推導與化學計量 (Step-by-Step Derivation)</span>
                        </div>
                        <div className="vault-step-content-text katex-scroll-protection">
                          <MathFormula math={q.solution} />
                        </div>
                      </div>

                      {/* Step 4: 易錯盲點警示 */}
                      <div className="vault-step-card">
                        <div className="vault-step-title-line chemistry">
                          <span className="vault-step-num chemistry">4</span>
                          <span>💡 易錯盲點與概念辨析 (Pitfall Warnings)</span>
                        </div>
                        <div className="vault-pitfall-box">
                          {q.hint ? (
                            <div><strong>⚠️ 考點提示：</strong>{q.hint}</div>
                          ) : (
                            <div>
                              <strong>⚠️ 常見盲區：</strong>注意限量試劑判斷（需莫耳數除以係數）、沉澱溶解度例外規則、酸鹼中和當量係數以及有效數字。
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Step 5: 核心素養表現 */}
                      {q.competency && (
                        <div className="vault-step-card">
                          <div className="vault-step-title-line chemistry">
                            <span className="vault-step-num chemistry">5</span>
                            <span>📝 108 課綱核心素養指引 (Competency)</span>
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
                <div className="vault-teleport-footer">
                  <div className="vault-teleport-hint">
                    <span>💡 觀念仍不清楚？透過動態化學教具模擬驗證：</span>
                  </div>

                  <button
                    type="button"
                    className="vault-lab-teleport-btn chemistry"
                    onClick={() => onOpenLab?.(lab.id)}
                  >
                    <span>{lab.icon} 前往「{lab.name}」即時驗證 ➔</span>
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

