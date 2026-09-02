import React, { useState } from 'react'
import { INTERVIEW_SCENARIOS, type InterviewScenarioItem } from '../data/interviewDialogues'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export const InterviewLab: React.FC<Props> = ({ onEarnXp, instructionLang = 'zh' }) => {
  const isJa = instructionLang === 'ja'
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showScript, setShowScript] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})

  const activeItem: InterviewScenarioItem =
    INTERVIEW_SCENARIOS[selectedIdx % INTERVIEW_SCENARIOS.length]

  function speakInterviewAudio(text: string) {
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
    <div className="math-lab interview-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>👔</span> {isJa ? 'TOEIC 採用面接・HR福利厚生特訓ラボ' : 'TOEIC 商務求職面試與人資福利聽力實驗室'}
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {isJa
              ? 'Part 3/4/7の超頻出ジャンル！「採用面接での自己PR・職務経歴・試用期間（probationary period）・福利厚生」を徹底攻略！'
              : '多益高頻 HR 人資場景：專案成就主導（spearhead）、試用期條款與薪資福利 package 速記！'}
          </p>
        </div>
      </div>

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {INTERVIEW_SCENARIOS.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            className={`pill-btn ${selectedIdx === idx ? 'active' : ''}`}
            onClick={() => {
              setSelectedIdx(idx)
              setShowScript(false)
            }}
          >
            <span>{item.icon}</span> {isJa ? item.titleJa : item.title}
          </button>
        ))}
      </div>

      {/* 雙欄佈局 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
        {/* 左側：面試對話播放 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: isPlaying ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
            {isPlaying ? '🗣️' : '👔'}
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 700 }}>
              {activeItem.accentLabel}
            </span>
            <h3 style={{ margin: '0.4rem 0 0.2rem', fontSize: '1.05rem' }}>{activeItem.dialogueRoles.candidate}</h3>
            <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{activeItem.dialogueRoles.interviewer}</span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              type="button"
              className="btn-primary"
              style={{
                padding: '0.6rem 1.4rem',
                borderRadius: '999px',
                background: isPlaying ? '#10b981' : 'linear-gradient(135deg, #f59e0b, #d97706)',
              }}
              onClick={() => speakInterviewAudio(activeItem.audioScript)}
            >
              {isPlaying ? '再生中...' : '▶ 面接音声を聴く (Play Audio)'}
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
            <div style={{ background: 'var(--surface-soft)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--line)', textAlign: 'left', fontSize: '0.78rem', lineHeight: 1.55, color: 'var(--text)', marginTop: '0.4rem', whiteSpace: 'pre-line' }}>
              {activeItem.audioScript}
            </div>
          )}

          <div style={{ marginTop: 'auto', background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '0.74rem', color: 'var(--muted)', textAlign: 'left', lineHeight: 1.45 }}>
            💡 <strong>TOEIC 頻出ポイント：</strong>{activeItem.hrKeywordsTipsJa}
          </div>
        </div>

        {/* 右側：實戰考題 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {activeItem.questions.map((q, qIdx) => (
            <div key={q.id} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 700 }}>
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
