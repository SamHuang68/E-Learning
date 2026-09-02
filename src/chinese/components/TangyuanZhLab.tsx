import React, { useState } from 'react'
import { TANGYUAN_DIALOGUES, type TangyuanDialogueItem } from '../data/tangyuanZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

interface TangyuanFlavor {
  id: string
  nameZh: string
  nameJa: string
  color: string
  descZh: string
  descJa: string
}

const TANGYUAN_FLAVORS: TangyuanFlavor[] = [
  { id: 'red-white', nameZh: '紅白小湯圓 (開運團圓)', nameJa: '紅白白玉団子（開運＆円満）', color: '#f43f5e', descZh: '紅丸開運招喜、白丸平安團圓，甜湯底經典！', descJa: '赤は開運、白は円満。素朴で優しい味わい。' },
  { id: 'sesame', nameZh: '爆漿黑芝麻大湯圓', nameJa: 'とろける黒胡麻湯圓', color: '#334155', descZh: '咬開濃郁黑芝麻糊流沙，香氣爆棚！', descJa: '噛むと濃厚な黒胡麻ペーストが口いっぱいに広がる！' },
  { id: 'peanut', nameZh: '流沙花生大湯圓', nameJa: '香ばしいピーナッツ湯圓', color: '#d97706', descZh: '吃得到花生顆粒感，甜香濃郁經典！', descJa: 'ピーナッツの粒感が香ばしい台湾定番の味！' },
  { id: 'savory', nameZh: '客家鹹湯圓 (茼蒿香菇香)', nameJa: '客家風塩味スープ湯圓（春菊＆椎茸）', color: '#10b981', descZh: '香菇、蝦米、肉絲爆香，加入冬至茼蒿最鮮美！', descJa: '干し椎茸・桜エビ・豚肉の旨味と春菊の香りが絶品！' },
]

export const TangyuanZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [activeFlavorId, setActiveFlavorId] = useState<string>('sesame')
  const [isBoiling, setIsBoiling] = useState(false)
  const [ageCount, setAgeCount] = useState(1)

  const activeItem: TangyuanDialogueItem =
    TANGYUAN_DIALOGUES[selectedIdx % TANGYUAN_DIALOGUES.length]

  const currentFlavor = TANGYUAN_FLAVORS.find((f) => f.id === activeFlavorId) || TANGYUAN_FLAVORS[0]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleCookTangyuan() {
    setIsBoiling(true)
    playCorrectSound()
    onEarnXp(15)
    setAgeCount((prev) => prev + 1)
    setTimeout(() => setIsBoiling(false), 2500)
  }

  return (
    <div className="math-lab tangyuan-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🥣</span> 台灣冬至吃湯圓添歲數生活實驗室 (Dongzhi Tangyuan Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            台湾の二十四節気「冬至」！「吃了長一歲・紅白小湯圓（開運團圓）・爆漿黑芝麻花生・客家鹹湯圓」を徹底マスター！
          </p>
        </div>
      </div>

      {/* 煮湯圓與添歲數儀表板 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.12), rgba(217, 119, 6, 0.12))',
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
          <div style={{ fontSize: '1.8rem' }}>🥣 ♨️</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>
              冬至滾水煮湯圓 ({currentFlavor.nameZh})
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {isBoiling
                ? '♨️ 湯圓浮上水面滾熟啦！熱騰騰咬開流沙，暖心又暖胃！恭喜吃了冬至圓又長了一歲！(+15 XP)'
                : `${currentFlavor.descZh} 吃過冬節圓，長歲數又圓滿！目前已吃過 ${ageCount} 碗溫暖冬至圓！`}
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
              background: isBoiling ? '#10b981' : 'linear-gradient(135deg, #f43f5e, #e11d48)',
            }}
            onClick={handleCookTangyuan}
          >
            {isBoiling ? '♨️ 湯圓浮起煮熟囉！' : '🥣 滾水沸煮・添歲數 (+15 XP)'}
          </button>
        </div>
      </div>

      {/* 口味選擇卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', marginBottom: '0.85rem' }}>
        {TANGYUAN_FLAVORS.map((flavor) => {
          const isSelected = flavor.id === activeFlavorId
          return (
            <button
              key={flavor.id}
              type="button"
              className={`practice-card ${isSelected ? 'active' : ''}`}
              style={{
                padding: '0.6rem 0.5rem',
                borderRadius: '10px',
                border: isSelected ? `2px solid ${flavor.color}` : '1px solid var(--line)',
                background: isSelected ? 'rgba(244, 63, 94, 0.12)' : 'var(--surface-soft)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                cursor: 'pointer',
              }}
              onClick={() => setActiveFlavorId(flavor.id)}
            >
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: flavor.color }} />
              <strong style={{ fontSize: '0.78rem' }}>{flavor.nameZh.split(' ')[0]}</strong>
              <span style={{ fontSize: '0.66rem', color: 'var(--muted)' }}>{flavor.nameJa.split('（')[0]}</span>
            </button>
          )
        })}
      </div>

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {TANGYUAN_DIALOGUES.map((item, idx) => (
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
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', fontWeight: 700 }}>
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
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f43f5e' }}>
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

        {/* 右側：冬至民俗名詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#f43f5e', fontWeight: 700, display: 'block' }}>
            💡 台湾冬至・冬節圓カルチャー豆知識（Tangyuan Tips）
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {activeItem.tangyuanGlossary.map((vocab, vIdx) => (
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
                  <strong style={{ fontSize: '0.88rem', color: '#f43f5e' }}>{vocab.termZh}</strong>
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
