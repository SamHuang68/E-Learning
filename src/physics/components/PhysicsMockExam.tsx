import React, { useState } from 'react'
import { PHYSICS_MOCK_EXAMS } from '../data/mockExams'
import { MathFormula } from '../../math/components/MathFormula'

type Props = {
  onSaveScore: (examId: string, score: number) => void
}

export const PhysicsMockExam: React.FC<Props> = ({ onSaveScore }) => {
  const exams = Object.values(PHYSICS_MOCK_EXAMS)
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '')
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const exam = exams.find((e) => e.id === selectedExamId) || exams[0]
  if (!exam) return <div>模擬試卷載入中…</div>

  function handleSelectOpt(qId: string, optIdx: number) {
    if (isSubmitted) return
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }))
  }

  function handleCalculateScore() {
    let score = 0
    const perQ = Math.round(100 / Math.max(1, exam.questions.length))
    exam.questions.forEach((q) => {
      if (answers[q.id] === q.answer) score += perQ
    })
    score = Math.min(100, score)
    setIsSubmitted(true)
    onSaveScore(exam.id, score)
  }

  return (
    <div className="math-mock-shell physics-mock-shell">
      <div className="mock-nav-tabs">
        {exams.map((ex) => (
          <button
            key={ex.id}
            type="button"
            className={`mock-tab ${selectedExamId === ex.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedExamId(ex.id)
              setAnswers({})
              setIsSubmitted(false)
            }}
          >
            {ex.title}
          </button>
        ))}
      </div>

      <div className="mock-exam-header" style={{ marginBottom: '0.6rem' }}>
        <h3>{exam.title} ({exam.targetExam})</h3>
        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)' }}>{exam.description}</p>
      </div>

      <div className="mock-questions-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {exam.questions.map((q, idx) => {
          const userAns = answers[q.id]
          const isCorrect = isSubmitted && userAns === q.answer

          return (
            <div key={q.id} className="practice-card mock-question-item">
              <div className="question-header">
                <span className="q-badge" style={{ background: '#0284c7', color: '#fff' }}>第 {idx + 1} 題</span>
              </div>
              <div className="question-body">
                <MathFormula math={q.question} />
              </div>
              {q.options && (
                <div className="options-grid">
                  {q.options.map((opt, oIdx) => {
                    let optCls = 'option-btn'
                    if (userAns === oIdx) optCls += ' selected'
                    if (isSubmitted) {
                      if (oIdx === q.answer) optCls += ' correct-opt'
                      else if (userAns === oIdx) optCls += ' wrong-opt'
                    }
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        className={optCls}
                        onClick={() => handleSelectOpt(q.id, oIdx)}
                      >
                        <span className="opt-letter">{String.fromCharCode(65 + oIdx)}</span>
                        <div className="opt-content">
                          <MathFormula math={opt} />
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
              {isSubmitted && (
                <div className={`solution-card ${isCorrect ? 'sol-correct' : 'sol-wrong'}`}>
                  <strong>{isCorrect ? '✓ 答對' : '❌ 答錯'}：</strong>
                  <MathFormula math={q.solution} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {!isSubmitted && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
          <button
            type="button"
            className="btn-submit-answer"
            style={{ background: '#0284c7' }}
            onClick={handleCalculateScore}
          >
            交卷計算成績 📊
          </button>
        </div>
      )}
    </div>
  )
}
