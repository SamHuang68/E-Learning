import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { CHEMISTRY_SOLVING_SIGNALS, type ChemistrySolvingSignal } from '../data/solvingSignals'
import { MathFormula } from '../../math/components/MathFormula'

const STORAGE_KEY_CHEMISTRY_MASTERY = 'chemistry_signals_mastery_v1'

type MasteryStatus = 'mastered' | 'review'
type MasteryMap = Record<string, MasteryStatus>
type ViewMode = 'cards' | 'drill'
type StageFilter = 'all' | 'junior' | 'senior'
type StatusFilter = 'all' | 'mastered' | 'review' | 'untested'

/**
 * 載入化學 3 秒破題訊號掌握狀態
 */
function loadMasteryFromStorage(): MasteryMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHEMISTRY_MASTERY)
    if (raw) {
      return JSON.parse(raw) as MasteryMap
    }
  } catch (err) {
    console.error('Failed to load chemistry signals mastery:', err)
  }
  return {}
}

/**
 * 儲存化學 3 秒破題訊號掌握狀態
 */
function saveMasteryToStorage(map: MasteryMap): void {
  try {
    localStorage.setItem(STORAGE_KEY_CHEMISTRY_MASTERY, JSON.stringify(map))
  } catch (err) {
    console.error('Failed to save chemistry signals mastery:', err)
  }
}

/**
 * 化學 3 秒破題訊號決策卡與翻轉測驗元件 (ChemistrySignalsView)
 *
 * 功能亮點：
 * 1. 雙模式自由切換：【🗂️ 學習卡片模式】與【⚡ 3 秒即時快答翻轉測驗】
 * 2. 測驗模式：先出示題目關鍵特徵 ➜ 腦中 3 秒反射 ➜ 揭曉口訣與第一步算式 ➜ 標記掌握度
 * 3. 響應式優化 (375px ~ 1920px)：全面套用 min-width: 0, word-break: break-word，公式自動水平滾動
 * 4. 掌握度追蹤：自動持久化儲存「已掌握 / 需複習」進度
 */
