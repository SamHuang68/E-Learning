import React from 'react'
import { TOCFL_MOCK_QUESTIONS, type TocflQuestion } from '../data/tocflExam'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  errorQuestionIds: string[]
  onRemoveError: (questionId: string) => void
  onEarnXp: (amount: number) => void
}

export const ChineseErrorVault: React.FC<Props> = ({ errorQuestionIds, onRemoveError, onEarnXp }) => {
  const errorList: TocflQuestion[] = TOCFL_MOCK_QUESTIONS.filter((q) =>
    errorQuestionIds.includes(q.id),
  )

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  function handleMaster(qId: string) {
    onRemoveError(qId)
    onEarnXp(15)
    playCorrectSound()
  }

  return (
    <div className="math-lab chinese-error-vault" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📕</span> 華語錯題本與盲點弱點分析 (Chinese Error Notebook)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            自動彙整 TOCFL 模擬測驗答錯之試題，提供繁中/拼音/注音與日本語詳解，加強掌握後可一鍵移出錯題！
          </p>
        </div>
      </div>

      {errorList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--line)' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🎉</span>
          <h4 style={{ margin: '0 0 0.3rem', fontSize: '1.1rem' }}>太棒了！目前沒有任何華語錯題</h4>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>
            前往「TOCFL 模擬測驗」檢驗實力，系統會自動將答錯的題目收錄至此處進行弱點專項攻克。
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
                    弱點 #{idx + 1}
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
                    🔊 聽發音
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ fontSize: '0.72rem', padding: '0.15rem 0.55rem', background: '#10b981' }}
                    onClick={() => handleMaster(q.id)}
                  >
                    ✓ 我已掌握 (+15 XP)
                  </button>
                </div>
              </div>

              <h4 style={{ margin: '0.3rem 0 0.2rem', fontSize: '0.95rem' }}>{q.promptZh}</h4>
              <div style={{ fontSize: '0.74rem', color: '#f59e0b', marginBottom: '0.4rem' }}>{q.promptPinyin}</div>

              <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '0.76rem', color: 'var(--muted)' }}>
                <div>正解：<strong style={{ color: '#10b981' }}>{q.options[q.correctIndex]?.zh}</strong> ({q.options[q.correctIndex]?.ja})</div>
                <div style={{ marginTop: '0.2rem', color: '#38bdf8' }}>💡 <strong>解說：</strong>{q.explanationJa}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
