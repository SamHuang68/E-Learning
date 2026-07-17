import type { CSSProperties } from 'react'
import type { ToeicCertificate, ToeicUnit } from '../data/certificates'
import type { ToeicProgress } from '../../utils/storage'
import { speakEnglish } from '../../utils/speech'

type Props = {
  cert: ToeicCertificate
  unit: ToeicUnit
  progress: ToeicProgress
  onOpenPhonics: () => void
  onOpenBuilder: () => void
  onStartVocab: () => void
  onStartListening: () => void
  onStartGrammar: () => void
  onSelectUnit: (id: number) => void
}

export function ToeicToday({
  cert,
  unit,
  progress,
  onOpenPhonics,
  onOpenBuilder,
  onStartVocab,
  onStartListening,
  onStartGrammar,
  onSelectUnit,
}: Props) {
  const vocabPct = Math.round((progress.vocabDone / unit.words) * 100)
  const listenPct = Math.round((progress.listeningDone / unit.listening) * 100)
  const grammarPct = progress.grammarStarted ? 40 : 0
  const overall = Math.round((vocabPct + listenPct + grammarPct) / 3)
  const ringDeg = Math.round((overall / 100) * 360)

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
              ? 'In progress · register & scenarios'
              : 'Not started · business politeness'}
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
      </div>

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
