import React, { useLayoutEffect, useRef, useState } from 'react'
import { TOCFL_MOCK_QUESTIONS } from '../data/tocflExam'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'
import { localizeTocflQuestion, type LocalizedTocflQuestion } from '../teachingCopy'

interface Props {
  errorQuestionIds: string[]
  onRemoveError: (questionId: string) => void
  onEarnXp: (amount: number) => void
}

export const ChineseErrorVault: React.FC<Props> = ({ errorQuestionIds, onRemoveError, onEarnXp }) => {
  const { locale } = useI18n()
  const rootRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const pendingFocusIndex = useRef<number | null>(null)
  const [removalRemainingCount, setRemovalRemainingCount] = useState<number | null>(null)
  const errorList: LocalizedTocflQuestion[] = TOCFL_MOCK_QUESTIONS
    .filter((q) => errorQuestionIds.includes(q.id))
    .map((question) => localizeTocflQuestion(question, locale))
  const copy = locale === 'en'
    ? {
        title: 'Mandarin Error Notebook and Blind-Spot Review',
        description: 'Collects missed TOCFL practice items with Traditional Chinese, pinyin, and English explanations. Remove an item after you have mastered it.',
        emptyTitle: 'No open Mandarin error items',
        emptyBody: 'Take the TOCFL practice test to check your skills. Missed items will be saved here for focused review.',
        item: 'Item',
        play: 'Play pronunciation',
        mastered: 'I know this (+15 XP)',
        answer: 'Answer:',
        explanation: 'Explanation:',
        removed: (remaining: number) => `Error item removed. ${remaining} ${remaining === 1 ? 'item remains' : 'items remain'}.`,
      }
    : {
        title: '華語錯題本與盲點弱點分析 (Chinese Error Notebook)',
        description: '自動彙整 TOCFL 模擬測驗答錯之試題，提供繁中/拼音/注音與日本語詳解，加強掌握後可一鍵移出錯題！',
        emptyTitle: '太棒了！目前沒有任何華語錯題',
        emptyBody: '前往「TOCFL 模擬測驗」檢驗實力，系統會自動將答錯的題目收錄至此處進行弱點專項攻克。',
        item: '弱點',
        play: '聽發音',
        mastered: '我已掌握 (+15 XP)',
        answer: '正解：',
        explanation: '解說：',
        removed: (remaining: number) => `已移除錯題，剩餘 ${remaining} 題。`,
      }
  const removalMessage = removalRemainingCount === null
    ? ''
    : copy.removed(removalRemainingCount)

  useLayoutEffect(() => {
    if (pendingFocusIndex.current === null) return
    const buttons = rootRef.current?.querySelectorAll<HTMLButtonElement>('[data-vault-remove]')
    const nextButton = buttons?.[Math.min(pendingFocusIndex.current, buttons.length - 1)]
    const focusTarget = nextButton ?? headingRef.current
    focusTarget?.focus()
    pendingFocusIndex.current = null
  }, [errorList.length])

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  function handleMaster(qId: string, index: number) {
    pendingFocusIndex.current = index
    setRemovalRemainingCount(errorList.length - 1)
    onRemoveError(qId)
    onEarnXp(15)
    playCorrectSound()
  }

  return (
    <div ref={rootRef} className="math-lab chinese-error-vault" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{removalMessage}</p>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 ref={headingRef} tabIndex={-1} style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📕</span> {copy.title}
          </h3>
          <p lang={locale === 'en' ? 'en' : 'zh-Hant'} className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {copy.description}
          </p>
        </div>
      </div>

      {errorList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--line)' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🎉</span>
          <h4 style={{ margin: '0 0 0.3rem', fontSize: '1.1rem' }}>{copy.emptyTitle}</h4>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>
            {copy.emptyBody}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {errorList.map((q, idx) => (
            <div
              key={q.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 700 }}>
                    {copy.item} #{idx + 1}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{q.section}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button
                    type="button"
                    className="pill-btn"
                    style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem' }}
                    onClick={() => speakChinese(q.promptZh)}
                  >
                    🔊 {copy.play}
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    data-vault-remove
                    style={{ fontSize: '0.72rem', padding: '0.15rem 0.55rem', background: '#10b981' }}
                    onClick={() => handleMaster(q.id, idx)}
                  >
                    ✓ {copy.mastered}
                  </button>
                </div>
              </div>

              <h4 style={{ margin: '0.3rem 0 0.2rem', fontSize: '0.95rem' }}>{q.promptZh}</h4>
              <div lang="zh-Latn" style={{ fontSize: '0.74rem', color: '#f59e0b', marginBottom: '0.4rem' }}>{q.promptPinyin}</div>

              <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '0.76rem', color: 'var(--muted)' }}>
                <div>{copy.answer} <strong style={{ color: '#10b981' }}>{q.options[q.correctIndex]?.zh}</strong> (<span lang={locale === 'en' ? 'en' : 'ja'}>{q.options[q.correctIndex]?.ja}</span>)</div>
                <div style={{ marginTop: '0.2rem', color: '#38bdf8' }}>💡 <strong>{copy.explanation}</strong> <span lang={locale === 'en' ? 'en' : 'ja'}>{q.explanationJa}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
