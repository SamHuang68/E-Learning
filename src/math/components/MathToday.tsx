import { teachingCopy } from '../../i18n/teachingCopy'
import React from 'react'
import type { MathGradeInfo, MathUnit } from '../data/curriculum'
import type { MathProgressState } from '../utils/mathStorage'
import { MathFormula } from './MathFormula'
import { SolvingSignalCards } from './SolvingSignalCards'
import { WhyThisNext } from '../../components/WhyThisNext'
import { useI18n } from '../../i18n/i18n'

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
  const { t, locale } = useI18n()
  return (
    <div className="math-today-view">
      {/* 頂部年級 Banner */}
      <section className="math-hero-card compact-hero">
        <div className="hero-header-line">
          <div className="hero-title-group">
            <span className="stage-pill">{teachingCopy(locale, gradeInfo.band)}</span>
            <h2>{t('math.today.classroom', { name: locale === 'en' ? gradeInfo.nameEn : gradeInfo.name })}</h2>
            {gradeInfo.targetExam && (
              <span className="exam-target-pill">🎯 {gradeInfo.targetExam}</span>
            )}
          </div>
          <span className="hero-desc-inline">{teachingCopy(locale, gradeInfo.description)}</span>
        </div>
        <WhyThisNext kind="unit" />

        <div className="hero-quick-actions">
          <button type="button" className="btn-hero-primary" onClick={onStartPractice}>
            ▶ {t('math.today.practice', { title: teachingCopy(locale, currentUnit.title) })}
          </button>
          <button
            type="button"
            className="btn-hero-secondary"
            onClick={onOpenVisual}
          >
            🎨 {t('math.today.visual')}
          </button>
          {currentUnit.suggestedLab && (
            <button
              type="button"
              className="btn-hero-secondary"
              onClick={() => onOpenLab(currentUnit.suggestedLab!)}
            >
              🧪 {t('math.today.lab')}
            </button>
          )}
          <button type="button" className="btn-hero-secondary" onClick={onOpenMock}>
            📝 {t('math.today.mock')}
          </button>
          <button type="button" className="btn-hero-secondary" onClick={onOpenVault}>
            📖 {t('math.today.vault', { count: progress.errorQuestions.length })}
          </button>
        </div>
      </section>

      {/* 單元地圖 Unit Map */}
      <section className="unit-map-section">
        <div className="section-title-row">
          <h3>{t('math.today.units')}</h3>
          <span className="unit-count-badge">{t('math.today.unitCount', { count: gradeInfo.units.length })}</span>
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
                  <span className="unit-seq">{t('math.today.unitN', { n: u.id })}</span>
                  <span className="unit-strand">{u.strand}</span>
                </div>
                <h4>{teachingCopy(locale, u.title)}</h4>
                <p className="unit-sub">{teachingCopy(locale, u.subtitle)}</p>

                <div className="unit-progress-bar-wrap">
                  <div
                    className="unit-progress-bar-fill"
                    style={{ width: `${uPct}%` }}
                  />
                </div>
                <div className="unit-meta-footer">
                  <span>{t('math.today.donePct', { done: uDone, total: u.questions.length, pct: uPct })}</span>
                  {isCurrent && <span className="current-indicator">{t('math.today.inProgress')} ●</span>}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 當前單元核心概念速讀 Concept Cards */}
      <section className="concepts-section">
        <h3>💡 {t('math.today.concepts', { n: currentUnit.id })}</h3>
        <div className="concept-cards-grid">
          {currentUnit.concepts.map((concept, idx) => (
            <div key={idx} className="concept-item-card">
              <span className="concept-idx">{t('math.today.conceptN', { n: String(idx + 1).padStart(2, '0') })}</span>
              <div className="concept-text">
                <MathFormula math={teachingCopy(locale, concept)} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 實驗室教具快捷入口 */}
      {gradeInfo.labs.length > 0 && (
        <section className="labs-section">
          <h3>🧪 {t('math.today.labs')}</h3>
          <div className="labs-grid">
            {gradeInfo.labs.map((lab) => (
              <div
                key={lab.id}
                className="lab-entry-card"
                onClick={() => onOpenLab(lab.id)}
              >
                <div className="lab-icon">⚗️</div>
                <div className="lab-info">
                  <h4>{teachingCopy(locale, lab.name)}</h4>
                  <p>{teachingCopy(locale, lab.description)}</p>
                </div>
                <button type="button" className="btn-enter-lab">
                  {teachingCopy(locale, '開啟教具 →')}
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
