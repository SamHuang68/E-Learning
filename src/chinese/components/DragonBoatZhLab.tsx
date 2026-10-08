import React, { useState } from 'react'
import { CHINESE_SUPPORT_EN, DRAGON_BOAT_DIALOGUES, type DragonBoatDialogueItem } from '../data/dragonBoatZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'
import { localizeChineseData } from '../teachingCopy'

interface Props {
  onEarnXp: (amount: number) => void
}

interface ZongziStyle {
  id: string
  nameZh: string
  nameJa: string
  color: string
  descZh: string
  descJa: string
  featureTags: string[]
}

const ZONGZI_STYLES: ZongziStyle[] = [
  {
    id: 'south',
    nameZh: '南部水煮粽 (軟糯綿密)',
    nameJa: '南部風水煮ちまき（もちもち濃厚）',
    color: '#059669',
    descZh: '生糯米包裹五花肉栗子蛋黃，大火滾水慢煮數小時，綿密軟糯，淋甜辣醬撒花生粉！',
    descJa: '生の餅米を具と共に包み、お湯でじっくり茹で上げる。とろみ醤油とピーナッツ粉が絶品！',
    featureTags: ['生米水煮', '軟糯綿密', '花生粉＋醬油膏', '竹麻竹葉清香'],
  },
  {
    id: 'north',
    nameZh: '北部油飯蒸粽 (粒粒分明)',
    nameJa: '北部風蒸しちまき（香ばしいおこわ）',
    color: '#d97706',
    descZh: '熟糯米先與油蔥酥、香菇蝦米爆炒入味，包入粽葉上蒸籠大火蒸熟，米粒Q彈有嚼勁！',
    descJa: '油蔥酥と具材で炒め合わせた味付けおこわを蒸籠で蒸す。米粒が立ち香ばしい！',
    featureTags: ['熟米油飯', '大火蒸熟', '粒粒分明Q彈', '油蔥酥胡椒香'],
  },
  {
    id: 'hakkas',
    nameZh: '客家粄粽 (香Q粿皮)',
    nameJa: '客家風お餅ちまき（粄粽）',
    color: '#8b5cf6',
    descZh: '糯米漿揉成Q彈粿糰，包入菜脯香菇豬肉碎餡，蒸熟後外皮鹹甜晶瑩，口感極佳！',
    descJa: '餅米の粉を練ったお餅の皮で干し大根や椎茸の餡を包む。つるんとした食感が格別！',
    featureTags: ['糯米粿皮', '客家菜脯香', '晶瑩剔透', '香鹹爽口'],
  },
  {
    id: 'alkaline',
    nameZh: '冰涼甜鹼粽 (蜂蜜紅豆)',
    nameJa: 'ひんやり冷やし甘口アルカリちまき（鹼粽）',
    color: '#f59e0b',
    descZh: '金黃半透明如同琥珀果凍，冷藏後冰涼滑嫩，沾砂糖、蜂蜜或包蜜紅豆餡消暑！',
    descJa: '黄金色に透き通るゼリー状のちまき。冷やして蜂蜜や砂糖をつけて食べる夏のデザート！',
    featureTags: ['琥珀晶瑩', '冰涼消暑', '沾蜂蜜果糖', '紅豆甜餡'],
  },
]

const ZONGZI_STYLE_EN: Record<string, { name: string; description: string; features: string[] }> = {
  south: { name: 'Southern boiled zongzi', description: 'Raw glutinous rice and fillings are wrapped, slowly boiled until soft, then served with sweet chili sauce and peanut powder.', features: ['Boiled from raw rice', 'Soft and cohesive'] },
  north: { name: 'Northern steamed zongzi', description: 'Seasoned cooked glutinous rice is stir-fried with shallots and fillings, wrapped, and steamed for distinct, chewy grains.', features: ['Seasoned cooked rice', 'Steamed until springy'] },
  hakkas: { name: 'Hakka ban zong', description: 'A chewy rice-flour wrapper encloses preserved radish, mushrooms, and pork before steaming.', features: ['Rice-flour wrapper', 'Preserved-radish filling'] },
  alkaline: { name: 'Chilled sweet alkaline zongzi', description: 'A translucent golden dessert zongzi served chilled with sugar, honey, or sweet red bean.', features: ['Translucent amber color', 'Chilled summer dessert'] },
}

