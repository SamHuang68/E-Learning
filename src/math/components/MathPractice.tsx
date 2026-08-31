import React, { useState, useEffect } from 'react'
import type { MathQuestion, MathUnit } from '../data/curriculum'
import { MathFormula } from './MathFormula'
import { recordMathAnswer } from '../utils/mathStorage'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { Scratchpad } from '../../components/Scratchpad'

type Props = {
  unit: MathUnit
  onBack: () => void
  onComplete?: () => void
}

/**
 * 數學單元練習引擎 (MathPractice)
 * 提供漸進式題庫作答、KaTeX 數學公式即時渲染、逐步詳解展開、提示系統與錯誤收集。
 */
export const MathPractice: React.FC<Props> = ({ unit, onBack, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [fillInput, setFillInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showScratchpad, setShowScratchpad] = useState(false)

  const questions = unit.questions
  const currentQ: MathQuestion | undefined = questions[currentIndex]

  function handleCheckAnswer() {
    if (!currentQ || submitted) return

    let correct = false
    if (currentQ.type === 'choice') {
      correct = selectedOption === currentQ.answer
    } else if (currentQ.type === 'fill') {
      const parsedUser = parseFloat(fillInput.trim())
      const targetAns = typeof currentQ.answer === 'number' ? currentQ.answer : parseFloat(String(currentQ.answer))
      if (!isNaN(parsedUser) && !isNaN(targetAns)) {
        correct = Math.abs(parsedUser - targetAns) < 0.01
      } else {
        correct = fillInput.trim().toLowerCase() === String(currentQ.answer).trim().toLowerCase()
      }
    }

    setIsCorrect(correct)
    if (correct) {
      playCorrectSound()
    }
    setSubmitted(true)
    recordMathAnswer(currentQ.id, correct, 5)
  }

  function handleNext() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1)
      setSelectedOption(null)
      setFillInput('')
      setSubmitted(false)
      setIsCorrect(false)
      setShowHint(false)
    } else {
      onComplete?.()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const k = e.key.toLowerCase()
      if (k === 'a' || k === '1') {
        if (!submitted && currentQ?.options && currentQ.options.length > 0) setSelectedOption(0)
      } else if (k === 'b' || k === '2') {
        if (!submitted && currentQ?.options && currentQ.options.length > 1) setSelectedOption(1)
      } else if (k === 'c' || k === '3') {
        if (!submitted && currentQ?.options && currentQ.options.length > 2) setSelectedOption(2)
      } else if (k === 'd' || k === '4') {
        if (!submitted && currentQ?.options && currentQ.options.length > 3) setSelectedOption(3)
      } else if (k === 'enter' || k === ' ') {
        e.preventDefault()
        if (!submitted) {
          handleCheckAnswer()
        } else {
          handleNext()
        }
      } else if (k === 'h') {
        setShowHint((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [submitted, selectedOption, fillInput, currentQ, currentIndex])

  if (!currentQ) {
    return (
      <div className="math-practice-empty">
        <h3>此單元目前無練習題</h3>
        <button type="button" className="btn-primary" onClick={onBack}>
          返回今日學習
        </button>
      </div>
    )
  }

  const isLastQuestion = currentIndex + 1 >= questions.length

  return (
    <div className="math-practice-shell">
      <div className="practice-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button type="button" className="btn-back" onClick={onBack}>
          ← 返回單元
        </button>
        <div className="practice-progress-pill">
          第 <strong>{currentIndex + 1}</strong> / {questions.length} 題
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div className="practice-unit-tag">{unit.title}</div>
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
          <span className="diff-badge">難度 ★{currentQ.difficulty}</span>
          <span className="strand-tag">{currentQ.title}</span>
        </div>

        <div className="question-body">
          <MathFormula math={currentQ.question} block={false} />
        </div>

        {/* 作答區 */}
        <div className="answer-section">
          {currentQ.type === 'choice' && currentQ.options && (
            <div className="options-grid">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx
                let optClass = 'option-btn'
                if (isSelected) optClass += ' selected'
                if (submitted) {
                  if (idx === currentQ.answer) optClass += ' correct-opt'
                  else if (isSelected && !isCorrect) optClass += ' wrong-opt'
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    className={optClass}
                    onClick={() => !submitted && setSelectedOption(idx)}
                    disabled={submitted}
                  >
                    <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                    <span className="opt-text">
                      <MathFormula math={opt} />
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {currentQ.type === 'fill' && (
            <div className="fill-input-group">
              <input
                type="text"
                value={fillInput}
                onChange={(e) => setFillInput(e.target.value)}
                placeholder="輸入您的計算答案..."
                disabled={submitted}
                className="fill-text-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !submitted) handleCheckAnswer()
                }}
              />
            </div>
          )}
        </div>

        {/* 提示與檢查按鈕 */}
        <div className="action-buttons-row">
          {currentQ.hint && !submitted && (
            <button
              type="button"
              className="btn-hint-toggle"
              onClick={() => setShowHint(!showHint)}
            >
              {showHint ? '隱藏提示' : '💡 提示'}
            </button>
          )}

          {!submitted ? (
            <button
              type="button"
              className="btn-primary btn-submit-answer"
              onClick={handleCheckAnswer}
              disabled={
                currentQ.type === 'choice'
                  ? selectedOption === null
                  : fillInput.trim() === ''
              }
            >
              確認答案
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary btn-next-question"
              onClick={handleNext}
            >
              {isLastQuestion ? '完成練習 🎉' : '下一題 →'}
            </button>
          )}
        </div>

        {/* 提示面板 */}
        {showHint && currentQ.hint && !submitted && (
          <div className="hint-card">
            <strong>解題靈感：</strong>
            <MathFormula math={currentQ.hint} />
          </div>
        )}

        {/* 解析區 */}
        {submitted && (
          <div className={`solution-card ${isCorrect ? 'sol-correct' : 'sol-wrong'}`}>
            <div className="solution-status">
              {isCorrect ? '✅ 答對了！+5 XP' : '❌ 答錯了，已自動收入錯題本'}
            </div>
            <div className="solution-content">
              <strong>【逐步詳解】</strong>
              <MathFormula math={currentQ.solution} block={true} />
            </div>
            {currentQ.competency && (
              <div className="competency-note">
                <span>108 課綱核心素養：{currentQ.competency}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
