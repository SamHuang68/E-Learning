/**
 * 臺灣 108 課綱物理 · 錯題弱點診斷與實驗室直通筆記本 (Physics Error Vault & Lab Teleportation)
 *
 * 核心升級：
 * 1. 雙軌全域題庫檢索池：全面納入單元練習題庫 (G7~G12) 與大考模擬試卷題庫 (會考 CAP / 學測 GSAT / 分科 AST)。
 * 2. 動態實驗室智慧導航：自動識別題目領域並掛載「🔬 立即前往關聯動態實驗室」按鈕，直通 5 大物理實驗室。
 * 3. 5 大維度步驟深度診斷：整合「3 秒破題訊號」、「關鍵物理公式」、「嚴密推導步驟」、「易錯盲點警示」與「選項逐項辨析」。
 * 4. 零溢出與平滑滾動：KaTeX 數學算式具備平滑滾動保護，卡片極致緊湊排版，手機端 0 橫向溢出。
 */

import React, { useState, useMemo } from 'react'
import {
  getAllPhysicsUnits,
  type PhysicsQuestion,
  PHYSICS_STRAND_NAMES,
} from '../data/curriculum'
import { PHYSICS_MOCK_EXAMS } from '../data/mockExams'
import { PHYSICS_SOLVING_SIGNALS } from '../data/solvingSignals'
import { MathFormula } from '../../math/components/MathFormula'
import { exportErrorVaultToAnki } from '../../utils/ankiExporter'

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
  matchedLab: {
    id: string
    name: string
    icon: string
    badge: string
    description: string
  }
}

/**
 * 智慧匹配題目所屬之物理互動實驗室
 *
 * @param q 物理題目物件
 * @param unitSuggestedLab 單元建議實驗室代碼
 * @returns 實驗室詳細定義 (包含 ID、名稱、圖標、特徵與說明)
 */
