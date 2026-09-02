import React, { useState } from 'react'
import { WEDDING_DIALOGUES, type WeddingDialogueItem } from '../data/weddingZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

export const WeddingZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [venue, setVenue] = useState<'hotel' | 'banquet' | 'outdoor'>('hotel')
  const [attendance, setAttendance] = useState<'single' | 'couple'>('single')
  const [blessingPhrase, setBlessingPhrase] = useState('百年好合')
  const [submittedRedPacket, setSubmittedRedPacket] = useState(false)

  const activeItem: WeddingDialogueItem =
    WEDDING_DIALOGUES[selectedIdx % WEDDING_DIALOGUES.length]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  // 試算推薦吉利紅包金額
  function getSuggestedAmount(): number {
    if (venue === 'hotel') {
      return attendance === 'couple' ? 6600 : 3600
    }
    if (venue === 'banquet') {
      return attendance === 'couple' ? 4200 : 2600
    }
    // outdoor 流水席辦桌
    return attendance === 'couple' ? 3600 : 2200
  }

  const suggestedAmount = getSuggestedAmount()

  function handlePresentGift() {
    setSubmittedRedPacket(true)
    onEarnXp(15)
    playCorrectSound()
    setTimeout(() => setSubmittedRedPacket(false), 3500)
  }

  return (
    <div className="math-lab wedding-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>💒</span> 台灣婚禮紅包行情與喜酒文化實驗室 (Wedding Red Envelope Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            台湾の結婚式（喝喜酒）マナー！「ご祝儀は偶数が吉（4と8は厳禁）・ホテルvs会館相場・袋の縦書き記名・喜餅引換券」を完全制覇！
          </p>
        </div>
      </div>

      {/* 婚禮紅包行情試算與封面書寫格式 */}
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
          <div style={{ fontSize: '1.8rem' }}>🧧 💒</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>紅包禮金行情試算 (Red Packet Estimator)</strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {submittedRedPacket
                ? `✓ 已於禮金桌簽到送出！金額 NT$ ${suggestedAmount}・賀詞「${blessingPhrase}」領取喜餅卡！(+15 XP)`
                : `建議包禮金額：NT$ ${suggestedAmount} (雙數吉利・避開四與八)`}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={venue}
            onChange={(e) => setVenue(e.target.value as 'hotel' | 'banquet' | 'outdoor')}
            style={{ padding: '0.3rem 0.45rem', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.74rem' }}
          >
            <option value="hotel">五星級飯店 (3600~6600)</option>
            <option value="banquet">一般婚宴會館 (2600~4200)</option>
            <option value="outdoor">辦桌流水席 (2200~3600)</option>
          </select>

          <select
            value={attendance}
            onChange={(e) => setAttendance(e.target.value as 'single' | 'couple')}
            style={{ padding: '0.3rem 0.45rem', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.74rem' }}
          >
            <option value="single">一人出席 (Single)</option>
            <option value="couple">攜伴二人出席 (Couple)</option>
          </select>

          <select
            value={blessingPhrase}
            onChange={(e) => setBlessingPhrase(e.target.value)}
            style={{ padding: '0.3rem 0.45rem', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.74rem' }}
          >
            <option value="百年好合">百年好合</option>
            <option value="永浴愛河">永浴愛河</option>
            <option value="早生貴子">早生貴子</option>
            <option value="白頭偕老">白頭偕老</option>
          </select>

          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.74rem',
              background: submittedRedPacket ? '#10b981' : 'linear-gradient(135deg, #ef4444, #dc2626)',
            }}
            onClick={handlePresentGift}
          >
            {submittedRedPacket ? '送出完成' : '🧧 送禮金簽名'}
          </button>
        </div>
      </div>

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {WEDDING_DIALOGUES.map((item, idx) => (
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

        {/* 右側：紅包民俗智慧與袋身格式 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#ef4444', fontWeight: 700, display: 'block' }}>
            💡 台湾結婚式・紅包（ご祝儀）マナー（Wedding Red Packet Tips）
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {activeItem.weddingGlossary.map((vocab, vIdx) => (
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
                  <strong style={{ fontSize: '0.88rem', color: '#ef4444' }}>{vocab.termZh}</strong>
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
