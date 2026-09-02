import React, { useState } from 'react'
import { MID_AUTUMN_DIALOGUES, type MidAutumnDialogueItem } from '../data/midAutumnZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

interface BbqIngredient {
  id: string
  nameZh: string
  nameJa: string
  icon: string
  descZh: string
  descJa: string
}

const BBQ_INGREDIENTS: BbqIngredient[] = [
  { id: 'pork-toast', nameZh: '烤豬肉片夾白吐司', nameJa: '食パン挟み豚焼き肉', icon: '🥪', descZh: '刷上鹹甜烤肉醬炭烤，夾進鬆軟吐司，台灣中秋靈魂！', descJa: '甘辛いタレで焼き上げた豚肉を食パンに挟む台湾BBQの魂！' },
  { id: 'sausage', nameZh: '蒜香黑豬肉香腸', nameJa: 'ニンニク風味台湾ソーセージ', icon: '🌭', descZh: '炭火烤到外皮焦脆爆汁，配生大蒜一起咬超對味！', descJa: '炭火でパリッと焼き、生のニンニク片と一緒にかじるのが台湾流！' },
  { id: 'corn', nameZh: '炭烤甜玉米 (刷沙茶醬)', nameJa: '焼きとうもろこし（沙茶醤ダレ）', icon: '🌽', descZh: '沙茶醬、醬油膏與花生粉多層次塗刷，焦香四溢！', descJa: '沙茶醤と醤油の香ばしいタレを重ね塗りした屋台の味！' },
  { id: 'tempura', nameZh: '炭烤甜不辣與米血糕', nameJa: 'さつま揚げ＆豚の血もち（米血糕）', icon: '🍢', descZh: '甜不辣烤到膨脹金黃酥脆，米血糕外酥內軟Q彈！', descJa: 'ぷっくり膨らんださつま揚げと外カリ中モチの米血糕！' },
]

export const MidAutumnZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [activeBbqId, setActiveBbqId] = useState<string>('pork-toast')
  const [isSizzling, setIsSizzling] = useState(false)
  const [pomeloHatWorn, setPomeloHatWorn] = useState(false)

  const activeItem: MidAutumnDialogueItem =
    MID_AUTUMN_DIALOGUES[selectedIdx % MID_AUTUMN_DIALOGUES.length]

  const currentBbq = BBQ_INGREDIENTS.find((b) => b.id === activeBbqId) || BBQ_INGREDIENTS[0]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleGrillBbq() {
    setIsSizzling(true)
    playCorrectSound()
    onEarnXp(15)
    setTimeout(() => setIsSizzling(false), 2500)
  }

  function handleWearPomeloHat() {
    setPomeloHatWorn((prev) => !prev)
    playCorrectSound()
    onEarnXp(15)
  }

  return (
    <div className="math-lab mid-autumn-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🌕</span> 台灣中秋節騎樓烤肉與柚子帽實驗室 (Mid-Autumn BBQ Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            台湾の秋の風物詩「中秋節」！「騎樓炭火烤肉夾吐司・麻豆文旦戴柚子帽求保佑・彰化排隊蛋黃酥」を徹底マスター！
          </p>
        </div>
      </div>

      {/* 騎樓烤肉與文旦柚子帽儀表板 */}
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
          <div style={{ fontSize: '1.8rem' }}>{pomeloHatWorn ? '🍈👑' : '🔥 🥩'}</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>
              騎樓炭烤：{currentBbq.nameZh} {pomeloHatWorn && '＋ 戴上綠色文旦柚子帽！'}
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {isSizzling
                ? '🔥 炭火滋滋作響！烤肉醬香氣撲鼻，肉片焦香夾入吐司大口咬下！(+15 XP)'
                : pomeloHatWorn
                ? '👑 文旦皮剪成尖頂帽子戴在頭上，保佑整年吉祥健康又可愛！(+15 XP)'
                : `${currentBbq.descZh}`}
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
              background: isSizzling ? '#10b981' : 'linear-gradient(135deg, #ef4444, #dc2626)',
            }}
            onClick={handleGrillBbq}
          >
            {isSizzling ? '🔥 炭火翻烤中...' : '🔥 刷烤肉醬・炭火翻烤 (+15 XP)'}
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.74rem',
              background: pomeloHatWorn ? '#10b981' : 'linear-gradient(135deg, #84cc16, #65a30d)',
            }}
            onClick={handleWearPomeloHat}
          >
            {pomeloHatWorn ? '✓ 柚子帽戴好保佑' : '🍈 剝文旦・戴柚子帽 (+15 XP)'}
          </button>
        </div>
      </div>

      {/* 烤肉食材選擇卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', marginBottom: '0.85rem' }}>
        {BBQ_INGREDIENTS.map((bbq) => {
          const isSelected = bbq.id === activeBbqId
          return (
            <button
              key={bbq.id}
              type="button"
              className={`practice-card ${isSelected ? 'active' : ''}`}
              style={{
                padding: '0.6rem 0.5rem',
                borderRadius: '10px',
                border: isSelected ? '2px solid #ef4444' : '1px solid var(--line)',
                background: isSelected ? 'rgba(239, 68, 68, 0.12)' : 'var(--surface-soft)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                cursor: 'pointer',
              }}
              onClick={() => setActiveBbqId(bbq.id)}
            >
              <span style={{ fontSize: '1.4rem' }}>{bbq.icon}</span>
              <strong style={{ fontSize: '0.78rem' }}>{bbq.nameZh.split(' ')[0]}</strong>
              <span style={{ fontSize: '0.66rem', color: 'var(--muted)' }}>{bbq.nameJa.split('（')[0]}</span>
            </button>
          )
        })}
      </div>

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {MID_AUTUMN_DIALOGUES.map((item, idx) => (
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
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f59e0b' }}>
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

        {/* 右側：中秋民俗名詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#d97706', fontWeight: 700, display: 'block' }}>
            💡 台湾中秋節・路上バーベキュー文化豆知識（BBQ Tips）
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {activeItem.midAutumnGlossary.map((vocab, vIdx) => (
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
