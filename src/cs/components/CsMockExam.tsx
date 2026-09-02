import React, { useState, useEffect } from 'react'
import { CS_MOCK_EXAMS, type CsMockExam as CsMockExamData } from '../data/mockExams'
import type { CsQuestion } from '../data/curriculum'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'

interface Props {
  onRecordExamScore: (examId: string, score: number, errorQuestionIds: string[]) => void
  onEarnXp: (amount: number) => void
}

export const CsMockExam: React.FC<Props> = ({ onRecordExamScore, onEarnXp }) => {
  const [selectedExamKey, setSelectedExamKey] = useState<'midterm' | 'final'>('midterm')
  const [currentExam, setCurrentExam] = useState<CsMockExamData>(CS_MOCK_EXAMS.midterm)
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [secondsRemaining, setSecondsRemaining] = useState(currentExam.durationMinutes * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  useEffect(() => {
    const exam = CS_MOCK_EXAMS[selectedExamKey]
    setCurrentExam(exam)
    setActiveQuestionIdx(0)
    setUserAnswers({})
    setIsSubmitted(false)
    setScore(null)
    setSecondsRemaining(exam.durationMinutes * 60)
    setIsTimerRunning(true)
  }, [selectedExamKey])

  const handleSubmitExam = React.useCallback(() => {
    setIsSubmitted(true)
    setIsTimerRunning(false)

    let correctCount = 0
    const wrongIds: string[] = []

    currentExam.questions.forEach((q) => {
      if (userAnswers[q.id] === q.answer) {
        correctCount += 1
      } else {
        wrongIds.push(q.id)
      }
    })

    const finalScore = Math.round((correctCount / currentExam.questions.length) * 100)
    setScore(finalScore)

    if (finalScore >= 60) {
      playCorrectSound()
      onEarnXp(20)
    } else {
      playWrongSound()
    }

    onRecordExamScore(currentExam.id, finalScore, wrongIds)
  }, [currentExam, userAnswers, onEarnXp, onRecordExamScore])

  useEffect(() => {
    if (!isTimerRunning || isSubmitted) return
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isTimerRunning, isSubmitted, handleSubmitExam])

  function handleSelectOption(qId: string, optIdx: number) {
    if (isSubmitted) return
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }))
  }

  const currentQ: CsQuestion = currentExam.questions[activeQuestionIdx]
  const mins = Math.floor(secondsRemaining / 60)
  const secs = secondsRemaining % 60

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* 試卷選擇與計時控制列 */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '0.85rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.6rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <button
            type="button"
            className={`pill-btn ${selectedExamKey === 'midterm' ? 'active' : ''}`}
            onClick={() => setSelectedExamKey('midterm')}
          >
            期中模擬評量 (30分鐘)
          </button>
          <button
            type="button"
            className={`pill-btn ${selectedExamKey === 'final' ? 'active' : ''}`}
            onClick={() => setSelectedExamKey('final')}
          >
            期末前沿 AI 綜合大考 (40分鐘)
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--surface-soft)', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>⏱️</span>
            <strong style={{ fontSize: '0.9rem', color: secondsRemaining < 300 ? '#ef4444' : '#2563eb' }}>
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </strong>
          </div>
          {!isSubmitted && (
            <button
              type="button"
              className="btn-primary"
              style={{ padding: '0.45rem 1rem', fontSize: '0.78rem' }}
              onClick={handleSubmitExam}
            >
              交卷評分
            </button>
          )}
        </div>
      </div>

      {/* 試卷成績報告卡片 (交卷後呈現) */}
      {isSubmitted && score !== null && (
        <div
          style={{
            background: score >= 60 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${score >= 60 ? '#10b981' : '#ef4444'}`,
            borderRadius: '12px',
            padding: '1rem 1.2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.6rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 700 }}>
              評量完成 · 診斷報告
            </span>
            <h3 style={{ margin: '0.2rem 0', fontSize: '1.2rem' }}>
              測驗得分：{score} 分（{score >= 60 ? '及格通過 🎉' : '需加強複習 💪'}）
            </h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--text)' }}>
              錯題已自動歸檔至「錯題弱點本」，供您後續深入解析與弱點突破！
            </span>
          </div>
          <button
            type="button"
            className="pill-btn"
            onClick={() => {
              setUserAnswers({})
              setIsSubmitted(false)
              setScore(null)
              setSecondsRemaining(currentExam.durationMinutes * 60)
              setIsTimerRunning(true)
            }}
          >
            ↺ 重新測驗
          </button>
        </div>
      )}

      {/* 題號導航氣泡網格 */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', background: 'var(--surface)', padding: '0.6rem 0.8rem', borderRadius: '10px', border: '1px solid var(--line)' }}>
        {currentExam.questions.map((q, idx) => {
          const isAnswered = userAnswers[q.id] !== undefined
          const isCurrent = idx === activeQuestionIdx
          let bg = 'var(--surface-soft)'
          let border = 'var(--line)'

          if (isSubmitted) {
            const isCorrect = userAnswers[q.id] === q.answer
            bg = isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
            border = isCorrect ? '#10b981' : '#ef4444'
          } else if (isCurrent) {
            border = '#2563eb'
            bg = 'rgba(37, 99, 235, 0.15)'
          } else if (isAnswered) {
            bg = 'rgba(37, 99, 235, 0.08)'
          }

          return (
            <button
              key={q.id}
              type="button"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: `1px solid ${border}`,
                background: bg,
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              onClick={() => setActiveQuestionIdx(idx)}
            >
              {idx + 1}
            </button>
          )
        })}
      </div>

      {/* 單題作答區 */}
      {currentQ && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.74rem', padding: '0.1rem 0.5rem', borderRadius: '999px', background: 'rgba(37, 99, 235, 0.15)', color: '#2563eb', fontWeight: 700 }}>
              第 {activeQuestionIdx + 1} / {currentExam.questions.length} 題
            </span>
            <strong style={{ fontSize: '0.92rem' }}>{currentQ.title}</strong>
          </div>

          <p style={{ fontSize: '0.88rem', lineHeight: 1.5, margin: '0.6rem 0' }}>
            {currentQ.question}
          </p>

          {currentQ.options && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.4rem', marginTop: '0.6rem' }}>
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx
                let border = 'var(--line)'
                let bg = 'var(--surface-soft)'

                if (isSubmitted) {
                  if (optIdx === currentQ.answer) {
                    border = '#10b981'
                    bg = 'rgba(16, 185, 129, 0.15)'
                  } else if (isSelected) {
                    border = '#ef4444'
                    bg = 'rgba(239, 68, 68, 0.15)'
                  }
                } else if (isSelected) {
                  border = '#2563eb'
                  bg = 'rgba(37, 99, 235, 0.12)'
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    className="practice-card"
                    style={{
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      border: `1px solid ${border}`,
                      background: bg,
                      textAlign: 'left',
                      cursor: isSubmitted ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                  >
                    <span style={{ fontSize: '0.82rem' }}>{opt}</span>
                    {isSubmitted && optIdx === currentQ.answer && <span style={{ color: '#10b981', fontWeight: 700 }}>✓ 正確</span>}
                    {isSubmitted && isSelected && optIdx !== currentQ.answer && <span style={{ color: '#ef4444', fontWeight: 700 }}>✗ 您的回答</span>}
                  </button>
                )
              })}
            </div>
          )}

          {/* 交卷後解析 */}
          {isSubmitted && (
            <div style={{ marginTop: '0.85rem', padding: '0.85rem', borderRadius: '8px', background: 'var(--surface-soft)', border: '1px solid var(--line)' }}>
              <strong style={{ fontSize: '0.8rem', color: '#2563eb', display: 'block', marginBottom: '0.3rem' }}>
                💡 試題深入解析：
              </strong>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.76rem', lineHeight: 1.5, color: 'var(--text)' }}>
                {currentQ.solution.map((step, sIdx) => (
                  <li key={sIdx}>{step}</li>
                ))}
              </ul>
              <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'var(--muted)' }}>
                <strong>考點結論：</strong>{currentQ.explanation}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
