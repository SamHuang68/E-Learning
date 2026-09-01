import React, { useState } from 'react'
import { CHINESE_GRAMMAR_SIGNALS, type ChineseGrammarSignal } from '../data/grammarSignals'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

export const ChineseSignalsView: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedSignalId, setSelectedSignalId] = useState<string>(CHINESE_GRAMMAR_SIGNALS[0].id)
  const [viewMode, setViewMode] = useState<'card' | 'drill'>('card')
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [showSolutions, setShowSolutions] = useState<Record<string, boolean>>({})
  const [isFlipped, setIsFlipped] = useState(false)
  const [drillIdx, setDrillIdx] = useState(0)

  const activeSignal: ChineseGrammarSignal =
    CHINESE_GRAMMAR_SIGNALS.find((s) => s.id === selectedSignalId) ?? CHINESE_GRAMMAR_SIGNALS[0]

  const drillSignal = CHINESE_GRAMMAR_SIGNALS[drillIdx % CHINESE_GRAMMAR_SIGNALS.length]

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
      {/* 頂部標題與模式切換 */}
      <div className="signal-hero-card" style={{ marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
        <div>
          <span className="signal-badge">中国語文法 · 3 秒直感判断ツリー</span>
          <h2>{activeSignal.pattern}</h2>
          <p className="hero-desc">{activeSignal.meaningJa}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            type="button"
            className={`pill-btn ${viewMode === 'card' ? 'active' : ''}`}
            onClick={() => setViewMode('card')}
          >
            🗂️ 學習卡片
          </button>
          <button
            type="button"
            className={`pill-btn ${viewMode === 'drill' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('drill')
              setIsFlipped(false)
            }}
          >
            ⚡ 3秒快答翻轉測驗
          </button>
        </div>
      </div>

      {viewMode === 'card' ? (
        <>
          {/* 文法選單膠囊列 */}
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
        </>
      ) : (
        /* 3秒快答翻轉卡片模式 */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '540px',
              minHeight: '220px',
              background: 'var(--surface)',
              border: '2px solid #f59e0b',
              borderRadius: '16px',
              padding: '1.4rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease',
            }}
            onClick={() => setIsFlipped((prev) => !prev)}
          >
            {!isFlipped ? (
              <>
                <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700, marginBottom: '0.5rem' }}>
                  【問題 #{drillIdx + 1}】看到此情境，3秒內反射文法！
                </span>
                <h3 style={{ margin: '0 0 0.6rem', fontSize: '1.2rem' }}>{drillSignal.signalTriggerJa}</h3>
                <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>👇 點擊翻面揭曉 3 秒秒殺公式與例句</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginBottom: '0.4rem' }}>
                  ⚡ {drillSignal.pattern}
                </span>
                <strong style={{ fontSize: '1.1rem', color: '#f59e0b', fontFamily: 'monospace', marginBottom: '0.4rem' }}>
                  {drillSignal.formula}
                </strong>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem' }}>{drillSignal.threeSecondRuleJa}</p>
                <div style={{ background: 'var(--surface-soft)', padding: '0.5rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                  例文：<strong>{drillSignal.contrastExample.zh}</strong>
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              className="pill-btn"
              onClick={() => {
                setDrillIdx((prev) => (prev > 0 ? prev - 1 : CHINESE_GRAMMAR_SIGNALS.length - 1))
                setIsFlipped(false)
              }}
            >
              ← 上一題
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setIsFlipped(false)
                setDrillIdx((prev) => prev + 1)
                onEarnXp(5)
                playCorrectSound()
              }}
            >
              下一題 (+5 XP) →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
