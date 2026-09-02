import React, { useState } from 'react'
import { FESTIVAL_DIALOGUES, type FestivalDialogueItem } from '../data/festivalZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

type PoeResult = 'sheng' | 'xiao' | 'yin'

export const FestivalZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [poeResult, setPoeResult] = useState<PoeResult | null>(null)
  const [isTossing, setIsTossing] = useState(false)

  const activeItem: FestivalDialogueItem =
    FESTIVAL_DIALOGUES[selectedIdx % FESTIVAL_DIALOGUES.length]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleTossPoe() {
    setIsTossing(true)
    setTimeout(() => {
      const rand = Math.random()
      let res: PoeResult = 'sheng'
      if (rand < 0.5) {
        res = 'sheng' // 聖筊 (50% 機率：一平一凸)
      } else if (rand < 0.75) {
        res = 'xiao' // 笑筊 (25% 機率：兩平)
      } else {
        res = 'yin' // 陰筊 (25% 機率：兩凸)
      }
      setPoeResult(res)
      setIsTossing(false)
      onEarnXp(10)
      playCorrectSound()
    }, 600)
  }

  return (
    <div className="math-lab festival-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🏮</span> 台灣傳統節慶、廟宇拜拜與年節文化實驗室 (Festivals & Traditions Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            台湾文化の真髄を体験！「龍山寺・行天宮のポエ占い（擲筊：聖筊・笑筊・陰筊）・迪化街年越し問屋街試食・買三送一」を直感マスター！
          </p>
        </div>
      </div>

      {/* 廟宇擲筊神明問事模擬器 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(245, 158, 11, 0.12))',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '0.85rem 1rem',
          marginBottom: '0.85rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.8rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '1.8rem' }}>🥠 🙏</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>龍山寺・行天宮 擲筊問事互動 (Temple Poe Tossing)</strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {poeResult === 'sheng' && '✨【聖筊】神明贊同！吉利順遂，心想事成！'}
              {poeResult === 'xiao' && '😄【笑筊】神明微笑笑納，心意未定或再想清楚點！'}
              {poeResult === 'yin' && '🛑【陰筊】神明不贊同，宜守成勿躁進！'}
              {!poeResult && '默念心中疑問，拋下一對紅色筊杯請示神明旨意'}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          style={{
            padding: '0.5rem 1.2rem',
            fontSize: '0.78rem',
            background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
          }}
          disabled={isTossing}
          onClick={handleTossPoe}
        >
          {isTossing ? '擲筊中...' : '🙏 虔誠擲筊請示 (+10 XP)'}
        </button>
      </div>

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {FESTIVAL_DIALOGUES.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            className={`pill-btn ${selectedIdx === idx ? 'active' : ''}`}
            onClick={() => setSelectedIdx(idx)}
          >
            <span>{item.icon}</span> {item.title.split('與')[0]}
          </button>
        ))}
      </div>

      {/* 雙欄佈局 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
        {/* 左側：對話實況 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 700 }}>
              {activeItem.locationZh} ({activeItem.locationJa})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginTop: '0.3rem' }}>
            {activeItem.dialogueLines.map((line, lIdx) => (
              <div
                key={lIdx}
                style={{
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8' }}>
                    {line.speakerJa}：
                  </span>
                  <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                    onClick={() => speakChinese(line.zh)}
                  >
                    🔊
                  </button>
                </div>
                <strong style={{ fontSize: '0.86rem', color: 'var(--text)' }}>{line.zh}</strong>
                <span style={{ fontSize: '0.72rem', color: '#f59e0b' }}>{line.pinyin}</span>
                <span style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.1rem' }}>
                  {line.ja}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 右側：節慶民俗重要單詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'block' }}>
            💡 台湾年中行事・寺廟参拝マナー（Festivals Tips）
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {activeItem.festivalGlossary.map((vocab, vIdx) => (
              <div
                key={vIdx}
                style={{
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.88rem', color: '#f59e0b' }}>{vocab.termZh}</strong>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text)' }}>{vocab.meaningJa}</span>
                </div>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                  {vocab.tipJa}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