function resolvePhysicsLab(
  q: PhysicsQuestion,
  unitSuggestedLab?: string,
): { id: string; name: string; icon: string; badge: string; description: string } {
  const textToScan = `${q.title} ${q.question} ${q.solution} ${q.interactiveLab || ''} ${unitSuggestedLab || ''}`.toLowerCase()

  // 1. 斜向拋體與等加速度運動實驗室 (ProjectileLab)
  if (
    textToScan.includes('projectile') ||
    textToScan.includes('拋體') ||
    textToScan.includes('拋射') ||
    textToScan.includes('平拋') ||
    textToScan.includes('斜拋') ||
    textToScan.includes('自由落體') ||
    textToScan.includes('運動學') ||
    textToScan.includes('仰角') ||
    textToScan.includes('射程') ||
    textToScan.includes('軌跡') ||
    textToScan.includes('初速')
  ) {
    return {
      id: 'projectile',
      name: '斜向拋體運動實驗室',
      icon: '🚀',
      badge: '拋體運動學',
      description: '調控初速、發射仰角與重力加速度，即時觀測拋物線軌跡與水平射程。',
    }
  }

  // 2. 簡諧運動與單擺能量實驗室 (ShmLab)
  if (
    textToScan.includes('shm') ||
    textToScan.includes('簡諧') ||
    textToScan.includes('單擺') ||
    textToScan.includes('彈簧') ||
    textToScan.includes('週期') ||
    textToScan.includes('振幅') ||
    textToScan.includes('力學能') ||
    textToScan.includes('動能') ||
    textToScan.includes('位能') ||
    textToScan.includes('擺角') ||
    textToScan.includes('端點')
  ) {
    return {
      id: 'shm',
      name: '簡諧運動與單擺實驗室',
      icon: '⏱️',
      badge: '簡諧與力學能守恆',
      description: '調節擺長、振幅與彈性係數，動態剖析速度、加速度與動能位能週期性轉化。',
    }
  }

  // 3. 司乃耳折射與幾何光學實驗室 (OpticsLab)
  if (
    textToScan.includes('optics') ||
    textToScan.includes('lens') ||
    textToScan.includes('折射') ||
    textToScan.includes('反射') ||
    textToScan.includes('司乃耳') ||
    textToScan.includes('透鏡') ||
    textToScan.includes('凸透鏡') ||
    textToScan.includes('凹透鏡') ||
    textToScan.includes('光學') ||
    textToScan.includes('全反射') ||
    textToScan.includes('焦距') ||
    textToScan.includes('成像') ||
    textToScan.includes('臨界角') ||
    q.strand === 'waves_optics'
  ) {
    return {
      id: 'optics',
      name: '司乃耳折射與透鏡光學實驗室',
      icon: '🌈',
      badge: '幾何光學與全反射',
      description: '連續變換入射角與介質折射率，實測司乃耳定律、全反射臨界角與透鏡成像規律。',
    }
  }

  // 4. 直流電路歐姆定律實驗室 (CircuitLab)
  if (
    textToScan.includes('circuit') ||
    textToScan.includes('kirchhoff') ||
    textToScan.includes('電路') ||
    textToScan.includes('電阻') ||
    textToScan.includes('歐姆') ||
    textToScan.includes('電流') ||
    textToScan.includes('電壓') ||
    textToScan.includes('電功率') ||
    textToScan.includes('克希荷夫') ||
    textToScan.includes('並聯') ||
    textToScan.includes('串聯') ||
    textToScan.includes('安培') ||
    textToScan.includes('伏特') ||
    q.strand === 'electromagnetism'
  ) {
    return {
      id: 'circuit',
      name: '直流電路歐姆定律實驗室',
      icon: '⚡',
      badge: '電路分析與歐姆定律',
      description: '自由配置電源電壓與電阻串並聯拓撲，即時模擬迴路電流、分壓與電功率消耗。',
    }
  }

  // 5. 阿基米德浮力與密度實驗室 (BuoyancyLab)
  if (
    textToScan.includes('buoyancy') ||
    textToScan.includes('density') ||
    textToScan.includes('measurement') ||
    textToScan.includes('浮力') ||
    textToScan.includes('阿基米德') ||
    textToScan.includes('密度') ||
    textToScan.includes('排水法') ||
    textToScan.includes('下沉') ||
    textToScan.includes('漂浮') ||
    textToScan.includes('彈簧秤') ||
    textToScan.includes('液體')
  ) {
    return {
      id: 'buoyancy',
      name: '阿基米德浮力與密度實驗室',
      icon: '⛵',
      badge: '流體靜力與浮力',
      description: '沉浸式測試固體在不同液體密度下的排開體積、浮力大小與秤重視重變化。',
    }
  }

  return {
    id: 'projectile',
    name: '斜向拋體運動實驗室',
    icon: '🚀',
    badge: '力學動態模擬',
    description: '透過動態畫布模擬物體受力與運動軌跡。',
  }
}

/**
 * 取得與題目最匹配的 3 秒破題訊號資料
 */
