import { use } from 'react'
import { loadStemConceptCopy, stemConceptCopy } from '../../i18n/stemConceptCopy'
import { stemCatalogCopy } from '../../i18n/stemCatalogCopy'
import { stemVaultCopy } from '../../i18n/stemVaultCopy'
import React from 'react'
import type { PhysicsGradeInfo, PhysicsUnit } from '../data/curriculum'
import type { PhysicsProgressState } from '../utils/physicsStorage'
import { MathFormula } from '../../math/components/MathFormula'
import { useI18n } from '../../i18n/i18n'
import { WhyThisNext } from '../../components/WhyThisNext'

type Props = {
  gradeInfo: PhysicsGradeInfo
  currentUnit: PhysicsUnit
  progress: PhysicsProgressState
  onSelectUnit: (unitId: number) => void
  onStartPractice: () => void
  onOpenLab: (labId: string) => void
  onOpenMock: () => void
  onOpenVault: () => void
  onOpenSignals: () => void
  onOpenFormulas: () => void
}

export const PhysicsToday: React.FC<Props> = ({
  gradeInfo,
  currentUnit,
  progress,
  onSelectUnit,
  onStartPractice,
  onOpenLab,
  onOpenMock,
  onOpenVault,
  onOpenSignals,
  onOpenFormulas,
}) => {
  const { t, locale } = useI18n()
  if (locale === 'en') use(loadStemConceptCopy())
  return (
    <div className="math-today-view physics-today-view">
      {/* 頂部年級 Banner */}
      <section className="math-hero-card compact-hero" style={{ background: 'linear-gradient(135deg, #0369a1, #0284c7)' }}>
        <div className="hero-header-line">
          <div className="hero-title-group">
            <span className="stage-pill">{stemVaultCopy(locale, gradeInfo.band)}</span>
            <h2>{locale === 'en' ? `${gradeInfo.nameEn} · physics classroom` : `${gradeInfo.name} · 物理素養教室`}</h2>
            {gradeInfo.targetExam && (
              <span className="exam-target-pill">🎯 {locale === 'en' ? gradeInfo.targetExam.match(/CAP|GSAT|AST/)?.[0] ?? gradeInfo.targetExam : gradeInfo.targetExam}</span>
            )}
          </div>
          <span className="hero-desc-inline">{stemCatalogCopy(locale, gradeInfo.description)}</span>
        </div>
        <WhyThisNext kind="unit" />

        <div className="hero-quick-actions">
          <button type="button" className="btn-hero-primary" onClick={onStartPractice}>
            ▶ {locale === 'en' ? t('math.today.practice', { title: stemCatalogCopy(locale, currentUnit.title) }) : `單元練習 (${currentUnit.title})`}
          </button>
          <button type="button" className="btn-hero-secondary" onClick={onOpenSignals}>
            ⚡ {locale === 'en' ? '3-second problem cues' : '3秒破題訊號'}
          </button>
          <button type="button" className="btn-hero-secondary" onClick={onOpenFormulas}>
            {t('physics.formulas.open')}
          </button>
          {currentUnit.suggestedLab && (
            <button
              type="button"
              className="btn-hero-secondary"
              onClick={() => onOpenLab(currentUnit.suggestedLab!)}
            >
              🧪 {locale === 'en' ? 'Unit lab' : '專屬實驗室'}
            </button>
          )}
          <button type="button" className="btn-hero-secondary" onClick={onOpenMock}>
            📝 {locale === 'en' ? 'Mock exam' : '模擬測驗'}
          </button>
          <button type="button" className="btn-hero-secondary" onClick={onOpenVault}>
            📖 {t('math.today.vault', { count: progress.errorQuestions.length })}
          </button>
        </div>
      </section>

      {/* 單元地圖 Unit Map */}
      <section className="unit-map-section">
        <div className="section-title-row">
          <h3>{locale === 'en' ? 'Physics curriculum units' : '課程單元路徑 (Physics Curriculum Units)'}</h3>
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
                role="button"
                tabIndex={0}
                className={`unit-map-card ${isCurrent ? 'active' : ''}`}
                onClick={() => onSelectUnit(u.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onSelectUnit(u.id)
                  }
                }}
              >
                <div className="unit-card-header">
                  <span className="unit-seq">{t('math.today.unitN', { n: u.id })}</span>
                  <span className="unit-strand">{u.strand}</span>
                </div>
                <h4>{stemCatalogCopy(locale, u.title)}</h4>
                <p className="unit-sub">{stemCatalogCopy(locale, u.subtitle)}</p>

                <div className="unit-progress-bar-wrap">
                  <div className="unit-progress-bar-fill" style={{ width: `${uPct}%`, background: '#38bdf8' }} />
                </div>
                <div className="unit-meta-footer">
                  <span>{t('math.today.donePct', { done: uDone, total: u.questions.length, pct: uPct })}</span>
                  {isCurrent && <span className="current-indicator" style={{ color: '#0284c7' }}>{t('math.today.inProgress')} ●</span>}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 當前單元核心概念速讀 Concept Cards */}
      <section className="concepts-section">
        <h3>💡 {locale === 'en' ? `Unit ${currentUnit.id} concepts and key physics formulas` : `單元 ${currentUnit.id} 核心觀念與必考物理公式`}</h3>
        <div className="concept-cards-grid">
          {currentUnit.concepts.map((concept, idx) => (
            <div key={idx} className="concept-item-card" style={{ borderLeftColor: '#0284c7' }}>
              <span className="concept-idx" style={{ color: '#0284c7' }}>{t('math.today.conceptN', { n: `0${idx + 1}` })}</span>
              <div className="concept-text">
                <MathFormula math={stemConceptCopy(locale, concept)} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 實驗室教具快捷入口 */}
      {gradeInfo.labs.length > 0 && (
        <section className="labs-section">
          <h3>🧪 {locale === 'en' ? 'Interactive physics labs' : '互動物理實驗室教具'}</h3>
          <div className="labs-grid">
            {gradeInfo.labs.map((lab) => (
              <div
                key={lab.id}
                className="lab-entry-card"
                onClick={() => onOpenLab(lab.id)}
              >
                <div className="lab-icon" style={{ background: '#e0f2fe' }}>⚛️</div>
                <div className="lab-info">
                  <h4>{stemCatalogCopy(locale, lab.name)}</h4>
                  <p>{stemCatalogCopy(locale, lab.description)}</p>
                </div>
                <button type="button" className="btn-enter-lab" style={{ color: '#0284c7' }}>
                  {locale === 'en' ? 'Open lab →' : '開啟實驗室 →'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
