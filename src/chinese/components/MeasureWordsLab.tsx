import React, { useState } from 'react'
import { MEASURE_WORDS, type MeasureWordItem } from '../data/measureWords'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

export const MeasureWordsLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedMwIdx, setSelectedMwIdx] = useState(0)
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({})
  const [submittedQuiz, setSubmittedQuiz] = useState<Record<string, boolean>>({})

  const activeItem: MeasureWordItem = MEASURE_WORDS[selectedMwIdx % MEASURE_WORDS.length]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleAnswerQuiz(optIdx: number) {
    if (submittedQuiz[activeItem.id]) return
    setSelectedQuizAnswers((prev) => ({ ...prev, [activeItem.id]: optIdx }))
    setSubmittedQuiz((prev) => ({ ...prev, [activeItem.id]: true }))

    if (optIdx === activeItem.quiz.correctIndex) {
      onEarnXp(15)
      playCorrectSound()
    } else {
      playWrongSound()
    }
  }

  return (
    <div className="math-lab measure-words-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🔢</span> 華語量詞精準搭配實驗室 (Classifiers & Measure Words Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            「一張桌子」？「一把椅子」？「一條褲子」？名詞形狀與量詞的自然搭配法則一網打盡！
          </p>
        </div>
      </div>

      {/* 膠囊選擇列 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {MEASURE_WORDS.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            className={`pill-btn ${selectedMwIdx === idx ? 'active' : ''}`}
            onClick={() => setSelectedMwIdx(idx)}
          >
            一「{item.classifierZh}」... ({item.pinyin})
          </button>
        ))}
      </div>

      {/* 雙欄佈局 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
        {/* 左側：量詞特徵與名詞清單 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '2.2rem', color: '#f59e0b' }}>
                一{activeItem.classifierZh}
              </h2>
              <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>
                {activeItem.pinyin} · {activeItem.bopomofo}
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 700 }}>
              {activeItem.categoryJa}
            </span>
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block' }}>使い分けのルール：</span>
            <div style={{ fontSize: '0.8rem', lineHeight: 1.45 }}>{activeItem.usageRuleJa}</div>
          </div>

          <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 700, marginTop: '0.2rem' }}>
            代表的な名詞の組み合わせ：
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {activeItem.matchedNouns.map((noun, nIdx) => (
              <div
                key={nIdx}
                style={{
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '0.5rem 0.7rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.88rem', color: '#f59e0b' }}>{noun.samplePhraseZh}</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)', marginLeft: '0.4rem' }}>
                    ({noun.nounZh} · {noun.meaningJa})
                  </span>
                </div>
                <button
                  type="button"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                  onClick={() => speakChinese(noun.samplePhraseZh)}
                >
                  🔊
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 右側：量詞秒殺測驗 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div>
            <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'block' }}>
              🎯 3秒量詞快答挑戰 (Quick Measure Word Quiz)
            </span>
            <div style={{ margin: '0.4rem 0', fontSize: '0.76rem', color: 'var(--muted)' }}>
              次の名詞に最も適した量詞を選んでください：
            </div>
            <h3 style={{ margin: '0.2rem 0', fontSize: '1.2rem', color: 'var(--text)' }}>
              一 [ ? ] {activeItem.quiz.nounZh}
            </h3>
            <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>({activeItem.quiz.meaningJa})</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
            {activeItem.quiz.options.map((opt, optIdx) => {
              const isPicked = selectedQuizAnswers[activeItem.id] === optIdx
              const isCorrect = optIdx === activeItem.quiz.correctIndex
              const isDone = submittedQuiz[activeItem.id]

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
                    padding: '0.8rem 0.5rem',
                    textAlign: 'center',
                    borderRadius: '8px',
                    border: `1px solid ${border}`,
                    background: bg,
                    cursor: isDone ? 'default' : 'pointer',
                  }}
                  onClick={() => handleAnswerQuiz(optIdx)}
                >
                  <h4 style={{ margin: 0, fontSize: '1.3rem' }}>{opt}</h4>
                </button>
              )
            })}
          </div>

          {submittedQuiz[activeItem.id] && (
            <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.45 }}>
              💡 <strong>解説：</strong>{activeItem.quiz.explanationJa}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
