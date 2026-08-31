import React, { useState } from 'react'
import { loadMathProgress, recordMathAnswer } from '../utils/mathStorage'
import { ALL_MATH_GRADES } from '../data/gradeStore'
import type { MathQuestion } from '../data/curriculum'
import { MathFormula } from './MathFormula'
import { exportErrorVaultToAnki } from '../../utils/ankiExporter'

type Props = {
  onBack: () => void
}

/**
 * 數學錯題筆記本 (MathErrorVault)
 * 自動蒐集作答錯誤的題目，提供再次挑戰、步驟解析與清除機制。
 */
export const MathErrorVault: React.FC<Props> = ({ onBack }) => {
  const [progress, setProgress] = useState(() => loadMathProgress())
  const [selectedQ, setSelectedQ] = useState<MathQuestion | null>(null)
  const [testInput, setTestInput] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  // 從所有年級題庫中找出錯題列表
  const errorQuestions: MathQuestion[] = []
  Object.values(ALL_MATH_GRADES).forEach((g) => {
    g.units.forEach((u) => {
      u.questions.forEach((q) => {
        if (progress.errorQuestions.includes(q.id)) {
          errorQuestions.push(q)
        }
      })
    })
  })

  function handleRecheck(q: MathQuestion) {
    let isCorrect = false
    if (q.type === 'choice') {
      isCorrect = Number(testInput) === q.answer
    } else {
      const parsed = parseFloat(testInput.trim())
      const target = typeof q.answer === 'number' ? q.answer : parseFloat(String(q.answer))
      if (!isNaN(parsed) && !isNaN(target)) {
        isCorrect = Math.abs(parsed - target) < 0.01
      } else {
        isCorrect = testInput.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
      }
    }

    if (isCorrect) {
      setFeedback('correct')
      const next = recordMathAnswer(q.id, true, 5)
      setProgress(next)
      setTimeout(() => {
        setSelectedQ(null)
        setTestInput('')
        setFeedback(null)
      }, 1000)
    } else {
      setFeedback('wrong')
    }
  }

  return (
    <div className="math-error-vault">
      <div className="vault-header">
        <div>
          <h2>錯題筆記本 (Error Notebook)</h2>
          <p className="vault-desc">
            自動彙整平常單元練習與模擬考答錯之題目。徹底訂正並再次答對即可移出錯題本！
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          {errorQuestions.length > 0 && (
            <button
              type="button"
              className="btn-back"
              style={{ background: 'rgba(37, 99, 235, 0.12)', color: '#2563eb', borderColor: '#2563eb' }}
              onClick={() => exportErrorVaultToAnki('數學', errorQuestions)}
              title="一鍵匯出數學錯題至 Anki 記憶牌組"
            >
              📑 匯出 Anki 牌組
            </button>
          )}
          <button type="button" className="btn-back" onClick={onBack}>
            ← 返回學習中心
          </button>
        </div>
      </div>

      {errorQuestions.length === 0 ? (
        <div className="vault-empty-card">
          <span className="empty-icon">🎉</span>
          <h3>太厲害了！目前沒有未解決的錯題</h3>
          <p>繼續保持良好的學習節奏，多做練習與模擬考挑戰高分！</p>
        </div>
      ) : (
        <div className="vault-grid">
          {errorQuestions.map((q) => {
            const text = `${q.title} ${q.question}`.toLowerCase()
            let labInfo: { name: string; tab: string } | null = null
            if (text.includes('畢氏') || text.includes('勾股') || text.includes('直角')) {
              labInfo = { name: '📐 畢氏勾股定理教具', tab: 'pythagoras' }
            } else if (text.includes('三角') || text.includes('sin') || text.includes('cos') || text.includes('單位圓')) {
              labInfo = { name: '⭕ 三角函數單位圓教具', tab: 'unit-circle' }
            } else if (text.includes('座標') || text.includes('坐標') || text.includes('函數') || text.includes('直線')) {
              labInfo = { name: '📊 平面坐標系幾何板', tab: 'coordinate' }
            } else if (text.includes('分數') || text.includes('分母') || text.includes('分子')) {
              labInfo = { name: '🍰 分數概念可視化板', tab: 'fraction' }
            } else if (text.includes('乘法') || text.includes('九九') || text.includes('乘積')) {
              labInfo = { name: '🔢 九九乘法陣列盤', tab: 'multiplication' }
            }

            return (
              <div key={q.id} className="vault-item-card">
                <div className="item-header">
                  <span className="q-badge">{q.title}</span>
                  <span className="diff-tag">★{q.difficulty}</span>
                </div>
                <div className="q-content">
                  <MathFormula math={q.question} />
                </div>
                {labInfo && (
                  <div style={{ margin: '0.4rem 0 0.2rem' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        background: 'rgba(59, 130, 246, 0.12)',
                        color: '#3b82f6',
                        display: 'inline-block',
                        fontWeight: 600,
                      }}
                    >
                      🔬 關聯教具：{labInfo.name}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  className="btn-review-item"
                  onClick={() => {
                    setSelectedQ(q)
                    setTestInput('')
                    setFeedback(null)
                  }}
                >
                  再次訂正挑戰 →
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* 訂正彈窗 */}
      {selectedQ && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>訂正題目：{selectedQ.title}</h3>
            <div className="modal-q-text">
              <MathFormula math={selectedQ.question} />
            </div>

            {selectedQ.type === 'choice' && selectedQ.options && (
              <div className="modal-options">
                {selectedQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`modal-opt-btn ${testInput === String(idx) ? 'active' : ''}`}
                    onClick={() => setTestInput(String(idx))}
                  >
                    {String.fromCharCode(65 + idx)}. <MathFormula math={opt} />
                  </button>
                ))}
              </div>
            )}

            {selectedQ.type === 'fill' && (
              <div className="modal-fill">
                <input
                  type="text"
                  placeholder="輸入計算結果..."
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="fill-text-input"
                />
              </div>
            )}

            {feedback === 'correct' && (
              <p className="feedback-badge correct">✅ 恭喜答對！已移出錯題本 (+5 XP)</p>
            )}
            {feedback === 'wrong' && (
              <div className="feedback-badge wrong">
                <p>❌ 依然不對喔，參考詳解：</p>
                <MathFormula math={selectedQ.solution} block={true} />
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleRecheck(selectedQ)}
              >
                提交訂正
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedQ(null)}
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