function findMatchingSignal(q: PhysicsQuestion) {
  const text = `${q.title} ${q.question} ${q.solution}`.toLowerCase()
  return (
    PHYSICS_SOLVING_SIGNALS.find((s) => {
      const topicLower = s.topic.toLowerCase()
      const signalLower = s.problemSignal.toLowerCase()
      return (
        (s.strand === q.strand && text.includes(topicLower.slice(0, 4))) ||
        signalLower.split(' ').some((kw) => kw.length > 2 && text.includes(kw))
      )
    }) ||
    PHYSICS_SOLVING_SIGNALS.find((s) => s.strand === q.strand)
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
    const map = new Map<string, EnrichedPhysicsError>()

    // (A) 單元練習題庫 (G7~G12 所有單元)
    const allUnits = getAllPhysicsUnits()
    allUnits.forEach((unit) => {
      unit.questions.forEach((q) => {
        const labInfo = resolvePhysicsLab(q, unit.suggestedLab)
        map.set(q.id, {
          question: q,
          sourceType: 'unit',
          sourceLabel: `${unit.band} · 單元 ${unit.id}: ${unit.title}`,
          strandName: PHYSICS_STRAND_NAMES[q.strand] || q.strand,
          matchedLab: labInfo,
        })
      })
    })

    // (B) 大考模擬試卷題庫 (CAP / GSAT / AST)
    Object.values(PHYSICS_MOCK_EXAMS).forEach((exam) => {
      exam.questions.forEach((q) => {
        const labInfo = resolvePhysicsLab(q)
        map.set(q.id, {
          question: q,
          sourceType: 'mock',
          sourceLabel: `${exam.title} (${exam.targetExam})`,
          strandName: PHYSICS_STRAND_NAMES[q.strand] || q.strand,
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
        const fallbackQ: PhysicsQuestion = {
          id,
          title: `物理進階複習題目 (${id})`,
          strand: 'mechanics',
          type: 'choice',
          difficulty: 3,
          question: '本題為歷次練習之重點錯題，請檢視推導公式並前往實驗室重溫觀念。',
          answer: 0,
          solution: '請回顧牛頓運動定律、能量守恆與電磁基本關係式進行推導。',
        }
        return {
          question: fallbackQ,
          sourceType: 'unit' as const,
          sourceLabel: '物理綜合強化題庫',
          strandName: '力學 (綜合強化)',
          matchedLab: resolvePhysicsLab(fallbackQ),
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
        <h3 style={{ margin: '0 0 0.4rem', color: '#0369a1' }}>太棒了！物理錯題本目前空空如也</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.86rem', maxWidth: '460px', margin: '0 auto' }}>
          你在單元基礎練習與大考模擬試卷中答錯的物理考題都會自動歸納在此。隨時歡迎透過模擬考或單元練習挑戰自我！
        </p>
      </div>
    )
  }

  const allExpanded = filteredQuestions.length > 0 && filteredQuestions.every((item) => expandedSteps[item.question.id])

  return (
    <div className="error-vault-container physics-error-vault">
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
          <span className="vault-stat-icon">🚀</span>
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
            placeholder="🔍 搜尋錯題關鍵字、公式或考點..."
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

          <button
            type="button"
            className="vault-chip-btn"
            style={{ background: 'rgba(37, 99, 235, 0.12)', color: '#2563eb', borderColor: '#2563eb' }}
            onClick={() => exportErrorVaultToAnki('物理', filteredQuestions.map((q) => q.question))}
            title="一鍵匯出當前篩選錯題至 Anki 記憶牌組"
          >
            📑 匯出 Anki 牌組
          </button>
        </div>

        {/* 主軸領域快速篩選 Chips */}
        <div className="vault-chips-row">
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedStrand('all')}
          >
            全部主軸 ({errorQuestions.length})
          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'mechanics' ? 'active' : ''}`}
            onClick={() => setSelectedStrand('mechanics')}
          >
            ⚙️ 力學運動與能量 ({errorQuestions.filter((q) => q.question.strand === 'mechanics').length})
          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'thermodynamics' ? 'active' : ''}`}
            onClick={() => setSelectedStrand('thermodynamics')}
          >
            🔥 熱學與分子動力 ({errorQuestions.filter((q) => q.question.strand === 'thermodynamics').length})
          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'waves_optics' ? 'active' : ''}`}
            onClick={() => setSelectedStrand('waves_optics')}
          >
            🌈 波動與幾何光學 ({errorQuestions.filter((q) => q.question.strand === 'waves_optics').length})
          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'electromagnetism' ? 'active' : ''}`}
            onClick={() => setSelectedStrand('electromagnetism')}
          >
            ⚡ 電磁學與電路 ({errorQuestions.filter((q) => q.question.strand === 'electromagnetism').length})
          </button>
          <button
            type="button"
            className={`vault-chip-btn ${selectedStrand === 'modern' ? 'active' : ''}`}
            onClick={() => setSelectedStrand('modern')}
          >
            ⚛️ 近代物理與原子 ({errorQuestions.filter((q) => q.question.strand === 'modern').length})
          </button>
        </div>
      </div>

      {/* 錯題卡片清單 */}
      {filteredQuestions.length === 0 ? (
        <div className="practice-card" style={{ textAlign: 'center', padding: '1.75rem' }}>
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.86rem' }}>
            沒有符合當前篩選條件的錯題項目。
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {filteredQuestions.map((item) => {
            const q = item.question
            const isStepOpen = Boolean(expandedSteps[q.id])
            const matchedSignal = findMatchingSignal(q)
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
                    <span className="vault-solution-title">💡 正確解析與公式推導</span>
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
                        <div className="vault-step-title-line">
                          <span className="vault-step-num">1</span>
                          <span>🎯 審題與 3 秒破題訊號 (Diagnosis)</span>
                        </div>
                        <div className="vault-step-content-text">
                          {matchedSignal ? (
                            <p style={{ margin: 0, color: '#0369a1', fontWeight: 600 }}>
                              【破題訊號】{matchedSignal.problemSignal} ➜{' '}
                              <span style={{ color: '#0284c7' }}>{matchedSignal.threeSecondRule}</span>
                            </p>
                          ) : (
                            <p style={{ margin: 0 }}>
                              鎖定本題物理主軸【{item.strandName}】，釐清已知物理量與待求未知量之函數關係。
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Step 2: 關鍵公式建構 */}
                      <div className="vault-step-card">
                        <div className="vault-step-title-line">
                          <span className="vault-step-num">2</span>
                          <span>📐 關鍵公式與物理定律 (Formula Formulation)</span>
                        </div>
                        <div className="vault-step-content-text katex-scroll-protection">
                          {matchedSignal?.firstStepFormula ? (
                            <MathFormula math={`$$${matchedSignal.firstStepFormula}$$`} block />
                          ) : (
                            <MathFormula math="依據物理定律列出方程式（如 $F = ma$, $E_k = \frac{1}{2}mv^2$, $n_1\sin\theta_1 = n_2\sin\theta_2$, $V = IR$）。" />
                          )}
                        </div>
                      </div>

                      {/* Step 3: 詳細數值計算與推導 */}
                      <div className="vault-step-card">
                        <div className="vault-step-title-line">
                          <span className="vault-step-num">3</span>
                          <span>🔍 步驟推導與數值求解 (Step-by-Step Derivation)</span>
                        </div>
                        <div className="vault-step-content-text katex-scroll-protection">
                          <MathFormula math={q.solution} />
                        </div>
                      </div>

                      {/* Step 4: 易錯盲點警示 */}
                      <div className="vault-step-card">
                        <div className="vault-step-title-line">
                          <span className="vault-step-num">4</span>
                          <span>💡 易錯盲點與常犯陷阱 (Pitfall Warnings)</span>
                        </div>
                        <div className="vault-pitfall-box">
                          {q.hint ? (
                            <div><strong>⚠️ 考點警示：</strong>{q.hint}</div>
                          ) : (
                            <MathFormula math="⚠️ 常見盲區：注意 SI 單位制換算（如 $\text{cm} \rightarrow \text{m}$、$\text{gw} \rightarrow \text{N}$），向量方向性正負號，以及能量守恆中的散熱損失。" />
                          )}
                        </div>
                      </div>

                      {/* Step 5: 核心素養表現 */}
                      {q.competency && (
                        <div className="vault-step-card">
                          <div className="vault-step-title-line">
                            <span className="vault-step-num">5</span>
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
                    <span>💡 觀念仍不清楚？透過動態畫布模擬驗證：</span>
                  </div>

                  <button
                    type="button"
                    className="vault-lab-teleport-btn"
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

