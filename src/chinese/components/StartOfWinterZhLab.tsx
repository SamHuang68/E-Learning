import React, { useState } from 'react'
import { START_OF_WINTER_DIALOGUES, type StartOfWinterDialogueItem } from '../data/startOfWinterZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

interface TonicDishItem {
  id: string
  nameZh: string
  nameJa: string
  icon: string
  descZh: string
  descJa: string
}

const TONIC_DISHES: TonicDishItem[] = [
  { id: 'ginger-duck', nameZh: '炭火陶鍋薑母鴨', nameJa: '炭火土鍋の生姜鴨鍋（薑母鴨）', icon: '🦆', descZh: '老薑黑麻油煸香番鴨肉，全酒米酒滾煮，沾豆腐乳醬！', descJa: 'ひね生姜と黒胡麻油で炒めた鴨肉を米酒で煮込む！発酵豆腐タレが絶品！' },
  { id: 'sesame-chicken', nameZh: '濃醇全酒麻油雞', nameJa: '濃厚米酒仕立ての胡麻油鶏（麻油雞）', icon: '🍲', descZh: '放山土雞腿肉吸飽黑麻油老薑精華，驅寒暖胃第一名！', descJa: '地鶏の旨味と黒胡麻油・生姜が凝縮した冬の定番温活スープ！' },
  { id: 'mutton-hotpot', nameZh: '溪湖清燉帶皮羊肉爐', nameJa: '彰化渓湖の皮付き羊肉鍋（羊肉爐）', icon: '🐑', descZh: '當歸中藥清湯熬煮帶皮羊肉，溫補不燥熱、Q彈鮮美！', descJa: '漢方スープで煮込んだ柔らかい皮付き羊肉！体を芯から温める！' },
  { id: 'duck-noodles', nameZh: '鴨油蔥酥手工麵線', nameJa: 'アヒル油と揚げネギの素麺（麵線）', icon: '🍜', descZh: '熱騰騰細麵線拌入薑母鴨油與油蔥酥，香氣直衝腦門！', descJa: '鴨の旨味油とフライドエシャロットを和えた絶品サイドメニュー！' },
]

export const StartOfWinterZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [activeDishId, setActiveDishId] = useState<string>('ginger-duck')
  const [isSimmering, setIsSimmering] = useState(false)
  const [dippedSauce, setDippedSauce] = useState(false)

  const activeItem: StartOfWinterDialogueItem =
    START_OF_WINTER_DIALOGUES[selectedIdx % START_OF_WINTER_DIALOGUES.length]

  const currentDish = TONIC_DISHES.find((d) => d.id === activeDishId) || TONIC_DISHES[0]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleSimmerPot() {
    setIsSimmering(true)
    playCorrectSound()
    onEarnXp(15)
    setTimeout(() => setIsSimmering(false), 2500)
  }

  function handleDipSauce() {
    setDippedSauce((prev) => !prev)
    playCorrectSound()
    onEarnXp(15)
  }

  return (
    <div className="math-lab start-of-winter-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🦆</span> 台灣立冬補冬炭火薑母鴨實驗室 (Start of Winter Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            台湾の冬の風物詩「立冬補冬、補嘴空」！「炭火陶鍋薑母鴨・拌鴨油手工麵線・沾濃香豆腐乳醬・麻油雞」を徹底マスター！
          </p>
        </div>
      </div>

      {/* 補冬儀表板 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.12), rgba(217, 119, 6, 0.12))',
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
          <div style={{ fontSize: '1.8rem' }}>{isSimmering ? '🔥🍲' : dippedSauce ? '🥢 😋' : '🦆 🫕'}</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>
              立冬進補美饌：{currentDish.nameZh}
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {isSimmering
                ? '🔥 紅泥炭火木炭燒得通紅！陶鍋中黑麻油米酒與老薑大滾，香氣四溢暖人心脾！(+15 XP)'
                : dippedSauce
                ? '🥢 鴨肉沾滿特調甘甜豆腐乳醬與辣椒醬油！肉質緊實彈牙，甘甜濃醇！(+15 XP)'
                : `${currentDish.descZh}`}
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
              background: isSimmering ? '#10b981' : 'linear-gradient(135deg, #dc2626, #b91c1c)',
            }}
            onClick={handleSimmerPot}
          >
            {isSimmering ? '🔥 陶鍋滾煮沸騰中' : '🍲 炭火大滾薑母鴨 (+15 XP)'}
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.74rem',
              background: dippedSauce ? '#10b981' : 'linear-gradient(135deg, #d97706, #b45309)',
            }}
            onClick={handleDipSauce}
          >
            {dippedSauce ? '✓ 沾醬美味享用' : '🥢 沾特調豆腐乳醬 (+15 XP)'}
          </button>
        </div>
      </div>

      {/* 補冬名物卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', marginBottom: '0.85rem' }}>
        {TONIC_DISHES.map((dish) => {
          const isSelected = dish.id === activeDishId
          return (
            <button
              key={dish.id}
              type="button"
              className={`practice-card ${isSelected ? 'active' : ''}`}
              style={{
                padding: '0.6rem 0.5rem',
                borderRadius: '10px',
                border: isSelected ? '2px solid #dc2626' : '1px solid var(--line)',
                background: isSelected ? 'rgba(220, 38, 38, 0.12)' : 'var(--surface-soft)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                cursor: 'pointer',
              }}
              onClick={() => setActiveDishId(dish.id)}
            >
              <span style={{ fontSize: '1.4rem' }}>{dish.icon}</span>
              <strong style={{ fontSize: '0.78rem' }}>{dish.nameZh.slice(0, 6)}</strong>
              <span style={{ fontSize: '0.66rem', color: 'var(--muted)' }}>{dish.nameJa.split('（')[0]}</span>
            </button>
          )
        })}
      </div>

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {START_OF_WINTER_DIALOGUES.map((item, idx) => (
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
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(220, 38, 38, 0.15)', color: '#dc2626', fontWeight: 700 }}>
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
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#dc2626' }}>
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

        {/* 右側：補冬民俗名詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#dc2626', fontWeight: 700, display: 'block' }}>
            💡 台湾立冬補冬・冬鍋文化豆知識（Winter Tonic Tips）
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {activeItem.winterTonicGlossary.map((vocab, vIdx) => (
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
                  <strong style={{ fontSize: '0.88rem', color: '#dc2626' }}>{vocab.termZh}</strong>
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