export const ChemistrySignalsView: React.FC = () => {
  // 檢視模式：學習卡片 或 即時快答翻轉測驗
  const [viewMode, setViewMode] = useState<ViewMode>('cards')

  // 篩選狀態
  const [selectedStage, setSelectedStage] = useState<StageFilter>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  // 掌握度紀錄 (key: signal.id, value: 'mastered' | 'review')
  const [masteryMap, setMasteryMap] = useState<MasteryMap>(loadMasteryFromStorage)

  // 測驗模式專屬狀態
  const [drillIndex, setDrillIndex] = useState<number>(0)
  const [isRevealed, setIsRevealed] = useState<boolean>(false)
  const [drillOnlyReview, setDrillOnlyReview] = useState<boolean>(false)
  const [isShuffled, setIsShuffled] = useState<boolean>(false)
  const [shuffledSeed, setShuffledSeed] = useState<number>(0)
  const [isDrillFinished, setIsDrillFinished] = useState<boolean>(false)
  const [sessionRecord, setSessionRecord] = useState<Record<string, MasteryStatus>>({})

  // 監聽並保存掌握度
  useEffect(() => {
    saveMasteryToStorage(masteryMap)
  }, [masteryMap])

  // 標記掌握度狀態
  const handleSetMastery = useCallback((signalId: string, status: MasteryStatus) => {
    setMasteryMap((prev) => ({
      ...prev,
      [signalId]: status,
    }))
  }, [])

  // 清除掌握度狀態
  const handleClearMastery = useCallback((signalId: string) => {
    setMasteryMap((prev) => {
      const next = { ...prev }
      delete next[signalId]
      return next
    })
  }, [])

  // 重設所有掌握度
  const handleResetAllMastery = useCallback(() => {
    if (window.confirm('確定要重設所有化學 3 秒破題卡的掌握度紀錄嗎？')) {
      setMasteryMap({})
    }
  }, [])

  // 根據條件篩選卡片清單 (學習卡片模式)
  const filteredSignals = useMemo(() => {
    return CHEMISTRY_SOLVING_SIGNALS.filter((sig: ChemistrySolvingSignal) => {
      // 學段篩選
      if (selectedStage !== 'all' && sig.stage !== selectedStage) {
        return false
      }
      // 掌握度篩選
      const status = masteryMap[sig.id]
      if (statusFilter === 'mastered' && status !== 'mastered') return false
      if (statusFilter === 'review' && status !== 'review') return false
      if (statusFilter === 'untested' && status !== undefined) return false

      // 關鍵字搜尋
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase()
        const matchTopic = sig.topic.toLowerCase().includes(q)
        const matchSignal = sig.problemSignal.toLowerCase().includes(q)
        const matchRule = sig.threeSecondRule.toLowerCase().includes(q)
        const matchGrade = sig.gradeBand.toLowerCase().includes(q)
        if (!matchTopic && !matchSignal && !matchRule && !matchGrade) {
          return false
        }
      }
      return true
    })
  }, [selectedStage, statusFilter, searchQuery, masteryMap])

  // 測驗模式卡片清單
  const drillSignals = useMemo(() => {
    let list = CHEMISTRY_SOLVING_SIGNALS.filter((sig: ChemistrySolvingSignal) => {
      if (selectedStage !== 'all' && sig.stage !== selectedStage) {
        return false
      }
      if (drillOnlyReview) {
        return masteryMap[sig.id] === 'review'
      }
      return true
    })

    if (isShuffled) {
      list = [...list].sort(() => Math.random() - 0.5)
    }

    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStage, drillOnlyReview, isShuffled, shuffledSeed, masteryMap])

  // 當前測驗卡片
  const currentDrillCard: ChemistrySolvingSignal | undefined = drillSignals[drillIndex]

  // 切換至指定卡片的測驗模式
  const handleStartDrillSingle = useCallback(
    (signalId: string) => {
      const idx = drillSignals.findIndex((s) => s.id === signalId)
      if (idx !== -1) {
        setDrillIndex(idx)
      } else {
        setDrillIndex(0)
      }
      setIsRevealed(false)
      setIsDrillFinished(false)
      setViewMode('drill')
    },
    [drillSignals]
  )

  // 測驗模式評分並前進下一張
  const handleDrillRate = useCallback(
    (status: MasteryStatus) => {
      if (!currentDrillCard) return

      // 更新全域與本輪記錄
      handleSetMastery(currentDrillCard.id, status)
      setSessionRecord((prev) => ({
        ...prev,
        [currentDrillCard.id]: status,
      }))

      // 前進到下一題
      if (drillIndex < drillSignals.length - 1) {
        setDrillIndex((prev) => prev + 1)
        setIsRevealed(false)
      } else {
        setIsDrillFinished(true)
      }
    },
    [currentDrillCard, drillIndex, drillSignals.length, handleSetMastery]
  )

  // 重新開始測驗
  const handleRestartDrill = useCallback(() => {
    setDrillIndex(0)
    setIsRevealed(false)
    setIsDrillFinished(false)
    setSessionRecord({})
    if (isShuffled) {
      setShuffledSeed((prev) => prev + 1)
    }
  }, [isShuffled])

  // 掌握度統計
  const totalCount = CHEMISTRY_SOLVING_SIGNALS.length
  const masteredCount = useMemo(
    () => Object.values(masteryMap).filter((v) => v === 'mastered').length,
    [masteryMap]
  )
  const reviewCount = useMemo(
    () => Object.values(masteryMap).filter((v) => v === 'review').length,
    [masteryMap]
  )
  const masteryPercentage = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0

  return (
    <div
      className="chemistry-signals-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* 標題與模式切換頂欄 */}
      <div
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          borderRadius: '14px',
          padding: '1.15rem 1.25rem',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(5, 150, 105, 0.18)',
          minWidth: 0,
          wordBreak: 'break-word',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '0.6rem',
            minWidth: 0,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '0.2rem 0.55rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '0.35rem',
              }}
            >
              🧪 化學 3 秒破題訊號庫 · 108 課綱專屬
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.3,
              }}
            >
              ⚡ 化學 3 秒破題訊號決策卡
            </h2>
            <p
              style={{
                margin: '0.25rem 0 0',
                fontSize: '0.82rem',
                color: '#d1fae5',
                lineHeight: 1.4,
              }}
            >
              看到題目特徵關鍵字 ➜ 3 秒直覺反射核心公式、反應式與微觀模型！
            </p>
          </div>

          {/* 模式切換按鈕組 */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.18)',
              padding: '0.25rem',
              borderRadius: '10px',
              gap: '0.25rem',
              flexWrap: 'wrap',
              minWidth: 0,
            }}
          >
            <button
              type="button"
              onClick={() => {
                setViewMode('cards')
                setIsRevealed(false)
              }}
              style={{
                background: viewMode === 'cards' ? '#ffffff' : 'transparent',
                color: viewMode === 'cards' ? '#047857' : '#d1fae5',
                fontWeight: viewMode === 'cards' ? 700 : 500,
                border: 'none',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                minWidth: 0,
              }}
            >
              <span>🗂️ 學習卡片模式</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('drill')
                setDrillIndex(0)
                setIsRevealed(false)
                setIsDrillFinished(false)
              }}
              style={{
                background: viewMode === 'drill' ? '#ffffff' : 'transparent',
                color: viewMode === 'drill' ? '#047857' : '#d1fae5',
                fontWeight: viewMode === 'drill' ? 700 : 500,
                border: 'none',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                minWidth: 0,
              }}
            >
              <span>⚡ 3秒快答翻轉測驗</span>
              {reviewCount > 0 && (
                <span
                  style={{
                    background: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    padding: '0.1rem 0.35rem',
                    borderRadius: '999px',
                    fontWeight: 700,
                  }}
                >
                  {reviewCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 學習掌握度進度條 */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            padding: '0.6rem 0.85rem',
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
              fontSize: '0.78rem',
              minWidth: 0,
            }}
          >
            <span>
              🎯 掌握率：<strong>{masteryPercentage}%</strong> ({masteredCount}/{totalCount})
            </span>
            <span style={{ color: '#a7f3d0' }}>•</span>
            <span style={{ color: '#86efac' }}>🟢 已掌握 {masteredCount}</span>
            <span style={{ color: '#fca5a5' }}>🔴 需複習 {reviewCount}</span>
            <span style={{ color: '#cbd5e1' }}>⚪ 尚未測驗 {totalCount - masteredCount - reviewCount}</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              maxWidth: '220px',
              minWidth: 0,
            }}
          >
            <div
              style={{
                flex: 1,
                height: '8px',
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${masteryPercentage}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #34d399, #10b981)',
                  borderRadius: '999px',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            {masteredCount + reviewCount > 0 && (
              <button
                type="button"
                onClick={handleResetAllMastery}
                title="重設掌握度紀錄"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  padding: '0.2rem 0.45rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                重設
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 模式一：學習卡片瀏覽模式 (Card Mode) */}
      {/* ========================================================================= */}
      {viewMode === 'cards' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', minWidth: 0 }}>
          {/* 控制面板：學段、狀態、搜尋 */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.65rem',
              minWidth: 0,
            }}
          >
            {/* 學段篩選 Pills */}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', minWidth: 0 }}>
              <button
                type="button"
                className={`pill-btn ${selectedStage === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedStage('all')}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
              >
                全部化學 ({CHEMISTRY_SOLVING_SIGNALS.length})
              </button>
              <button
                type="button"
                className={`pill-btn ${selectedStage === 'junior' ? 'active' : ''}`}
                onClick={() => setSelectedStage('junior')}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
              >
                國中會考 CAP (3)
              </button>
              <button
                type="button"
                className={`pill-btn ${selectedStage === 'senior' ? 'active' : ''}`}
                onClick={() => setSelectedStage('senior')}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
              >
                高中學測/分科 (12)
              </button>
            </div>

            {/* 狀態篩選與搜尋框 */}
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center', minWidth: 0 }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                style={{
                  fontSize: '0.78rem',
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: 'var(--ink)',
                  minHeight: '34px',
                }}
              >
                <option value="all">全部狀態</option>
                <option value="mastered">🟢 僅已掌握</option>
                <option value="review">🔴 僅需複習</option>
                <option value="untested">⚪ 尚未測驗</option>
              </select>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋題目特徵或口訣..."
                style={{
                  fontSize: '0.78rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: 'var(--ink)',
                  minHeight: '34px',
                  width: '180px',
                  maxWidth: '100%',
                }}
              />
            </div>
          </div>

          {/* 卡片網格列表 */}
          {filteredSignals.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2.5rem 1rem',
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px dashed #cbd5e1',
                color: 'var(--muted)',
                fontSize: '0.9rem',
              }}
            >
              🔍 沒有符合篩選條件的化學破題訊號卡。
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 310px), 1fr))',
                gap: '0.75rem',
                minWidth: 0,
              }}
            >
              {filteredSignals.map((sig: ChemistrySolvingSignal) => {
                const status = masteryMap[sig.id]
                return (
                  <div
                    key={sig.id}
                    className="concept-item-card"
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderLeft: '4px solid #059669',
                      borderRadius: '10px',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.55rem',
                      minWidth: 0,
                      wordBreak: 'break-word',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    {/* 卡片頂部：單元標題、年級與掌握狀態 */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '0.4rem',
                        minWidth: 0,
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            color: '#065f46',
                            display: 'block',
                            lineHeight: 1.3,
                          }}
                        >
                          {sig.topic}
                        </span>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            color: '#047857',
                            background: '#ecfdf5',
                            padding: '0.15rem 0.4rem',
                            borderRadius: '4px',
                            display: 'inline-block',
                            marginTop: '0.2rem',
                          }}
                        >
                          {sig.gradeBand}
                        </span>
                      </div>

                      {/* 掌握度徽章 */}
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '999px',
                          fontWeight: 700,
                          flexShrink: 0,
                          background:
                            status === 'mastered'
                              ? '#dcfce7'
                              : status === 'review'
                              ? '#fee2e2'
                              : '#f1f5f9',
                          color:
                            status === 'mastered'
                              ? '#15803d'
                              : status === 'review'
                              ? '#b91c1c'
                              : '#64748b',
                          border: `1px solid ${
                            status === 'mastered'
                              ? '#86efac'
                              : status === 'review'
                              ? '#fca5a5'
                              : '#cbd5e1'
                          }`,
                        }}
                      >
                        {status === 'mastered'
                          ? '🟢 已掌握'
                          : status === 'review'
                          ? '🔴 需複習'
                          : '⚪ 未測驗'}
                      </span>
                    </div>

                    {/* 題目關鍵特徵訊號 */}
                    <div
                      style={{
                        background: '#f8fafc',
                        borderLeft: '3px solid #059669',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '0 6px 6px 0',
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#047857',
                          marginBottom: '0.15rem',
                        }}
                      >
                        🔍 看到題目訊號：
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: 'var(--ink)',
                          lineHeight: 1.4,
                        }}
                      >
                        {sig.problemSignal}
                      </div>
                    </div>

                    {/* 3 秒破題口訣 */}
                    <div
                      style={{
                        background: '#ecfdf5',
                        borderLeft: '3px solid #10b981',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '0 6px 6px 0',
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#059669',
                          marginBottom: '0.15rem',
                        }}
                      >
                        ⚡ 3 秒破題口訣：
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: '#065f46',
                          fontWeight: 700,
                          lineHeight: 1.4,
                        }}
                      >
                        {sig.threeSecondRule}
                      </div>
                    </div>

                    {/* 破題第一步算式 */}
                    <div
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '0.45rem 0.65rem',
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#64748b',
                          marginBottom: '0.2rem',
                        }}
                      >
                        📐 破題第一步算式：
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--ink)',
                          overflowX: 'auto',
                          maxWidth: '100%',
                          minWidth: 0,
                          padding: '0.1rem 0',
                        }}
                      >
                        <MathFormula math={`$$${sig.firstStepFormula}$$`} block={true} />
                      </div>
                    </div>

                    {/* 秒殺解題示範 (可折疊) */}
                    <details
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '0.4rem 0.65rem',
                        fontSize: '0.78rem',
                        minWidth: 0,
                      }}
                    >
                      <summary
                        style={{
                          fontWeight: 700,
                          color: '#047857',
                          cursor: 'pointer',
                          userSelect: 'none',
                        }}
                      >
                        💡 查看秒殺解題示範
                      </summary>
                      <div
                        style={{
                          marginTop: '0.4rem',
                          paddingTop: '0.4rem',
                          borderTop: '1px dashed #cbd5e1',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.35rem',
                          minWidth: 0,
                        }}
                      >
                        <div style={{ color: 'var(--ink)', lineHeight: 1.4 }}>
                          <strong>題目：</strong>
                          <MathFormula math={sig.exampleProblem.question} />
                        </div>
                        <div
                          style={{
                            color: '#065f46',
                            background: '#ecfdf5',
                            padding: '0.35rem 0.5rem',
                            borderRadius: '4px',
                            lineHeight: 1.4,
                          }}
                        >
                          <strong>⚡ 秒解：</strong>
                          <MathFormula math={sig.exampleProblem.quickSolve} />
                        </div>
                      </div>
                    </details>

                    {/* 底部操作按鈕：標記狀態與直接測驗 */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.35rem',
                        marginTop: 'auto',
                        paddingTop: '0.4rem',
                        borderTop: '1px solid #f1f5f9',
                        flexWrap: 'wrap',
                        minWidth: 0,
                      }}
                    >
                      <div style={{ display: 'flex', gap: '0.25rem', minWidth: 0 }}>
                        <button
                          type="button"
                          onClick={() =>
                            status === 'mastered'
                              ? handleClearMastery(sig.id)
                              : handleSetMastery(sig.id, 'mastered')
                          }
                          style={{
                            background: status === 'mastered' ? '#dcfce7' : '#f8fafc',
                            border: `1px solid ${status === 'mastered' ? '#86efac' : '#e2e8f0'}`,
                            color: status === 'mastered' ? '#15803d' : '#64748b',
                            borderRadius: '6px',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {status === 'mastered' ? '✓ 已掌握' : '標為掌握'}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            status === 'review'
                              ? handleClearMastery(sig.id)
                              : handleSetMastery(sig.id, 'review')
                          }
                          style={{
                            background: status === 'review' ? '#fee2e2' : '#f8fafc',
                            border: `1px solid ${status === 'review' ? '#fca5a5' : '#e2e8f0'}`,
                            color: status === 'review' ? '#b91c1c' : '#64748b',
                            borderRadius: '6px',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {status === 'review' ? '⚠ 需複習' : '標為複習'}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartDrillSingle(sig.id)}
                        style={{
                          background: '#ecfdf5',
                          border: '1px solid #a7f3d0',
                          color: '#047857',
                          borderRadius: '6px',
                          padding: '0.25rem 0.55rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                        }}
                      >
                        <span>⚡ 快答測驗</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 模式二：3 秒即時快答翻轉測驗模式 (Quick Drill / Flashcard Mode) */}
      {/* ========================================================================= */}
      {viewMode === 'drill' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '760px',
            width: '100%',
            margin: '0 auto',
            minWidth: 0,
            boxSizing: 'border-box',
          }}
        >
          {/* 測驗導航控制欄 */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.6rem',
              minWidth: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', minWidth: 0 }}>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  cursor: 'pointer',
                }}
              >
                ← 返回卡片總覽
              </button>

              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button
                  type="button"
                  className={`pill-btn ${selectedStage === 'all' ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedStage('all')
                    setDrillIndex(0)
                    setIsRevealed(false)
                    setIsDrillFinished(false)
                  }}
                  style={{ fontSize: '0.74rem', padding: '0.25rem 0.5rem' }}
                >
                  全部
                </button>
                <button
                  type="button"
                  className={`pill-btn ${selectedStage === 'junior' ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedStage('junior')
                    setDrillIndex(0)
                    setIsRevealed(false)
                    setIsDrillFinished(false)
                  }}
                  style={{ fontSize: '0.74rem', padding: '0.25rem 0.5rem' }}
                >
                  國中
                </button>
                <button
                  type="button"
                  className={`pill-btn ${selectedStage === 'senior' ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedStage('senior')
                    setDrillIndex(0)
                    setIsRevealed(false)
                    setIsDrillFinished(false)
                  }}
                  style={{ fontSize: '0.74rem', padding: '0.25rem 0.5rem' }}
                >
                  高中
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <label
                style={{
                  fontSize: '0.76rem',
                  color: 'var(--ink)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={drillOnlyReview}
                  onChange={(e) => {
                    setDrillOnlyReview(e.target.checked)
                    setDrillIndex(0)
                    setIsRevealed(false)
                    setIsDrillFinished(false)
                  }}
                />
                <span>僅複習需加強卡 ({reviewCount})</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setIsShuffled((prev) => !prev)
                  setShuffledSeed((prev) => prev + 1)
                  setDrillIndex(0)
                  setIsRevealed(false)
                  setIsDrillFinished(false)
                }}
                style={{
                  background: isShuffled ? '#d1fae5' : '#f8fafc',
                  border: `1px solid ${isShuffled ? '#6ee7b7' : '#cbd5e1'}`,
                  color: isShuffled ? '#047857' : 'var(--ink)',
                  borderRadius: '6px',
                  padding: '0.3rem 0.55rem',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                🔀 {isShuffled ? '隨機抽題中' : '隨機抽題'}
              </button>
            </div>
          </div>

          {/* 無測驗題目時 */}
          {drillSignals.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                background: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
              <h3 style={{ margin: '0 0 0.5rem', color: '#047857' }}>目前無符合條件的卡片！</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '0 0 1.25rem' }}>
                {drillOnlyReview ? '太棒了！目前沒有被標記為「需複習」的卡片。' : '請調整篩選學段或模式。'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setDrillOnlyReview(false)
                  setSelectedStage('all')
                }}
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                切換為全部化學破題卡
              </button>
            </div>
          ) : isDrillFinished ? (
            /* 測驗完成總結畫面 */
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
              <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.3rem', color: '#047857' }}>
                本輪 3 秒破題快答測驗完成！
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '0 0 1.5rem' }}>
                看見化學反應或題目關鍵字，0.5 秒反射核心公式與微觀架構，考試解題如有神助！
              </p>

              {/* 成績數據面板 */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '0.75rem',
                  maxWidth: '520px',
                  margin: '0 auto 1.75rem',
                }}
              >
                <div
                  style={{
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: '10px',
                    padding: '0.85rem',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 600 }}>本輪測驗</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>
                    {drillSignals.length} <span style={{ fontSize: '0.8rem' }}>組</span>
                  </div>
                </div>

                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: '10px',
                    padding: '0.85rem',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600 }}>本輪掌握</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803d' }}>
                    {Object.values(sessionRecord).filter((v) => v === 'mastered').length}{' '}
                    <span style={{ fontSize: '0.8rem' }}>組</span>
                  </div>
                </div>

                <div
                  style={{
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    borderRadius: '10px',
                    padding: '0.85rem',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: '#be123c', fontWeight: 600 }}>本輪需複習</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#e11d48' }}>
                    {Object.values(sessionRecord).filter((v) => v === 'review').length}{' '}
                    <span style={{ fontSize: '0.8rem' }}>組</span>
                  </div>
                </div>
              </div>

              {/* 總結操作按鈕組 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  type="button"
                  onClick={handleRestartDrill}
                  style={{
                    background: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.55rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🔄 重新挑戰本輪
                </button>

                {reviewCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setDrillOnlyReview(true)
                      setDrillIndex(0)
                      setIsRevealed(false)
                      setIsDrillFinished(false)
                    }}
                    style={{
                      background: '#fee2e2',
                      color: '#b91c1c',
                      border: '1px solid #fca5a5',
                      borderRadius: '8px',
                      padding: '0.55rem 1.25rem',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ⚡ 僅針對需複習卡 ({reviewCount}) 特訓
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  style={{
                    background: '#f1f5f9',
                    color: 'var(--ink)',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0.55rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  🗂️ 返回卡片總覽
                </button>
              </div>
            </div>
          ) : (
            /* 測驗進行中：3 秒翻轉卡片主體 */
            currentDrillCard && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  minWidth: 0,
                }}
              >
                {/* 測驗進度與切換指示 */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    color: 'var(--muted)',
                    minWidth: 0,
                  }}
                >
                  <span>
                    卡片 <strong>{drillIndex + 1}</strong> / {drillSignals.length}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '120px',
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: '6px',
                        background: '#e2e8f0',
                        borderRadius: '999px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${((drillIndex + 1) / drillSignals.length) * 100}%`,
                          height: '100%',
                          background: '#059669',
                          borderRadius: '999px',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 翻轉卡片容器 */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '2px solid #059669',
                    borderRadius: '16px',
                    padding: '1.25rem 1.4rem',
                    boxShadow: '0 8px 30px rgba(5, 150, 105, 0.08)',
                    minWidth: 0,
                    wordBreak: 'break-word',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  {/* 卡片標頭：主題與年級 */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid #f1f5f9',
                      paddingBottom: '0.65rem',
                      flexWrap: 'wrap',
                      gap: '0.4rem',
                      minWidth: 0,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                      <span
                        style={{
                          background: '#ecfdf5',
                          color: '#047857',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {currentDrillCard.gradeBand}
                      </span>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#047857' }}>
                        {currentDrillCard.topic}
                      </h3>
                    </div>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color:
                          masteryMap[currentDrillCard.id] === 'mastered'
                            ? '#15803d'
                            : masteryMap[currentDrillCard.id] === 'review'
                            ? '#b91c1c'
                            : '#64748b',
                      }}
                    >
                      {masteryMap[currentDrillCard.id] === 'mastered'
                        ? '🟢 歷史記錄：已掌握'
                        : masteryMap[currentDrillCard.id] === 'review'
                        ? '🔴 歷史記錄：需複習'
                        : '⚪ 歷史記錄：未測驗'}
                    </span>
                  </div>

                  {/* 正面：題目關鍵特徵訊號 (思考階段) */}
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderLeft: '5px solid #059669',
                      borderRadius: '8px',
                      padding: '1rem 1.15rem',
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#047857',
                        letterSpacing: '0.04em',
                        marginBottom: '0.35rem',
                      }}
                    >
                      🎯 題目關鍵特徵訊號（Trigger Signal）：
                    </div>
                    <div
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        lineHeight: 1.5,
                      }}
                    >
                      {currentDrillCard.problemSignal}
                    </div>
                  </div>

                  {/* 思考指引提示 */}
                  {!isRevealed ? (
                    <div
                      style={{
                        background: '#f0fdf4',
                        border: '1px dashed #86efac',
                        borderRadius: '10px',
                        padding: '1rem',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.65rem',
                      }}
                    >
                      <div style={{ fontSize: '1.4rem' }}>🧠</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#166534' }}>
                        請在腦中進行 3 秒直覺反射：
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#15803d', maxWidth: '420px', lineHeight: 1.4 }}>
                        「看到此化學題型，3 秒破題口訣是什麼？第一步該帶入哪道公式或反應式？」
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsRevealed(true)}
                        style={{
                          marginTop: '0.4rem',
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '0.65rem 1.5rem',
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                          transition: 'transform 0.15s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}
                      >
                        <span>👁️ 揭曉 3 秒破題口訣與第一步算式</span>
                      </button>
                    </div>
                  ) : (
                    /* 背面：揭曉口訣、算式與範例 */
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem',
                        animation: 'fadeIn 0.2s ease',
                        minWidth: 0,
                      }}
                    >
                      {/* 3 秒破題口訣 */}
                      <div
                        style={{
                          background: '#ecfdf5',
                          border: '1px solid #a7f3d0',
                          borderLeft: '5px solid #10b981',
                          borderRadius: '8px',
                          padding: '0.85rem 1rem',
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            color: '#059669',
                            marginBottom: '0.2rem',
                          }}
                        >
                          ⚡ 3 秒破題口訣：
                        </div>
                        <div
                          style={{
                            fontSize: '0.98rem',
                            fontWeight: 800,
                            color: '#065f46',
                            lineHeight: 1.45,
                          }}
                        >
                          {currentDrillCard.threeSecondRule}
                        </div>
                      </div>

                      {/* 破題第一步算式 */}
                      <div
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '0.85rem 1rem',
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#64748b',
                            marginBottom: '0.35rem',
                          }}
                        >
                          📐 破題第一步算式：
                        </div>
                        <div
                          style={{
                            fontSize: '0.92rem',
                            color: 'var(--ink)',
                            overflowX: 'auto',
                            maxWidth: '100%',
                            minWidth: 0,
                            padding: '0.25rem 0',
                          }}
                        >
                          <MathFormula math={`$$${currentDrillCard.firstStepFormula}$$`} block={true} />
                        </div>
                      </div>

                      {/* 秒殺解題示範 */}
                      <div
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '0.75rem 1rem',
                          fontSize: '0.82rem',
                          minWidth: 0,
                        }}
                      >
                        <div style={{ color: 'var(--ink)', marginBottom: '0.35rem', lineHeight: 1.4 }}>
                          <strong>範例題目：</strong>
                          <MathFormula math={currentDrillCard.exampleProblem.question} />
                        </div>
                        <div
                          style={{
                            color: '#065f46',
                            background: '#ecfdf5',
                            padding: '0.4rem 0.6rem',
                            borderRadius: '4px',
                            lineHeight: 1.4,
                          }}
                        >
                          <strong>⚡ 秒殺步驟：</strong>
                          <MathFormula math={currentDrillCard.exampleProblem.quickSolve} />
                        </div>
                      </div>

                      {/* 自我評估按鈕組 */}
                      <div
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '0.85rem 1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.6rem',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)' }}>
                          剛才你在 3 秒內成功反射破題口訣與公式了嗎？
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            gap: '0.65rem',
                            width: '100%',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleDrillRate('review')}
                            style={{
                              flex: '1 1 140px',
                              maxWidth: '220px',
                              background: '#fee2e2',
                              border: '1px solid #fca5a5',
                              color: '#b91c1c',
                              borderRadius: '8px',
                              padding: '0.55rem 0.85rem',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <span>🔴 需再複習 (難以反射)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDrillRate('mastered')}
                            style={{
                              flex: '1 1 140px',
                              maxWidth: '220px',
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              border: 'none',
                              color: '#ffffff',
                              borderRadius: '8px',
                              padding: '0.55rem 0.85rem',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 3px 10px rgba(16, 185, 129, 0.25)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <span>🟢 3秒秒殺 (已精準掌握)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 底部前進與後退導航列 */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '0.65rem',
                      minWidth: 0,
                    }}
                  >
                    <button
                      type="button"
                      disabled={drillIndex === 0}
                      onClick={() => {
                        if (drillIndex > 0) {
                          setDrillIndex((prev) => prev - 1)
                          setIsRevealed(false)
                        }
                      }}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.78rem',
                        color: drillIndex === 0 ? '#94a3b8' : 'var(--ink)',
                        cursor: drillIndex === 0 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      ← 上一張
                    </button>

                    {isRevealed && (
                      <button
                        type="button"
                        onClick={() => setIsRevealed(false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        隱藏答案重新思考
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (drillIndex < drillSignals.length - 1) {
                          setDrillIndex((prev) => prev + 1)
                          setIsRevealed(false)
                        } else {
                          setIsDrillFinished(true)
                        }
                      }}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.78rem',
                        color: 'var(--ink)',
                        cursor: 'pointer',
                      }}
                    >
                      {drillIndex === drillSignals.length - 1 ? '結束測驗 ➡' : '下一張 ➡'}
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
