import React from 'react'
import { getAllChemistryUnits } from '../data/curriculum'
import { MathFormula } from '../../math/components/MathFormula'

type Props = {
  errorQuestionIds: string[]
  onRemoveError: (qId: string) => void
}

export const ChemistryErrorVault: React.FC<Props> = ({ errorQuestionIds, onRemoveError }) => {
  const allUnits = getAllChemistryUnits()
  const errorQuestions = allUnits
    .flatMap((u) => u.questions)
    .filter((q) => errorQuestionIds.includes(q.id))

  if (errorQuestions.length === 0) {
    return (
      <div className="practice-card" style={{ textAlign: 'center', padding: '2rem' }}>
        <h3>🎉 太棒了！錯題本目前空空如也</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
          在單元練習或模擬考中答錯的化學題目會自動收錄於此，助您針對盲點精準複習。
        </p>
      </div>
    )
  }

  return (
    <div className="chemistry-error-vault">
      <div className="section-title-row" style={{ marginBottom: '0.6rem' }}>
        <h3>📖 化學弱點錯題筆記本</h3>
        <span className="unit-count-badge">收錄 {errorQuestions.length} 題待強化</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {errorQuestions.map((q) => (
          <div key={q.id} className="practice-card">
            <div className="question-header">
              <span className="q-badge" style={{ background: '#ef4444', color: '#fff' }}>待複習</span>
              <button
                type="button"
                className="pill-btn"
                style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#10b981' }}
                onClick={() => onRemoveError(q.id)}
              >
                ✓ 我已學會 (移出錯題本)
              </button>
            </div>

            <div className="question-body">
              <h4>{q.title}</h4>
              <MathFormula math={q.question} />
            </div>

            <div className="solution-card sol-correct" style={{ marginTop: '0.45rem' }}>
              <div className="solution-status">💡 正確解析與化學步驟推導：</div>
              <div className="solution-content">
                <MathFormula math={q.solution} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
