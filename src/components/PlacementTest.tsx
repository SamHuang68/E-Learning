import { useMemo, useState } from 'react'
import { enPlacementQuestions } from '../data/placement/en'
import { jaPlacementQuestions } from '../data/placement/ja'
import { useI18n } from '../i18n/i18n'
import {
  scorePlacement,
  type PlacementQuestion,
  type PlacementResult,
} from '../engine/placement'

type Props = {
  lang: 'ja' | 'en'
  questions?: PlacementQuestion[]
  onComplete: (result: PlacementResult) => void
  onExit: () => void
}

function resultLabel(result: PlacementResult): string {
  return 'certificateId' in result
    ? `TOEIC ${result.band}`
    : `JLPT ${result.band}`
}

export function PlacementTest({ lang, questions: suppliedQuestions, onComplete, onExit }: Props) {
  const { locale } = useI18n()
  const isEn = locale === 'en'
  const trackLabel = isEn
    ? lang === 'ja' ? 'Japanese' : 'English'
    : lang === 'ja' ? '日語' : '英語'
  const questions = useMemo<PlacementQuestion[]>(
    () => suppliedQuestions ?? (lang === 'ja' ? jaPlacementQuestions : enPlacementQuestions),
    [lang, suppliedQuestions],
  )
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<PlacementResult | null>(null)

  const question = questions[index]
  const answered = question ? answers[question.id] : undefined
  const progress = Math.round(((index + 1) / questions.length) * 100)

  function choose(choiceIndex: number) {
    if (!question || result) return
    setAnswers((previous) => ({ ...previous, [question.id]: choiceIndex }))
  }

  function finish() {
    const selectedAnswers = Object.fromEntries(
      questions.map((item) => {
        const selectedIndex = answers[item.id]
        return [item.id, selectedIndex === undefined ? '' : (item.choices[selectedIndex] ?? '')]
      }),
    )
    const nextResult = scorePlacement(selectedAnswers, questions)
    setResult(nextResult)
    onComplete(nextResult)
  }

  if (!question) {
    return (
      <section className="practice-view placement-test" lang={locale}>
        <button type="button" className="ghost back" onClick={onExit}>
          {isEn ? '← Back' : '← 返回'}
        </button>
        <div className="practice-card">
          <div className="flash-face">
            <strong>{isEn ? 'No placement questions available' : '尚無分級題目'}</strong>
            <p>{isEn ? 'Please try again later.' : '請稍後再試。'}</p>
          </div>
        </div>
      </section>
    )
  }

  if (result) {
    return (
      <section className="practice-view placement-test" lang={locale}>
        <p className="eyebrow">PLACEMENT RESULT</p>
        <h1>{isEn ? `${trackLabel} Placement Complete` : `${trackLabel}分級完成`}</h1>
        <div className="practice-card">
          <div className="flash-face">
            <strong>{resultLabel(result)}</strong>
            <span className="flash-meaning">
              {isEn ? 'Score' : '得分'} {result.score} / {questions.length}
            </span>
            <p>
              {isEn
                ? lang === 'ja'
                  ? 'Your suggested starting JLPT band is ready.'
                  : 'Your suggested TOEIC certificate track is ready.'
                : '系統已依本次作答建議起始級距。'}
            </p>
            <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.5rem' }}>
              {isEn
                ? lang === 'ja'
                  ? 'Score bands are for learning reference only. They are not official JLPT results.'
                  : 'Score bands are for learning reference only. They are not official ETS TOEIC scores.'
                : lang === 'ja'
                  ? '級距僅供學習參考，並非官方 JLPT 成績。'
                  : '級距僅供學習參考，並非官方 ETS TOEIC 成績。'}
            </p>
          </div>
          <div className="flash-actions">
            <button type="button" className="primary-btn inline" onClick={onExit}>
              {isEn ? 'Done' : '完成'}
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="practice-view placement-test" lang={locale}>
      <button type="button" className="ghost back" onClick={onExit}>
        {isEn ? '← Back' : '← 返回'}
      </button>
      <p className="eyebrow">PLACEMENT · {lang.toUpperCase()}</p>
      <h1>
        {isEn ? `${trackLabel} Placement Test` : `${trackLabel}分級測驗`}
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
          <strong lang={lang}>{question.prompt}</strong>
        </div>
        <div className="choice-grid">
          {question.choices.map((choice, choiceIndex) => (
            <button
              type="button"
              key={choice}
              className={choiceIndex === answered ? 'choice-btn selected' : 'choice-btn'}
              aria-pressed={choiceIndex === answered}
              onClick={() => choose(choiceIndex)}
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
            {isEn ? '← Previous' : '← 上一題'}
          </button>
          {index < questions.length - 1 ? (
            <button
              type="button"
              className="primary-btn inline"
              disabled={answered === undefined}
              onClick={() => setIndex((current) => Math.min(questions.length - 1, current + 1))}
            >
              {isEn ? 'Next →' : '下一題 →'}
            </button>
          ) : (
            <button
              type="button"
              className="primary-btn inline"
              disabled={answered === undefined}
              onClick={finish}
            >
              {isEn ? 'View placement' : '查看級距'}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
