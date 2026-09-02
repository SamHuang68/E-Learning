import React, { useState } from 'react'
import { TRANSIT_SCENARIOS, type TransitScenarioItem } from '../data/transitDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

export const TransitLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0)
  const [easyCardBalance, setEasyCardBalance] = useState<number>(100)
  const [chargeSuccessMsg, setChargeSuccessMsg] = useState<string | null>(null)

  const activeScenario: TransitScenarioItem =
    TRANSIT_SCENARIOS[selectedScenarioIdx % TRANSIT_SCENARIOS.length]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleCharge(amount: number) {
    setEasyCardBalance((prev) => prev + amount)
    setChargeSuccessMsg(`🎉 加值成功！已為悠遊卡充入 NT$ ${amount} 元！`)
    onEarnXp(10)
    playCorrectSound()
    setTimeout(() => setChargeSuccessMsg(null), 3500)
  }

  return (
    <div className="math-lab transit-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🚇</span> 台灣交通出行與悠遊卡捷運實驗室 (Transit & Metro Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            台湾旅行・生活で毎日使う「MRT（捷運）・悠遊カード・タクシー（運將）」のリアルな会話と現地交通用語を体感！
          </p>
        </div>
      </div>

      {/* 悠遊卡儲值互動模擬面板 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(16, 185, 129, 0.12))',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '0.9rem',
          marginBottom: '0.9rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ fontSize: '2rem' }}>💳</div>
          <div>
            <strong style={{ fontSize: '0.95rem', display: 'block' }}>悠遊卡 (EasyCard) 虛擬感應卡</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>目前可用餘額：</span>
            <strong style={{ fontSize: '1.1rem', color: '#10b981', marginLeft: '0.3rem' }}>
              NT$ {easyCardBalance} 元
            </strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>模擬加值：</span>
          <button type="button" className="pill-btn" onClick={() => handleCharge(100)}>
            +100 元
          </button>
          <button type="button" className="pill-btn" onClick={() => handleCharge(500)}>
            +500 元
          </button>
          <button type="button" className="pill-btn" onClick={() => handleCharge(1000)}>
            +1000 元
          </button>
        </div>
      </div>

      {chargeSuccessMsg && (
        <div style={{ padding: '0.45rem 0.8rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.8rem' }}>
          {chargeSuccessMsg}
        </div>
      )}

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem' }}>
        {TRANSIT_SCENARIOS.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            className={`pill-btn ${selectedScenarioIdx === idx ? 'active' : ''}`}
            onClick={() => setSelectedScenarioIdx(idx)}
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
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7', fontWeight: 700 }}>
              {activeScenario.locationZh} ({activeScenario.locationJa})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginTop: '0.4rem' }}>
            {activeScenario.dialogueLines.map((line, lIdx) => (
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
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#38bdf8' }}>
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

        {/* 右側：台灣交通實用語彙指南 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'block' }}>
            💡 台湾交通実用単語と豆知識（Culture Tips）
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {activeScenario.usefulVocabulary.map((vocab, vIdx) => (
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
