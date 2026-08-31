import React, { useState } from 'react'
import { CHEMISTRY_MOCK_EXAMS } from '../data/mockExams'
import { MathFormula } from '../../math/components/MathFormula'

type Props = {
  onSaveScore: (examId: string, score: number) => void
}

function isOptionMatch(idx: number | undefined, answer: string | number | string[]): boolean {
  if (idx === undefined) return false
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

export const ChemistryMockExam: React.FC<Props> = ({ onSaveScore }) => {
  const exams = Object.values(CHEMISTRY_MOCK_EXAMS)
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
      if (isOptionMatch(answers[q.id], q.answer)) score += perQ
    })
    score = Math.min(100, score)
    setIsSubmitted(true)
    onSaveScore(exam.id, score)
  }

  return (
    <div className="math-mock-shell chemistry-mock-shell">
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
        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)' }}>{exam.subtitle}</p>
      </div>

      <div className="mock-questions-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {exam.questions.map((q, idx) => {
          const userAns = answers[q.id]
          const isCorrect = isSubmitted && isOptionMatch(userAns, q.answer)

          return (
            <div key={q.id} className="practice-card mock-question-item">
              <div className="question-header">
                <span className="q-badge" style={{ background: '#059669', color: '#fff' }}>第 {idx + 1} 題</span>
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
                      if (isOptionMatch(oIdx, q.answer)) optCls += ' correct-opt'
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
            style={{ background: '#059669' }}
            onClick={handleCalculateScore}
          >
            交卷計算成績 📊
          </button>
        </div>
      )}
    </div>
  )
}
