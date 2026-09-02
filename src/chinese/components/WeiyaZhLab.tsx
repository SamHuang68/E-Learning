import React, { useState } from 'react'
import { WEIYA_DIALOGUES, type WeiyaDialogueItem } from '../data/weiyaZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

export const WeiyaZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [chickenHeadTarget, setChickenHeadTarget] = useState<'boss' | 'sky' | 'colleague'>('boss')
  const [porkFatness, setPorkFatness] = useState('半肥半瘦')
  const [extraPeanutSugar, setExtraPeanutSugar] = useState(true)
  const [lotteryPrize, setLotteryPrize] = useState<'idle' | 'drawing' | 'grandPrize'>('idle')

  const activeItem: WeiyaDialogueItem =
    WEIYA_DIALOGUES[selectedIdx % WEIYA_DIALOGUES.length]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleDrawLottery() {
    setLotteryPrize('drawing')
    setTimeout(() => {
      setLotteryPrize('grandPrize')
      onEarnXp(20)
      playCorrectSound()
    }, 1200)
  }

  return (
    <div className="math-lab weiya-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🧧</span> 台灣年終尾牙文化與刈包摸彩實驗室 (Taiwan Weiya Banquet Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            台湾の年末大宴会「尾牙」！「刈包（虎咬豬）で金運丸呑み・鶏頭を社長に向けて加碼（ボーナス上乗せ）・豪華賞金抽選会」を完全制覇！
          </p>
        </div>
      </div>

      {/* 尾牙摸彩與刈包客製儀表板 */}
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
          <div style={{ fontSize: '1.8rem' }}>🍗 🧧</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>尾牙摸彩抽獎機 (Weiya Raffle & Gua Bao)</strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {lotteryPrize === 'grandPrize'
                ? '🎊 恭喜抽中尾牙特獎！十萬元加碼紅包入袋！新年業績長紅！(+20 XP)'
                : lotteryPrize === 'drawing'
                ? '🎰 摸彩箱搖晃中... 全場齊喊「加碼！加碼！」'
                : `雞頭方向：${chickenHeadTarget === 'boss' ? '轉向老闆 (全體加薪加碼！)' : '指向天空 (大賺一筆)'}・刈包：${porkFatness}${extraPeanutSugar ? '多花生糖粉' : ''}`}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`pill-btn ${chickenHeadTarget === 'boss' ? 'active' : ''}`}
            style={{ padding: '0.3rem 0.55rem', fontSize: '0.74rem' }}
            onClick={() => setChickenHeadTarget((prev) => (prev === 'boss' ? 'sky' : 'boss'))}
          >
            {chickenHeadTarget === 'boss' ? '🍗 雞頭對老闆 (加碼！)' : '🍗 雞頭朝天'}
          </button>

          <select
            value={porkFatness}
            onChange={(e) => setPorkFatness(e.target.value)}
            style={{ padding: '0.3rem 0.45rem', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.74rem' }}
          >
            <option value="半肥半瘦">焢肉半肥瘦</option>
            <option value="偏瘦肉">焢肉偏瘦肉</option>
            <option value="偏肥嫩">焢肉偏肥嫩</option>
          </select>

          <button
            type="button"
            className={`pill-btn ${extraPeanutSugar ? 'active' : ''}`}
            style={{ padding: '0.3rem 0.55rem', fontSize: '0.74rem' }}
            onClick={() => setExtraPeanutSugar((prev) => !prev)}
          >
            {extraPeanutSugar ? '✓ 多花生粉' : '正常花生粉'}
          </button>

          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.74rem',
              background: lotteryPrize === 'grandPrize' ? '#10b981' : 'linear-gradient(135deg, #ef4444, #dc2626)',
            }}
            onClick={handleDrawLottery}
          >
            {lotteryPrize === 'grandPrize' ? '再來一抽' : '🎰 尾牙摸彩抽獎'}
          </button>
        </div>
      </div>

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {WEIYA_DIALOGUES.map((item, idx) => (
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

        {/* 右側：尾牙文化名詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#ef4444', fontWeight: 700, display: 'block' }}>
            💡 台湾尾牙・忘年会カルチャー（Weiya Banquet Tips）
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {activeItem.weiyaGlossary.map((vocab, vIdx) => (
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
