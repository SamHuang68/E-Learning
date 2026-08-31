import React from 'react'
import type { MathGradeInfo, MathUnit } from '../data/curriculum'
import type { MathProgressState } from '../utils/mathStorage'
import { MathFormula } from './MathFormula'
import { SolvingSignalCards } from './SolvingSignalCards'

type Props = {
  gradeInfo: MathGradeInfo
  currentUnit: MathUnit
  progress: MathProgressState
  onSelectUnit: (unitId: number) => void
  onStartPractice: () => void
  onOpenLab: (labId: string) => void
  onOpenMock: () => void
  onOpenVault: () => void
  onOpenVisual: () => void
}

/**
 * 數學「今日學習」首頁儀表板 (MathToday)
 * 展示當前年級主題、核心單元地圖、概念卡片、教具實驗室入口與練習按鈕。
 */
export const MathToday: React.FC<Props> = ({
  gradeInfo,
  currentUnit,
  progress,
  onSelectUnit,
  onStartPractice,
  onOpenLab,
  onOpenMock,
  onOpenVault,
  onOpenVisual,
}) => {
  return (
    <div className="math-today-view">
      {/* 頂部年級 Banner */}
      <section className="math-hero-card compact-hero">
        <div className="hero-header-line">
          <div className="hero-title-group">
            <span className="stage-pill">{gradeInfo.band}</span>
            <h2>{gradeInfo.name} · 數學素養教室</h2>
            {gradeInfo.targetExam && (
              <span className="exam-target-pill">🎯 {gradeInfo.targetExam}</span>
            )}
          </div>
          <span className="hero-desc-inline">{gradeInfo.description}</span>
        </div>

        <div className="hero-quick-actions">
          <button type="button" className="btn-hero-primary" onClick={onStartPractice}>
            ▶ 單元練習 ({currentUnit.title})
          </button>
          <button
            type="button"
            className="btn-hero-secondary"
            onClick={onOpenVisual}
          >
            🎨 幾何圖示
          </button>
          {currentUnit.suggestedLab && (
            <button
              type="button"
              className="btn-hero-secondary"
              onClick={() => onOpenLab(currentUnit.suggestedLab!)}
            >
              🧪 專屬教具
            </button>
          )}
          <button type="button" className="btn-hero-secondary" onClick={onOpenMock}>
            📝 模擬測驗
          </button>
          <button type="button" className="btn-hero-secondary" onClick={onOpenVault}>
            📖 錯題本 ({progress.errorQuestions.length})
          </button>
        </div>
      </section>

      {/* 單元地圖 Unit Map */}
      <section className="unit-map-section">
        <div className="section-title-row">
          <h3>課程單元路徑 (Curriculum Units)</h3>
          <span className="unit-count-badge">共 {gradeInfo.units.length} 個核心單元</span>
        </div>

        <div className="unit-cards-grid">
          {gradeInfo.units.map((u) => {
            const isCurrent = u.id === currentUnit.id
            const uDone = u.questions.filter((q) =>
              progress.completedQuestions.includes(q.id),
            ).length
            const uPct = Math.round((uDone / Math.max(1, u.questions.length)) * 100)

            return (
              <div
                key={u.id}
                className={`unit-map-card ${isCurrent ? 'active' : ''}`}
                onClick={() => onSelectUnit(u.id)}
              >
                <div className="unit-card-header">
                  <span className="unit-seq">單元 {u.id}</span>
                  <span className="unit-strand">{u.strand}</span>
                </div>
                <h4>{u.title}</h4>
                <p className="unit-sub">{u.subtitle}</p>

                <div className="unit-progress-bar-wrap">
                  <div
                    className="unit-progress-bar-fill"
                    style={{ width: `${uPct}%` }}
                  />
                </div>
                <div className="unit-meta-footer">
                  <span>{uDone}/{u.questions.length} 題完成 ({uPct}%)</span>
                  {isCurrent && <span className="current-indicator">進行中 ●</span>}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 當前單元核心概念速讀 Concept Cards */}
      <section className="concepts-section">
        <h3>💡 單元 {currentUnit.id} 核心概念與必考重點</h3>
        <div className="concept-cards-grid">
          {currentUnit.concepts.map((concept, idx) => (
            <div key={idx} className="concept-item-card">
              <span className="concept-idx">重點 0{idx + 1}</span>
              <div className="concept-text">
                <MathFormula math={concept} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 實驗室教具快捷入口 */}
      {gradeInfo.labs.length > 0 && (
        <section className="labs-section">
          <h3>🧪 互動幾何與算式實驗室</h3>
          <div className="labs-grid">
            {gradeInfo.labs.map((lab) => (
              <div
                key={lab.id}
                className="lab-entry-card"
                onClick={() => onOpenLab(lab.id)}
              >
                <div className="lab-icon">⚗️</div>
                <div className="lab-info">
                  <h4>{lab.name}</h4>
                  <p>{lab.description}</p>
                </div>
                <button type="button" className="btn-enter-lab">
                  開啟教具 →
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3 秒解題破題訊號卡 */}
      <section className="signals-section">
        <SolvingSignalCards initialStage={gradeInfo.stage} />
      </section>
    </div>
  )
}
