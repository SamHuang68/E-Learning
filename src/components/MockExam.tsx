import { useEffect, useMemo, useState } from 'react'
import { enMockQuestions } from '../data/mock/en'
import { jaMockQuestions } from '../data/mock/ja'

export type MockExamQuestion = {
  id: string
  prompt: string
  choices: string[]
  answer: string
  tag: string
}

export type MockExamResult = {
  id: string
  tag: string
  selected: string | null
  correct: boolean
}

type Props = {
  lang: 'ja' | 'en'
  questions?: MockExamQuestion[]
  durationMinutes?: number | null
  onComplete: (result: {
    score: number
    weakTags: string[]
    results: MockExamResult[]
  }) => void
  onExit?: () => void
}

function formatClock(seconds: number): string {
  const safe = Math.max(0, seconds)
  const minutes = Math.floor(safe / 60)
  const rest = safe % 60
  return `${minutes}:${String(rest).padStart(2, '0')}`
}

function weakTags(results: MockExamResult[]): string[] {
  const totals = new Map<string, { wrong: number; total: number }>()
  results.forEach((result) => {
    const current = totals.get(result.tag) ?? { wrong: 0, total: 0 }
    current.total += 1
    if (!result.correct) current.wrong += 1
    totals.set(result.tag, current)
  })
  return [...totals.entries()]
    .filter(([, value]) => value.wrong > 0 && value.wrong / value.total >= 0.34)
    .sort((a, b) => b[1].wrong - a[1].wrong)
    .map(([tag]) => tag)
}

export function MockExam({
  lang,
  questions,
  durationMinutes = 10,
  onComplete,
  onExit,
}: Props) {
  const bank = useMemo<MockExamQuestion[]>(
    () => questions ?? (lang === 'ja' ? jaMockQuestions : enMockQuestions),
    [lang, questions],
  )
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [elapsed, setElapsed] = useState(0)
  const [summary, setSummary] = useState<{
    score: number
    weakTags: string[]
    results: MockExamResult[]
  } | null>(null)

  useEffect(() => {
    if (summary) return undefined
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [summary])

  const question = bank[index]
  const durationSeconds = durationMinutes === null ? null : durationMinutes * 60
  const remaining =
    durationSeconds === null ? null : Math.max(0, Math.round(durationSeconds - elapsed))
  const isOverSoftLimit = remaining === 0

  function finish() {
    const results = bank.map((item): MockExamResult => {
      const selected = answers[item.id] ?? null
      return {
        id: item.id,
        tag: item.tag,
        selected,
        correct: selected === item.answer,
      }
    })
    const score = results.filter((result) => result.correct).length
    const nextSummary = { score, weakTags: weakTags(results), results }
    setSummary(nextSummary)
    onComplete(nextSummary)
  }

  if (summary) {
    return (
      <section className="practice-view mock-exam">
        <p className="eyebrow">MOCK RESULT</p>
        <h1>{lang === 'ja' ? '模擬測驗結果' : 'Mock Exam Result'}</h1>
        <div className="practice-card">
          <div className="flash-face">
            <strong>
              {summary.score} / {bank.length}
            </strong>
            <span className="flash-meaning">
              Weak tags: {summary.weakTags.join(', ') || 'none'}
            </span>
            <p>
              {lang === 'ja'
                ? '請針對弱項標籤回到練習區複習。'
                : 'Use weak tags to choose your next review set.'}
            </p>
          </div>
          <div className="flash-actions">
            {onExit ? (
              <button type="button" className="primary-btn inline" onClick={onExit}>
                完成
              </button>
            ) : null}
          </div>
        </div>
      </section>
    )
  }

  if (!question) {
    return (
      <section className="practice-view mock-exam">
        <p className="eyebrow">MOCK</p>
        <div className="practice-card">
          <div className="flash-face">
            <strong>沒有題目</strong>
            <p>No mock questions are available.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="practice-view mock-exam">
      {onExit ? (
        <button type="button" className="ghost back" onClick={onExit}>
          ← 返回
        </button>
      ) : null}
      <p className="eyebrow">MOCK · {lang.toUpperCase()}</p>
      <h1>
        {lang === 'ja' ? '短版模擬測驗' : 'Short Mock Exam'}
        <span>
          {index + 1} / {bank.length}
        </span>
      </h1>
      {remaining !== null ? (
        <p className={isOverSoftLimit ? 'status-line warn' : 'status-line'}>
          Soft timer: {formatClock(remaining)}
          {isOverSoftLimit ? ' · 建議完成目前題目後交卷' : ''}
        </p>
      ) : null}

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
              className={answers[question.id] === choice ? 'choice-btn selected' : 'choice-btn'}
              onClick={() =>
                setAnswers((previous) => ({ ...previous, [question.id]: choice }))
              }
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
          <button
            type="button"
            className="ghost"
            disabled={index >= bank.length - 1}
            onClick={() => setIndex((current) => Math.min(bank.length - 1, current + 1))}
          >
            下一題 →
          </button>
          <button type="button" className="primary-btn inline" onClick={finish}>
            交卷
          </button>
        </div>
      </div>
    </section>
  )
}
