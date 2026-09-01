import React, { useState } from 'react'
import { CHINESE_GRAMMAR_SIGNALS, type ChineseGrammarSignal } from '../data/grammarSignals'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

export const ChineseSignalsView: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedSignalId, setSelectedSignalId] = useState<string>(CHINESE_GRAMMAR_SIGNALS[0].id)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [showSolutions, setShowSolutions] = useState<Record<string, boolean>>({})

  const activeSignal: ChineseGrammarSignal =
    CHINESE_GRAMMAR_SIGNALS.find((s) => s.id === selectedSignalId) ?? CHINESE_GRAMMAR_SIGNALS[0]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  function handleSelectOption(signalId: string, optIdx: number) {
    setQuizAnswers((prev) => ({ ...prev, [signalId]: optIdx }))
    setShowSolutions((prev) => ({ ...prev, [signalId]: true }))
    if (optIdx === activeSignal.quiz.correctIndex) {
      playCorrectSound()
      onEarnXp(10)
    } else {
      playWrongSound()
    }
  }

  return (
    <div className="signal-decision-view chinese-signals-view" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 頂部標題 */}
      <div className="signal-hero-card" style={{ marginBottom: '0.8rem' }}>
        <span className="signal-badge">中国語文法 · 3 秒直感判断ツリー</span>
        <h2>{activeSignal.pattern}</h2>
        <p className="hero-desc">{activeSignal.meaningJa}</p>
      </div>

      {/* 5大文法選單膠囊列 */}
      <div className="signal-group-pills" style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {CHINESE_GRAMMAR_SIGNALS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`pill-btn ${activeSignal.id === s.id ? 'active' : ''}`}
            onClick={() => setSelectedSignalId(s.id)}
          >
            {s.pattern.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* 3秒判別法則與公式卡 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem', marginBottom: '0.8rem' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '0.85rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#f59e0b', fontWeight: 700, display: 'block' }}>
            🎯 どんなシチュエーションで使う？ (Trigger)：
          </span>
          <p style={{ margin: '0.3rem 0 0.6rem', fontSize: '0.82rem', lineHeight: 1.45 }}>{activeSignal.signalTriggerJa}</p>
          <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 600 }}>⚡ 3秒直感判別法：</span>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600 }}>{activeSignal.threeSecondRuleJa}</p>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '0.85rem' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700, display: 'block' }}>
            📐 構文公式 (Formula)：
          </span>
          <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)', margin: '0.3rem 0 0.6rem', fontFamily: 'monospace', fontSize: '0.82rem', color: '#10b981' }}>
            {activeSignal.formula}
          </div>
          <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}>⚠️ 落とし穴注意：</span>
            <div style={{ fontSize: '0.76rem', color: '#ef4444', marginTop: '0.15rem' }}>{activeSignal.pitfall.wrong}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.15rem' }}>{activeSignal.pitfall.reasonJa}</div>
          </div>
        </div>
      </div>

      {/* 經典例句與發音 */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '0.85rem', marginBottom: '0.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700 }}>📖 經典對比例句：</span>
          <button
            type="button"
            className="pill-btn"
            style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem' }}
            onClick={() => speakChinese(activeSignal.contrastExample.zh)}
          >
            🔊 聽朗讀
          </button>
        </div>
        <strong style={{ fontSize: '1.05rem', display: 'block' }}>{activeSignal.contrastExample.zh}</strong>
        <div style={{ fontSize: '0.76rem', color: '#f59e0b' }}>
          {activeSignal.contrastExample.pinyin} ({activeSignal.contrastExample.bopomofo})
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
          {activeSignal.contrastExample.ja}
        </div>
        <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '0.25rem' }}>
          💡 {activeSignal.contrastExample.noteJa}
        </div>
      </div>

      {/* 主動檢索測驗 (Active Recall Quiz) */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '0.85rem' }}>
        <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
          🎯 主動回想測驗 (Active Recall Quiz)：
        </span>
        <h4 style={{ margin: '0 0 0.6rem', fontSize: '0.9rem' }}>{activeSignal.quiz.questionJa}</h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {activeSignal.quiz.options.map((opt, optIdx) => {
            const isPicked = quizAnswers[activeSignal.id] === optIdx
            const isSubmitted = showSolutions[activeSignal.id]
            const isCorrect = optIdx === activeSignal.quiz.correctIndex

            let bg = 'var(--surface-soft)'
            let border = 'var(--line)'
            if (isSubmitted) {
              if (isCorrect) {
                bg = 'rgba(16, 185, 129, 0.15)'
                border = '#10b981'
              } else if (isPicked) {
                bg = 'rgba(239, 68, 68, 0.15)'
                border = '#ef4444'
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
                  background: bg,
                  border: `1px solid ${border}`,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onClick={() => handleSelectOption(activeSignal.id, optIdx)}
              >
                <span style={{ fontSize: '0.84rem' }}>{opt}</span>
                {isSubmitted && isCorrect && <span style={{ color: '#10b981', fontWeight: 700 }}>✓ 正解 (+10 XP)</span>}
              </button>
            )
          })}
        </div>

        {showSolutions[activeSignal.id] && (
          <div style={{ marginTop: '0.6rem', padding: '0.6rem', borderRadius: '8px', background: 'var(--surface-soft)', fontSize: '0.76rem', color: 'var(--muted)' }}>
            💡 <strong>解說：</strong>{activeSignal.quiz.explanationJa}
          </div>
        )}
      </div>
    </div>
  )
}
