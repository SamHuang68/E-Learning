import { stemVaultCopy } from '../../i18n/stemVaultCopy'
import { teachingCopy } from '../../i18n/teachingCopy'
import React, { useEffect, useRef, useState } from 'react'
import { loadMathProgress, recordMathAnswer } from '../utils/mathStorage'
import { ALL_MATH_GRADES } from '../data/gradeStore'
import { MOCK_EXAMS } from '../data/mockExams'
import type { MathQuestion } from '../data/curriculum'
import { MathFormula } from './MathFormula'
import { exportErrorVaultToAnki } from '../../utils/ankiExporter'
import { useI18n } from '../../i18n/i18n'
import { localizeMathQuestion } from '../../i18n/mathTeachingCopy'

type Props = {
  onBack: () => void
}

/**
 * 數學錯題筆記本 (MathErrorVault)
 * 自動蒐集作答錯誤的題目，提供再次挑戰、步驟解析與清除機制。
 */
export const MathErrorVault: React.FC<Props> = ({ onBack }) => {
  const { t, locale } = useI18n()
  const [progress, setProgress] = useState(() => loadMathProgress())
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [testInput, setTestInput] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const retryTriggerRef = useRef<HTMLButtonElement | null>(null)
  const vaultHeadingRef = useRef<HTMLHeadingElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const submittedRef = useRef(false)

  // 單元及練習卷共用檢索池，避免已儲存的練習卷錯題無法訂正。
  const rawQuestionsById = new Map<string, MathQuestion>()
  Object.values(ALL_MATH_GRADES).forEach((g) => {
    g.units.forEach((u) => {
      u.questions.forEach((q) => rawQuestionsById.set(q.id, q))
    })
  })
  Object.values(MOCK_EXAMS).forEach((exam) => {
    exam.questions.forEach((q) => rawQuestionsById.set(q.id, q))
  })
  const errorQuestions = progress.errorQuestions
    .map((id) => rawQuestionsById.get(id))
    .filter((q): q is MathQuestion => Boolean(q))
    .map((q) => localizeMathQuestion(q, locale))
  const selectedRawQuestion = selectedQuestionId
    ? rawQuestionsById.get(selectedQuestionId) ?? null
    : null
  const selectedQuestion = selectedRawQuestion
    ? localizeMathQuestion(selectedRawQuestion, locale)
    : null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (selectedQuestionId) {
      submittedRef.current = false
      if (!dialog.open) dialog.showModal()
      dialog.querySelector<HTMLElement>('button, input, [tabindex]:not([tabindex="-1"])')?.focus()
      return
    }
    if (dialog.open) dialog.close()
    const retryTrigger = retryTriggerRef.current
    if (retryTrigger) {
      if (retryTrigger.isConnected) retryTrigger.focus()
      else vaultHeadingRef.current?.focus()
      retryTriggerRef.current = null
    }
  }, [selectedQuestionId])

  useEffect(() => () => {
    if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current)
  }, [])

  function cancelScheduledClose() {
    if (closeTimerRef.current === null) return
    clearTimeout(closeTimerRef.current)
    closeTimerRef.current = null
  }

  function closeReview() {
    cancelScheduledClose()
    submittedRef.current = false
    setSelectedQuestionId(null)
    setTestInput('')
    setFeedback(null)
  }

  function handleRecheck(q: MathQuestion) {
    if (!testInput.trim() || submittedRef.current) return
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
      submittedRef.current = true
      setFeedback('correct')
      const next = recordMathAnswer(q.id, true, 5)
      setProgress(next)
      cancelScheduledClose()
      closeTimerRef.current = setTimeout(() => {
        closeTimerRef.current = null
        setSelectedQuestionId(null)
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
          <h2 ref={vaultHeadingRef} tabIndex={-1}>{t('vault.title')}</h2>
          <p className="vault-desc">
            {t('vault.desc')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          {errorQuestions.length > 0 && (
            <button
              type="button"
              className="btn-back"
              style={{ background: 'rgba(37, 99, 235, 0.12)', color: '#2563eb', borderColor: '#2563eb' }}
              onClick={() => exportErrorVaultToAnki(locale === 'en' ? 'Math' : '數學', errorQuestions)}
              title={t('vault.exportTitle')}
            >
              📋 {t('vault.exportAnki')}
            </button>
          )}
          <button type="button" className="btn-back" onClick={onBack}>
            ← {t('vault.back')}
          </button>
        </div>
      </div>

      {errorQuestions.length === 0 ? (
        <div className="vault-empty-card">
          <span className="empty-icon">🎉</span>
          <h3>{t('vault.emptyTitle')}</h3>
          <p>{t('vault.emptyBody')}</p>
        </div>
      ) : (
        <div className="vault-grid">
          {errorQuestions.map((q) => {
            const rawQuestion = rawQuestionsById.get(q.id) ?? q
            const text = `${rawQuestion.title} ${rawQuestion.question}`.toLowerCase()
            let labInfo: { name: string; tab: string } | null = null
            if (text.includes('畢氏') || text.includes('勾股') || text.includes('直角')) {
              labInfo = { name: '📐 畢氏勾股定理教具', tab: 'pythagoras' }
            } else if (text.includes('三角') || text.includes('sin') || text.includes('cos') || text.includes('單位圓')) {
              labInfo = { name: '🔴 三角函數單位圓教具', tab: 'unit-circle' }
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
                      🔬 {t('vault.relatedLab', { name: stemVaultCopy(locale, labInfo.name) })}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  className="btn-review-item"
                  onClick={(event) => {
                    cancelScheduledClose()
                    retryTriggerRef.current = event.currentTarget
                    setSelectedQuestionId(q.id)
                    setTestInput('')
                    setFeedback(null)
                  }}
                >
                  {t('vault.retry')}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* 訂正彈窗 */}
      <dialog
        ref={dialogRef}
        className="modal-overlay"
        aria-modal="true"
        aria-labelledby="math-error-review-title"
        onCancel={(event) => {
          event.preventDefault()
          closeReview()
        }}
        onClose={closeReview}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeReview()
        }}
      >
        {selectedQuestion && selectedRawQuestion && (
          <div className="modal-content">
            <h3 id="math-error-review-title">{t('vault.reviewTitle', { title: selectedQuestion.title })}</h3>
            <div className="modal-q-text">
              <MathFormula math={selectedQuestion.question} />
            </div>

            {selectedQuestion.type === 'choice' && selectedQuestion.options && (
              <div className="modal-options">
                {selectedQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={feedback === 'correct'}
                    className={`modal-opt-btn ${testInput === String(idx) ? 'active' : ''}`}
                    aria-pressed={testInput === String(idx)}
                    onClick={() => setTestInput(String(idx))}
                  >
                    {String.fromCharCode(65 + idx)}. <MathFormula math={opt} />
                  </button>
                ))}
              </div>
            )}

            {selectedQuestion.type === 'fill' && (
              <div className="modal-fill">
                <input
                  type="text"
                  aria-label={t('exercise.typeAnswer')}
                  disabled={feedback === 'correct'}
                  placeholder={t('exercise.typeAnswer')}
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="fill-text-input"
                />
              </div>
            )}

            {feedback === 'correct' && (
              <p className="feedback-badge correct" role="status">✅ {t('vault.correct')}</p>
            )}
            {feedback === 'wrong' && (
              <div className="feedback-badge wrong" role="alert">
                <p>❌ {t('vault.wrong')}</p>
                <MathFormula math={selectedQuestion.solution} block={true} />
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn-primary"
                disabled={!testInput.trim() || feedback === 'correct'}
                onClick={() => handleRecheck(selectedRawQuestion)}
              >
                {t('vault.submit')}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={closeReview}
              >
                {teachingCopy(locale, '關閉')}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  )
}
