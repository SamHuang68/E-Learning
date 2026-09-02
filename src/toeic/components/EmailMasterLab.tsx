import React, { useState } from 'react'
import { EMAIL_TEMPLATES, type EmailTemplateItem } from '../data/emailTemplates'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export const EmailMasterLab: React.FC<Props> = ({ onEarnXp, instructionLang = 'zh' }) => {
  const isJa = instructionLang === 'ja'
  const [selectedEmailIdx, setSelectedEmailIdx] = useState(0)
  const [styleMode, setStyleMode] = useState<'formal' | 'semiFormal'>('formal')
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({})
  const [submittedQuiz, setSubmittedQuiz] = useState<Record<string, boolean>>({})

  const activeEmail: EmailTemplateItem =
    EMAIL_TEMPLATES[selectedEmailIdx % EMAIL_TEMPLATES.length]

  function speakEnglish(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  function handleSelectQuiz(optIdx: number) {
    if (submittedQuiz[activeEmail.id]) return
    setSelectedQuizAnswers((prev) => ({ ...prev, [activeEmail.id]: optIdx }))
    setSubmittedQuiz((prev) => ({ ...prev, [activeEmail.id]: true }))

    if (optIdx === activeEmail.quiz.correctIndex) {
      onEarnXp(15)
      playCorrectSound()
    } else {
      playWrongSound()
    }
  }

  return (
    <div className="math-lab email-master-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>✉️</span> {isJa ? 'TOEIC ビジネスメール・文体変換ラボ' : 'TOEIC 商務電子郵件經典句型與寫作實驗室'}
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {isJa
              ? 'Part 7読解の最重要テーマ！フォーマル（公式・対顧客）とセミフォーマル（社内・同僚）の文体変換と頻出構文を習得！'
              : '訓練 Part 7 高頻詢價、道歉補償、會議邀請等商務電郵，掌握正式 (Formal) 與半正式 (Semi-formal) 語氣切換！'}
          </p>
        </div>
      </div>

      {/* 類別切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {EMAIL_TEMPLATES.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            className={`pill-btn ${selectedEmailIdx === idx ? 'active' : ''}`}
            onClick={() => setSelectedEmailIdx(idx)}
          >
            {isJa ? item.titleJa : item.title}
          </button>
        ))}
      </div>

      {/* 雙欄佈局 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
        {/* 左側：電郵本體與語氣轉換 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }}>
              {activeEmail.category} Email
            </span>

            {/* 語氣切換器 */}
            <div style={{ display: 'flex', gap: '0.2rem', background: 'var(--surface-soft)', padding: '0.15rem', borderRadius: '999px' }}>
              <button
                type="button"
                style={{
                  border: 'none',
                  borderRadius: '999px',
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: styleMode === 'formal' ? '#38bdf8' : 'transparent',
                  color: styleMode === 'formal' ? '#fff' : 'var(--muted)',
                }}
                onClick={() => setStyleMode('formal')}
              >
                Formal (對外/客戶)
              </button>
              <button
                type="button"
                style={{
                  border: 'none',
                  borderRadius: '999px',
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: styleMode === 'semiFormal' ? '#f59e0b' : 'transparent',
                  color: styleMode === 'semiFormal' ? '#fff' : 'var(--muted)',
                }}
                onClick={() => setStyleMode('semiFormal')}
              >
                Semi-formal (社內/同僚)
              </button>
            </div>
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.5rem 0.7rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--muted)', display: 'block' }}>Subject (件名)：</span>
            <strong style={{ fontSize: '0.82rem', color: 'var(--text)' }}>
              {isJa ? activeEmail.subjectLineJa : activeEmail.subjectLine}
            </strong>
          </div>

          {/* 郵件內容 */}
          <div style={{ background: 'var(--surface-soft)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--line)', whiteSpace: 'pre-line', fontSize: '0.82rem', lineHeight: 1.55 }}>
            {styleMode === 'formal' ? activeEmail.formalBody : activeEmail.semiFormalBody}
          </div>

          <button
            type="button"
            className="btn-primary"
            style={{ alignSelf: 'flex-start', padding: '0.35rem 0.75rem', fontSize: '0.76rem' }}
            onClick={() => speakEnglish(styleMode === 'formal' ? activeEmail.formalBody : activeEmail.semiFormalBody)}
          >
            🔊 全文朗讀 (Listen Email)
          </button>
        </div>

        {/* 右側：必背句型與段落填空測驗 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {/* 必背句型 */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700 }}>
              📌 {isJa ? 'Part 7 必須キーフレーズ：' : 'Part 7 核心必背句型：'}
            </span>
            {activeEmail.keyPhrases.map((kp, kIdx) => (
              <div key={kIdx} style={{ background: 'var(--surface-soft)', padding: '0.5rem 0.65rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
                <strong style={{ fontSize: '0.82rem', color: '#38bdf8', display: 'block' }}>{kp.phraseEn}</strong>
                <span style={{ fontSize: '0.74rem', color: 'var(--text)', display: 'block', margin: '0.1rem 0' }}>
                  {isJa ? kp.phraseJa : kp.phraseZh}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>💡 {kp.purposeJa}</span>
              </div>
            ))}
          </div>

          {/* 實戰測驗 */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, display: 'block' }}>
                🎯 {isJa ? '句型判定チャレンジ：' : '電郵句型速答實戰：'}
              </span>
              <h4 style={{ margin: '0.3rem 0 0.5rem', fontSize: '0.88rem' }}>
                {isJa ? activeEmail.quiz.questionJa : activeEmail.quiz.questionZh}
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.35rem' }}>
              {activeEmail.quiz.options.map((opt, optIdx) => {
                const isPicked = selectedQuizAnswers[activeEmail.id] === optIdx
                const isCorrect = optIdx === activeEmail.quiz.correctIndex
                const isDone = submittedQuiz[activeEmail.id]

                let border = 'var(--line)'
                let bg = 'var(--surface-soft)'
                if (isDone) {
                  if (isCorrect) {
                    border = '#10b981'
                    bg = 'rgba(16, 185, 129, 0.15)'
                  } else if (isPicked) {
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
                      padding: '0.55rem 0.8rem',
                      borderRadius: '8px',
                      border: `1px solid ${border}`,
                      background: bg,
                      textAlign: 'left',
                      cursor: isDone ? 'default' : 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onClick={() => handleSelectQuiz(optIdx)}
                  >
                    <span style={{ fontSize: '0.82rem' }}>{opt}</span>
                    {isDone && isCorrect && <span style={{ color: '#10b981', fontWeight: 700 }}>✓ 正解 (+15 XP)</span>}
                  </button>
                )
              })}
            </div>

            {submittedQuiz[activeEmail.id] && (
              <div style={{ marginTop: '0.4rem', padding: '0.6rem', borderRadius: '8px', background: 'var(--surface-soft)', fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                💡 <strong>解説：</strong>{activeEmail.quiz.clueExplanationJa}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
