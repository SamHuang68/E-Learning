import React, { useState } from 'react'
import { TOEIC_SOLVING_SIGNALS, type ToeicSolvingSignal } from '../data/solvingSignals'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export const ToeicSignalsView: React.FC<Props> = ({ onEarnXp, instructionLang = 'zh' }) => {
  const isJa = instructionLang === 'ja'
  const [selectedSignalId, setSelectedSignalId] = useState<string>(TOEIC_SOLVING_SIGNALS[0].id)
  const [viewMode, setViewMode] = useState<'card' | 'drill'>('card')
  const [selectedOptIdx, setSelectedOptIdx] = useState<Record<string, number>>({})
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({})
  const [isFlipped, setIsFlipped] = useState(false)
  const [drillIdx, setDrillIdx] = useState(0)

  const activeSignal: ToeicSolvingSignal =
    TOEIC_SOLVING_SIGNALS.find((s) => s.id === selectedSignalId) ?? TOEIC_SOLVING_SIGNALS[0]

  const drillSignal = TOEIC_SOLVING_SIGNALS[drillIdx % TOEIC_SOLVING_SIGNALS.length]

  function handleSelectOption(signalId: string, optIdx: number) {
    setSelectedOptIdx((prev) => ({ ...prev, [signalId]: optIdx }))
    setShowExplanation((prev) => ({ ...prev, [signalId]: true }))
    if (optIdx === activeSignal.exampleQuestion.correctIndex) {
      onEarnXp(10)
      playCorrectSound()
    } else {
      playWrongSound()
    }
  }

  return (
    <div className="signal-decision-view toeic-signals-view" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標題與模式切換 */}
      <div className="signal-hero-card" style={{ marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
        <div>
          <span className="signal-badge" style={{ background: '#38bdf8', color: '#0f172a' }}>
            {isJa ? 'TOEIC Part 5/6 · 3秒解答シグナル' : 'TOEIC Part 5/6 · 3秒秒殺訊號卡'}
          </span>
          <h2>{isJa ? activeSignal.titleJa : activeSignal.title}</h2>
          <p className="hero-desc">{isJa ? activeSignal.category : activeSignal.category}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            type="button"
            className={`pill-btn ${viewMode === 'card' ? 'active' : ''}`}
            onClick={() => setViewMode('card')}
          >
            🗂️ {isJa ? '学習カード' : '學習卡片'}
          </button>
          <button
            type="button"
            className={`pill-btn ${viewMode === 'drill' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('drill')
              setIsFlipped(false)
            }}
          >
            ⚡ {isJa ? '3秒フラッシュテスト' : '3秒快答翻轉測驗'}
          </button>
        </div>
      </div>

      {viewMode === 'card' ? (
        <>
          {/* 訊號膠囊選單 */}
          <div className="signal-group-pills" style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
            {TOEIC_SOLVING_SIGNALS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`pill-btn ${activeSignal.id === s.id ? 'active' : ''}`}
                onClick={() => setSelectedSignalId(s.id)}
              >
                {isJa ? s.titleJa.split('（')[0] : s.title.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* 破題特徵與 3 秒法則卡片 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem', marginBottom: '0.8rem' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '0.85rem' }}>
              <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, display: 'block' }}>
                🔍 {isJa ? '設問文の着眼点 (Trigger Feature)：' : '題目特徵訊號 (Trigger Feature)：'}
              </span>
              <p style={{ margin: '0.3rem 0 0.6rem', fontSize: '0.82rem', lineHeight: 1.45 }}>
                {isJa ? activeSignal.triggerFeatureJa : activeSignal.triggerFeature}
              </p>
              <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 600 }}>
                  ⚡ {isJa ? '3秒瞬殺ルール：' : '3秒秒殺口訣：'}
                </span>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>
                  {isJa ? activeSignal.threeSecondRuleJa : activeSignal.threeSecondRule}
                </p>
              </div>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '0.85rem' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 700, display: 'block' }}>
                📐 {isJa ? '文法公式 (Formula)：' : '第一步算式與公式：'}
              </span>
              <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)', margin: '0.3rem 0 0.6rem', fontFamily: 'monospace', fontSize: '0.82rem', color: '#10b981' }}>
                {activeSignal.formula}
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}>
                  ⚠️ {isJa ? '頻出の引っ掛け：' : '常見盲點警示：'}
                </span>
                <div style={{ fontSize: '0.74rem', color: '#ef4444', marginTop: '0.15rem' }}>
                  {isJa ? activeSignal.pitfallWarningJa : activeSignal.pitfallWarningZh}
                </div>
              </div>
            </div>
          </div>

          {/* 實戰演練試題 */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '0.85rem' }}>
            <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
              🎯 {isJa ? '本番形式ミニ問題 (Quick Practice)：' : '多益實戰秒殺題 (Quick Practice)：'}
            </span>
            <h4 style={{ margin: '0 0 0.6rem', fontSize: '0.92rem', lineHeight: 1.4 }}>{activeSignal.exampleQuestion.question}</h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.35rem' }}>
              {activeSignal.exampleQuestion.options.map((opt, optIdx) => {
                const isPicked = selectedOptIdx[activeSignal.id] === optIdx
                const isSubmitted = showExplanation[activeSignal.id]
                const isCorrect = optIdx === activeSignal.exampleQuestion.correctIndex

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

            {showExplanation[activeSignal.id] && (
              <div style={{ marginTop: '0.6rem', padding: '0.6rem', borderRadius: '8px', background: 'var(--surface-soft)', fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                💡 <strong>{isJa ? '解説：' : '解析：'}</strong>
                {isJa ? activeSignal.exampleQuestion.explanationJa : activeSignal.exampleQuestion.explanationZh}
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
              border: '2px solid #38bdf8',
              borderRadius: '16px',
              padding: '1.4rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }}
            onClick={() => setIsFlipped((prev) => !prev)}
          >
            {!isFlipped ? (
              <>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, marginBottom: '0.5rem' }}>
                  【{isJa ? '設問' : '題目'} #{drillIdx + 1}】3秒で反射！
                </span>
                <h3 style={{ margin: '0 0 0.6rem', fontSize: '1.15rem' }}>
                  {isJa ? drillSignal.triggerFeatureJa : drillSignal.triggerFeature}
                </h3>
                <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>
                  👇 {isJa ? 'クリックして3秒ルールと公式を表示' : '點擊翻面揭曉 3 秒秒殺公式'}
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginBottom: '0.4rem' }}>
                  ⚡ {isJa ? drillSignal.titleJa : drillSignal.title}
                </span>
                <strong style={{ fontSize: '1.05rem', color: '#38bdf8', fontFamily: 'monospace', marginBottom: '0.4rem' }}>
                  {drillSignal.formula}
                </strong>
                <p style={{ margin: 0, fontSize: '0.84rem' }}>
                  {isJa ? drillSignal.threeSecondRuleJa : drillSignal.threeSecondRule}
                </p>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              className="pill-btn"
              onClick={() => {
                setDrillIdx((prev) => (prev > 0 ? prev - 1 : TOEIC_SOLVING_SIGNALS.length - 1))
                setIsFlipped(false)
              }}
            >
              ← {isJa ? '前の問題' : '上一題'}
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
              {isJa ? '次の問題 (+5 XP) →' : '下一題 (+5 XP) →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
