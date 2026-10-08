import React, { useState } from 'react'
import { CHINESE_SUPPORT_EN, YOUBIKE_DIALOGUES, type YouBikeDialogueItem } from '../data/youbikeZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'
import { localizeChineseData } from '../teachingCopy'

interface Props {
  onEarnXp: (amount: number) => void
}

export const YouBikeZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const { locale } = useI18n()
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [transitDiscount, setTransitDiscount] = useState(true)
  const [seatInverted, setSeatInverted] = useState(false)
  const [rentState, setRentState] = useState<'idle' | 'rented' | 'returned'>('idle')

  const activeItem: YouBikeDialogueItem =
    YOUBIKE_DIALOGUES[selectedIdx % YOUBIKE_DIALOGUES.length]
  const localizedItem = localizeChineseData(activeItem, locale, CHINESE_SUPPORT_EN)
  const localizedDialogues = localizeChineseData(YOUBIKE_DIALOGUES, locale, CHINESE_SUPPORT_EN)

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleRentOrReturn() {
    if (rentState === 'idle') {
      setRentState('rented')
      onEarnXp(10)
      playCorrectSound()
    } else if (rentState === 'rented') {
      setRentState('returned')
      onEarnXp(15)
      playCorrectSound()
      setTimeout(() => setRentState('idle'), 3500)
    }
  }

  return (
    <div className="math-lab youbike-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🚲</span> {locale === 'en' ? 'Taiwan YouBike and Transit Lab' : '台灣 YouBike 微笑單車與轉乘生活實驗室 (YouBike Transit Lab)'}
          </h3>
          <p lang={locale === 'en' ? 'en' : 'ja'} className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {locale === 'en'
              ? 'Practise Mandarin for YouBike 2.0: recognizing an inverted-seat fault signal, receiving a transit discount, renting by card, and docking the bicycle correctly.'
              : '台湾の国民的シェアサイクル「YouBike 2.0」！「座墊反轉（故障サイン）・捷運公車轉乘現折5元・靠卡借車・卡榫入柱還車」を完全制覇！'}
          </p>
        </div>
      </div>

      {/* YouBike 租借感應與轉乘模擬器 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.12), rgba(16, 185, 129, 0.12))',
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
          <div style={{ fontSize: '1.8rem' }}>🚲 🟡</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>{locale === 'en' ? 'YouBike 2.0 Smart On-Bike Console' : 'YouBike 2.0 智慧車機螢幕 (Smart Solar On-Bike Console)'}</strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {rentState === 'rented'
                ? locale === 'en' ? 'Ride in progress: NT$5 metro-transfer discount active. The first 30 minutes cost NT$5.' : '騎乘中：捷運轉乘扣抵 5 元已啟動！租借前 30 分鐘只需 5 元'
                : rentState === 'returned'
                ? locale === 'en' ? '✓ Beep! Bicycle returned and NT$5 charged. (+15 XP)' : '✓ 嗶嗶！還車成功！扣款 5 元完成！(+15 XP)'
                : locale === 'en'
                  ? `Bicycle ready · ${transitDiscount ? 'NT$5 transit discount' : 'standard fare'}${seatInverted ? ' (seat inverted to report a fault)' : ''}`
                  : `車況正常・${transitDiscount ? '享捷運公車轉乘折5元' : '一般費率'}${seatInverted ? ' (已手動反轉椅墊報修)' : ''}`}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button aria-pressed={seatInverted}
            type="button"
            className={`pill-btn ${seatInverted ? 'active' : ''}`}
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
            onClick={() => setSeatInverted((prev) => !prev)}
          >
            {seatInverted
              ? locale === 'en' ? '⚠️ Seat inverted (fault reported)' : '⚠️ 椅墊反轉 (故障待修)'
              : locale === 'en' ? '🔄 Demonstrate the inverted-seat signal' : '🔄 座墊反轉示範'}
          </button>

          <button aria-pressed={transitDiscount}
            type="button"
            className={`pill-btn ${transitDiscount ? 'active' : ''}`}
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
            onClick={() => setTransitDiscount((prev) => !prev)}
          >
            {transitDiscount
              ? locale === 'en' ? '✓ NT$5 metro-transfer discount' : '✓ 捷運轉乘扣5元'
              : locale === 'en' ? 'No transit discount' : '無轉乘優惠'}
          </button>

          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.76rem',
              background:
                rentState === 'rented'
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : rentState === 'returned'
                  ? '#10b981'
                  : 'linear-gradient(135deg, #eab308, #ca8a04)',
            }}
            onClick={handleRentOrReturn}
          >
            {rentState === 'idle'
              ? locale === 'en' ? '💳 Tap EasyCard to rent' : '💳 悠遊卡感應借車'
              : rentState === 'rented'
              ? locale === 'en' ? '🏁 Dock the bicycle to return it' : '🏁 卡榫入柱還車'
              : locale === 'en' ? 'Return complete' : '還車完畢'}
          </button>
        </div>
      </div>

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {localizedDialogues.map((item, idx) => (
          <button aria-pressed={selectedIdx === idx}
            key={item.id}
            type="button"
            className={`pill-btn ${selectedIdx === idx ? 'active' : ''}`}
            onClick={() => setSelectedIdx(idx)}
          >
            <span>{item.icon}</span> {locale === 'en' ? item.title : item.title.split('：')[0]}
          </button>
        ))}
      </div>

      {/* 雙欄佈局 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '0.8rem' }}>
        {/* 左側：對話實況 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(234, 179, 8, 0.15)', color: '#ca8a04', fontWeight: 700 }}>
              {activeItem.locationZh} (<span lang={locale === 'en' ? 'en' : 'ja'}>{localizedItem.locationJa}</span>)
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
                    <span lang={locale === 'en' ? 'en' : 'ja'}>{localizedItem.dialogueLines[lIdx].speakerJa}</span>:
                  </span>
                  <button aria-label={locale === 'en' ? `Read aloud: ${line.zh}` : `朗讀：${line.zh}`}
                    type="button"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                    onClick={() => speakChinese(line.zh)}
                  >
                    🔊
                  </button>
                </div>
                <strong style={{ fontSize: '0.86rem', color: 'var(--text)' }}>{line.zh}</strong>
                <span lang="zh-Latn" style={{ fontSize: '0.72rem', color: '#f59e0b' }}>{line.pinyin}</span>
                <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.1rem' }}>
                  {localizedItem.dialogueLines[lIdx].ja}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 右側：YouBike 綠色生活重要單詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'block' }}>
            {locale === 'en' ? '💡 YouBike and bike-sharing tips' : '💡 台湾 YouBike・シェアサイクル文化（YouBike Tips）'}
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {localizedItem.youbikeGlossary.map((vocab, vIdx) => (
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
                  <strong style={{ fontSize: '0.88rem', color: '#ca8a04' }}>{vocab.termZh}</strong>
                  <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: 'var(--text)' }}>{vocab.meaningJa}</span>
                </div>
                <p lang={locale === 'en' ? 'en' : 'ja'} style={{ margin: '0.25rem 0 0', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.4 }}>
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
