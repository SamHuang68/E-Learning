import type { ToeicUnit } from '../data/certificates'
import { speakEnglish } from '../../utils/speech'

type Props = {
  kind: 'vocab' | 'listening' | 'grammar'
  unit: ToeicUnit
  onBack: () => void
  onProgress: () => void
}

export function ToeicPractice({ kind, unit, onBack, onProgress }: Props) {
  const sample =
    kind === 'vocab'
      ? {
          eyebrow: 'VOCABULARY',
          title: 'Word Practice',
          en: 'deadline',
          tip: '截止日期',
          sentence: 'The deadline is Friday.',
        }
      : kind === 'listening'
        ? {
            eyebrow: 'LISTENING',
            title: 'Listen & Repeat',
            en: 'Could you send the report by noon?',
            tip: '聽完跟讀',
            sentence: 'Focus on polite request intonation.',
          }
        : {
            eyebrow: 'GRAMMAR',
            title: 'Pattern Drill',
            en: unit.grammar,
            tip: '句型精練',
            sentence: `Practice patterns for: ${unit.titleEn}`,
          }

  return (
    <section className="practice-view">
      <button type="button" className="ghost back" onClick={onBack}>
        ← Back
      </button>
      <p className="eyebrow">{sample.eyebrow}</p>
      <h1>
        {sample.title}
        <span>Unit {unit.id}</span>
      </h1>
      <p className="lede">{unit.titleEn}</p>

      <div className="practice-card">
        <div className="flash-face">
          <strong>{sample.en}</strong>
          <span>{sample.tip}</span>
          <p>{sample.sentence}</p>
        </div>
        <div className="flash-actions">
          <button
            type="button"
            className="ghost"
            onClick={() => speakEnglish(sample.en)}
          >
            🔊 Speak
          </button>
          <button type="button" className="primary-btn inline" onClick={onProgress}>
            Mark done +XP
          </button>
        </div>
      </div>
    </section>
  )
}
