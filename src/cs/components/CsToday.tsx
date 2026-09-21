import React, { useState } from 'react'
import type { CsProgress } from '../utils/csStorage'
import { CS_CURRICULUM, getCsQuestionCount, getNextCsUnit, isCsAdvancedUnit } from '../data/curriculum'
import { computeCsRadar } from '../../engine/radar'
import { useI18n } from '../../i18n/i18n'
import type { CsNavSection } from './CsTopNav'
import { CsBigOCard } from './CsBigOCard'

interface Props {
  progress: CsProgress
  onNavigate: (section: CsNavSection, unitId?: string) => void
}

export const CsToday: React.FC<Props> = ({ progress, onNavigate }) => {
  const { t } = useI18n()
  const [showProgress, setShowProgress] = useState(false)
  const nextUnit = getNextCsUnit(progress.completedQuestions)
  const unitIndex = CS_CURRICULUM.findIndex((unit) => unit.id === nextUnit.id) + 1
  const remaining = nextUnit.questions.filter((q) => !progress.completedQuestions.includes(q.id)).length
  const doneInUnit = nextUnit.questions.length - remaining
  const totalQuestions = getCsQuestionCount()
  const completedCount = progress.completedQuestions.length
  const hasProgress = completedCount > 0 || progress.xp > 0
  const labId = nextUnit.suggestedLab as CsNavSection | undefined
  const showAdvancedLab = labId === 'ai-transformer' && isCsAdvancedUnit(nextUnit)

  const radar = computeCsRadar(
    progress.completedQuestions,
    progress.examScores,
    progress.labCompleted,
  )

  return (
    <div className="cs-today">
      <header className="cs-today-hero">
        <p className="eyebrow">{t('cs.today.unitOf', { n: unitIndex, total: CS_CURRICULUM.length })}</p>
        <h1>{t('cs.today.next', { title: nextUnit.title.replace(/^單元 \d+：/, '') })}</h1>
        <p className="lede">{nextUnit.subtitle}</p>
        <p className="cs-today-progress-line">
          {t('cs.today.unitItems', { done: doneInUnit, total: nextUnit.questions.length })}
          {hasProgress ? ` · ${completedCount}/${totalQuestions}` : ''}
        </p>
        <div className="hub-hero-actions">
          <button
            type="button"
            className="hub-primary-cta"
            onClick={() => onNavigate('practice', nextUnit.id)}
          >
            {t('cs.today.practice')}
          </button>
          {labId && !showAdvancedLab ? (
            <button type="button" className="hub-secondary-cta" onClick={() => onNavigate(labId)}>
              {t('cs.today.labFirst')}
            </button>
          ) : (
            <button type="button" className="hub-secondary-cta" onClick={() => onNavigate('textbook')}>
              {t('cs.today.readerCh', { n: unitIndex })}
            </button>
          )}
        </div>
        <div className="cs-today-secondary">
          <button type="button" onClick={() => onNavigate('hierarchy')}>
            {t('cs.today.outline')}
          </button>
          <button type="button" onClick={() => onNavigate('textbook')}>
            {t('cs.today.reader')}
          </button>
          {hasProgress ? (
            <button type="button" onClick={() => setShowProgress((open) => !open)}>
              {showProgress ? t('cs.today.hideCoverage') : t('cs.today.coverage')}
            </button>
          ) : null}
        </div>
      </header>

      <CsBigOCard />

      {showProgress && hasProgress ? (
        <section className="cs-today-radar" aria-label={t('cs.today.coverage')}>
          <div className="section-header-row">
            <h2>{t('cs.today.coverage')}</h2>
            <span className="section-subtext">平均 {radar.averageScore}／100</span>
          </div>
          {radar.dimensions.map((dim) => (
            <div key={dim.key} className="cs-radar-row">
              <div className="cs-radar-row-top">
                <span>{dim.label}</span>
                <strong>{dim.score}</strong>
              </div>
              <div className="cs-radar-bar">
                <i style={{ width: `${dim.score}%` }} />
              </div>
            </div>
          ))}
        </section>
      ) : null}
    </div>
  )
}
