import React, { useState } from 'react'
import { CHINESE_SUPPORT_EN, RECHAO_DIALOGUES, type RechaoDialogueItem } from '../data/rechaoZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'
import { localizeChineseData } from '../teachingCopy'

interface Props {
  onEarnXp: (amount: number) => void
}

export const RechaoZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const { locale } = useI18n()
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [dishes, setDishes] = useState<string[]>(['蔥爆牛肉', '三杯雞', '炒水蓮'])
  const [beerCount, setBeerCount] = useState(2)
  const [treated, setTreated] = useState(false)

  const activeItem: RechaoDialogueItem =
    RECHAO_DIALOGUES[selectedIdx % RECHAO_DIALOGUES.length]
  const localizedItem = localizeChineseData(activeItem, locale, CHINESE_SUPPORT_EN)
  const localizedDialogues = localizeChineseData(RECHAO_DIALOGUES, locale, CHINESE_SUPPORT_EN)

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleTreatBill() {
    setTreated(true)
    onEarnXp(10)
    playCorrectSound()
    setTimeout(() => setTreated(false), 3500)
  }

  function toggleDish(name: string) {
    if (dishes.includes(name)) {
      setDishes(dishes.filter((d) => d !== name))
    } else {
      setDishes([...dishes, name])
    }
  }

  return (
    <div className="math-lab rechao-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🍻</span> {locale === 'en' ? 'Taiwan Rechao Dining and Bill-Paying Culture Lab' : '台灣百元熱炒聚餐與搶買單文化實驗室 (Rechao Dining & Culture Lab)'}
          </h3>
          <p lang={locale === 'en' ? 'en' : 'ja'} className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {locale === 'en'
              ? 'Practise authentic Mandarin for a lively rechao meal: ordering shared dishes and Taiwan Beer, serving rice, and warmly competing to pay the bill.'
              : '台湾夜のソウルフード「熱炒（台湾居酒屋）」！「蔥爆牛肉・三杯雞・炒水蓮・金牌台啤・我請客搶買單」のリアル会話と人情味を完全制覇！'}
          </p>
        </div>
      </div>

      {/* 熱炒點菜與搶買單互動模擬器 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(239, 68, 68, 0.12))',
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
          <div style={{ fontSize: '1.8rem' }}>🍻 🍲</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>{locale === 'en' ? 'Taiwan Rechao Order' : '熱炒點菜單 (Taiwan Rechao Order)'}</strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {treated
                ? locale === 'en' ? '✓ You got the bill! “This meal is on me—your turn next time!” (+10 XP)' : '✓ 豪氣搶買單！「這頓算我的！下次換你請！」(+10 XP)'
                : locale === 'en' ? `${dishes.length} dishes · ${beerCount} bottles of Gold Medal beer · complimentary rice` : `已點 ${dishes.length} 道菜・金牌啤酒 ${beerCount} 瓶・白飯免費`}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {['蔥爆牛肉', '三杯雞', '炒水蓮', '鳳梨蝦球', '蒜泥白肉'].map((d) => (
            <button aria-pressed={dishes.includes(d)}
              key={d}
              type="button"
              className={`pill-btn ${dishes.includes(d) ? 'active' : ''}`}
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem' }}
              onClick={() => toggleDish(d)}
            >
              {dishes.includes(d) ? '✓ ' : '+ '}{d}
            </button>
          ))}

          <button
            type="button"
            className="pill-btn"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem' }}
            onClick={() => setBeerCount((c) => Math.min(12, c + 1))}
          >
            🍻 {locale === 'en' ? 'Beer' : '啤酒'} +1 ({beerCount})
          </button>

          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.76rem',
              background: treated ? '#10b981' : 'linear-gradient(135deg, #eab308, #ca8a04)',
            }}
            onClick={handleTreatBill}
          >
            {treated
              ? locale === 'en' ? 'Paid successfully' : '結帳成功'
              : locale === 'en' ? '💵 Reach for the bill—my treat!' : '💵 掏錢包搶買單！我請客！'}
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

        {/* 右側：熱炒文化重要單詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'block' }}>
            {locale === 'en' ? '💡 Rechao dining and etiquette tips' : '💡 台湾熱炒文化・マナーの極意（Rechao Dining Tips）'}
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {localizedItem.rechaoGlossary.map((vocab, vIdx) => (
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
