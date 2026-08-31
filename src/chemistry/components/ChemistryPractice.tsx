import React, { useState } from 'react'
import type { ChemistryUnit } from '../data/curriculum'
import { MathFormula } from '../../math/components/MathFormula'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { Scratchpad } from '../../components/Scratchpad'

type Props = {
  unit: ChemistryUnit
  completedQuestions: string[]
  errorQuestions: string[]
  onAnswerCorrect: (qId: string, pts: number) => void
  onAnswerWrong: (qId: string) => void
  onNextUnit: () => void
}

function isOptionMatch(idx: number, answer: string | number | string[]): boolean {
  if (typeof answer === 'number') return idx === answer
  if (typeof answer === 'string') {
    const letter = String.fromCharCode(65 + idx)
    return answer.trim().toUpperCase() === letter || answer.trim() === String(idx)
  }
  if (Array.isArray(answer)) {
    const letter = String.fromCharCode(65 + idx)
    return answer.map((a) => a.trim().toUpperCase()).includes(letter) || answer.includes(String(idx))
  }
  return false
}

export const ChemistryPractice: React.FC<Props> = ({
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
  const [showScratchpad, setShowScratchpad] = useState(false)

  const questions = unit.questions
  const q = questions[currentIdx] || questions[0]

  const isCompleted = q ? completedQuestions.includes(q.id) : false
  const isCorrect = q && isSubmitted && selectedOption !== null && isOptionMatch(selectedOption, q.answer)

  function handleSubmit() {
    if (!q || selectedOption === null) return
    setIsSubmitted(true)
    if (isOptionMatch(selectedOption, q.answer)) {
      playCorrectSound()
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

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const k = e.key.toLowerCase()
      if (k === 'a' || k === '1') {
        if (!isSubmitted && q?.options && q.options.length > 0) setSelectedOption(0)
      } else if (k === 'b' || k === '2') {
        if (!isSubmitted && q?.options && q.options.length > 1) setSelectedOption(1)
      } else if (k === 'c' || k === '3') {
        if (!isSubmitted && q?.options && q.options.length > 2) setSelectedOption(2)
      } else if (k === 'd' || k === '4') {
        if (!isSubmitted && q?.options && q.options.length > 3) setSelectedOption(3)
      } else if (k === 'enter' || k === ' ') {
        e.preventDefault()
        if (!isSubmitted && selectedOption !== null) {
          handleSubmit()
        } else if (isSubmitted) {
          handleNext()
        }
      } else if (k === 'h') {
        setShowHint((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSubmitted, selectedOption, q, currentIdx])

  if (!q) {
    return <div className="practice-empty">單元題庫準備中…</div>
  }

  return (
    <div className="math-practice-shell chemistry-practice-shell">
      <div className="practice-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>單元 {unit.id}：{unit.title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>進度：{currentIdx + 1} / {questions.length} 題</span>
          <button
            type="button"
            className="pill-btn"
            style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem' }}
            onClick={() => setShowScratchpad(!showScratchpad)}
          >
            ✏️ 草稿紙
          </button>
        </div>
      </div>

      <Scratchpad isOpen={showScratchpad} onClose={() => setShowScratchpad(false)} />

      <div className="practice-card">
        <div className="question-header">
          <span className="q-badge" style={{ background: '#059669', color: '#fff' }}>
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
                if (isOptionMatch(idx, q.answer)) optCls += ' correct-opt'
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
          <button
            type="button"
            className="btn-hint-toggle"
            style={{ borderColor: showScratchpad ? '#10b981' : undefined, color: showScratchpad ? '#10b981' : undefined }}
            onClick={() => setShowScratchpad((prev) => !prev)}
          >
            ✏️ {showScratchpad ? '收起草稿' : '草稿紙'}
          </button>

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
              style={{ background: '#059669' }}
            >
              確認作答
            </button>
          ) : (
            <button
              type="button"
              className="btn-next-question"
              onClick={handleNext}
              style={{ background: '#059669' }}
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
              {isCorrect ? '🎉 答對了！' : '❌ 答錯了，請複習以下詳細化學步驟推導：'}
            </div>
            <div className="solution-content">
              <MathFormula math={q.solution} />
            </div>
            {q.competency && (
              <div className="competency-note">
                <strong>108 課綱核心素養：</strong> {q.competency}
              </div>
            )}
            {!isCorrect && (
              <div
                style={{
                  marginTop: '0.5rem',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  fontSize: '0.74rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.35rem',
                }}
              >
                <span>🎯 <b>弱點診斷：</b>此題已自動收錄至化學錯題本，建議搭配 3 秒破題訊號卡強化觀念！</span>
                <span style={{ color: '#ef4444', fontWeight: 700 }}>需補強觀念</span>
              </div>
            )}
          </div>
        )}

        <Scratchpad isOpen={showScratchpad} onClose={() => setShowScratchpad(false)} />
      </div>
    </div>
  )
}
