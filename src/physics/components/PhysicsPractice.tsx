import React, { useState } from 'react'
import type { PhysicsUnit } from '../data/curriculum'
import { MathFormula } from '../../math/components/MathFormula'

type Props = {
  unit: PhysicsUnit
  completedQuestions: string[]
  errorQuestions: string[]
  onAnswerCorrect: (qId: string, pts: number) => void
  onAnswerWrong: (qId: string) => void
  onNextUnit: () => void
}

export const PhysicsPractice: React.FC<Props> = ({
  unit,
  completedQuestions,
  onAnswerCorrect,
  onAnswerWrong,
  onNextUnit,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const questions = unit.questions
  const q = questions[currentIdx] || questions[0]
  if (!q) {
    return <div className="practice-empty">單元題庫準備中…</div>
  }

  const isCompleted = completedQuestions.includes(q.id)
  const isCorrect = isSubmitted && selectedOption === q.answer

  function handleSubmit() {
    if (selectedOption === null) return
    setIsSubmitted(true)
    if (selectedOption === q.answer) {
      onAnswerCorrect(q.id, q.difficulty * 10)
    } else {
      onAnswerWrong(q.id)
    }
  }

  function handleNext() {
    setSelectedOption(null)
    setIsSubmitted(false)
    setShowHint(false)
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
    } else {
      onNextUnit()
    }
  }

  return (
    <div className="math-practice-shell physics-practice-shell">
      <div className="practice-top-bar">
        <span>單元 {unit.id}：{unit.title}</span>
        <span>進度：{currentIdx + 1} / {questions.length} 題</span>
      </div>

      <div className="practice-card">
        <div className="question-header">
          <span className="q-badge" style={{ background: '#0284c7', color: '#fff' }}>
            {q.strand.toUpperCase()} · 難度 {'★'.repeat(q.difficulty)}
          </span>
          {isCompleted && <span className="completed-badge">✓ 已掌握</span>}
        </div>

        <div className="question-body">
          <h4>{q.title}</h4>
          <div className="q-text">
            <MathFormula math={q.question} />
          </div>
        </div>

        {q.options && (
          <div className="options-grid">
            {q.options.map((opt, idx) => {
              let optCls = 'option-btn'
              if (selectedOption === idx) optCls += ' selected'
              if (isSubmitted) {
                if (idx === q.answer) optCls += ' correct-opt'
                else if (selectedOption === idx) optCls += ' wrong-opt'
              }

              return (
                <button
                  key={idx}
                  type="button"
                  className={optCls}
                  onClick={() => !isSubmitted && setSelectedOption(idx)}
                >
                  <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                  <div className="opt-content">
                    <MathFormula math={opt} />
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <div className="action-buttons-row">
          {q.hint && !isSubmitted && (
            <button
              type="button"
              className="btn-hint-toggle"
              onClick={() => setShowHint(!showHint)}
            >
              💡 {showHint ? '隱藏提示' : '提示'}
            </button>
          )}

          {!isSubmitted ? (
            <button
              type="button"
              className="btn-submit-answer"
              disabled={selectedOption === null}
              onClick={handleSubmit}
              style={{ background: '#0284c7' }}
            >
              確認作答
            </button>
          ) : (
            <button
              type="button"
              className="btn-next-question"
              onClick={handleNext}
              style={{ background: '#0284c7' }}
            >
              {currentIdx < questions.length - 1 ? '下一題 →' : '完成本單元練習 🎉'}
            </button>
          )}
        </div>

        {showHint && q.hint && (
          <div className="hint-card">
            <strong>💡 解題關鍵：</strong> {q.hint}
          </div>
        )}

        {isSubmitted && (
          <div className={`solution-card ${isCorrect ? 'sol-correct' : 'sol-wrong'}`}>
            <div className="solution-status">
              {isCorrect ? '🎉 答對了！' : '❌ 答錯了，請複習以下詳細物理步驟推導：'}
            </div>
            <div className="solution-content">
              <MathFormula math={q.solution} />
            </div>
            {q.competency && (
              <div className="competency-note">
                <strong>108 課綱核心素養：</strong> {q.competency}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
