import React, { useState } from 'react'
import type { PhysicsUnit } from '../data/curriculum'
import { MathFormula } from '../../math/components/MathFormula'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { Scratchpad } from '../../components/Scratchpad'

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
  const [viewMode, setViewMode] = useState<'textbook' | 'practice'>('textbook')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showScratchpad, setShowScratchpad] = useState(false)

  const questions = unit.questions
  const q = questions[currentIdx] || questions[0]

  const isCompleted = q ? completedQuestions.includes(q.id) : false
  const isCorrect = q && isSubmitted && selectedOption === q.answer

  function handleSubmit() {
    if (!q || selectedOption === null) return
    setIsSubmitted(true)
    if (selectedOption === q.answer) {
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
      if (viewMode !== 'practice') return
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
  })

  return (
    <div className="math-practice-shell physics-practice-shell">
      {/* 頂部切換與標題 Bar */}
      <div className="practice-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 800 }}>單元 {unit.id}：{unit.title}</span>
          <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
            {unit.band} · {unit.targetExam}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {/* 教科書 vs 題目 切換膠囊 */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', padding: '2px', borderRadius: '6px' }}>
            <button
              type="button"
              onClick={() => setViewMode('textbook')}
              style={{
                padding: '0.25rem 0.6rem',
                fontSize: '0.74rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: viewMode === 'textbook' ? '#0284c7' : 'transparent',
                color: viewMode === 'textbook' ? '#fff' : 'var(--muted)',
                fontWeight: viewMode === 'textbook' ? 700 : 500,
              }}
            >
              📖 教科書觀念導讀
            </button>
            <button
              type="button"
              onClick={() => setViewMode('practice')}
              style={{
                padding: '0.25rem 0.6rem',
                fontSize: '0.74rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: viewMode === 'practice' ? '#0284c7' : 'transparent',
                color: viewMode === 'practice' ? '#fff' : 'var(--muted)',
                fontWeight: viewMode === 'practice' ? 700 : 500,
              }}
            >
              ✍️ 自我評量 ({questions.length}題)
            </button>
          </div>

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

      {/* 視圖 1: 教科書深度觀念版面 (Textbook Knowledge Panel) */}
      {viewMode === 'textbook' ? (
        <div
          className="textbook-knowledge-panel"
          style={{
            background: 'var(--card-bg, rgba(30, 41, 59, 0.5))',
            border: '1px solid var(--line, rgba(255, 255, 255, 0.1))',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
              PHYSICS TEXTBOOK MODULE · {unit.strand}
            </span>
            <h2 style={{ margin: '0.2rem 0 0.2rem', fontSize: '1.25rem', fontWeight: 800 }}>
              {unit.title}
            </h2>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.82rem' }}>
              {unit.subtitle}
            </p>
          </div>

          {/* 第一性原理與核心觀念清單 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>📐</span> 第一性原理與核心物理定律推導：
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {unit.concepts.map((concept, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderLeft: '3px solid #38bdf8',
                    borderRadius: '0 8px 8px 0',
                    padding: '0.75rem 1rem',
                    fontSize: '0.84rem',
                    lineHeight: 1.6,
                    color: '#e2e8f0',
                  }}
                >
                  <MathFormula math={concept} />
                </div>
              ))}
            </div>
          </div>

          {/* 關聯動態實驗室提示 */}
          {unit.suggestedLab && (
            <div
              style={{
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div>
                <strong style={{ fontSize: '0.82rem', color: '#a5b4fc' }}>🔬 關聯互動動態實驗室：</strong>
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1', marginLeft: '0.25rem' }}>
                  本單元具備專屬動態數值模擬實驗室 ({unit.suggestedLab})，可於側邊欄即時開啟探索。
                </span>
              </div>
            </div>
          )}

          {/* 底部導引按鈕 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setViewMode('practice')}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                color: '#fff',
                border: 'none',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
              }}
            >
              <span>✍️ 觀念已研讀通透，進入題目自我驗證</span>
              <span>➜</span>
            </button>
          </div>
        </div>
      ) : (
        /* 視圖 2: 題庫自我評量 (Practice View) */
        !q ? (
          <div className="practice-empty">單元題庫準備中…</div>
        ) : (
          <div className="practice-card">
            <div className="question-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="q-badge" style={{ background: '#0284c7', color: '#fff' }}>
                {q.strand.toUpperCase()} · 難度 {'★'.repeat(q.difficulty)}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                第 {currentIdx + 1} / {questions.length} 題
                {isCompleted && <span className="completed-badge" style={{ marginLeft: '0.5rem' }}>✓ 已掌握</span>}
              </span>
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
                    if (idx === q.answer) optCls += ' correct'
                    else if (selectedOption === idx) optCls += ' wrong'
                  }
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={optCls}
                      disabled={isSubmitted}
                      onClick={() => setSelectedOption(idx)}
                    >
                      <span className="opt-marker">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="opt-text">
                        <MathFormula math={opt} />
                      </span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* 操作按鈕列 */}
            <div className="practice-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', alignItems: 'center' }}>
              {!isSubmitted ? (
                <button
                  type="button"
                  className="btn-primary"
                  disabled={selectedOption === null}
                  onClick={handleSubmit}
                >
                  確認送出 (Enter)
                </button>
              ) : (
                <button type="button" className="btn-primary" onClick={handleNext}>
                  {currentIdx < questions.length - 1 ? '下一題 (Enter)' : '完成本單元'}
                </button>
              )}

              {q.hint && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowHint(!showHint)}
                >
                  💡 {showHint ? '隱藏提示' : '解題提示'}
                </button>
              )}

              <button
                type="button"
                className="btn-secondary"
                onClick={() => setViewMode('textbook')}
                style={{ marginLeft: 'auto', fontSize: '0.78rem' }}
              >
                📖 回顧教科書觀念
              </button>
            </div>

            {showHint && q.hint && (
              <div className="hint-box" style={{ marginTop: '0.75rem' }}>
                <strong>提示：</strong>
                <MathFormula math={q.hint} />
              </div>
            )}

            {isSubmitted && (
              <div className={`solution-box ${isCorrect ? 'sol-correct' : 'sol-wrong'}`} style={{ marginTop: '0.75rem' }}>
                <div className="sol-header">
                  {isCorrect ? '🎉 答對了！' : '❌ 答錯了，請研讀解析：'}
                </div>
                <div className="sol-body">
                  <MathFormula math={q.solution} />
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  )
}