export const DragonBoatZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const { locale } = useI18n()
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [activeZongziId, setActiveZongziId] = useState<string>('south')
  const [eggStanding, setEggStanding] = useState(false)
  const [isCookingZongzi, setIsCookingZongzi] = useState(false)

  const activeItem: DragonBoatDialogueItem =
    DRAGON_BOAT_DIALOGUES[selectedIdx % DRAGON_BOAT_DIALOGUES.length]
  const localizedItem = localizeChineseData(activeItem, locale, CHINESE_SUPPORT_EN)
  const localizedDialogues = localizeChineseData(DRAGON_BOAT_DIALOGUES, locale, CHINESE_SUPPORT_EN)

  const currentZongzi = ZONGZI_STYLES.find((z) => z.id === activeZongziId) || ZONGZI_STYLES[0]
  const currentZongziEn = ZONGZI_STYLE_EN[currentZongzi.id]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleStandEgg() {
    setEggStanding(true)
    playCorrectSound()
    onEarnXp(15)
  }

  function handleCookZongzi() {
    setIsCookingZongzi(true)
    playCorrectSound()
    onEarnXp(15)
    setTimeout(() => setIsCookingZongzi(false), 2500)
  }

  return (
    <div className="math-lab dragon-boat-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🛶</span> {locale === 'en' ? 'Taiwan Dragon Boat Festival Lab' : '台灣端午節正午立蛋與南北粽實驗室 (Dragon Boat Lab)'}
          </h3>
          <p lang={locale === 'en' ? 'en' : 'ja'} className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {locale === 'en'
              ? 'Practise Mandarin through Taiwan’s Dragon Boat Festival: stand an egg at noon, compare southern and northern zongzi, and learn the mugwort-and-calamus custom.'
              : '台湾の初夏「端午節」！「正午立蛋求好運・南部水煮粽vs北部油飯蒸粽大論戰・門插艾草菖蒲辟邪」を徹底マスター！'}
          </p>
        </div>
      </div>

      {/* 端午立蛋與南北粽儀表板 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.12), rgba(217, 119, 6, 0.12))',
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
          <div style={{ fontSize: '1.8rem' }}>{eggStanding ? '🥚✨' : '🛶 🌿'}</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>
              {locale === 'en' ? `Dragon Boat Festival Experience: ${currentZongzi.nameZh}` : `端午節慶體驗：${currentZongzi.nameZh}`}
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {eggStanding
                ? locale === 'en' ? '🎉 The egg stands upright at noon. May good luck continue all year. (+15 XP)' : '🎉 雞蛋在正午 12 點神奇直立起來了！陽氣充滿，一整年好運連連！(+15 XP)'
                : isCookingZongzi
                ? locale === 'en' ? '♨️ The zongzi are cooked and fragrant. Serve them hot with thick soy sauce. (+15 XP)' : '♨️ 粽葉飄香！熱騰騰粽子出爐，香氣四溢！快淋上醬油膏開吃囉！(+15 XP)'
                : locale === 'en' ? currentZongziEn.description : currentZongzi.descZh}
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
              background: eggStanding ? '#10b981' : 'linear-gradient(135deg, #f59e0b, #d97706)',
            }}
            onClick={handleStandEgg}
          >
            {eggStanding
              ? locale === 'en' ? '✓ Egg standing successfully' : '✓ 雞蛋直立成功！'
              : locale === 'en' ? '🥚 Stand an egg at noon (+15 XP)' : '🥚 正午 12 點挑戰立蛋 (+15 XP)'}
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.74rem',
              background: isCookingZongzi ? '#10b981' : 'linear-gradient(135deg, #059669, #047857)',
            }}
            onClick={handleCookZongzi}
          >
            {isCookingZongzi
              ? locale === 'en' ? '♨️ Zongzi are ready' : '♨️ 粽葉飄香起鍋'
              : locale === 'en' ? '🌿 Cook the zongzi (+15 XP)' : '🌿 下鍋蒸煮粽子 (+15 XP)'}
          </button>
        </div>
      </div>

      {/* 粽子風味選擇卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', marginBottom: '0.85rem' }}>
        {ZONGZI_STYLES.map((zongzi) => {
          const isSelected = zongzi.id === activeZongziId
          return (
            <button aria-pressed={isSelected}
              key={zongzi.id}
              type="button"
              className={`practice-card ${isSelected ? 'active' : ''}`}
              style={{
                padding: '0.6rem 0.5rem',
                borderRadius: '10px',
                border: isSelected ? `2px solid ${zongzi.color}` : '1px solid var(--line)',
                background: isSelected ? 'rgba(5, 150, 105, 0.12)' : 'var(--surface-soft)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                cursor: 'pointer',
              }}
              onClick={() => setActiveZongziId(zongzi.id)}
            >
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: zongzi.color }} />
              <strong style={{ fontSize: '0.78rem' }}>{zongzi.nameZh.split(' ')[0]}</strong>
              <span style={{ fontSize: '0.66rem', color: 'var(--muted)' }}>{locale === 'en' ? ZONGZI_STYLE_EN[zongzi.id].name : zongzi.nameJa.split('（')[0]}</span>
              <div style={{ display: 'flex', gap: '0.2rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.2rem' }}>
                {(locale === 'en' ? ZONGZI_STYLE_EN[zongzi.id].features : zongzi.featureTags.slice(0, 2)).map((tag, tIdx) => (
                  <span key={tIdx} style={{ fontSize: '0.62rem', background: 'rgba(5, 150, 105, 0.15)', color: '#059669', padding: '0.05rem 0.3rem', borderRadius: '4px' }}>
                    {tag}
                  </span>
                ))}
              </div>
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
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(5, 150, 105, 0.15)', color: '#059669', fontWeight: 700 }}>
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

        {/* 右側：端午民俗名詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, display: 'block' }}>
            {locale === 'en' ? '💡 Taiwan Dragon Boat Festival and zongzi tips' : '💡 台湾端午節・ちまき文化豆知識（Dragon Boat Tips）'}
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {localizedItem.dragonBoatGlossary.map((vocab, vIdx) => (
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
