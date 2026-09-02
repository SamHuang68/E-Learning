import React, { useState } from 'react'
import { YUELAO_LOVE_DIALOGUES, type YuelaoLoveDialogueItem } from '../data/yuelaoLoveZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

interface YuelaoOffering {
  id: string
  nameZh: string
  nameJa: string
  icon: string
  symbolZh: string
  symbolJa: string
}

const YUELAO_OFFERINGS: YuelaoOffering[] = [
  { id: 'red-dates', nameZh: '紅棗與枸杞', nameJa: '乾燥ナツメ＆クコの実', icon: '🍒', symbolZh: '象徵「早日結良緣、添人氣顧眼睛」！', symbolJa: '「早日良縁」「健康・人気運上昇」を象徴！' },
  { id: 'longan', nameZh: '福圓桂圓肉', nameJa: 'ドライ竜眼（福円）', icon: '🟤', symbolZh: '象徵「圓圓滿滿、貴人相助」！', symbolJa: '「万事円満」「良縁・福徳円満」を祈願！' },
  { id: 'candy', nameZh: '雙喜巧克力與喜糖', nameJa: '婚礼用キャンディ・チョコ', icon: '🍬', symbolZh: '象徵「月老嘴甜甜、感情甜甜蜜蜜」！', symbolJa: '「月老様に甘い言葉を」「恋人同士甘い関係」！' },
  { id: 'ribbon-coin', nameZh: '姻緣紅線與鉛錢', nameJa: '赤い糸＆鉛銭（結縁のお守り）', icon: '🧧', symbolZh: '過香爐順時針三圈收進皮夾隨身攜帶！', symbolJa: '香炉の上で時計回りに3周回して財布に納める！' },
]

export const YuelaoLoveZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [activeOffId, setActiveOffId] = useState<string>('ribbon-coin')
  const [isPassingFurnace, setIsPassingFurnace] = useState(false)
  const [jiaobeiResult, setJiaobeiResult] = useState<string | null>(null)

  const activeItem: YuelaoLoveDialogueItem =
    YUELAO_LOVE_DIALOGUES[selectedIdx % YUELAO_LOVE_DIALOGUES.length]

  const currentOffering = YUELAO_OFFERINGS.find((o) => o.id === activeOffId) || YUELAO_OFFERINGS[0]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handlePassFurnace() {
    setIsPassingFurnace(true)
    playCorrectSound()
    onEarnXp(15)
    setTimeout(() => setIsPassingFurnace(false), 2500)
  }

  function handleCastJiaobei() {
    setJiaobeiResult('聖筊 (一正一反)！月老微笑應允，牽起命中注定的紅線！')
    playCorrectSound()
    onEarnXp(15)
  }

  return (
    <div className="math-lab yuelao-love-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🏮</span> 台灣七夕霞海城隍廟月老求紅線實驗室 (Yuelao Love Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            台湾のロマンチックな伝統信仰「七夕・月下老人」！「迪化街霞海城隍廟・求紅線鉛錢過香爐・擲筊聖筊求良緣」を徹底マスター！
          </p>
        </div>
      </div>

      {/* 月老求紅線與過香爐儀表板 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(239, 68, 68, 0.12))',
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
          <div style={{ fontSize: '1.8rem' }}>{isPassingFurnace ? '✨🧧' : jiaobeiResult ? '🎉🙏' : '🏮 ❤️'}</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>
              月老供品靈驗祈願：{currentOffering.nameZh}
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {isPassingFurnace
                ? '✨ 紅線與鉛錢在香爐香煙上方順時針繞三圈！神明加持靈氣充沛，隨身攜帶！(+15 XP)'
                : jiaobeiResult
                ? `🎉 ${jiaobeiResult} (+15 XP)`
                : `${currentOffering.symbolZh}`}
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
              background: isPassingFurnace ? '#10b981' : 'linear-gradient(135deg, #ec4899, #db2777)',
            }}
            onClick={handlePassFurnace}
          >
            {isPassingFurnace ? '✨ 順時針過香爐中' : '🧧 紅線過香爐繞三圈 (+15 XP)'}
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.74rem',
              background: jiaobeiResult ? '#10b981' : 'linear-gradient(135deg, #ef4444, #b91c1c)',
            }}
            onClick={handleCastJiaobei}
          >
            {jiaobeiResult ? '✓ 聖筊求得良緣' : '🙏 向月老擲筊求良緣 (+15 XP)'}
          </button>
        </div>
      </div>

      {/* 供品選擇卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', marginBottom: '0.85rem' }}>
        {YUELAO_OFFERINGS.map((off) => {
          const isSelected = off.id === activeOffId
          return (
            <button
              key={off.id}
              type="button"
              className={`practice-card ${isSelected ? 'active' : ''}`}
              style={{
                padding: '0.6rem 0.5rem',
                borderRadius: '10px',
                border: isSelected ? '2px solid #ec4899' : '1px solid var(--line)',
                background: isSelected ? 'rgba(236, 72, 153, 0.12)' : 'var(--surface-soft)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                cursor: 'pointer',
              }}
              onClick={() => setActiveOffId(off.id)}
            >
              <span style={{ fontSize: '1.4rem' }}>{off.icon}</span>
              <strong style={{ fontSize: '0.78rem' }}>{off.nameZh.split('與')[0]}</strong>
              <span style={{ fontSize: '0.66rem', color: 'var(--muted)' }}>{off.nameJa.split('（')[0]}</span>
            </button>
          )
        })}
      </div>

      {/* 場景切換膠囊 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        {YUELAO_LOVE_DIALOGUES.map((item, idx) => (
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
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', fontWeight: 700 }}>
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
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ec4899' }}>
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

        {/* 右側：月老民俗名詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#ec4899', fontWeight: 700, display: 'block' }}>
            💡 台湾月下老人・縁結び豆知識（Yuelao Tips）
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {activeItem.yuelaoGlossary.map((vocab, vIdx) => (
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
                  <strong style={{ fontSize: '0.88rem', color: '#ec4899' }}>{vocab.termZh}</strong>
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
