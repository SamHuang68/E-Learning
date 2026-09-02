import React, { useState } from 'react'
import { BOBA_DIALOGUES, type BobaDialogueItem } from '../data/bobaZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

export const BobaZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [teaBase, setTeaBase] = useState('四季春青茶')
  const [sweetness, setSweetness] = useState('微糖 (三分糖)')
  const [iceLevel, setIceLevel] = useState('微冰')
  const [topping, setTopping] = useState('黑糖波霸 (大珍珠)')
  const [useEcoCup, setUseEcoCup] = useState(true)
  const [ordered, setOrdered] = useState(false)

  const activeItem: BobaDialogueItem =
    BOBA_DIALOGUES[selectedIdx % BOBA_DIALOGUES.length]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handlePlaceOrder() {
    setOrdered(true)
    onEarnXp(10)
    playCorrectSound()
    setTimeout(() => setOrdered(false), 3500)
  }

  return (
    <div className="math-lab boba-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🧋</span> 台灣手搖飲極致客製化實驗室 (Taiwan Boba Customization Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            台湾手搖茶の神髄！「微糖微冰（3分糖・氷少なめ）・波霸大粒タピオカ・自備環保杯現折5元・封膜ストローの刺し方」を直感マスター！
          </p>
        </div>
      </div>

      {/* 手搖茶飲客製化標籤產生器 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(236, 72, 153, 0.12))',
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
          <div style={{ fontSize: '1.8rem' }}>🧋 🏷️</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>杯身貼紙標籤 (Customized Tea Label)</strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {ordered
                ? `✓ 點單完成！「${teaBase}・${sweetness}・${iceLevel}・加${topping}」已折5元！(+10 XP)`
                : `${teaBase} / ${sweetness} / ${iceLevel} / ${topping}${useEcoCup ? ' (環保杯折5元)' : ''}`}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={teaBase}
            onChange={(e) => setTeaBase(e.target.value)}
            style={{ padding: '0.3rem 0.45rem', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.74rem' }}
          >
            <option value="四季春青茶">四季春青茶</option>
            <option value="熟成紅茶拿鐵">熟成紅茶拿鐵</option>
            <option value="文山包種烏龍">文山包種烏龍</option>
            <option value="珍珠奶茶">珍珠奶茶</option>
          </select>

          <select
            value={sweetness}
            onChange={(e) => setSweetness(e.target.value)}
            style={{ padding: '0.3rem 0.45rem', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.74rem' }}
          >
            <option value="無糖 (零分糖)">無糖 (零分)</option>
            <option value="微糖 (三分糖)">微糖 (三分)</option>
            <option value="半糖 (五分糖)">半糖 (五分)</option>
            <option value="少糖 (七分糖)">少糖 (七分)</option>
            <option value="全糖 (十分糖)">全糖 (十分)</option>
          </select>

          <select
            value={iceLevel}
            onChange={(e) => setIceLevel(e.target.value)}
            style={{ padding: '0.3rem 0.45rem', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.74rem' }}
          >
            <option value="去冰">去冰</option>
            <option value="微冰">微冰</option>
            <option value="少冰">少冰</option>
            <option value="正常冰">正常冰</option>
            <option value="常溫">常溫</option>
            <option value="溫熱">溫熱</option>
          </select>

          <select
            value={topping}
            onChange={(e) => setTopping(e.target.value)}
            style={{ padding: '0.3rem 0.45rem', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.74rem' }}
          >
            <option value="黑糖波霸 (大珍珠)">黑糖波霸</option>
            <option value="黃金粉圓 (小珍珠)">黃金粉圓</option>
            <option value="椰果">香甜椰果</option>
            <option value="統一布丁">統一布丁</option>
            <option value="手作仙草凍">手作仙草凍</option>
            <option value="不加料純茶">不加料純茶</option>
          </select>

          <button
            type="button"
            className={`pill-btn ${useEcoCup ? 'active' : ''}`}
            style={{ padding: '0.3rem 0.55rem', fontSize: '0.74rem' }}
            onClick={() => setUseEcoCup((prev) => !prev)}
          >
            {useEcoCup ? '✓ 折5元' : '免自備杯'}
          </button>

          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.74rem',
              background: ordered ? '#10b981' : 'linear-gradient(135deg, #f59e0b, #d97706)',
            }}
            onClick={handlePlaceOrder}
          >
            {ordered ? '製作中...' : '🥤 向店員點單'}
          </button>
        </div>
      </div>

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {BOBA_DIALOGUES.map((item, idx) => (
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
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.15)', color: '#d97706', fontWeight: 700 }}>
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

        {/* 右側：手搖飲茶文化重要單詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'block' }}>
            💡 台湾手搖茶・カスタム虎の巻（Boba Ordering Tips）
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {activeItem.bobaGlossary.map((vocab, vIdx) => (
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
