import React, { useState } from 'react'
import { CHINESE_SUPPORT_EN, ZHUAZHOU_DIALOGUES, type ZhuazhouDialogueItem } from '../data/zhuazhouZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'
import { localizeChineseData } from '../teachingCopy'

interface Props {
  onEarnXp: (amount: number) => void
}

interface ZhuazhouProp {
  id: string
  nameZh: string
  nameJa: string
  nameEn: string
  icon: string
  careerZh: string
  careerJa: string
  careerEn: string
  blessingZh: string
}

const ZHUAZHOU_PROPS: ZhuazhouProp[] = [
  { id: 'stethoscope', nameZh: '聽診器', nameJa: '聴診器', nameEn: 'Stethoscope', icon: '🩺', careerZh: '仁心良醫・濟世救人', careerJa: '医師・医療従事者', careerEn: 'physician or healthcare professional', blessingZh: '妙手回春，守護全民健康！' },
  { id: 'abacus', nameZh: '算盤', nameJa: 'そろばん', nameEn: 'Abacus', icon: '🧮', careerZh: '精算會計・金融巨擘', careerJa: '公認会計士・金融エキスパート', careerEn: 'accountant or finance expert', blessingZh: '日進斗金，算盤一響黃金萬兩！' },
  { id: 'gold-ingot', nameZh: '金元寶', nameJa: '金元宝（金のインゴット）', nameEn: 'Gold ingot', icon: '🪙', careerZh: '富甲一方・商業領袖', careerJa: '実業家・起業家', careerEn: 'business leader or entrepreneur', blessingZh: '招財進寶，富貴榮華一生吉祥！' },
  { id: 'mouse', nameZh: '科技滑鼠', nameJa: 'PCマウス', nameEn: 'Computer mouse', icon: '🖱️', careerZh: '高科技新貴・AI工程師', careerJa: 'ITエンジニア・先端科学者', careerEn: 'technology or AI professional', blessingZh: '科技創新，引領人工智慧時代！' },
  { id: 'brush', nameZh: '文房毛筆', nameJa: '毛筆・筆', nameEn: 'Calligraphy brush', icon: '🖌️', careerZh: '當代文豪・學界名宿', careerJa: '学者・作家・教授', careerEn: 'scholar, writer, or professor', blessingZh: '下筆有神，才高八斗學富五車！' },
  { id: 'chicken-drumstick', nameZh: '滷大雞腿', nameJa: '大きな骨付き鶏もも肉', nameEn: 'Braised chicken drumstick', icon: '🍗', careerZh: '豐衣足食・頂級名廚', careerJa: '食の巨匠・一生食べ物に困らない', careerEn: 'chef with a life of abundance', blessingZh: '衣食無憂，有口福一生享福氣！' },
]

