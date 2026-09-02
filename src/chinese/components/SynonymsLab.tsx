import React, { useState } from 'react'
import { SYNONYM_ITEMS, type SynonymItem } from '../data/synonyms'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

export const SynonymsLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})

  const activeItem: SynonymItem = SYNONYM_ITEMS[selectedIdx % SYNONYM_ITEMS.length]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleSelectOption(optIdx: number) {
    if (submitted[activeItem.id]) return
    setSelectedOption((prev) => ({ ...prev, [activeItem.id]: optIdx }))
    setSubmitted((prev) => ({ ...prev, [activeItem.id]: true }))

    if (optIdx === activeItem.quiz.correctIndex) {
      onEarnXp(15)
      playCorrectSound()
    } else {
      playWrongSound()
    }
  }

  return (
    <div className="math-lab synonyms-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>⚖️</span> 華語近義詞辨析與語法搭配實驗室 (Synonyms Distinction Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            日本人学習者が最も混同しやすい近義詞の「品詞・語順・使われる文脈」の違いをクリアに攻略！
          </p>
        </div>
      </div>

      {/* 膠囊選擇列 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {SYNONYM_ITEMS.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            className={`pill-btn ${selectedIdx === idx ? 'active' : ''}`}
            onClick={() => setSelectedIdx(idx)}
          >
            {item.wordA.zh} vs {item.wordB.zh}
          </button>
        ))}
      </div>

      {/* 雙欄對比佈局 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
        {/* Word A */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#38bdf8' }}>{activeItem.wordA.zh}</h3>
              <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{activeItem.wordA.pinyin}</span>
            </div>
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }}>
              {activeItem.wordA.posJa}
            </span>
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block' }}>意味と特徴：</span>
            <div style={{ fontSize: '0.8rem', lineHeight: 1.45 }}>{activeItem.wordA.definitionJa}</div>
          </div>

          <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
            <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700, display: 'block' }}>文法パターン：</span>
            <code style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>{activeItem.wordA.patternZh}</code>
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>例文 (Example)：</span>
              <button
                type="button"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                onClick={() => speakChinese(activeItem.wordA.exampleZh)}
              >
                🔊
              </button>
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, margin: '0.2rem 0' }}>{activeItem.wordA.exampleZh}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{activeItem.wordA.exampleJa}</div>
          </div>
        </div>

        {/* Word B */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#f59e0b' }}>{activeItem.wordB.zh}</h3>
              <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{activeItem.wordB.pinyin}</span>
            </div>
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 700 }}>
              {activeItem.wordB.posJa}
            </span>
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block' }}>意味と特徴：</span>
            <div style={{ fontSize: '0.8rem', lineHeight: 1.45 }}>{activeItem.wordB.definitionJa}</div>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
            <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700, display: 'block' }}>文法パターン：</span>
            <code style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700 }}>{activeItem.wordB.patternZh}</code>
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>例文 (Example)：</span>
              <button
                type="button"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                onClick={() => speakChinese(activeItem.wordB.exampleZh)}
              >
                🔊
              </button>
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, margin: '0.2rem 0' }}>{activeItem.wordB.exampleZh}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{activeItem.wordB.exampleJa}</div>
          </div>
        </div>
      </div>

      {/* 核心差異總結與實戰測驗 */}
      <div style={{ marginTop: '0.8rem', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '0.8rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'block' }}>
            💡 決定的な使い分けのポイント：
          </span>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', lineHeight: 1.45 }}>{activeItem.coreDifferenceJa}</p>
        </div>

        <div>
          <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700, display: 'block' }}>
            🎯 3秒選詞實戰 (Quick Drill)
          </span>
          <h4 style={{ margin: '0.3rem 0 0.6rem', fontSize: '0.94rem' }}>{activeItem.quiz.questionZh}</h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.4rem' }}>
            {activeItem.quiz.options.map((opt, optIdx) => {
              const isPicked = selectedOption[activeItem.id] === optIdx
              const isCorrect = optIdx === activeItem.quiz.correctIndex
              const isDone = submitted[activeItem.id]

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
                    textAlign: 'center',
                    borderRadius: '8px',
                    border: `1px solid ${border}`,
                    background: bg,
                    cursor: isDone ? 'default' : 'pointer',
                  }}
                  onClick={() => handleSelectOption(optIdx)}
                >
                  <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>{opt}</span>
                </button>
              )
            })}
          </div>

          {submitted[activeItem.id] && (
            <div style={{ marginTop: '0.6rem', padding: '0.6rem', borderRadius: '8px', background: 'var(--surface-soft)', fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.45 }}>
              💡 <strong>解説：</strong>{activeItem.quiz.explanationJa}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
