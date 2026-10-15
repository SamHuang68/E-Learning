import React, { useState } from 'react'
import { CS_CURRICULUM, csStrandMessageKey, type CsUnit, type CsQuestion } from '../data/curriculum'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'
import { csTeachingCopy, localizeCsUnit } from '../../i18n/csTeachingCopy'

interface Props {
  completedQuestions?: string[]
  onCompleteQuestion: (questionId: string, earnedXp: number) => void
  onRecordError: (questionId: string) => void
  initialUnitId?: string
}

export const CsPractice: React.FC<Props> = ({
  completedQuestions = [],
  onCompleteQuestion,
  onRecordError,
  initialUnitId,
}) => {
  const { t, locale } = useI18n()
  const copy = (zhHant: string, en: string) => locale === 'en' ? en : zhHant
  const curriculum = CS_CURRICULUM.map((unit) => localizeCsUnit(locale, unit))
  const [activeUnitId, setActiveUnitId] = useState<string>(
    initialUnitId && CS_CURRICULUM.some((u) => u.id === initialUnitId)
      ? initialUnitId
      : CS_CURRICULUM[0].id
  )
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({})
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({})

  const currentUnit: CsUnit = curriculum.find((u) => u.id === activeUnitId) || curriculum[0]

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
    <div className="cs-practice">
      {/* 單元切換膠囊 */}
      <div className="cs-practice-unit-tabs">
        {curriculum.map((u, idx) => {
          const isActive = u.id === activeUnitId
          const unitCompleted = u.questions.every((q) => completedQuestions.includes(q.id))
          return (
            <button aria-pressed={isActive}
              key={u.id}
              type="button"
              className={`pill-btn cs-practice-unit-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveUnitId(u.id)}
            >
              <span>{unitCompleted ? '✓' : idx + 1}</span>
              <span>{u.title.split(/[：:]/, 1)[0]}</span>
            </button>
          )
        })}
      </div>

      {/* 當前單元標頭與核心概念速覽 */}
      <div className="cs-practice-overview">
        <div className="cs-practice-overview-header">
          <div>
            <span className="cs-practice-strand">
              {t(csStrandMessageKey(currentUnit.strand))} · {csTeachingCopy(locale, currentUnit.band)}
            </span>
            <h3>{currentUnit.title}</h3>
            <span className="cs-practice-overview-subtitle">{currentUnit.subtitle}</span>
          </div>
        </div>

        {/* 核心觀念要點 */}
        <div className="cs-practice-concepts">
          <strong>
            {copy('📖 本單元核心觀念精要：', '📖 Core concepts in this unit:')}
          </strong>
          <ul>
            {currentUnit.concepts.map((concept, cIdx) => (
              <li key={cIdx}>{concept}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 單元題目列表 */}
      <div className="cs-practice-questions">
        {currentUnit.questions.map((q, qIdx) => {
          const isSubmitted = submittedQuestions[q.id]
          const chosenOpt = selectedOptions[q.id]
          const isDone = completedQuestions.includes(q.id)

          return (
            <div
              key={q.id}
              className="cs-practice-question"
              style={{
                border: isDone ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--line)',
              }}
            >
              <div className="cs-practice-question-header">
                <div className="cs-practice-question-title">
                  <span className="cs-practice-question-number">
                    {copy(`第 ${qIdx + 1} 題`, `Question ${qIdx + 1}`)}
                  </span>
                  <strong>{q.title}</strong>
                </div>
                {isDone && (
                  <span className="cs-practice-mastery" style={{ color: '#10b981' }}>{copy('✓ 已掌握 (+15 XP)', '✓ Mastered (+15 XP)')}</span>
                )}
              </div>

              <p className="cs-practice-stem">
                {q.question}
              </p>

              {/* 選項列表 */}
              {q.options && (
                <div className="cs-practice-options">
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
                        className="practice-card cs-practice-option"
                        aria-pressed={isChosen}
                        aria-disabled={Boolean(isSubmitted)}
                        style={{
                          border: `1px solid ${border}`,
                          background: bg,
                          cursor: isSubmitted ? 'default' : 'pointer',
                        }}
                        onClick={() => handleSelectOption(q, optIdx)}
                      >
                        <span className="cs-practice-option-text">{opt}</span>
                        {isSubmitted && isCorrect && <span className="cs-practice-option-status" style={{ color: '#10b981' }}>{copy('✓ 正確', '✓ Correct')}</span>}
                        {isSubmitted && isChosen && !isCorrect && <span className="cs-practice-option-status" style={{ color: '#ef4444' }}>{copy('✗ 錯誤', '✗ Incorrect')}</span>}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* 詳解區域 */}
              {isSubmitted && (
                <div className="cs-practice-feedback">
                  <p role="status" aria-live="polite" aria-atomic="true" className="status-line">
                    {chosenOpt === q.answer ? copy('答對了', 'Correct') : copy('答錯了', 'Incorrect')}
                  </p>
                  <strong className="cs-practice-feedback-title">
                    {copy('💡 步驟式深度解析：', '💡 Step-by-step explanation:')}
                  </strong>
                  <ol>
                    {q.solution.map((step, sIdx) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ol>
                  <div className="cs-practice-keypoint">
                    <strong>{copy('考點精要：', 'Key point:')}</strong>{q.explanation}
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
