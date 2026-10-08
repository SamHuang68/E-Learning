import React, { useState } from 'react'
import { CHINESE_SUPPORT_EN, QINGMING_POPIAH_DIALOGUES, type QingmingPopiahDialogueItem } from '../data/qingmingPopiahZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'
import { localizeChineseData } from '../teachingCopy'

interface Props {
  onEarnXp: (amount: number) => void
}

interface PopiahIngredient {
  id: string
  nameZh: string
  nameJa: string
  icon: string
  descZh: string
  descJa: string
}

const POPIAH_INGREDIENTS: PopiahIngredient[] = [
  { id: 'peanut-powder', nameZh: '香濃花生糖粉 (防破皮吸水)', nameJa: 'ピーナッツ砂糖粉（水分ブロック）', icon: '🥜', descZh: '第一層必撒！甜香酥脆，吸收蔬菜湯汁保護薄餅皮！', descJa: '真っ先に敷き詰める！甘香ばしく野菜の水分を吸収して破れを防ぐ！' },
  { id: 'cabbage', nameZh: '清炒高麗菜與胡蘿蔔絲', nameJa: '炒めキャベツ＆人参の千切り', icon: '🥬', descZh: '清甜爽口，下鍋熱炒瀝乾水分，潤餅鮮甜基底！', descJa: 'シャキシャキの甘み、水分をしっかり切って入れる潤餅の主役！' },
  { id: 'pork', nameZh: '香煎紅糟五花肉與香腸', nameJa: '紅麹豚肉の素揚げ＆ソーセージ', icon: '🥓', descZh: '紅糟鹹甜香醇，五花肉外酥內嫩，肉香滿溢！', descJa: '紅麹の香ばしさとカリッと焼いた豚バラ肉のジューシーな旨味！' },
  { id: 'noodles-tofu', nameZh: '五香豆干絲與南部油麵條', nameJa: '五香押し豆腐＆南部風焼きそば（油麵）', icon: '🍜', descZh: '豆香十足嚼勁好，台南高雄特別豪邁加入油麵超飽足！', descJa: '風味豊かな押し豆腐に、台湾南部ならではの炒め麺でボリューム満点！' },
]

const POPIAH_INGREDIENT_EN: Record<string, { name: string; description: string }> = {
  'peanut-powder': { name: 'Peanut-sugar powder', description: 'Spread this first: it adds sweetness and crunch while absorbing vegetable moisture so the wrapper does not tear.' },
  cabbage: { name: 'Stir-fried cabbage and carrot', description: 'Lightly stir-fried and well drained, this crisp, sweet mixture forms the popiah base.' },
  pork: { name: 'Red-yeast pork belly and sausage', description: 'Sweet-savory red-yeast seasoning gives the crisp-edged pork belly a rich aroma.' },
  'noodles-tofu': { name: 'Five-spice tofu and southern oil noodles', description: 'Chewy shredded tofu and oil noodles make the southern Taiwan version especially substantial.' },
}

