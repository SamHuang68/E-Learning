import React, { useState } from 'react'

type Props = {
  onXp?: (amount: number) => void
}

/**
 * 國小「九九乘法速算挑戰 (MultiplicationLab)」
 * 包含 9x9 矩陣互動點讀表與即時速算闖關模式。
 */
export const MultiplicationLab: React.FC<Props> = ({ onXp }) => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null)
  const [selectedCol, setSelectedCol] = useState<number | null>(null)
  const [quizMode, setQuizMode] = useState(false)
  const [quizA, setQuizA] = useState(7)
  const [quizB, setQuizB] = useState(8)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)

  function nextQuestion() {
    const a = Math.floor(Math.random() * 8) + 2 // 2~9
    const b = Math.floor(Math.random() * 8) + 2
    setQuizA(a)
    setQuizB(b)
    setUserAnswer('')
    setFeedback(null)
  }

  function handleAnswerSubmit(e: React.FormEvent) {
    e.preventDefault()
    const correct = quizA * quizB
    if (Number(userAnswer) === correct) {
      setScore((s) => s + 1)
      setFeedback('correct')
      onXp?.(3)
      setTimeout(() => {
        nextQuestion()
      }, 700)
    } else {
      setFeedback(`答錯囉！${quizA} × ${quizB} = ${correct}`)
    }
  }

  return (
    <div className="math-lab multiplication-lab">
      <div className="lab-header">
        <div>
          <h3>九九乘法速算教室 (9×9 Multiplication)</h3>
          <p className="lab-desc">
            點擊表格任意交叉格查看算式與幾何矩陣，或開啟速算闖關模式測驗熟練度！
          </p>
        </div>
        <button
          type="button"
          className={`btn-mode-toggle ${quizMode ? 'active' : ''}`}
          onClick={() => {
            setQuizMode(!quizMode)
            if (!quizMode) nextQuestion()
          }}
        >
          {quizMode ? '返回九九乘法表' : '⚡ 開啟速算闖關'}
        </button>
      </div>

      {!quizMode ? (
        <div className="mult-table-container">
          <div className="mult-table-grid">
            <div className="mult-corner-cell">×</div>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="mult-header-cell">{i + 1}</div>
            ))}

            {Array.from({ length: 9 }).map((_, r) => {
              const rowNum = r + 1
              return (
                <React.Fragment key={r}>
                  <div className="mult-header-cell">{rowNum}</div>
                  {Array.from({ length: 9 }).map((_, c) => {
                    const colNum = c + 1
                    const isSelected = selectedRow === rowNum && selectedCol === colNum
                    const isRowHighlight = selectedRow === rowNum
                    const isColHighlight = selectedCol === colNum
                    return (
                      <button
                        key={c}
                        type="button"
                        className={`mult-cell ${isSelected ? 'selected' : ''} ${
                          isRowHighlight || isColHighlight ? 'highlighted' : ''
                        }`}
                        onClick={() => {
                          setSelectedRow(rowNum)
                          setSelectedCol(colNum)
                        }}
                      >
                        {rowNum * colNum}
                      </button>
                    )
                  })}
                </React.Fragment>
              )
            })}
          </div>

          {selectedRow && selectedCol && (
            <div className="mult-detail-card">
              <h4>
                {selectedRow} × {selectedCol} = {selectedRow * selectedCol}
              </h4>
              <p>
                意義：{selectedCol} 份，每份有 {selectedRow} 個（共連加 {selectedCol} 次 {selectedRow}）。
              </p>
              <div className="dot-matrix">
                {Array.from({ length: selectedRow }).map((_, r) => (
                  <div key={r} className="dot-row">
                    {Array.from({ length: selectedCol }).map((_, c) => (
                      <span key={c} className="matrix-dot" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mult-quiz-panel">
          <div className="quiz-card">
            <div className="quiz-question-box">
              <span className="quiz-math">
                {quizA} × {quizB} = ?
              </span>
            </div>

            <form onSubmit={handleAnswerSubmit} className="quiz-form">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="輸入答案"
                autoFocus
                className="input-quiz-answer"
              />
              <button type="submit" className="btn-primary">
                確認
              </button>
            </form>

            {feedback === 'correct' && (
              <p className="quiz-feedback-correct">🎉 太棒了！答對了 +3 XP</p>
            )}
            {feedback && feedback !== 'correct' && (
              <p className="quiz-feedback-wrong">{feedback}</p>
            )}

            <div className="quiz-score-badge">已連續答對：{score} 題</div>
          </div>
        </div>
      )}
    </div>
  )
}
