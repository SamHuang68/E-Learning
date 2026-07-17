import { useMemo, useState } from 'react'
import { enPlacementQuestions } from '../data/placement/en'
import { jaPlacementQuestions } from '../data/placement/ja'
import {
  scorePlacement,
  type PlacementQuestion,
  type PlacementResult,
} from '../engine/placement'

type Props = {
  lang: 'ja' | 'en'
  onComplete: (result: PlacementResult) => void
  onExit: () => void
}

function resultLabel(result: PlacementResult): string {
  return 'certificateId' in result
    ? `TOEIC ${result.band}`
    : `JLPT ${result.band}`
}

export function PlacementTest({ lang, onComplete, onExit }: Props) {
  const questions = useMemo<PlacementQuestion[]>(
    () => (lang === 'ja' ? jaPlacementQuestions : enPlacementQuestions),
    [lang],
  )
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<PlacementResult | null>(null)

  const question = questions[index]
  const answered = question ? answers[question.id] : undefined
  const progress = Math.round(((index + 1) / questions.length) * 100)

  function choose(choice: string) {
    if (!question || result) return
    setAnswers((previous) => ({ ...previous, [question.id]: choice }))
  }

  function finish() {
    const nextResult = scorePlacement(answers, questions)
    setResult(nextResult)
    onComplete(nextResult)
  }

  if (!question) {
    return (
      <section className="practice-view placement-test">
        <button type="button" className="ghost back" onClick={onExit}>
          ← 返回
        </button>
        <div className="practice-card">
          <div className="flash-face">
            <strong>尚無分級題目</strong>
            <p>請稍後再試。</p>
          </div>
        </div>
      </section>
    )
  }

  if (result) {
    return (
      <section className="practice-view placement-test">
        <p className="eyebrow">PLACEMENT RESULT</p>
        <h1>{lang === 'ja' ? '日語分級完成' : 'English Placement Complete'}</h1>
        <div className="practice-card">
          <div className="flash-face">
            <strong>{resultLabel(result)}</strong>
            <span className="flash-meaning">
              Score {result.score} / {questions.length}
            </span>
            <p>
              {lang === 'ja'
                ? '系統已依本次作答建議起始級距。'
                : 'Your suggested TOEIC certificate track is ready.'}
            </p>
          </div>
          <div className="flash-actions">
            <button type="button" className="primary-btn inline" onClick={onExit}>
              完成
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="practice-view placement-test">
      <button type="button" className="ghost back" onClick={onExit}>
        ← 返回
      </button>
      <p className="eyebrow">PLACEMENT · {lang.toUpperCase()}</p>
      <h1>
        {lang === 'ja' ? '日語分級測驗' : 'English Placement'}
        <span>
          {index + 1} / {questions.length}
        </span>
      </h1>
      <div className="progress-bar-track" aria-hidden="true">
        <span className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="practice-card">
        <div className="flash-face">
          <span className="scenario-chip">{question.tag}</span>
          <strong>{question.prompt}</strong>
        </div>
        <div className="choice-grid">
          {question.choices.map((choice) => (
            <button
              type="button"
              key={choice}
              className={choice === answered ? 'choice-btn selected' : 'choice-btn'}
              onClick={() => choose(choice)}
            >
              {choice}
            </button>
          ))}
        </div>
        <div className="flash-actions">
          <button
            type="button"
            className="ghost"
            disabled={index <= 0}
            onClick={() => setIndex((current) => Math.max(0, current - 1))}
          >
            ← 上一題
          </button>
          {index < questions.length - 1 ? (
            <button
              type="button"
              className="primary-btn inline"
              disabled={!answered}
              onClick={() => setIndex((current) => Math.min(questions.length - 1, current + 1))}
            >
              下一題 →
            </button>
          ) : (
            <button
              type="button"
              className="primary-btn inline"
              disabled={!answered}
              onClick={finish}
            >
              查看級距
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
