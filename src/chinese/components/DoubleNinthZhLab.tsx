import React, { useState } from 'react'
import { DOUBLE_NINTH_DIALOGUES, type DoubleNinthDialogueItem } from '../data/doubleNinthZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

interface SeniorTraditionItem {
  id: string
  nameZh: string
  nameJa: string
  icon: string
  symbolZh: string
  symbolJa: string
}

const SENIOR_TRADITIONS: SeniorTraditionItem[] = [
  { id: 'chrysanthemum-tea', nameZh: '銅鑼杭菊金黃菊花茶', nameJa: '苗栗銅鑼の菊花茶（清熱明目）', icon: '🌼', symbolZh: '產地直送黃金杭菊！清香甘甜、清熱退火明目舒緩！', symbolJa: '香り豊かな菊の花茶！目の疲れを癒し健康長寿を願う！' },
  { id: 'chongyang-cake', nameZh: '黑糖紅豆軟糯重陽糕', nameJa: '黒糖小豆の重陽蒸し餅（步步高升）', icon: '🥮', symbolZh: '米香軟Q，「糕」諧音「高」，象徵生活事業步步高升！', symbolJa: 'もちもちの伝統菓子！「糕」と「高」の掛詞で運気上昇！' },
  { id: 'elder-gift', nameZh: '重陽敬老禮金與金鎖片', nameJa: '敬老祝い金＆長寿祈願の金牌', icon: '🧧', symbolZh: '縣市政府發放敬老金！感謝長輩奉獻，祝賀百歲延年！', symbolJa: '自治体からの敬老祝儀！長年の感謝と健康長寿を祝福！' },
  { id: 'mountain-hiking', nameZh: '象山陽明山登高步道', nameJa: '秋晴れの登高ハイキング（象山）', icon: '⛰️', symbolZh: '秋高氣爽登高望遠！開闊胸襟避災厄、全家踏青舒暢！', symbolJa: '秋風爽やかな山歩き！厄を払い三世代で心身をリフレッシュ！' },
]

export const DoubleNinthZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [activeTradId, setActiveTradId] = useState<string>('chrysanthemum-tea')
  const [isBrewingTea, setIsBrewingTea] = useState(false)
  const [hikingCompleted, setHikingCompleted] = useState(false)

  const activeItem: DoubleNinthDialogueItem =
    DOUBLE_NINTH_DIALOGUES[selectedIdx % DOUBLE_NINTH_DIALOGUES.length]

  const currentTrad = SENIOR_TRADITIONS.find((t) => t.id === activeTradId) || SENIOR_TRADITIONS[0]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleBrewTea() {
    setIsBrewingTea(true)
    playCorrectSound()
    onEarnXp(15)
    setTimeout(() => setIsBrewingTea(false), 2500)
  }

  function handleCompleteHike() {
    setHikingCompleted((prev) => !prev)
    playCorrectSound()
    onEarnXp(15)
  }

  return (
    <div className="math-lab double-ninth-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>⛰️</span> 台灣九九重陽節登高與敬老尊賢實驗室 (Double Ninth Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            台湾の秋の伝統「九九重陽節」！「登高步道踏青・領敬老禮金・泡銅鑼杭菊茶吃重陽糕步步高升」を徹底マスター！
          </p>
        </div>
      </div>

      {/* 重陽敬老儀表板 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.12), rgba(202, 138, 4, 0.12))',
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
          <div style={{ fontSize: '1.8rem' }}>{hikingCompleted ? '⛰️ 🌤️' : isBrewingTea ? '🫖 🌼' : '🥮 🧧'}</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>
              重陽敬老民俗體驗：{currentTrad.nameZh}
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {hikingCompleted
                ? '⛰️ 全家陪同長輩登上象山步道涼亭！眺望台北101遠景，舒展筋骨延年益壽！(+15 XP)'
                : isBrewingTea
                ? '🌼 熱水沖入透明玻璃壺，苗栗銅鑼杭菊朵朵綻放！茶湯金黃透亮，清香甘美明目降火！(+15 XP)'
                : `${currentTrad.symbolZh}`}
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
              background: isBrewingTea ? '#10b981' : 'linear-gradient(135deg, #d97706, #b45309)',
            }}
            onClick={handleBrewTea}
          >
            {isBrewingTea ? '🌼 菊花茶沖泡完成' : '🫖 沖泡銅鑼杭菊茶 (+15 XP)'}
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.74rem',
              background: hikingCompleted ? '#10b981' : 'linear-gradient(135deg, #ea580c, #c2410c)',
            }}
            onClick={handleCompleteHike}
          >
            {hikingCompleted ? '✓ 登高踏青完成' : '⛰️ 陪伴長輩登高踏青 (+15 XP)'}
          </button>
        </div>
      </div>

      {/* 重陽民俗體驗卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', marginBottom: '0.85rem' }}>
        {SENIOR_TRADITIONS.map((trad) => {
          const isSelected = trad.id === activeTradId
          return (
            <button
              key={trad.id}
              type="button"
              className={`practice-card ${isSelected ? 'active' : ''}`}
              style={{
                padding: '0.6rem 0.5rem',
                borderRadius: '10px',
                border: isSelected ? '2px solid #ea580c' : '1px solid var(--line)',
                background: isSelected ? 'rgba(234, 88, 12, 0.12)' : 'var(--surface-soft)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                cursor: 'pointer',
              }}
              onClick={() => setActiveTradId(trad.id)}
            >
              <span style={{ fontSize: '1.4rem' }}>{trad.icon}</span>
              <strong style={{ fontSize: '0.78rem' }}>{trad.nameZh.slice(0, 6)}</strong>
              <span style={{ fontSize: '0.66rem', color: 'var(--muted)' }}>{trad.nameJa.split('（')[0]}</span>
            </button>
          )
        })}
      </div>

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {DOUBLE_NINTH_DIALOGUES.map((item, idx) => (
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
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(234, 88, 12, 0.15)', color: '#ea580c', fontWeight: 700 }}>
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
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ea580c' }}>
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

        {/* 右側：重陽敬老民俗名詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#ea580c', fontWeight: 700, display: 'block' }}>
            💡 台湾重陽節・敬老登高文化豆知識（Double Ninth Tips）
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {activeItem.doubleNinthGlossary.map((vocab, vIdx) => (
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
                  <strong style={{ fontSize: '0.88rem', color: '#ea580c' }}>{vocab.termZh}</strong>
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
