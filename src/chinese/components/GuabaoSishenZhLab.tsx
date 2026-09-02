import React, { useState } from 'react'
import { GUABAO_SISHEN_DIALOGUES, type GuabaoSishenDialogueItem } from '../data/guabaoSishenZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

type MeatPreference = 'half' | 'lean' | 'fatty'

export const GuabaoSishenZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [meatPref, setMeatPref] = useState<MeatPreference>('half')
  const [hasPeanut, setHasPeanut] = useState(true)
  const [hasPickles, setHasPickles] = useState(true)
  const [hasCoriander, setHasCoriander] = useState(true)
  const [addedWine, setAddedWine] = useState(false)
  const [bitten, setBitten] = useState(false)

  const activeItem: GuabaoSishenDialogueItem =
    GUABAO_SISHEN_DIALOGUES[selectedIdx % GUABAO_SISHEN_DIALOGUES.length]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleBiteGuabao() {
    setBitten(true)
    playCorrectSound()
    onEarnXp(15)
    setTimeout(() => setBitten(false), 2000)
  }

  function handleAddWine() {
    setAddedWine((prev) => !prev)
    playCorrectSound()
    onEarnXp(15)
  }

  const meatLabel = meatPref === 'half' ? '半肥半瘦（黃金比例）' : meatPref === 'lean' ? '偏瘦肉（扎實不膩）' : '偏肥肉（入口即化）'

  return (
    <div className="math-lab guabao-sishen-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🍔</span> 台灣夜市名物刈包「虎咬豬」與四神湯實驗室 (Guabao & Sishen Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            台湾の冬の夜市の定番「虎咬猪・刈包＆薬膳四神湯」！「半肥半瘦・酸菜・花生糖粉・当帰薬酒」を徹底マスター！
          </p>
        </div>
      </div>

      {/* 刈包四神湯互動儀表板 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.12), rgba(16, 185, 129, 0.12))',
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
          <div style={{ fontSize: '1.8rem' }}>{bitten ? '🐯 😋' : addedWine ? '🍶 🍲' : '🍔 🥣'}</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>
              特製客製刈包：{meatLabel}
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {bitten
                ? '🐯 虎咬豬大口咬下！熱騰騰軟嫩三層爌肉混合花生糖粉甜香與酸菜脆口，象徵咬碎晦氣迎福氣！(+15 XP)'
                : addedWine
                ? '🍶 往乳白色滾燙四神湯滴入幾滴特製當歸藥酒，酒香撲鼻、溫補暖胃！(+15 XP)'
                : `配料：${hasPickles ? '爽脆酸菜 ' : ''}${hasPeanut ? '香濃花生粉 ' : ''}${hasCoriander ? '提味香菜' : ''}`}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.74rem',
              background: bitten ? '#10b981' : 'linear-gradient(135deg, #d97706, #b45309)',
            }}
            onClick={handleBiteGuabao}
          >
            {bitten ? '🐯 幸福咬住福氣' : '🍔 虎咬豬大口咬下 (+15 XP)'}
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.74rem',
              background: addedWine ? '#10b981' : 'linear-gradient(135deg, #059669, #047857)',
            }}
            onClick={handleAddWine}
          >
            {addedWine ? '✓ 已滴入當歸藥酒' : '🍶 滴幾滴當歸藥酒 (+15 XP)'}
          </button>
        </div>
      </div>

      {/* 客製化配料勾選 */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
        <button
          type="button"
          className={`pill-btn ${meatPref === 'half' ? 'active' : ''}`}
          onClick={() => setMeatPref('half')}
        >
          🥩 半肥半瘦 (定番)
        </button>
        <button
          type="button"
          className={`pill-btn ${meatPref === 'lean' ? 'active' : ''}`}
          onClick={() => setMeatPref('lean')}
        >
          🍖 偏瘦肉 (ヘルシー)
        </button>
        <button
          type="button"
          className={`pill-btn ${meatPref === 'fatty' ? 'active' : ''}`}
          onClick={() => setMeatPref('fatty')}
        >
          🥓 偏肥肉 (とろける)
        </button>
        <button
          type="button"
          className={`pill-btn ${hasPeanut ? 'active' : ''}`}
          onClick={() => setHasPeanut((prev) => !prev)}
        >
          🥜 花生糖粉 {hasPeanut ? '✓' : '✗'}
        </button>
        <button
          type="button"
          className={`pill-btn ${hasPickles ? 'active' : ''}`}
          onClick={() => setHasPickles((prev) => !prev)}
        >
          🥬 爽脆酸菜 {hasPickles ? '✓' : '✗'}
        </button>
        <button
          type="button"
          className={`pill-btn ${hasCoriander ? 'active' : ''}`}
          onClick={() => setHasCoriander((prev) => !prev)}
        >
          🌿 香菜 {hasCoriander ? '✓' : '✗'}
        </button>
      </div>

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {GUABAO_SISHEN_DIALOGUES.map((item, idx) => (
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
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(217, 119, 6, 0.15)', color: '#d97706', fontWeight: 700 }}>
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
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d97706' }}>
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
                <span style={{ fontSize: '0.72rem', color: '#059669' }}>{line.pinyin}</span>
                <span style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.1rem' }}>
                  {line.ja}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 右側：名物名詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#d97706', fontWeight: 700, display: 'block' }}>
            💡 台湾名物「刈包（虎咬猪）」・四神湯豆知識（Guabao Tips）
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {activeItem.guabaoGlossary.map((vocab, vIdx) => (
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
                  <strong style={{ fontSize: '0.88rem', color: '#d97706' }}>{vocab.termZh}</strong>
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
