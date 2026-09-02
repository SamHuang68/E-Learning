import React, { useState } from 'react'
import { LOTTERY_DIALOGUES, type LotteryDialogueItem } from '../data/lotteryZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

export const LotteryZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [inputDigits, setInputDigits] = useState('789')
  const [winningMatch, setWinningMatch] = useState<'none' | 'matched200' | 'matched1000w'>('matched200')
  const [redeemed, setRedeemed] = useState(false)

  const activeItem: LotteryDialogueItem =
    LOTTERY_DIALOGUES[selectedIdx % LOTTERY_DIALOGUES.length]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleCheckReceipt() {
    if (inputDigits.endsWith('789')) {
      setWinningMatch('matched200')
      onEarnXp(10)
      playCorrectSound()
    } else if (inputDigits === '88888888') {
      setWinningMatch('matched1000w')
      onEarnXp(50)
      playCorrectSound()
    } else {
      setWinningMatch('none')
    }
  }

  function handleRedeemAtStore() {
    setRedeemed(true)
    onEarnXp(15)
    playCorrectSound()
    setTimeout(() => setRedeemed(false), 3500)
  }

  return (
    <div className="math-lab lottery-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🧾</span> 台灣統一發票對獎與超商折抵生活實驗室 (Receipt Lottery Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            台湾の国民的お楽しみ「統一發票」！「奇数月25日抽選・末三碼（下3桁）200元・超商當場折抵購物・手機載具自動匯款」を直感マスター！
          </p>
        </div>
      </div>

      {/* 發票對獎號碼模擬器 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.12))',
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
          <div style={{ fontSize: '1.8rem' }}>🧾 🎁</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>統一發票中獎開獎機 (Lottery Checker)</strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {redeemed
                ? '✓ 恭喜！超商櫃檯核對證件完成！已當場折抵現金 200 元！(+15 XP)'
                : winningMatch === 'matched200'
                ? '🎉 恭喜中獎！末三碼對中「789」，獲得六獎 200 元！可直接超商消費折抵'
                : winningMatch === 'matched1000w'
                ? '🎊 狂賀！八碼全中「88888888」特別獎一千萬元！(+50 XP)'
                : '銘謝惠顧，這張沒中，祝下張幸運中獎！'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={inputDigits}
            onChange={(e) => setInputDigits(e.target.value)}
            placeholder="輸入發票末三碼"
            style={{ width: '120px', padding: '0.3rem 0.5rem', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.74rem' }}
          />

          <button
            type="button"
            className="btn-primary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.74rem' }}
            onClick={handleCheckReceipt}
          >
            🔍 即時對獎
          </button>

          {winningMatch !== 'none' && (
            <button
              type="button"
              className="btn-primary"
              style={{
                padding: '0.4rem 0.75rem',
                fontSize: '0.74rem',
                background: redeemed ? '#10b981' : 'linear-gradient(135deg, #10b981, #059669)',
              }}
              onClick={handleRedeemAtStore}
            >
              {redeemed ? '已折抵' : '🏪 超商折抵200元'}
            </button>
          )}
        </div>
      </div>

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {LOTTERY_DIALOGUES.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            className={`pill-btn ${selectedIdx === idx ? 'active' : ''}`}
            onClick={() => setSelectedIdx(idx)}
          >
            <span>{item.icon}</span> {item.title.split('：')[0]}
          </button>
        ))}
      </div>

      {/* 雙欄佈局 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
        {/* 左側：對話實況 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700 }}>
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

        {/* 右側：發票文化單詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'block' }}>
            💡 台湾統一發票・レシート宝くじ豆知識（Lottery Tips）
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {activeItem.lotteryGlossary.map((vocab, vIdx) => (
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
                  <strong style={{ fontSize: '0.88rem', color: '#10b981' }}>{vocab.termZh}</strong>
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
