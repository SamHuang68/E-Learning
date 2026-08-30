import React, { useState } from 'react'
import { MOCK_EXAMS, type MockExamType } from '../data/mockExams'
import { MathFormula } from './MathFormula'
import { recordMockScore } from '../utils/mathStorage'

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
  const [scoreResult, setScoreResult] = useState<{
    correctCount: number
    totalCount: number
    percentage: number
    scaleGrade: string
    weakStrands: string[]
  } | null>(null)

  const exam = MOCK_EXAMS[examType]

  function handleStart() {
    setAnswers({})
    setIsFinished(false)
    setIsStarted(true)
  }

  function handleSelectOption(qIndex: number, optIndex: number) {
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }))
  }

  function handleFillAnswer(qIndex: number, val: string) {
    setAnswers((prev) => ({ ...prev, [qIndex]: val }))
  }

  function handleSubmit() {
    let correct = 0
    const weakList: string[] = []

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
      const gsatScore = Math.min(15, Math.max(1, Math.round((pct / 100) * 15)))
      const level =
        gsatScore >= 12
          ? '頂標'
          : gsatScore >= 9
          ? '前標'
          : gsatScore >= 6
          ? '均標'
          : gsatScore >= 3
          ? '後標'
          : '底標'
      scale = `${gsatScore} 級分 (${level})`
    } else {
      scale = pct >= 85 ? '精熟級' : pct >= 60 ? '基礎級' : '待加強級'
    }

    const res = {
      correctCount: correct,
      totalCount: exam.questions.length,
      percentage: pct,
      scaleGrade: scale,
      weakStrands: weakList,
    }
    setScoreResult(res)
    setIsFinished(true)
    recordMockScore(exam.id, pct)
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
          <div className="exam-header-bar">
            <h3>{exam.title}</h3>
            <span className="exam-timer-pill">測驗進行中</span>
          </div>

          <div className="mock-questions-list">
            {exam.questions.map((q, idx) => (
              <div key={q.id} className="mock-q-item">
                <div className="mock-q-num">第 {idx + 1} 題（難度 ★{q.difficulty}）</div>
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
