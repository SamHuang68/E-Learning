import React, { useState } from 'react'
import { LANTERN_FESTIVAL_DIALOGUES, type LanternFestivalDialogueItem } from '../data/lanternFestivalZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

interface SkyLanternColor {
  id: string
  colorNameZh: string
  colorNameJa: string
  hex: string
  wishZh: string
  wishJa: string
}

const LANTERN_COLORS: SkyLanternColor[] = [
  { id: 'red', colorNameZh: '紅色 (喜慶)', colorNameJa: '赤（慶事・健康）', hex: '#ef4444', wishZh: '闔家平安・身體健康', wishJa: '家内安全・健康長寿' },
  { id: 'yellow', colorNameZh: '黃色 (財富)', colorNameJa: '黄（金運・事業）', hex: '#f59e0b', wishZh: '財源滾滾・步步高升', wishJa: '金運上昇・商売繁盛' },
  { id: 'blue', colorNameZh: '藍色 (事業)', colorNameJa: '青（学業・出世）', hex: '#3b82f6', wishZh: '工作順利・金榜題名', wishJa: '仕事順調・合格祈願' },
  { id: 'pink', colorNameZh: '粉色 (愛情)', colorNameJa: 'ピンク（良縁）', hex: '#ec4899', wishZh: '幸福美滿・良緣早至', wishJa: '良縁成就・恋愛円満' },
]

export const LanternFestivalZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [activeColorId, setActiveColorId] = useState<string>('red')
  const [isLanternFlying, setIsLanternFlying] = useState(false)
  const [isBeeFiring, setIsBeeFiring] = useState(false)

  const activeItem: LanternFestivalDialogueItem =
    LANTERN_FESTIVAL_DIALOGUES[selectedIdx % LANTERN_FESTIVAL_DIALOGUES.length]

  const currentColor = LANTERN_COLORS.find((c) => c.id === activeColorId) || LANTERN_COLORS[0]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleFlyLantern() {
    setIsLanternFlying(true)
    playCorrectSound()
    onEarnXp(15)
    setTimeout(() => setIsLanternFlying(false), 3000)
  }

  function handleBeeFire() {
    setIsBeeFiring(true)
    playCorrectSound()
    onEarnXp(15)
    setTimeout(() => setIsBeeFiring(false), 2500)
  }

  return (
    <div className="math-lab lantern-festival-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🏮</span> 台灣元宵節平溪天燈與鹽水蜂炮實驗室 (Lantern Festival Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            台湾の正月締めくくり「元宵節」！「平渓十分四色天燈祈福・台南鹽水蜂炮消災解厄・廟口猜燈謎」を徹底マスター！
          </p>
        </div>
      </div>

      {/* 平溪天燈祈福放飛儀表板 */}
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
          <div style={{ fontSize: '1.8rem' }}>{isLanternFlying ? '✨🏮' : isBeeFiring ? '💥🎆' : '🏮 🔥'}</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>
              元宵民俗體驗：{currentColor.colorNameZh}天燈【{currentColor.wishZh}】
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {isLanternFlying
                ? '✨ 天燈灌滿熱氣冉冉升空！紅黃光芒照亮夜空，願望直達天聽！(+15 XP)'
                : isBeeFiring
                ? '💥 萬發蜂炮齊發！劈啪巨響萬彈穿梭，全副武裝消災除煞！(+15 XP)'
                : `四色天燈面面寫心願：${currentColor.wishZh}（${currentColor.wishJa}）`}
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
              background: isLanternFlying ? '#10b981' : 'linear-gradient(135deg, #ef4444, #b91c1c)',
            }}
            onClick={handleFlyLantern}
          >
            {isLanternFlying ? '✨ 天燈升空中...' : '🏮 點火放天燈祈福 (+15 XP)'}
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.74rem',
              background: isBeeFiring ? '#10b981' : 'linear-gradient(135deg, #f59e0b, #d97706)',
            }}
            onClick={handleBeeFire}
          >
            {isBeeFiring ? '💥 蜂炮震撼發射' : '🎆 體驗鹽水蜂炮 (+15 XP)'}
          </button>
        </div>
      </div>

      {/* 天燈祈福顏色選擇卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', marginBottom: '0.85rem' }}>
        {LANTERN_COLORS.map((lantern) => {
          const isSelected = lantern.id === activeColorId
          return (
            <button
              key={lantern.id}
              type="button"
              className={`practice-card ${isSelected ? 'active' : ''}`}
              style={{
                padding: '0.6rem 0.5rem',
                borderRadius: '10px',
                border: isSelected ? `2px solid ${lantern.hex}` : '1px solid var(--line)',
                background: isSelected ? 'rgba(239, 68, 68, 0.12)' : 'var(--surface-soft)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                cursor: 'pointer',
              }}
              onClick={() => setActiveColorId(lantern.id)}
            >
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: lantern.hex }} />
              <strong style={{ fontSize: '0.78rem' }}>{lantern.colorNameZh.split(' ')[0]}</strong>
              <span style={{ fontSize: '0.66rem', color: 'var(--muted)' }}>{lantern.colorNameJa.split('（')[0]}</span>
              <span style={{ fontSize: '0.66rem', color: '#ef4444', marginTop: '0.2rem' }}>
                {lantern.wishZh.split('・')[0]}
              </span>
            </button>
          )
        })}
      </div>

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {LANTERN_FESTIVAL_DIALOGUES.map((item, idx) => (
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
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444' }}>
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
                <span style={{ fontSize: '0.72rem', color: '#d97706' }}>{line.pinyin}</span>
                <span style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.1rem' }}>
                  {line.ja}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 右側：元宵民俗名詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#ef4444', fontWeight: 700, display: 'block' }}>
            💡 台湾元宵節・小正月文化豆知識（Lantern Festival Tips）
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {activeItem.lanternFestivalGlossary.map((vocab, vIdx) => (
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
