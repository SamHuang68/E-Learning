import React from 'react'
import type { ChemistryGradeInfo, ChemistryUnit } from '../data/curriculum'
import type { ChemistryProgressState } from '../utils/chemistryStorage'
import { MathFormula } from '../../math/components/MathFormula'

type Props = {
  gradeInfo: ChemistryGradeInfo
  currentUnit: ChemistryUnit
  progress: ChemistryProgressState
  onSelectUnit: (unitId: number) => void
  onStartPractice: () => void
  onOpenLab: (labId: string) => void
  onOpenMock: () => void
  onOpenVault: () => void
  onOpenSignals: () => void
}

export const ChemistryToday: React.FC<Props> = ({
  gradeInfo,
  currentUnit,
  progress,
  onSelectUnit,
  onStartPractice,
  onOpenLab,
  onOpenMock,
  onOpenVault,
  onOpenSignals,
}) => {
  return (
    <div className="math-today-view chemistry-today-view">
      {/* 頂部年級 Banner */}
      <section className="math-hero-card compact-hero" style={{ background: 'linear-gradient(135deg, #065f46, #059669)' }}>
        <div className="hero-header-line">
          <div className="hero-title-group">
            <span className="stage-pill">{gradeInfo.band}</span>
            <h2>{gradeInfo.name} · 化學素養教室</h2>
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
          <button type="button" className="btn-hero-secondary" onClick={onOpenSignals}>
            ⚡ 3秒破題訊號
          </button>
          {currentUnit.suggestedLab && (
            <button
              type="button"
              className="btn-hero-secondary"
              onClick={() => onOpenLab(currentUnit.suggestedLab!)}
            >
              🔬 專屬實驗室
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
          <h3>課程單元路徑 (Chemistry Curriculum Units)</h3>
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
                  <span className="unit-seq" style={{ color: '#059669' }}>單元 {u.id}</span>
                  <span className="unit-strand">{u.strand}</span>
                </div>
                <h4>{u.title}</h4>
                <p className="unit-sub">{u.subtitle}</p>

                <div className="unit-progress-bar-wrap">
                  <div className="unit-progress-bar-fill" style={{ width: `${uPct}%`, background: '#10b981' }} />
                </div>
                <div className="unit-meta-footer">
                  <span>{uDone}/{u.questions.length} 題完成 ({uPct}%)</span>
                  {isCurrent && <span className="current-indicator" style={{ color: '#059669' }}>進行中 ●</span>}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 當前單元核心概念速讀 Concept Cards */}
      <section className="concepts-section">
        <h3>💡 單元 {currentUnit.id} 核心觀念與必考化學反應</h3>
        <div className="concept-cards-grid">
          {currentUnit.concepts.map((concept, idx) => (
            <div key={idx} className="concept-item-card" style={{ borderLeftColor: '#059669' }}>
              <span className="concept-idx" style={{ color: '#059669' }}>重點 0{idx + 1}</span>
              <div className="concept-text">
                <MathFormula math={concept} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 實驗室教具快捷入口 */}
      {gradeInfo.labs && gradeInfo.labs.length > 0 && (
        <section className="labs-section">
          <h3>🔬 互動化學實驗室教具</h3>
          <div className="labs-grid">
            {gradeInfo.labs.map((lab) => (
              <div
                key={lab.id}
                className="lab-entry-card"
                onClick={() => onOpenLab(lab.id)}
              >
                <div className="lab-icon" style={{ background: '#d1fae5' }}>🧪</div>
                <div className="lab-info">
                  <h4>{lab.name}</h4>
                  <p>{lab.description}</p>
                </div>
                <button type="button" className="btn-enter-lab" style={{ color: '#059669' }}>
                  開啟實驗室 →
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
