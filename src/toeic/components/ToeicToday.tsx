import type { CSSProperties } from 'react'
import type { ToeicCertificate, ToeicUnit } from '../data/certificates'
import type { LearningMeta, ToeicProgress } from '../../utils/storage'
import { Heatmap } from '../../components/Heatmap'
import { speakEnglish } from '../../utils/speech'

type Props = {
  cert: ToeicCertificate
  unit: ToeicUnit
  progress: ToeicProgress
  progressPct: number
  events: LearningMeta['events']
  onOpenPhonics: () => void
  onOpenBuilder: () => void
  onStartVocab: () => void
  onStartListening: () => void
  onStartGrammar: () => void
  onStartReview: () => void
  onStartWeakTask: () => void
  onStartMock: () => void
  onStartPlacement?: () => void
  onSelectUnit: (id: number) => void
  dueCount: number
  newCount: number
  streak: number
  dailyDone: number
  dailyGoal: number
}

export function ToeicToday({
  cert,
  unit,
  progress,
  progressPct,
  events,
  onOpenPhonics,
  onOpenBuilder,
  onStartVocab,
  onStartListening,
  onStartGrammar,
  onStartReview,
  onStartWeakTask,
  onStartMock,
  onStartPlacement,
  onSelectUnit,
  dueCount,
  newCount,
  streak,
  dailyDone,
  dailyGoal,
}: Props) {
  const overall = progressPct
  const ringDeg = Math.round((overall / 100) * 360)
  const totalQueue = dueCount + newCount

  return (
    <section className="study-section">
      <section
        className="unit-banner"
        style={{ '--unit-color': cert.color } as CSSProperties}
      >
        <div>
          <span className="unit-pill">
            {cert.name} · {cert.scoreMin}–{cert.scoreMax} · Unit {unit.id}
          </span>
          <h2>{unit.titleEn}</h2>
          <p>{cert.audience}</p>
          <div className="banner-actions">
            <button
              type="button"
              onClick={() => {
                speakEnglish(unit.titleEn)
                onStartVocab()
              }}
            >
              Start learning →
            </button>
            <span>
              Vocab {unit.words} · Listening {unit.listening} · Grammar 1
            </span>
          </div>
        </div>
        <div className="toeic-cert-visual" aria-hidden="true">
          <div style={{ background: cert.colorSoft, borderColor: cert.color }}>
            <strong style={{ color: cert.color }}>{cert.nameEn}</strong>
            <span>
              {cert.scoreMin}–{cert.scoreMax}
            </span>
          </div>
        </div>
        <div
          className="progress-ring"
          style={{ '--progress': `${ringDeg}deg` } as CSSProperties}
        >
          <div>
            <strong>{overall}%</strong>
            <small>Unit</small>
          </div>
        </div>
      </section>

      <div className="daily-review">
        <div>
          <p className="eyebrow">SRS · TODAY</p>
          <h2>
            {streak}-day streak · {dailyDone}/{dailyGoal} cards
          </h2>
          <span>
            Due reviews: {dueCount} cards · New lesson: {newCount} cards. Practice saves spacing,
            daily goal progress, and achievements.
          </span>
        </div>
        <div className="flash-actions">
          <button type="button" className="ghost" onClick={onStartWeakTask}>
            弱項任務
          </button>
          <button
            type="button"
            className="primary-btn inline"
            disabled={totalQueue <= 0}
            onClick={onStartReview}
          >
            Today Review →
          </button>
        </div>
      </div>

      <Heatmap events={events} />

      {cert.id === 'orange' && (
        <div className="daily-review">
          <div>
            <p className="eyebrow">FOUNDATION</p>
            <h2>先打好發音與基礎字？</h2>
            <span>橘／棕級建議先完成字母與高頻字語音導讀。</span>
          </div>
          <button
            type="button"
            className="primary-btn inline"
            onClick={onOpenPhonics}
          >
            Phonics →
          </button>
        </div>
      )}

      <div className="section-heading">
        <div>
          <p className="eyebrow">TODAY&apos;S PLAN</p>
          <h2>本單元學習路徑</h2>
        </div>
        <span>Vocab → Listening → Grammar</span>
      </div>

      <div className="task-grid">
        <button type="button" onClick={onStartVocab}>
          <i>V</i>
          <span>TASK 01</span>
          <h3>{unit.title}</h3>
          <p>
            {progress.vocabDone}/{unit.words} words
          </p>
          <b>Go →</b>
        </button>
        <button type="button" onClick={onStartListening}>
          <i>♪</i>
          <span>TASK 02</span>
          <h3>Listening</h3>
          <p>
            {progress.listeningDone}/{unit.listening} items
          </p>
          <b>Go →</b>
        </button>
        <button type="button" onClick={onStartGrammar}>
          <i>G</i>
          <span>TASK 03</span>
          <h3>Polite / diplomatic｜{unit.grammar}</h3>
          <p>
            {progress.grammarStarted
              ? 'In progress · register, scenario, and polite choices'
              : 'Not started · choose polite forms by scenario'}
          </p>
          <b>Go →</b>
        </button>
      </div>

      <div className="result-panel">
        <div>
          <strong>{overall}%</strong>
          <span>Unit {unit.id}</span>
        </div>
        <ul>
          <li>
            Vocab: {progress.vocabDone}/{unit.words}
          </li>
          <li>
            Listening: {progress.listeningDone}/{unit.listening}
          </li>
          <li>
            Polite patterns:{' '}
            {progress.grammarStarted ? 'In progress' : 'Pending'}
          </li>
        </ul>
        <p>{cert.audience}</p>
        <button type="button" className="text-link" onClick={onOpenBuilder}>
          Open lesson builder →
        </button>
        {onStartPlacement && (
          <button type="button" className="text-link" onClick={onStartPlacement}>
            Retake placement →
          </button>
        )}
      </div>

      <button type="button" className="unit-test-card" onClick={onStartMock}>
        <span>FINAL CHECKPOINT</span>
        <div>
          <strong>Unit mock · 15 questions</strong>
          <small>Vocab, listening, and polite pattern mixed review</small>
        </div>
        <b>Start mock →</b>
      </button>

      <div className="unit-map">
        <h3>{cert.mapTitle}</h3>
        <p>{cert.mapDesc}</p>
        <div>
          {cert.units.map((u) => (
            <button
              key={u.id}
              type="button"
              className={u.id === unit.id ? 'active' : ''}
              onClick={() => onSelectUnit(u.id)}
            >
              {u.id}
              <small>{u.title}</small>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
