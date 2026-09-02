import React, { useState } from 'react'
import { PHONE_SCENARIOS, type PhoneScenarioItem } from '../data/phoneDialogues'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export const PhoneLab: React.FC<Props> = ({ onEarnXp, instructionLang = 'zh' }) => {
  const isJa = instructionLang === 'ja'
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showScript, setShowScript] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})

  const activeItem: PhoneScenarioItem = PHONE_SCENARIOS[selectedIdx % PHONE_SCENARIOS.length]

  function speakPhoneAudio(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = activeItem.targetAccent
    utterance.rate = 0.95
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)
    setIsPlaying(true)
    window.speechSynthesis.speak(utterance)
  }

  function handleSelectOption(qId: string, optIdx: number, correctIdx: number) {
    if (submitted[qId]) return
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }))
    setSubmitted((prev) => ({ ...prev, [qId]: true }))

    if (optIdx === correctIdx) {
      onEarnXp(15)
      playCorrectSound()
    } else {
      playWrongSound()
    }
  }

  return (
    <div className="math-lab phone-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📞</span> {isJa ? 'TOEIC 電話応対・留守電（Voicemail）特訓ラボ' : 'TOEIC 商務電話與語音信箱聽力特訓實驗室'}
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {isJa
              ? 'リスニングPart 4で頻出する「留守番電話メッセージ・日程変更・折り返し要請」の速記と即座の文脈把握を徹底特訓！'
              : '訓練 Part 3/4 高頻商務電話留言：轉機延誤、會議改期、分機號碼等關鍵資訊盲聽秒殺！'}
          </p>
        </div>
      </div>

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {PHONE_SCENARIOS.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            className={`pill-btn ${selectedIdx === idx ? 'active' : ''}`}
            onClick={() => {
              setSelectedIdx(idx)
              setShowScript(false)
            }}
          >
            {isJa ? item.titleJa : item.title}
          </button>
        ))}
      </div>

      {/* 雙欄佈局 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
        {/* 左側：電話錄音機介面 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: isPlaying ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', transition: 'all 0.3s ease' }}>
            {isPlaying ? '🔊' : '📼'}
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }}>
              {activeItem.accentLabel}
            </span>
            <h3 style={{ margin: '0.4rem 0 0.2rem', fontSize: '1.1rem' }}>{activeItem.callerName}</h3>
            <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{activeItem.callerCompany}</span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              type="button"
              className="btn-primary"
              style={{
                padding: '0.6rem 1.4rem',
                borderRadius: '999px',
                background: isPlaying ? '#10b981' : 'linear-gradient(135deg, #0284c7, #38bdf8)',
              }}
              onClick={() => speakPhoneAudio(activeItem.audioScript)}
            >
              {isPlaying ? '再生中...' : '▶ 留守電を聴く (Play)'}
            </button>
            <button
              type="button"
              className="pill-btn"
              onClick={() => setShowScript((prev) => !prev)}
            >
              {showScript ? '隠す' : '📝 スクリプト'}
            </button>
          </div>

          {showScript && (
            <div style={{ background: 'var(--surface-soft)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--line)', textAlign: 'left', fontSize: '0.78rem', lineHeight: 1.5, color: 'var(--text)', marginTop: '0.4rem' }}>
              {activeItem.audioScript}
            </div>
          )}
        </div>

        {/* 右側：聽力實戰考題 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {activeItem.questions.map((q, qIdx) => (
            <div key={q.id} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }}>
                  Question {qIdx + 1}
                </span>
                <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{isJa ? q.questionJa : q.question}</h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.35rem', marginTop: '0.6rem' }}>
                {q.options.map((opt, optIdx) => {
                  const isPicked = selectedAnswers[q.id] === optIdx
                  const isCorrect = optIdx === q.correctIndex
                  const isDone = submitted[q.id]

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
                      onClick={() => handleSelectOption(q.id, optIdx, q.correctIndex)}
                    >
                      <span style={{ fontSize: '0.82rem' }}>{opt}</span>
                      {isDone && isCorrect && <span style={{ color: '#10b981', fontWeight: 700 }}>✓ 正解 (+15 XP)</span>}
                    </button>
                  )
                })}
              </div>

              {submitted[q.id] && (
                <div style={{ marginTop: '0.6rem', padding: '0.6rem', borderRadius: '8px', background: 'var(--surface-soft)', fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                  💡 <strong>{isJa ? '解説：' : '解析：'}</strong> {isJa ? q.explanationJa : q.explanationZh}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
