import React, { useLayoutEffect, useRef, useState } from 'react'
import { CS_CURRICULUM, type CsQuestion } from '../data/curriculum'
import { CS_MOCK_EXAMS } from '../data/mockExams'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'

interface Props {
  errorQuestionIds?: string[]
  onRemoveError: (questionId: string) => void
}

export const CsErrorVault: React.FC<Props> = ({ errorQuestionIds = [], onRemoveError }) => {
  const { t, locale } = useI18n()
  const rootRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const pendingFocusIndex = useRef<number | null>(null)
  const [removalMessage, setRemovalMessage] = useState('')
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

  useLayoutEffect(() => {
    if (pendingFocusIndex.current === null) return
    const buttons = rootRef.current?.querySelectorAll<HTMLButtonElement>('[data-vault-remove]')
    const nextButton = buttons?.[Math.min(pendingFocusIndex.current, buttons.length - 1)]
    const focusTarget = nextButton ?? headingRef.current
    focusTarget?.focus()
    pendingFocusIndex.current = null
  }, [errorQuestions.length])

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true" lang={locale}>{removalMessage}</p>
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
          <h3 ref={headingRef} tabIndex={-1} style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📕</span> <span lang={locale}>{t('vault.csTitle')}</span>
          </h3>
          <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
            <span lang={locale}>{t('vault.csDesc')}</span>
          </span>
        </div>
        <span style={{ fontSize: '0.78rem', padding: '0.2rem 0.6rem', borderRadius: '999px', background: errorQuestions.length > 0 ? '#ef4444' : '#10b981', color: '#fff', fontWeight: 700 }}>
          <span lang={locale}>{t('vault.pending', { count: errorQuestions.length })}</span>
        </span>
      </div>

      {/* 錯題為空時的恭喜卡片 */}
      {errorQuestions.length === 0 ? (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.6rem' }}>🎉 🏆</div>
          <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem' }}><span lang={locale}>{t('vault.csEmptyTitle')}</span></h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>
            <span lang={locale}>{t('vault.csEmptyBody')}</span>
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
                  <span lang={locale}>{t('vault.item', { n: idx + 1 })}</span>
                </span>
                <button
                  type="button"
                  data-vault-remove
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
                    pendingFocusIndex.current = idx
                    setRemovalMessage(locale === 'en'
                      ? `Removed from Error Vault. ${errorQuestions.length - 1} remaining.`
                      : `已移除錯題，剩餘 ${errorQuestions.length - 1} 題。`)
                    playCorrectSound()
                    onRemoveError(q.id)
                  }}
                >
                  ✓ <span lang={locale}>{t('vault.mastered')}</span>
                </button>
              </div>

              <strong style={{ fontSize: '0.9rem', display: 'block', marginBottom: '0.4rem' }}>{q.title}</strong>
              <p style={{ fontSize: '0.84rem', lineHeight: 1.5, margin: '0.4rem 0 0.6rem' }}>{q.question}</p>

              {q.options && (
                <div style={{ background: 'var(--surface-soft)', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--line)', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                    <span lang={locale}>{t('vault.answer', { answer: '' })}</span>{q.options[Number(q.answer)]}
                  </span>
                </div>
              )}

              <div style={{ background: 'var(--surface-soft)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
                <strong style={{ fontSize: '0.76rem', color: '#2563eb', display: 'block', marginBottom: '0.25rem' }}>
                  💡 <span lang={locale}>{t('vault.explain')}</span>
                </strong>
                <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.74rem', lineHeight: 1.5, color: 'var(--text)' }}>
                  {q.solution.map((step, sIdx) => (
                    <li key={sIdx}>{step}</li>
                  ))}
                </ol>
                <div style={{ marginTop: '0.35rem', fontSize: '0.72rem', color: 'var(--muted)' }}>
                  <strong><span lang={locale}>{t('vault.blindspot')}</span></strong>{q.explanation}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
