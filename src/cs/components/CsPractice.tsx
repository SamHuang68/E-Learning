import React, { useState } from 'react'
import { CS_CURRICULUM, type CsUnit, type CsQuestion } from '../data/curriculum'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'

interface Props {
  completedQuestions: string[]
  onCompleteQuestion: (questionId: string, earnedXp: number) => void
  onRecordError: (questionId: string) => void
}

export const CsPractice: React.FC<Props> = ({
  completedQuestions,
  onCompleteQuestion,
  onRecordError,
}) => {
  const [activeUnitId, setActiveUnitId] = useState<string>(CS_CURRICULUM[0].id)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({})
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({})

  const currentUnit: CsUnit = CS_CURRICULUM.find((u) => u.id === activeUnitId) || CS_CURRICULUM[0]

  function handleSelectOption(q: CsQuestion, optIdx: number) {
    if (submittedQuestions[q.id]) return

    setSelectedOptions((prev) => ({ ...prev, [q.id]: optIdx }))
    setSubmittedQuestions((prev) => ({ ...prev, [q.id]: true }))

    const isCorrect = optIdx === q.answer
    if (isCorrect) {
      playCorrectSound()
      onCompleteQuestion(q.id, 15)
    } else {
      playWrongSound()
      onRecordError(q.id)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* 單元切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {CS_CURRICULUM.map((u, idx) => {
          const isActive = u.id === activeUnitId
          const unitCompleted = u.questions.every((q) => completedQuestions.includes(q.id))
          return (
            <button
              key={u.id}
              type="button"
              className={`pill-btn ${isActive ? 'active' : ''}`}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.74rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
              onClick={() => setActiveUnitId(u.id)}
            >
              <span>{unitCompleted ? '✓' : idx + 1}</span>
              <span>{u.title.split('：')[0]}</span>
            </button>
          )
        })}
      </div>

      {/* 當前單元標頭與核心概念速覽 */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <div>
            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'rgba(37, 99, 235, 0.15)', color: '#2563eb', fontWeight: 700 }}>
              {currentUnit.strand} · {currentUnit.band}
            </span>
            <h3 style={{ margin: '0.3rem 0 0.1rem', fontSize: '1.05rem' }}>{currentUnit.title}</h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{currentUnit.subtitle}</span>
          </div>
        </div>

        {/* 核心觀念要點 */}
        <div style={{ background: 'var(--surface-soft)', borderRadius: '8px', padding: '0.65rem 0.8rem', marginTop: '0.5rem', border: '1px solid var(--line)' }}>
          <strong style={{ fontSize: '0.76rem', color: '#2563eb', display: 'block', marginBottom: '0.25rem' }}>
            📖 本單元核心觀念精要：
          </strong>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.74rem', lineHeight: 1.5, color: 'var(--text)' }}>
            {currentUnit.concepts.map((concept, cIdx) => (
              <li key={cIdx}>{concept}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 單元題目列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {currentUnit.questions.map((q, qIdx) => {
          const isSubmitted = submittedQuestions[q.id]
          const chosenOpt = selectedOptions[q.id]
          const isDone = completedQuestions.includes(q.id)

          return (
            <div
              key={q.id}
              style={{
                background: 'var(--surface)',
                border: isDone ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--line)',
                borderRadius: '12px',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'rgba(37, 99, 235, 0.15)', color: '#2563eb', fontWeight: 700 }}>
                    第 {qIdx + 1} 題
                  </span>
                  <strong style={{ fontSize: '0.88rem' }}>{q.title}</strong>
                </div>
                {isDone && (
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>✓ 已掌握 (+15 XP)</span>
                )}
              </div>

              <p style={{ fontSize: '0.84rem', lineHeight: 1.5, margin: '0.4rem 0 0.6rem' }}>
                {q.question}
              </p>

              {/* 選項列表 */}
              {q.options && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.35rem' }}>
                  {q.options.map((opt, optIdx) => {
                    const isChosen = chosenOpt === optIdx
                    const isCorrect = optIdx === q.answer

                    let border = 'var(--line)'
                    let bg = 'var(--surface-soft)'

                    if (isSubmitted) {
                      if (isCorrect) {
                        border = '#10b981'
                        bg = 'rgba(16, 185, 129, 0.15)'
                      } else if (isChosen) {
                        border = '#ef4444'
                        bg = 'rgba(239, 68, 68, 0.15)'
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        className="practice-card"
                        style={{
                          padding: '0.5rem 0.8rem',
                          borderRadius: '8px',
                          border: `1px solid ${border}`,
                          background: bg,
                          textAlign: 'left',
                          cursor: isSubmitted ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                        onClick={() => handleSelectOption(q, optIdx)}
                      >
                        <span style={{ fontSize: '0.8rem' }}>{opt}</span>
                        {isSubmitted && isCorrect && <span style={{ color: '#10b981', fontWeight: 700 }}>✓ 正確</span>}
                        {isSubmitted && isChosen && !isCorrect && <span style={{ color: '#ef4444', fontWeight: 700 }}>✗ 錯誤</span>}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* 詳解區域 */}
              {isSubmitted && (
                <div style={{ marginTop: '0.65rem', padding: '0.75rem', borderRadius: '8px', background: 'var(--surface-soft)', border: '1px solid var(--line)' }}>
                  <strong style={{ fontSize: '0.78rem', color: '#2563eb', display: 'block', marginBottom: '0.3rem' }}>
                    💡 步驟式深度解析：
                  </strong>
                  <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.76rem', lineHeight: 1.5, color: 'var(--text)' }}>
                    {q.solution.map((step, sIdx) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ol>
                  <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'var(--muted)' }}>
                    <strong>考點精要：</strong>{q.explanation}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