export const ZhuazhouZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const { locale } = useI18n()
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [steppedTurtle, setSteppedTurtle] = useState(false)
  const [selectedPropId, setSelectedPropId] = useState<string>('stethoscope')
  const [blessed, setBlessed] = useState(false)

  const activeItem: ZhuazhouDialogueItem =
    ZHUAZHOU_DIALOGUES[selectedIdx % ZHUAZHOU_DIALOGUES.length]
  const localizedItem = localizeChineseData(activeItem, locale, CHINESE_SUPPORT_EN)
  const localizedDialogues = localizeChineseData(ZHUAZHOU_DIALOGUES, locale, CHINESE_SUPPORT_EN)

  const activeProp = ZHUAZHOU_PROPS.find((p) => p.id === selectedPropId) || ZHUAZHOU_PROPS[0]

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleStepTurtle() {
    setSteppedTurtle(true)
    onEarnXp(10)
    playCorrectSound()
  }

  function handlePickProp(propId: string) {
    setSelectedPropId(propId)
    setBlessed(true)
    onEarnXp(15)
    playCorrectSound()
    setTimeout(() => setBlessed(false), 3000)
  }

  return (
    <div className="math-lab zhuazhou-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>👶</span> {locale === 'en' ? 'Taiwan First-Birthday Zhuazhou Lab' : '台灣度晬抓周與腳踏紅龜粿民俗實驗室 (Taiwanese Zhuazhou Lab)'}
          </h3>
          <p lang={locale === 'en' ? 'en' : 'ja'} className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {locale === 'en'
              ? 'Practise Mandarin through Taiwan’s first-birthday customs: the tiger hat, stepping on a red tortoise cake, and choosing an object from the bamboo tray.'
              : '台湾の赤ちゃんの満1歳のお祝い「度晬＆抓周」！「虎頭帽・脚踏亀（紅龜粿踏みで長寿祈願）・米篩選び取り占い」をリアル体験！'}
          </p>
        </div>
      </div>

      {/* 抓周米篩儀表板 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(245, 158, 11, 0.12))',
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
          <div style={{ fontSize: '1.8rem' }}>🐢 👶</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>{locale === 'en' ? 'Zhuazhou Bamboo Tray' : '抓周圓米篩舞台 (Zhuazhou Bamboo Tray)'}</strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {blessed
                ? locale === 'en'
                  ? `🎊 The baby chose ${activeProp.nameZh} (${activeProp.nameEn}), suggesting a future as a ${activeProp.careerEn}. (+15 XP)`
                  : `🎊 寶寶抓到「${activeProp.nameZh}」！預測志向：${activeProp.careerZh}！(+15 XP)`
                : steppedTurtle
                ? locale === 'en' ? '🐢 Red tortoise cake stepped on: wish the baby longevity and prosperity, then choose an object from the tray.' : '🐢 已腳踏紅龜粿！祝福長命百歲、大富大貴！快讓寶寶抓取米篩道具！'
                : locale === 'en' ? 'First put on the tiger hat, step on the red tortoise cake, and then begin the zhuazhou selection.' : '先戴上虎頭帽、腳踩紅龜粿（腳踏龜），再抱入大米篩開始抓周！'}
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
              background: steppedTurtle ? '#10b981' : 'linear-gradient(135deg, #ec4899, #db2777)',
            }}
            onClick={handleStepTurtle}
          >
            {steppedTurtle
              ? locale === 'en' ? '✓ Red tortoise cake stepped on (+10 XP)' : '✓ 已腳踏紅龜粿 (+10 XP)'
              : locale === 'en' ? '🐢 Step on the red tortoise cake' : '🐢 腳踏紅龜粿 (祈願長壽)'}
          </button>
        </div>
      </div>

      {/* 抓周六大道具選擇區 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem', marginBottom: '0.85rem' }}>
        {ZHUAZHOU_PROPS.map((p) => (
          <button aria-pressed={selectedPropId === p.id}
            key={p.id}
            type="button"
            className={`practice-card ${selectedPropId === p.id ? 'active' : ''}`}
            style={{
              padding: '0.6rem 0.5rem',
              borderRadius: '10px',
              border: selectedPropId === p.id ? '2px solid #ec4899' : '1px solid var(--line)',
              background: selectedPropId === p.id ? 'rgba(236, 72, 153, 0.15)' : 'var(--surface-soft)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem',
              cursor: 'pointer',
            }}
            onClick={() => handlePickProp(p.id)}
          >
            <span style={{ fontSize: '1.4rem' }}>{p.icon}</span>
            <strong style={{ fontSize: '0.82rem' }}>{p.nameZh}</strong>
            <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{locale === 'en' ? p.nameEn : p.nameJa}</span>
          </button>
        ))}
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
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', fontWeight: 700 }}>
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
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8' }}>
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
                <span lang="zh-Latn" style={{ fontSize: '0.72rem', color: '#f59e0b' }}>{line.pinyin}</span>
                <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.1rem' }}>
                  {line.ja}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 右側：抓周名詞解析 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: '#ec4899', fontWeight: 700, display: 'block' }}>
            {locale === 'en' ? '💡 Taiwan first-birthday and zhuazhou tips' : '💡 台湾度晬抓周・満1歳文化豆知識（Zhuazhou Tips）'}
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {localizedItem.zhuazhouGlossary.map((vocab, vIdx) => (
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
