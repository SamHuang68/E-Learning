import React, { useState, useEffect, useRef } from 'react'
import { MOCK_EXAMS, type MockExamType } from '../data/mockExams'
import { MathFormula } from './MathFormula'
import { recordMockScore, loadMathProgress, saveMathProgress } from '../utils/mathStorage'

type Props = {
  onExit: () => void
}

/**
 * 數學科全真模擬考系統 (MathMockExam)
 * 支援：國小學力檢測、國中教育會考 (CAP)、大學學測 (GSAT) 15 級分制
 */
export const MathMockExam: React.FC<Props> = ({ onExit }) => {
  const [examType, setExamType] = useState<MockExamType>('cap')
  const [isStarted, setIsStarted] = useState(false)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [isFinished, setIsFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(80 * 60)
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true)
  const timerRef = useRef<number | null>(null)
  const [scoreResult, setScoreResult] = useState<{
    correctCount: number
    totalCount: number
    percentage: number
    scaleGrade: string
    weakStrands: string[]
  } | null>(null)
  const [flagged, setFlagged] = useState<Record<number, boolean>>({})

  const exam = MOCK_EXAMS[examType]

  // 初始化時長
  const defaultMinutes = examType === 'cap' ? 80 : examType === 'gsat' ? 100 : 40

  useEffect(() => {
    if (!isStarted || isFinished || !isTimerRunning) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isStarted, isFinished, isTimerRunning])

  function handleStart() {
    setAnswers({})
    setFlagged({})
    setIsFinished(false)
    setTimeLeft(defaultMinutes * 60)
    setIsTimerRunning(true)
    setIsStarted(true)
  }

  function handleSelectOption(qIndex: number, optIndex: number) {
    if (isFinished) return
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }))
  }

  function handleFillAnswer(qIndex: number, val: string) {
    if (isFinished) return
    setAnswers((prev) => ({ ...prev, [qIndex]: val }))
  }

  function handleSubmit() {
    let correct = 0
    const weakList: string[] = []
    const wrongQIds: string[] = []

    exam.questions.forEach((q, idx) => {
      const userAns = answers[idx]
      let qCorrect = false
      if (q.type === 'choice') {
        qCorrect = userAns === q.answer
      } else if (q.type === 'fill') {
        const parsed = parseFloat(String(userAns || '').trim())
        const target = typeof q.answer === 'number' ? q.answer : parseFloat(String(q.answer))
        if (!isNaN(parsed) && !isNaN(target)) {
          qCorrect = Math.abs(parsed - target) < 0.01
        } else {
          qCorrect = String(userAns || '').trim().toLowerCase() === String(q.answer).trim().toLowerCase()
        }
      }

      if (qCorrect) {
        correct++
      } else {
        weakList.push(q.title)
        wrongQIds.push(q.id)
      }
    })

    const pct = Math.round((correct / exam.questions.length) * 100)

    // 換算級分
    let scale = ''
    if (examType === 'cap') {
      if (pct >= 90) scale = 'A++ (精熟頂級)'
      else if (pct >= 80) scale = 'A+ (精熟優等)'
      else if (pct >= 70) scale = 'A (精熟)'
      else if (pct >= 60) scale = 'B++ (基礎前段)'
      else if (pct >= 50) scale = 'B+ (基礎中段)'
      else if (pct >= 40) scale = 'B (基礎)'
      else scale = 'C (待加強)'
    } else if (examType === 'gsat') {
      const scaled = Math.min(15, Math.max(1, Math.round((pct / 100) * 15)))
      scale = `${scaled} 級分 (${scaled >= 13 ? '頂標' : scaled >= 11 ? '前標' : scaled >= 8 ? '均標' : '後標'})`
    } else {
      scale = pct >= 80 ? '優等評級 (Distinction)' : pct >= 60 ? '通過評級 (Pass)' : '建議補強 (Review Needed)'
    }

    // 自動將錯題寫入 LocalStorage
    try {
      const currentProgress = loadMathProgress()
      const errorSet = new Set(currentProgress.errorQuestions)
      wrongQIds.forEach((id) => errorSet.add(id))
      saveMathProgress({
        ...currentProgress,
        errorQuestions: Array.from(errorSet),
      })
    } catch {
      /* ignore */
    }

    setScoreResult({
      correctCount: correct,
      totalCount: exam.questions.length,
      percentage: pct,
      scaleGrade: scale,
      weakStrands: weakList,
    })
    setIsFinished(true)
    recordMockScore(examType, pct)
  }

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="math-mock-shell">
      {!isStarted ? (
        <div className="mock-intro-card">
          <div className="mock-nav-tabs">
            <button
              type="button"
              className={`mock-tab ${examType === 'elementary' ? 'active' : ''}`}
              onClick={() => setExamType('elementary')}
            >
              國小學力檢測
            </button>
            <button
              type="button"
              className={`mock-tab ${examType === 'cap' ? 'active' : ''}`}
              onClick={() => setExamType('cap')}
            >
              國中教育會考 (CAP)
            </button>
            <button
              type="button"
              className={`mock-tab ${examType === 'gsat' ? 'active' : ''}`}
              onClick={() => setExamType('gsat')}
            >
              大學學科能力測驗 (GSAT)
            </button>
          </div>

          <div className="mock-details">
            <h2>{exam.title}</h2>
            <p className="mock-sub">{exam.subtitle}</p>
            <div className="exam-meta-grid">
              <div className="meta-cell">
                <span>適合學段</span>
                <strong>{exam.targetGrade}</strong>
              </div>
              <div className="meta-cell">
                <span>測驗題數</span>
                <strong>{exam.questions.length} 題</strong>
              </div>
              <div className="meta-cell">
                <span>評分標準</span>
                <strong>{exam.gradingScale}</strong>
              </div>
            </div>
            <div className="mock-actions">
              <button type="button" className="btn-primary btn-start-exam" onClick={handleStart}>
                開始全真模擬考 🚀
              </button>
              <button type="button" className="btn-back" onClick={onExit}>
                返回今日學習
              </button>
            </div>
          </div>
        </div>
      ) : !isFinished ? (
        <div className="mock-exam-body">
          <div className="exam-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0 }}>{exam.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span
                className="exam-timer-pill"
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '999px',
                  background: timeLeft < 300 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                  color: timeLeft < 300 ? '#ef4444' : '#3b82f6',
                  border: `1px solid ${timeLeft < 300 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                }}
              >
                ⏱️ {formatTimer(timeLeft)}
              </span>
              <button
                type="button"
                className="pill-btn"
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                onClick={() => setIsTimerRunning(!isTimerRunning)}
              >
                {isTimerRunning ? '⏸️ 暫停' : '▶️ 繼續'}
              </button>
            </div>
          </div>

          {/* 頂部題號導覽膠囊網格 */}
          <div
            className="exam-nav-grid"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.3rem',
              marginBottom: '0.85rem',
              padding: '0.5rem',
              background: 'var(--surface-soft)',
              borderRadius: '8px',
            }}
          >
            {exam.questions.map((_, idx) => {
              const isAnswered = answers[idx] !== undefined && answers[idx] !== ''
              const isFlagged = flagged[idx]
              return (
                <button
                  key={idx}
                  type="button"
                  style={{
                    width: '32px',
                    height: '28px',
                    borderRadius: '6px',
                    border: isFlagged ? '1.5px solid #f59e0b' : '1px solid var(--line)',
                    background: isFlagged ? '#fef3c7' : isAnswered ? '#3b82f6' : 'var(--surface)',
                    color: isFlagged ? '#b45309' : isAnswered ? '#ffffff' : 'var(--text)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                  onClick={() => {
                    const el = document.getElementById(`math-mock-q-${idx}`)
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }}
                >
                  {idx + 1}
                  {isFlagged && ' 🚩'}
                </button>
              )
            })}
          </div>

          <div className="mock-questions-list">
            {exam.questions.map((q, idx) => (
              <div key={q.id} id={`math-mock-q-${idx}`} className="mock-q-item">
                <div className="mock-q-num" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>第 {idx + 1} 題（難度 ★{q.difficulty}）</span>
                  <button
                    type="button"
                    onClick={() => setFlagged((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                    style={{
                      border: flagged[idx] ? '1px solid #f59e0b' : '1px solid var(--line)',
                      background: flagged[idx] ? '#fef3c7' : 'transparent',
                      color: flagged[idx] ? '#b45309' : 'var(--muted)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.15s ease',
                    }}
                    title={flagged[idx] ? '點擊取消標記' : '點擊標記此題為不確定'}
                  >
                    {flagged[idx] ? '🚩 已標記' : '🏳️ 標記'}
                  </button>
                </div>
                <div className="mock-q-text">
                  <MathFormula math={q.question} />
                </div>

                {q.type === 'choice' && q.options && (
                  <div className="mock-options">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        type="button"
                        className={`mock-opt-btn ${answers[idx] === oIdx ? 'selected' : ''}`}
                        onClick={() => handleSelectOption(idx, oIdx)}
                      >
                        <span className="opt-char">{String.fromCharCode(65 + oIdx)}</span>
                        <MathFormula math={opt} />
                      </button>
                    ))}
                  </div>
                )}

                {q.type === 'fill' && (
                  <div className="mock-fill">
                    <input
                      type="text"
                      placeholder="請輸入答案"
                      value={answers[idx] || ''}
                      onChange={(e) => handleFillAnswer(idx, e.target.value)}
                      className="fill-text-input"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mock-footer-bar">
            <button type="button" className="btn-secondary" onClick={() => setIsStarted(false)}>
              放棄交卷
            </button>
            <button type="button" className="btn-primary" onClick={handleSubmit}>
              交卷評分 📝
            </button>
          </div>
        </div>
      ) : (
        <div className="mock-result-card">
          <div className="result-header">
            <h3>{exam.title} · 成績報告單</h3>
          </div>

          <div className="score-hero">
            <div className="score-circle">
              <span className="score-num">{scoreResult?.percentage}</span>
              <span className="score-unit">分</span>
            </div>
            <div className="scale-result">
              <span className="scale-label">評定等級：</span>
              <strong className="scale-badge">{scoreResult?.scaleGrade}</strong>
              <p>答對 {scoreResult?.correctCount} / {scoreResult?.totalCount} 題</p>
            </div>
          </div>

          {scoreResult && scoreResult.weakStrands.length > 0 && (
            <div className="weakness-box">
              <h4>🎯 弱點觀念複習建議：</h4>
              <ul>
                {scoreResult.weakStrands.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="result-actions">
            <button type="button" className="btn-primary" onClick={() => setIsStarted(false)}>
              再測一次
            </button>
            <button type="button" className="btn-back" onClick={onExit}>
              返回學習中心
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
