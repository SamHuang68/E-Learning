import React, { useState } from 'react'
import { CS_SOLVING_SIGNALS, type CsSolvingSignal } from '../data/solvingSignals'
import { MathFormula } from '../../math/components/MathFormula'
import { loadCsSignalsMastery, saveCsSignalsMastery } from '../utils/csStorage'
import { playCorrectSound } from '../../engine/audioSynthesizer'

export const CsSignalsView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'drill'>('cards')
  const [activeIdx, setActiveIdx] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [mastery, setMastery] = useState<Record<string, boolean>>(() => loadCsSignalsMastery())
  const [selectedStrand, setSelectedStrand] = useState<string>('all')

  const filteredSignals = CS_SOLVING_SIGNALS.filter((sig) => {
    if (selectedStrand === 'all') return true
    return sig.strand === selectedStrand
  })

  const currentSignal: CsSolvingSignal =
    filteredSignals[activeIdx % filteredSignals.length] || CS_SOLVING_SIGNALS[0]

  function handleMarkMastery(sigId: string, isMastered: boolean) {
    playCorrectSound()
    const next = { ...mastery, [sigId]: isMastered }
    setMastery(next)
    saveCsSignalsMastery(next)
  }

  function handleNextDrill() {
    setIsRevealed(false)
    setActiveIdx((prev) => (prev + 1) % filteredSignals.length)
  }

  const masteredCount = Object.values(mastery).filter(Boolean).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* 頂部標頭與模式切換 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(245, 158, 11, 0.12))',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '0.85rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.6rem',
        }}
      >
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>⚡</span> 計算機概論 3 秒破題訊號卡
          </h3>
          <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
            題目特徵 ➜ 3 秒直覺口訣 ➜ 第一步算式秒殺！已掌握：{masteredCount} / {CS_SOLVING_SIGNALS.length}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <button
            type="button"
            className={`pill-btn ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => setViewMode('cards')}
          >
            🗂️ 學習卡片模式
          </button>
          <button
            type="button"
            className={`pill-btn ${viewMode === 'drill' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('drill')
              setIsRevealed(false)
            }}
          >
            ⚡ 3秒翻轉快答測驗
          </button>
        </div>
      </div>

      {/* 領域切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`pill-btn ${selectedStrand === 'all' ? 'active' : ''}`}
          onClick={() => {
            setSelectedStrand('all')
            setActiveIdx(0)
          }}
        >
          全部領域 ({CS_SOLVING_SIGNALS.length})
        </button>
        {['五大單元架構', '數位邏輯', '作業系統', '網路與通訊', '現代AI硬體', '前沿AI演算法'].map((strand) => (
          <button
            key={strand}
            type="button"
            className={`pill-btn ${selectedStrand === strand ? 'active' : ''}`}
            onClick={() => {
              setSelectedStrand(strand)
              setActiveIdx(0)
            }}
          >
            {strand}
          </button>
        ))}
      </div>

      {/* 模式 A：學習卡片模式 (Cards Mode) */}
      {viewMode === 'cards' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.8rem' }}>
          {filteredSignals.map((sig) => {
            const isMastered = !!mastery[sig.id]
            return (
              <div
                key={sig.id}
                style={{
                  background: 'var(--surface)',
                  border: isMastered ? '1px solid #10b981' : '1px solid var(--line)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(37, 99, 235, 0.15)', color: '#2563eb', fontWeight: 700 }}>
                    {sig.strand}
                  </span>
                  <button
                    type="button"
                    style={{
                      border: 'none',
                      background: isMastered ? 'rgba(16, 185, 129, 0.2)' : 'var(--surface-soft)',
                      color: isMastered ? '#10b981' : 'var(--muted)',
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                    onClick={() => handleMarkMastery(sig.id, !isMastered)}
                  >
                    {isMastered ? '✓ 已掌握' : '○ 標記掌握'}
                  </button>
                </div>

                <strong style={{ fontSize: '0.92rem' }}>{sig.topic}</strong>

                <div style={{ background: 'var(--surface-soft)', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 700, display: 'block' }}>
                    🔍 題目特徵訊號：
                  </span>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text)', lineHeight: 1.45 }}>
                    {sig.problemSignal}
                  </span>
                </div>

                <div style={{ background: 'rgba(37, 99, 235, 0.08)', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(37, 99, 235, 0.25)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 700, display: 'block' }}>
                    ⚡ 3 秒直覺破題口訣：
                  </span>
                  <strong style={{ fontSize: '0.78rem', color: '#1d4ed8', lineHeight: 1.45 }}>
                    {sig.threeSecondRule}
                  </strong>
                </div>

                <div style={{ fontSize: '0.8rem', overflowX: 'auto', padding: '0.2rem 0' }}>
                  <MathFormula math={sig.firstStepFormula} block />
                </div>

                <div style={{ marginTop: 'auto', background: 'var(--surface-soft)', padding: '0.5rem 0.7rem', borderRadius: '8px', fontSize: '0.72rem', color: 'var(--muted)' }}>
                  <strong>範例：</strong>{sig.exampleProblem.question} ➜ <span style={{ color: '#10b981', fontWeight: 600 }}>{sig.exampleProblem.quickSolve}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 模式 B：3 秒翻轉快答測驗 (Flashcard / Quick Drill Mode) */}
      {viewMode === 'drill' && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1.4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', maxWidth: '680px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(37, 99, 235, 0.15)', color: '#2563eb', fontWeight: 700 }}>
              {currentSignal.strand} · 第 {activeIdx + 1} / {filteredSignals.length} 卡
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>
              主題：{currentSignal.topic}
            </span>
          </div>

          {/* 正面：題目訊號 */}
          <div style={{ width: '100%', background: 'var(--surface-soft)', padding: '1.2rem', borderRadius: '10px', border: '1px solid var(--line)', textAlign: 'left' }}>
            <span style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
              🔍 考卷題目出現以下特徵：
            </span>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text)' }}>
              {currentSignal.problemSignal}
            </p>
          </div>

          {/* 翻轉按鈕 */}
          {!isRevealed ? (
            <button
              type="button"
              className="btn-primary"
              style={{ padding: '0.65rem 1.8rem', borderRadius: '999px', fontSize: '0.88rem' }}
              onClick={() => {
                playCorrectSound()
                setIsRevealed(true)
              }}
            >
              ⚡ 揭曉 3 秒破題口訣與算式
            </button>
          ) : (
            /* 背面：口訣與第一步算式 */
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.8rem', textAlign: 'left' }}>
              <div style={{ background: 'rgba(37, 99, 235, 0.08)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(37, 99, 235, 0.3)' }}>
                <span style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                  🎯 3 秒破題口訣：
                </span>
                <strong style={{ fontSize: '0.88rem', color: '#1d4ed8', lineHeight: 1.5 }}>
                  {currentSignal.threeSecondRule}
                </strong>
              </div>

              <div style={{ background: 'var(--surface-soft)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--line)', overflowX: 'auto' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block', marginBottom: '0.3rem' }}>
                  破題第一步算式：
                </span>
                <MathFormula math={currentSignal.firstStepFormula} block />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.4rem' }}>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ background: '#10b981', padding: '0.5rem 1.2rem', borderRadius: '999px', fontSize: '0.8rem' }}
                  onClick={() => {
                    handleMarkMastery(currentSignal.id, true)
                    handleNextDrill()
                  }}
                >
                  ✓ 我已秒殺掌握
                </button>
                <button
                  type="button"
                  className="pill-btn"
                  style={{ padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}
                  onClick={() => {
                    handleMarkMastery(currentSignal.id, false)
                    handleNextDrill()
                  }}
                >
                  ○ 稍後再複習下一題
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
