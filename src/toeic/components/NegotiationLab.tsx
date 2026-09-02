import React, { useState } from 'react'
import { NEGOTIATION_CHUNKS, type NegotiationChunkItem } from '../data/negotiationChunks'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export const NegotiationLab: React.FC<Props> = ({ onEarnXp, instructionLang = 'zh' }) => {
  const isJa = instructionLang === 'ja'
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedChunkId, setSelectedChunkId] = useState<string>(NEGOTIATION_CHUNKS[0].id)

  const categories = ['All', 'Negotiation', 'Contract', 'Strategy', 'Networking']

  const filteredChunks =
    selectedCategory === 'All'
      ? NEGOTIATION_CHUNKS
      : NEGOTIATION_CHUNKS.filter((c) => c.category === selectedCategory)

  const activeChunk: NegotiationChunkItem =
    NEGOTIATION_CHUNKS.find((c) => c.id === selectedChunkId) ?? NEGOTIATION_CHUNKS[0]

  function speakEnglish(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="math-lab negotiation-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🤝</span> {isJa ? 'TOEIC 交渉・ネットワーキング重要チャンクラボ' : 'TOEIC 商務談判與職場社交語塊實驗室'}
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {isJa
              ? 'ビジネス会議、価格交渉、契約締結、スモールトークでネイティブが多用する高得点直結チャンクを習得！'
              : '掌握商務議價、合約條件宣告與國際會議破冰社交的核心語塊，秒殺 Part 3/4 聽力與 Part 7 商務書信！'}
          </p>
        </div>
      </div>

      {/* 分類篩選膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 雙欄佈局 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
        {/* 左側：語塊列表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {filteredChunks.map((item) => (
            <button
              key={item.id}
              type="button"
              className="practice-card"
              style={{
                padding: '0.75rem 0.9rem',
                textAlign: 'left',
                borderRadius: '10px',
                border: selectedChunkId === item.id ? '2px solid #38bdf8' : '1px solid var(--line)',
                background: selectedChunkId === item.id ? 'rgba(56, 189, 248, 0.12)' : 'var(--surface)',
                cursor: 'pointer',
              }}
              onClick={() => {
                setSelectedChunkId(item.id)
                speakEnglish(item.chunk)
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <strong style={{ fontSize: '0.95rem', color: selectedChunkId === item.id ? '#38bdf8' : 'var(--text)' }}>
                  {item.chunk}
                </strong>
                <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: 'var(--surface-soft)', color: 'var(--muted)' }}>
                  {item.category}
                </span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>
                {isJa ? item.meaningJa : item.meaningZh}
              </div>
            </button>
          ))}
        </div>

        {/* 右側：語塊深入解析卡片 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }}>
                {activeChunk.category} Chunk
              </span>
              <h2 style={{ margin: '0.35rem 0 0.1rem', fontSize: '1.35rem', color: '#38bdf8' }}>
                {activeChunk.chunk}
              </h2>
              <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{activeChunk.phonetic}</span>
            </div>

            <button
              type="button"
              className="btn-primary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
              onClick={() => {
                speakEnglish(activeChunk.chunk)
                onEarnXp(10)
                playCorrectSound()
              }}
            >
              🔊 聽發音 (+10 XP)
            </button>
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block' }}>
              {isJa ? '日本語の意味：' : '中文釋義：'}
            </span>
            <strong style={{ fontSize: '0.9rem' }}>{isJa ? activeChunk.meaningJa : activeChunk.meaningZh}</strong>
          </div>

          <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, display: 'block' }}>
              💼 {isJa ? 'ビジネスでの実践活用シーン：' : '商務情境應用剖析：'}
            </span>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', lineHeight: 1.45 }}>
              {isJa ? activeChunk.businessContextJa : activeChunk.businessContextZh}
            </p>
          </div>

          <div style={{ background: 'var(--surface-soft)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Example Sentence (例文)：</span>
              <button
                type="button"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                onClick={() => speakEnglish(activeChunk.exampleSentenceEn)}
              >
                🔊
              </button>
            </div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, margin: '0.25rem 0', color: 'var(--text)' }}>
              {activeChunk.exampleSentenceEn}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>
              {isJa ? activeChunk.exampleSentenceJa : activeChunk.exampleSentenceZh}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
