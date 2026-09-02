import React, { useState } from 'react'
import { REPAIR_DIALOGUES, type RepairDialogueItem } from '../data/repairZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

export const RepairZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [issueItem, setIssueItem] = useState('分離式冷氣滴水漏水')
  const [repairStatus, setRepairStatus] = useState(false)

  const activeItem: RepairDialogueItem =
    REPAIR_DIALOGUES[selectedIdx % REPAIR_DIALOGUES.length]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleReportIssue() {
    setRepairStatus(true)
    onEarnXp(10)
    playCorrectSound()
    setTimeout(() => setRepairStatus(false), 3500)
  }

  return (
    <div className="math-lab repair-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🔧</span> 台灣租屋水電修繕與管委會實驗室 (Home Repair & Community Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            台湾生活のトラブル解決！「冷気滴水報修・水電師傅予約・大樓管委會管理費・總開關跳電」のリアル日常会話を徹底攻略！
          </p>
        </div>
      </div>

      {/* 租屋水電線上報修模擬器 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(16, 185, 129, 0.12))',
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
          <div style={{ fontSize: '1.8rem' }}>🔧 🏠</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>房東修繕與水電到府叫修 (Landlord Repair Request)</strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {repairStatus ? '✓ 房東回覆：已指派水電師傅明日到府！(+10 XP)' : '報修項目：' + issueItem}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={issueItem}
            onChange={(e) => setIssueItem(e.target.value)}
            style={{
              padding: '0.35rem 0.5rem',
              borderRadius: '6px',
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontSize: '0.78rem',
            }}
          >
            <option value="分離式冷氣滴水漏水">分離式冷氣滴水漏水</option>
            <option value="蓮蓬頭水壓不足出水小">蓮蓬頭水壓不足出水小</option>
            <option value="廚房流理台水管堵塞">廚房流理台水管堵塞</option>
            <option value="客廳插座跳電無熔絲開關">客廳插座跳電無熔絲開關</option>
          </select>

          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.76rem',
              background: repairStatus ? '#10b981' : 'linear-gradient(135deg, #f59e0b, #d97706)',
            }}
            onClick={handleReportIssue}
          >
            {repairStatus ? '報修成功' : '📲 LINE 發訊房東報修'}
          </button>
        </div>
      </div>

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {REPAIR_DIALOGUES.map((item, idx) => (
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
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 700 }}>
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

        {/* 右側：生活修繕重要單詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'block' }}>
            💡 台湾賃貸生活・修繕の知恵（Living & Repair Tips）
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {activeItem.repairGlossary.map((vocab, vIdx) => (
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
