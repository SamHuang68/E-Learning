import React, { useState } from 'react'
import { UTILITIES_DIALOGUES, type UtilitiesDialogueItem } from '../data/utilitiesZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

export const UtilitiesZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [kwhUsed, setKwhUsed] = useState<number>(180)
  const [ratePerKwh, setRatePerKwh] = useState<number>(5.0)
  const [billSettled, setBillSettled] = useState(false)

  const activeItem: UtilitiesDialogueItem =
    UTILITIES_DIALOGUES[selectedIdx % UTILITIES_DIALOGUES.length]

  const totalElectricityCost = Math.round(kwhUsed * ratePerKwh)

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleSettleBill() {
    setBillSettled(true)
    onEarnXp(10)
    playCorrectSound()
    setTimeout(() => setBillSettled(false), 3000)
  }

  return (
    <div className="math-lab utilities-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>⚡</span> 台灣水電瓦斯帳單與搬家生活實驗室 (Utilities & Relocation Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            台湾生活のリアル！「台電の電気代計算（一度電）・個別メーター抄表・大樓管理費・引越し業者（搬家師傅）」を完全網羅！
          </p>
        </div>
      </div>

      {/* 台電電費即時試算器 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.12), rgba(56, 189, 248, 0.12))',
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
          <div style={{ fontSize: '1.8rem' }}>⚡ 💡</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>獨立電表度數與電費試算 (Electricity Calculator)</strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              用電度數：{kwhUsed} 度 × 一度 {ratePerKwh} 元 = NT$ {totalElectricityCost} 元
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.76rem' }}>度數：</label>
          <input
            type="number"
            value={kwhUsed}
            step="10"
            min="10"
            max="1000"
            onChange={(e) => setKwhUsed(Number(e.target.value))}
            style={{
              padding: '0.3rem 0.5rem',
              borderRadius: '6px',
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              color: 'var(--text)',
              width: '75px',
              fontSize: '0.8rem',
            }}
          />

          <label style={{ fontSize: '0.76rem' }}>單價：</label>
          <select
            value={ratePerKwh}
            onChange={(e) => setRatePerKwh(Number(e.target.value))}
            style={{
              padding: '0.3rem 0.5rem',
              borderRadius: '6px',
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontSize: '0.8rem',
            }}
          >
            <option value="4.5">4.5 元 (非夏季)</option>
            <option value="5.0">5.0 元 (一般房東)</option>
            <option value="6.0">6.0 元 (夏季高峰)</option>
          </select>

          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.76rem',
              background: billSettled ? '#10b981' : 'linear-gradient(135deg, #eab308, #ca8a04)',
            }}
            onClick={handleSettleBill}
          >
            {billSettled ? '✓ 電費繳清完成！(+10 XP)' : '🧾 模擬水電結算'}
          </button>
        </div>
      </div>

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {UTILITIES_DIALOGUES.map((item, idx) => (
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
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(234, 179, 8, 0.15)', color: '#eab308', fontWeight: 700 }}>
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

        {/* 右側：水電搬家重要單詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'block' }}>
            💡 台湾光熱費・引越し必須単語（Utilities Tips）
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {activeItem.utilitiesGlossary.map((vocab, vIdx) => (
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