export const QingmingPopiahZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const { locale } = useI18n()
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [activeIngId, setActiveIngId] = useState<string>('peanut-powder')
  const [isRolling, setIsRolling] = useState(false)
  const [tombSwept, setTombSwept] = useState(false)

  const activeItem: QingmingPopiahDialogueItem =
    QINGMING_POPIAH_DIALOGUES[selectedIdx % QINGMING_POPIAH_DIALOGUES.length]
  const localizedItem = localizeChineseData(activeItem, locale, CHINESE_SUPPORT_EN)
  const localizedDialogues = localizeChineseData(QINGMING_POPIAH_DIALOGUES, locale, CHINESE_SUPPORT_EN)

  const currentIng = POPIAH_INGREDIENTS.find((i) => i.id === activeIngId) || POPIAH_INGREDIENTS[0]
  const currentIngEn = POPIAH_INGREDIENT_EN[currentIng.id]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleRollPopiah() {
    setIsRolling(true)
    playCorrectSound()
    onEarnXp(15)
    setTimeout(() => setIsRolling(false), 2500)
  }

  function handleSweepTomb() {
    setTombSwept((prev) => !prev)
    playCorrectSound()
    onEarnXp(15)
  }

  return (
    <div className="math-lab qingming-popiah-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🌱</span> {locale === 'en' ? 'Taiwan Qingming Tomb-Sweeping and Popiah Lab' : '台灣清明節掃墓祭祖與包潤餅實驗室 (Qingming Popiah Lab)'}
          </h3>
          <p lang={locale === 'en' ? 'en' : 'ja'} className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {locale === 'en'
              ? 'Practise Mandarin through Taiwan’s Qingming traditions: sweep ancestral tombs, secure tomb paper with stones, and assemble popiah with regional fillings.'
              : '台湾の春の伝統「清明節」！「掃墓壓墓紙慎終追遠・手作包潤餅撒花生糖粉・南部加炒油麵」を徹底マスター！'}
          </p>
        </div>
      </div>

      {/* 掃墓掛紙與潤餅手作儀表板 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(245, 158, 11, 0.12))',
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
          <div style={{ fontSize: '1.8rem' }}>{tombSwept ? '🪨📄' : '🌯 🥜'}</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>
              {locale === 'en' ? `Popiah Ingredient: ${currentIng.nameZh}` : `潤餅手作配料：${currentIng.nameZh}`}
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {isRolling
                ? locale === 'en' ? '🌯 Fold both sides inward and roll the popiah tightly into a full cylinder. (+15 XP)' : '🌯 兩手俐落將兩側往內摺、緊緊捲成飽滿圓柱形！大口咬下脆爽爆汁！(+15 XP)'
                : tombSwept
                ? locale === 'en' ? '🪨 Colored tomb paper is neatly secured with stones as a gesture of remembrance and respect for the ancestors. (+15 XP)' : '🪨 彩色墓紙已用石頭整齊壓在祖墳上，慎終追遠祈求祖德流芳庇佑子孫！(+15 XP)'
                : locale === 'en' ? currentIngEn.description : currentIng.descZh}
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
              background: isRolling ? '#10b981' : 'linear-gradient(135deg, #10b981, #059669)',
            }}
            onClick={handleRollPopiah}
          >
            {isRolling
              ? locale === 'en' ? '🌯 Popiah rolled' : '🌯 潤餅捲起完成'
              : locale === 'en' ? '🌯 Roll the popiah (+15 XP)' : '🌯 捲起整條飽滿潤餅 (+15 XP)'}
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.74rem',
              background: tombSwept ? '#10b981' : 'linear-gradient(135deg, #d97706, #b45309)',
            }}
            onClick={handleSweepTomb}
          >
            {tombSwept
              ? locale === 'en' ? '✓ Tomb paper secured' : '✓ 壓墓紙祭祖禮成'
              : locale === 'en' ? '🪨 Sweep the tomb and secure tomb paper (+15 XP)' : '🪨 掃墓培墓壓墓紙 (+15 XP)'}
          </button>
        </div>
      </div>

      {/* 潤餅食材選料卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', marginBottom: '0.85rem' }}>
        {POPIAH_INGREDIENTS.map((ing) => {
          const isSelected = ing.id === activeIngId
          return (
            <button aria-pressed={isSelected}
              key={ing.id}
              type="button"
              className={`practice-card ${isSelected ? 'active' : ''}`}
              style={{
                padding: '0.6rem 0.5rem',
                borderRadius: '10px',
                border: isSelected ? '2px solid #10b981' : '1px solid var(--line)',
                background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'var(--surface-soft)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                cursor: 'pointer',
              }}
              onClick={() => setActiveIngId(ing.id)}
            >
              <span style={{ fontSize: '1.4rem' }}>{ing.icon}</span>
              <strong style={{ fontSize: '0.78rem' }}>{ing.nameZh.split(' ')[0]}</strong>
              <span style={{ fontSize: '0.66rem', color: 'var(--muted)' }}>{locale === 'en' ? POPIAH_INGREDIENT_EN[ing.id].name : ing.nameJa.split('（')[0]}</span>
            </button>
          )
        })}
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
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700 }}>
              {localizedItem.locationZh} (<span lang={locale === 'en' ? 'en' : 'ja'}>{localizedItem.locationJa}</span>)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginTop: '0.3rem' }}>
            {localizedItem.dialogueLines.map((line, lIdx) => (
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
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669' }}>
                    <span lang={locale === 'en' ? 'en' : 'ja'}>{line.speakerJa}</span>:
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
                <span lang="zh-Latn" style={{ fontSize: '0.72rem', color: '#d97706' }}>{line.pinyin}</span>
                <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.1rem' }}>
                  {line.ja}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 右側：清明民俗名詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, display: 'block' }}>
            {locale === 'en' ? '💡 Taiwan Qingming and popiah tips' : '💡 台湾清明節・潤餅文化豆知識（Popiah Tips）'}
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {localizedItem.qingmingGlossary.map((vocab, vIdx) => (
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
                  <strong style={{ fontSize: '0.88rem', color: '#059669' }}>{vocab.termZh}</strong>
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
