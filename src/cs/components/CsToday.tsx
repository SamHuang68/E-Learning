import React, { useState } from 'react'
import type { CsProgress } from '../utils/csStorage'
import { CS_CURRICULUM, getCsQuestionCount, getNextCsUnit, isCsAdvancedUnit } from '../data/curriculum'
import { computeCsRadar } from '../../engine/radar'
import { useI18n } from '../../i18n/i18n'
import { localizeTrackRadar } from '../../i18n/radarI18n'
import { localizeCsUnit } from '../../i18n/csTeachingCopy'
import type { CsNavSection } from './CsTopNav'
import { CsBigOCard } from './CsBigOCard'
import { CsHttpTcpCard } from './CsHttpTcpCard'
import { WhyThisNext } from '../../components/WhyThisNext'
import { CS_LAB_ID } from '../csLabRegistry'

interface Props {
  progress: CsProgress
  onNavigate: (section: CsNavSection, unitId?: string) => void
}

export const CsToday: React.FC<Props> = ({ progress, onNavigate }) => {
  const { locale, t } = useI18n()
  const [showProgress, setShowProgress] = useState(false)
  const coreUnits = CS_CURRICULUM.filter((unit) => !isCsAdvancedUnit(unit))
  const coreQuestions = coreUnits.flatMap((unit) => unit.questions)
  const completedQuestionIds = new Set(progress.completedQuestions)
  const completedCoreCount = coreQuestions.filter((question) => completedQuestionIds.has(question.id)).length
  const hasCompletedCorePath = coreQuestions.length > 0 && completedCoreCount === coreQuestions.length
  const nextUnit = getNextCsUnit(progress.completedQuestions)
  const reviewUnit = coreUnits[0] ?? nextUnit
  const localizedNextUnit = localizeCsUnit(locale, nextUnit)
  const unitIndex = CS_CURRICULUM.findIndex((unit) => unit.id === nextUnit.id) + 1
  const remaining = nextUnit.questions.filter((q) => !progress.completedQuestions.includes(q.id)).length
  const doneInUnit = nextUnit.questions.length - remaining
  const totalQuestions = getCsQuestionCount()
  const completedCount = progress.completedQuestions.length
  const hasProgress = completedCount > 0 || progress.xp > 0
  const labId = nextUnit.suggestedLab
  const showAdvancedLab = labId === CS_LAB_ID.AI_TRANSFORMER && isCsAdvancedUnit(nextUnit)

  const radar = localizeTrackRadar(
    computeCsRadar(
      progress.completedQuestions,
      progress.examScores,
      progress.labCompleted,
    ),
    locale,
  )

  return (
    <div className="cs-today" lang={locale}>
      <header className="cs-today-hero">
        <p className="eyebrow">
          {hasCompletedCorePath
            ? t('cs.today.coreCompleteEyebrow')
            : t('cs.today.unitOf', { n: unitIndex, total: CS_CURRICULUM.length })}
        </p>
        <h1>
          {hasCompletedCorePath
            ? t('cs.today.coreCompleteTitle')
            : t('cs.today.next', { title: localizedNextUnit.title.replace(/^Unit \d+:\s*/, '') })}
        </h1>
        {hasCompletedCorePath ? null : <WhyThisNext kind="unit" />}
        <p className="lede">
          {hasCompletedCorePath ? t('cs.today.coreCompleteBody') : localizedNextUnit.subtitle}
        </p>
        <p className="cs-today-progress-line">
          {hasCompletedCorePath
            ? t('cs.today.coreItems', { done: completedCoreCount, total: coreQuestions.length })
            : t('cs.today.unitItems', { done: doneInUnit, total: nextUnit.questions.length })}
          {!hasCompletedCorePath && hasProgress ? ` · ${completedCount}/${totalQuestions}` : ''}
        </p>
        <div className="hub-hero-actions">
          <button
            type="button"
            className="hub-primary-cta"
            onClick={() => onNavigate('practice', hasCompletedCorePath ? reviewUnit.id : nextUnit.id)}
          >
            {hasCompletedCorePath ? t('cs.today.reviewCore') : t('cs.today.practice')}
          </button>
          {!hasCompletedCorePath && labId && !showAdvancedLab ? (
            <button type="button" className="hub-secondary-cta" onClick={() => onNavigate(labId)}>
              {t('cs.today.labFirst')}
            </button>
          ) : !hasCompletedCorePath ? (
            <button type="button" className="hub-secondary-cta" onClick={() => onNavigate('textbook')}>
              {t('cs.today.readerCh', { n: unitIndex })}
            </button>
          ) : null}
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
      <CsHttpTcpCard />

      {showProgress && hasProgress ? (
        <section className="cs-today-radar" aria-label={t('cs.today.coverage')}>
          <div className="section-header-row">
            <h2>{t('cs.today.coverage')}</h2>
            <span className="section-subtext">{t('vault.avgLine', { score: radar.averageScore })}</span>
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
