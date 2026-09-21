import type { CSSProperties } from 'react'
import type { JlptLevel, Unit } from '../data/course'
import { useI18n } from '../i18n/i18n'
import {
  aobaUnitChromeTitle,
  jlptMapDesc,
  jlptMapTitle,
  jlptTierLabel,
} from '../i18n/jlptChrome'
import type { ProgressState } from '../utils/storage'
import { HeroArt } from './HeroArt'

type Props = {
  level: JlptLevel
  unit: Unit
  progress: ProgressState
  onOpenBuilder: () => void
  onOpenKana: () => void
  onStartVocab: () => void
  onStartReading: () => void
  onStartGrammar: () => void
  onStartReview: () => void
  onStartMock: () => void
  onStartPlacement?: () => void
  onSelectUnit: (id: number) => void
  dueCount: number
  streak: number
  dailyDone: number
  dailyGoal: number
}

export function TodayView({
  level,
  unit,
  progress,
  onOpenBuilder,
  onOpenKana,
  onStartVocab,
  onStartReading,
  onStartGrammar,
  onStartReview,
  onStartMock,
  onStartPlacement,
  onSelectUnit,
  dueCount,
  streak,
  dailyDone,
  dailyGoal,
}: Props) {
  const { t, locale } = useI18n()
  const srsGuideUrl = `${import.meta.env.BASE_URL}srs-review.html`
  const vocabPct = Math.round((progress.vocabDone / unit.words) * 100)
  const readingPct = Math.round((progress.readingDone / unit.reading) * 100)
  const grammarPct = progress.grammarStarted ? 40 : 0
  const overall = Math.round((vocabPct + readingPct + grammarPct) / 3)
  const ringDeg = Math.round((overall / 100) * 360)

  if (overall === 0) {
    return (
      <section className="study-section today-view">
        <div className="empty-state-card" role="status" aria-live="polite">
          <h2>{t('todayView.emptyTitle')}</h2>
          <p>{t('todayView.emptyBody')}</p>
          <button
            type="button"
            className="primary-btn"
            onClick={onStartVocab}
          >
            {t('todayView.emptyCta')}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="study-section today-view">
      <section
        className="unit-banner"
        style={{ '--unit-color': level.color } as CSSProperties}
      >
        <div>
          <span className="unit-pill">
            {level.band} · {jlptTierLabel(level.tier, t)} · Unit {unit.id}
          </span>
          <h2>{unit.titleJa}</h2>
          <p>{level.audience}</p>
          <div className="banner-actions">
            <button type="button" onClick={onStartVocab}>
              {t('todayView.start')}
            </button>
            <span>
              {t('todayView.meta', { words: unit.words, reading: unit.reading })}
            </span>
          </div>
        </div>
        <HeroArt />
        <div
          className="progress-ring"
          style={{ '--progress': `${ringDeg}deg` } as CSSProperties}
        >
          <div>
            <strong>{overall}%</strong>
            <small>{t('todayView.unitProgress')}</small>
          </div>
        </div>
      </section>

      <div className="daily-review">
        <div>
          <p className="eyebrow">SRS · TODAY</p>
          <h2>
            {t('todayView.streak', { streak, done: dailyDone, goal: dailyGoal })}
          </h2>
          {dueCount > 0 ? (
            <span>{t('todayView.due', { count: dueCount })}</span>
          ) : (
            <div className="due-empty-state" role="status" aria-live="polite">
              <strong>{t('todayView.dueEmptyTitle')}</strong>
              <p>{t('todayView.dueEmptyBody')}</p>
            </div>
          )}
        </div>
        <div className="daily-review-actions">
          <button
            type="button"
            className="primary-btn inline"
            disabled={dueCount <= 0}
            onClick={onStartReview}
          >
            {t('todayView.review')}
          </button>
          <a
            className="srs-guide-link"
            href={srsGuideUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={t('todayView.srsGuideAria')}
          >
            {t('todayView.srsGuide')}
          </a>
          <span className="srs-guide-mobile-note">{t('todayView.srsMobile')}</span>
        </div>
      </div>

      <div className="daily-review">
        <div>
          <p className="eyebrow">{t('todayView.kanaEyebrow')}</p>
          <h2>{t('todayView.kanaTitle')}</h2>
          <span>
            {t('todayView.kanaBody', { band: level.band })}
          </span>
        </div>
        <button type="button" className="primary-btn inline" onClick={onOpenKana}>
          {t('todayView.kanaCta')}
        </button>
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">TODAY&apos;S PLAN</p>
          <h2>{t('todayView.planTitle')}</h2>
        </div>
        <span>{t('todayView.planMeta')}</span>
      </div>

      <div className="task-grid">
        <button type="button" onClick={onStartVocab}>
          <i>Aa</i>
          <span>TASK 01</span>
          <h3>{t('todayView.vocab')}</h3>
          <p>
            {t('todayView.done', { done: progress.vocabDone, total: unit.words })}
          </p>
          <b>{t('todayView.go')}</b>
        </button>
        <button type="button" onClick={onStartReading}>
          <i>読</i>
          <span>TASK 02</span>
          <h3>{unit.title}</h3>
          <p>
            {t('todayView.answered', { done: progress.readingDone, total: unit.reading })}
          </p>
          <b>{t('todayView.go')}</b>
        </button>
        <button type="button" onClick={onStartGrammar}>
          <i>文</i>
          <span>TASK 03</span>
          <h3>場面・敬語｜{unit.grammar}</h3>
          <p>
            {progress.grammarStarted
              ? t('todayView.grammarIn')
              : t('todayView.grammarNew')}
          </p>
          <b>{t('todayView.go')}</b>
        </button>
      </div>

      <div className="result-panel">
        <div>
          <strong>{overall}%</strong>
          <span>{t('todayView.complete', { id: unit.id })}</span>
        </div>
        <ul>
          <li>
            {t('todayView.vocabMastery', { done: progress.vocabDone, total: unit.words })}
          </li>
          <li>
            {t('todayView.readingMastery', { done: progress.readingDone, total: unit.reading })}
          </li>
          <li>
            {t('todayView.grammarLabel')}
            {progress.grammarStarted ? t('todayView.inProgress') : t('todayView.notStarted')}
          </li>
        </ul>
        <p>
          {t('todayView.audience', { tier: jlptTierLabel(level.tier, t), band: level.band })}
        </p>
        <button type="button" className="text-link" onClick={onOpenBuilder}>
          {t('todayView.builder')}
        </button>
        {onStartPlacement && (
          <button type="button" className="text-link" onClick={onStartPlacement}>
            {t('todayView.placement')}
          </button>
        )}
      </div>

      <button type="button" className="unit-test-card" onClick={onStartMock}>
        <span>FINAL CHECKPOINT</span>
        <div>
          <strong>{t('todayView.mockTitle')}</strong>
          <small>{t('todayView.mockMeta')}</small>
        </div>
        <b>{t('todayView.startTest')}</b>
      </button>

      <div className="unit-map">
        <h3>{jlptMapTitle(level, t)}</h3>
        <p>{jlptMapDesc(level, t)}</p>
        <div>
          {level.units.map((u) => (
            <button
              key={u.id}
              type="button"
              className={u.id === unit.id ? 'active' : ''}
              onClick={() => onSelectUnit(u.id)}
            >
              {u.id}
              <small>{aobaUnitChromeTitle(locale, u)}</small>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
