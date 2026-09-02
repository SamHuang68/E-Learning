import React from 'react'
import { CS_CURRICULUM, type CsQuestion } from '../data/curriculum'
import { CS_MOCK_EXAMS } from '../data/mockExams'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  errorQuestionIds: string[]
  onRemoveError: (questionId: string) => void
}

export const CsErrorVault: React.FC<Props> = ({ errorQuestionIds, onRemoveError }) => {
  // 匯總所有題目池
  const allQuestionsMap: Record<string, CsQuestion> = {}

  CS_CURRICULUM.forEach((unit) => {
    unit.questions.forEach((q) => {
      allQuestionsMap[q.id] = q
    })
  })

  Object.values(CS_MOCK_EXAMS).forEach((exam) => {
    exam.questions.forEach((q) => {
      allQuestionsMap[q.id] = q
    })
  })

  const errorQuestions = errorQuestionIds
    .map((id) => allQuestionsMap[id])
    .filter((q): q is CsQuestion => Boolean(q))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* 標頭 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(245, 158, 11, 0.12))',
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
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📕</span> 計算機概論 錯題弱點本
          </h3>
          <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
            集中收錄單元練習與模擬考中答錯的題目，逐題突破盲點，徹底掌握底層運算邏輯！
          </span>
        </div>
        <span style={{ fontSize: '0.78rem', padding: '0.2rem 0.6rem', borderRadius: '999px', background: errorQuestions.length > 0 ? '#ef4444' : '#10b981', color: '#fff', fontWeight: 700 }}>
          待複習錯題：{errorQuestions.length} 題
        </span>
      </div>

      {/* 錯題為空時的恭喜卡片 */}
      {errorQuestions.length === 0 ? (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.6rem' }}>🎉 🏆</div>
          <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem' }}>太棒了！目前沒有任何待複習錯題</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>
            您的計算機概論知識儲備極為扎實。建議前往「五大單元動態實驗室」或「現代 AI 矩陣實驗室」進行深度探究！
          </p>
        </div>
      ) : (
        /* 錯題列表 */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {errorQuestions.map((q, idx) => (
            <div
              key={q.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '1.1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 700 }}>
                  錯題 #{idx + 1}
                </span>
                <button
                  type="button"
                  style={{
                    border: 'none',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    fontSize: '0.74rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                  onClick={() => {
                    playCorrectSound()
                    onRemoveError(q.id)
                  }}
                >
                  ✓ 我已掌握 (移出錯題)
                </button>
              </div>

              <strong style={{ fontSize: '0.9rem', display: 'block', marginBottom: '0.4rem' }}>{q.title}</strong>
              <p style={{ fontSize: '0.84rem', lineHeight: 1.5, margin: '0.4rem 0 0.6rem' }}>{q.question}</p>

              {q.options && (
                <div style={{ background: 'var(--surface-soft)', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--line)', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                    正確答案：{q.options[Number(q.answer)]}
                  </span>
                </div>
              )}

              <div style={{ background: 'var(--surface-soft)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
                <strong style={{ fontSize: '0.76rem', color: '#2563eb', display: 'block', marginBottom: '0.25rem' }}>
                  💡 步驟解析與避坑指南：
                </strong>
                <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.74rem', lineHeight: 1.5, color: 'var(--text)' }}>
                  {q.solution.map((step, sIdx) => (
                    <li key={sIdx}>{step}</li>
                  ))}
                </ol>
                <div style={{ marginTop: '0.35rem', fontSize: '0.72rem', color: 'var(--muted)' }}>
                  <strong>盲點精析：</strong>{q.explanation}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
