import React, { useState } from 'react'
import { GHOST_FESTIVAL_DIALOGUES, type GhostFestivalDialogueItem } from '../data/ghostFestivalZhDialogues'
import { playCorrectSound, playWrongSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

interface OfferingItem {
  id: string
  nameZh: string
  nameJa: string
  icon: string
  isSafeForGhost: boolean
  tipZh: string
  tipJa: string
}

const OFFERING_LIST: OfferingItem[] = [
  { id: 'apple', nameZh: '蘋果 (平平安安)', nameJa: 'リンゴ（無病息災）', icon: '🍎', isSafeForGhost: true, tipZh: '適合！象徵平平安安，好兄弟受饗佑民！', tipJa: '適切！無病息災（平平安安）を象徴し最も好まれる。' },
  { id: 'banana', nameZh: '香蕉 (招你來禁忌)', nameJa: 'バナナ（禁忌：招你來）', icon: '🍌', isSafeForGhost: false, tipZh: '禁忌！台語諧音「招」，會把好兄弟招進家中！', tipJa: 'タブー！台湾語で「招く」の同音で霊を家に引き寄せるため禁止。' },
  { id: 'instant-noodles', nameZh: '整箱乾拌泡麵', nameJa: 'カップラーメン（箱買い）', icon: '🍜', isSafeForGhost: true, tipZh: '超受歡迎！耐放方便，普渡招牌供品！', tipJa: '大人気！保存が効き分けやすいため中元普渡の定番。' },
  { id: 'pear', nameZh: '水梨 (招你來禁忌)', nameJa: '梨（禁忌：招你來）', icon: '🍐', isSafeForGhost: false, tipZh: '禁忌！台語諧音「來」，與香蕉李子合稱招你來！', tipJa: 'タブー！台湾語で「来る（來）」の同音のため禁忌。' },
  { id: 'soda', nameZh: '黑松沙士整箱', nameJa: '台湾コーラ・清涼飲料水', icon: '🥤', isSafeForGhost: true, tipZh: '適合！好兄弟消暑解渴，澎湃大方！', tipJa: '適切！夏の暑さを和らげる清涼飲料水として大定番。' },
  { id: 'pineapple', nameZh: '鳳梨 (旺來禁忌)', nameJa: 'パイナップル（禁忌：旺來）', icon: '🍍', isSafeForGhost: false, tipZh: '禁忌！諧音「旺來」，好兄弟太旺會引發事故！', tipJa: 'タブー！「災いが盛んに来る（旺來）」ため好兄弟には厳禁。' },
]

export const GhostFestivalZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [pickedOfferingIds, setPickedOfferingIds] = useState<string[]>(['apple', 'instant-noodles', 'soda'])
  const [tabooAlert, setTabooAlert] = useState<string | null>(null)
  const [waterLanternReleased, setWaterLanternReleased] = useState(false)

  const activeItem: GhostFestivalDialogueItem =
    GHOST_FESTIVAL_DIALOGUES[selectedIdx % GHOST_FESTIVAL_DIALOGUES.length]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleToggleOffering(item: OfferingItem) {
    if (pickedOfferingIds.includes(item.id)) {
      setPickedOfferingIds((prev) => prev.filter((id) => id !== item.id))
      setTabooAlert(null)
    } else {
      if (!item.isSafeForGhost) {
        setTabooAlert(`⚠️ 禁忌提醒！${item.nameZh}：${item.tipZh}`)
        playWrongSound()
      } else {
        setTabooAlert(null)
        playCorrectSound()
        onEarnXp(5)
      }
      setPickedOfferingIds((prev) => [...prev, item.id])
    }
  }

  function handleReleaseWaterLantern() {
    setWaterLanternReleased(true)
    onEarnXp(15)
    playCorrectSound()
    setTimeout(() => setWaterLanternReleased(false), 3500)
  }

  return (
    <div className="math-lab ghost-festival-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🏮</span> 台灣中元普渡拜拜與供品禁忌實驗室 (Ghost Festival Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            台湾の旧暦7月「中元普渡」！「好兄弟への供養・果物のタブー（香蕉李子梨子＝招你來）・放水燈慈悲祈福」を徹底マスター！
          </p>
        </div>
      </div>

      {/* 普渡供桌與放水燈儀表板 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(239, 68, 68, 0.12))',
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
          <div style={{ fontSize: '1.8rem' }}>🏮 🪔</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>中元普渡香案供桌 (Pudu Offerings Table)</strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {waterLanternReleased
                ? '🌊 基隆望海巷水燈頭隨波漂向大海！照亮水路引領好兄弟赴宴，功德圓滿！(+15 XP)'
                : tabooAlert
                ? tabooAlert
                : `已擺設 ${pickedOfferingIds.length} 樣供品，心意滿滿！插上普渡旗與線香，祈求闔家平安！`}
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
              background: waterLanternReleased ? '#10b981' : 'linear-gradient(135deg, #f59e0b, #d97706)',
            }}
            onClick={handleReleaseWaterLantern}
          >
            {waterLanternReleased ? '✓ 水燈漂向大海' : '🪔 子夜望海巷放水燈'}
          </button>
        </div>
      </div>

      {/* 供品禁忌選取區 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', marginBottom: '0.85rem' }}>
        {OFFERING_LIST.map((item) => {
          const isSelected = pickedOfferingIds.includes(item.id)
          return (
            <button
              key={item.id}
              type="button"
              className={`practice-card ${isSelected ? 'active' : ''}`}
              style={{
                padding: '0.6rem 0.5rem',
                borderRadius: '10px',
                border: isSelected ? (item.isSafeForGhost ? '2px solid #10b981' : '2px solid #ef4444') : '1px solid var(--line)',
                background: isSelected ? (item.isSafeForGhost ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)') : 'var(--surface-soft)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                cursor: 'pointer',
              }}
              onClick={() => handleToggleOffering(item)}
            >
              <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
              <strong style={{ fontSize: '0.78rem' }}>{item.nameZh}</strong>
              <span style={{ fontSize: '0.66rem', color: 'var(--muted)' }}>{item.nameJa}</span>
            </button>
          )
        })}
      </div>

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {GHOST_FESTIVAL_DIALOGUES.map((item, idx) => (
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

        {/* 右側：普渡民俗名詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#d97706', fontWeight: 700, display: 'block' }}>
            💡 台湾中元普渡・好兄弟カルチャー豆知識（Pudu Tips）
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {activeItem.ghostFestivalGlossary.map((vocab, vIdx) => (
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
