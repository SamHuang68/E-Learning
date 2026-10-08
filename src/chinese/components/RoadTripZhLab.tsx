import React, { useState } from 'react'
import { CHINESE_SUPPORT_EN, ROAD_TRIP_DIALOGUES, type RoadTripDialogueItem } from '../data/roadTripZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'
import { localizeChineseData } from '../teachingCopy'

interface Props {
  onEarnXp: (amount: number) => void
}

export const RoadTripZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const { locale } = useI18n()
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [fuelType, setFuelType] = useState('九五無鉛 (95 Octane)')
  const [fuelAmount, setFuelAmount] = useState('加滿 (Full Tank)')
  const [gasPumped, setGasPumped] = useState(false)

  const activeItem: RoadTripDialogueItem =
    ROAD_TRIP_DIALOGUES[selectedIdx % ROAD_TRIP_DIALOGUES.length]
  const localizedItem = localizeChineseData(activeItem, locale, CHINESE_SUPPORT_EN)
  const localizedDialogues = localizeChineseData(ROAD_TRIP_DIALOGUES, locale, CHINESE_SUPPORT_EN)

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handlePumpGas() {
    setGasPumped(true)
    onEarnXp(10)
    playCorrectSound()
    setTimeout(() => setGasPumped(false), 3000)
  }

  return (
    <div className="math-lab road-trip-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>⛽</span> {locale === 'en' ? 'Taiwan Road Trip and Car Rental Lab' : '台灣租車自駕與環島公路旅行實驗室 (Road Trip & Car Rental Lab)'}
          </h3>
          <p lang={locale === 'en' ? 'en' : 'ja'} className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {locale === 'en'
              ? 'Practise essential Mandarin for refuelling at CPC stations, collecting and inspecting a rental car, receipts, and safe road trips.'
              : '台湾一周（環島）ドライブ旅行！「中油加油站（九五加滿・載具統編）・レンタカー受け取り＆点検・蘇花改バイパス安全走行」を直感マスター！'}
          </p>
        </div>
      </div>

      {/* 台灣中油加油站即時喊單模擬器 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(16, 185, 129, 0.12))',
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
          <div style={{ fontSize: '1.8rem' }}>⛽ 🚗</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>{locale === 'en' ? 'CPC petrol-station order practice' : '中油加油站喊單模擬 (CPC Gas Station)'}</strong>
            <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {locale === 'en' ? <>Order: {fuelType} · {fuelAmount} · Save the receipt to a mobile barcode</> : <>口令：{fuelType}・{fuelAmount}・發票存載具</>}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            aria-label={locale === 'en' ? 'Fuel type' : '油品'}
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            style={{
              padding: '0.35rem 0.5rem',
              borderRadius: '6px',
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontSize: '0.78rem',
            }}
          >
            <option value="九二無鉛 (92)">九二無鉛 (92)</option>
            <option value="九五無鉛 (95 Octane)">九五無鉛 (95) ★一般房車推薦</option>
            <option value="九八無鉛 (98)">九八無鉛 (98)</option>
            <option value="超級柴油 (Diesel)">超級柴油 (柴油車專用)</option>
          </select>

          <select
            aria-label={locale === 'en' ? 'Fuel amount' : '加油金額'}
            value={fuelAmount}
            onChange={(e) => setFuelAmount(e.target.value)}
            style={{
              padding: '0.35rem 0.5rem',
              borderRadius: '6px',
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontSize: '0.78rem',
            }}
          >
            <option value="加滿 (Full Tank)">加滿 (Full Tank)</option>
            <option value="加五百元 (NT$ 500)">加五百元 (NT$ 500)</option>
            <option value="加一千元 (NT$ 1000)">加一千元 (NT$ 1000)</option>
            <option value="加二十公升 (20 Liters)">加二十公升 (20 Liters)</option>
          </select>

          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.76rem',
              background: gasPumped ? '#10b981' : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            }}
            onClick={handlePumpGas}
          >
            {gasPumped
              ? locale === 'en' ? '✓ Refuelling complete · Drive safely (+10 XP)' : '✓ 加油完成！祝行車平安 (+10 XP)'
              : locale === 'en' ? '⛽ Simulate a fuel order' : '⛽ 模擬喊單加油'}
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
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9', fontWeight: 700 }}>
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

        {/* 右側：自駕交通重要單詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'block' }}>
            {locale === 'en' ? '💡 Car-rental and road-trip tips' : '💡 台湾レンタカー・ドライブ必須知識（Road Trip Tips）'}
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {localizedItem.roadTripGlossary.map((vocab, vIdx) => (
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
