import React, { useState } from 'react'
import { CHINESE_SUPPORT_EN, GUABAO_SISHEN_DIALOGUES, type GuabaoSishenDialogueItem } from '../data/guabaoSishenZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'
import { localizeChineseData } from '../teachingCopy'

interface Props {
  onEarnXp: (amount: number) => void
}

type MeatPreference = 'half' | 'lean' | 'fatty'

export const GuabaoSishenZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const { locale } = useI18n()
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [meatPref, setMeatPref] = useState<MeatPreference>('half')
  const [hasPeanut, setHasPeanut] = useState(true)
  const [hasPickles, setHasPickles] = useState(true)
  const [hasCoriander, setHasCoriander] = useState(true)
  const [addedWine, setAddedWine] = useState(false)
  const [bitten, setBitten] = useState(false)

  const activeItem: GuabaoSishenDialogueItem =
    GUABAO_SISHEN_DIALOGUES[selectedIdx % GUABAO_SISHEN_DIALOGUES.length]
  const localizedItem = localizeChineseData(activeItem, locale, CHINESE_SUPPORT_EN)
  const localizedDialogues = localizeChineseData(GUABAO_SISHEN_DIALOGUES, locale, CHINESE_SUPPORT_EN)

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleBiteGuabao() {
    setBitten(true)
    playCorrectSound()
    onEarnXp(15)
    setTimeout(() => setBitten(false), 2000)
  }

  function handleAddWine() {
    setAddedWine((prev) => !prev)
    playCorrectSound()
    onEarnXp(15)
  }

  const meatLabel = meatPref === 'half' ? '半肥半瘦（黃金比例）' : meatPref === 'lean' ? '偏瘦肉（扎實不膩）' : '偏肥肉（入口即化）'
  const meatLabelEn = meatPref === 'half' ? 'half lean and half fatty' : meatPref === 'lean' ? 'mostly lean' : 'mostly fatty'

  return (
    <div className="math-lab guabao-sishen-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🍔</span> {locale === 'en' ? 'Taiwan Gua Bao and Four-Herbs Soup Lab' : '台灣夜市名物刈包「虎咬豬」與四神湯實驗室 (Guabao & Sishen Lab)'}
          </h3>
          <p lang={locale === 'en' ? 'en' : 'ja'} className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {locale === 'en'
              ? 'Practise Mandarin for two Taiwan night-market classics: customize gua bao with braised pork and toppings, then season four-herbs soup with angelica rice wine.'
              : '台湾の冬の夜市の定番「虎咬猪・刈包＆薬膳四神湯」！「半肥半瘦・酸菜・花生糖粉・当帰薬酒」を徹底マスター！'}
          </p>
        </div>
      </div>

      {/* 刈包四神湯互動儀表板 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.12), rgba(16, 185, 129, 0.12))',
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
          <div style={{ fontSize: '1.8rem' }}>{bitten ? '🐯 😋' : addedWine ? '🍶 🍲' : '🍔 🥣'}</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>
              {locale === 'en' ? `Custom Gua Bao: ${meatLabel} (${meatLabelEn})` : `特製客製刈包：${meatLabel}`}
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {bitten
                ? locale === 'en' ? '🐯 Take a bite of the warm gua bao: tender braised pork, sweet peanut powder, and crisp pickled mustard greens. (+15 XP)' : '🐯 虎咬豬大口咬下！熱騰騰軟嫩三層爌肉混合花生糖粉甜香與酸菜脆口，象徵咬碎晦氣迎福氣！(+15 XP)'
                : addedWine
                ? locale === 'en' ? '🍶 Add a few drops of angelica rice wine to the hot, milky four-herbs soup. (+15 XP)' : '🍶 往乳白色滾燙四神湯滴入幾滴特製當歸藥酒，酒香撲鼻、溫補暖胃！(+15 XP)'
                : locale === 'en'
                  ? `Toppings: ${[hasPickles && 'pickled mustard greens', hasPeanut && 'peanut powder', hasCoriander && 'coriander'].filter(Boolean).join(', ') || 'none'}`
                  : `配料：${hasPickles ? '爽脆酸菜 ' : ''}${hasPeanut ? '香濃花生粉 ' : ''}${hasCoriander ? '提味香菜' : ''}`}
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
              background: bitten ? '#10b981' : 'linear-gradient(135deg, #d97706, #b45309)',
            }}
            onClick={handleBiteGuabao}
          >
            {bitten
              ? locale === 'en' ? '🐯 Bite complete' : '🐯 幸福咬住福氣'
              : locale === 'en' ? '🍔 Take a bite of the gua bao (+15 XP)' : '🍔 虎咬豬大口咬下 (+15 XP)'}
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.74rem',
              background: addedWine ? '#10b981' : 'linear-gradient(135deg, #059669, #047857)',
            }}
            onClick={handleAddWine}
          >
            {addedWine
              ? locale === 'en' ? '✓ Angelica rice wine added' : '✓ 已滴入當歸藥酒'
              : locale === 'en' ? '🍶 Add angelica rice wine (+15 XP)' : '🍶 滴幾滴當歸藥酒 (+15 XP)'}
          </button>
        </div>
      </div>

      {/* 客製化配料勾選 */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
        <button aria-pressed={meatPref === 'half'}
          type="button"
          className={`pill-btn ${meatPref === 'half' ? 'active' : ''}`}
          onClick={() => setMeatPref('half')}
        >
          🥩 <span lang="zh-Hant">半肥半瘦</span>{' '}
          <span lang={locale === 'en' ? 'en' : 'ja'}>{locale === 'en' ? '— Half lean, half fatty' : '(定番)'}</span>
        </button>
        <button aria-pressed={meatPref === 'lean'}
          type="button"
          className={`pill-btn ${meatPref === 'lean' ? 'active' : ''}`}
          onClick={() => setMeatPref('lean')}
        >
          🍖 <span lang="zh-Hant">偏瘦肉</span>{' '}
          <span lang={locale === 'en' ? 'en' : 'ja'}>{locale === 'en' ? '— Mostly lean' : '(ヘルシー)'}</span>
        </button>
        <button aria-pressed={meatPref === 'fatty'}
          type="button"
          className={`pill-btn ${meatPref === 'fatty' ? 'active' : ''}`}
          onClick={() => setMeatPref('fatty')}
        >
          🥓 <span lang="zh-Hant">偏肥肉</span>{' '}
          <span lang={locale === 'en' ? 'en' : 'ja'}>{locale === 'en' ? '— Mostly fatty' : '(とろける)'}</span>
        </button>
        <button aria-pressed={hasPeanut}
          type="button"
          className={`pill-btn ${hasPeanut ? 'active' : ''}`}
          onClick={() => setHasPeanut((prev) => !prev)}
        >
          🥜 {locale === 'en' ? 'Peanut powder' : '花生糖粉'} {hasPeanut ? '✓' : '✗'}
        </button>
        <button aria-pressed={hasPickles}
          type="button"
          className={`pill-btn ${hasPickles ? 'active' : ''}`}
          onClick={() => setHasPickles((prev) => !prev)}
        >
          🥬 {locale === 'en' ? 'Pickled mustard greens' : '爽脆酸菜'} {hasPickles ? '✓' : '✗'}
        </button>
        <button aria-pressed={hasCoriander}
          type="button"
          className={`pill-btn ${hasCoriander ? 'active' : ''}`}
          onClick={() => setHasCoriander((prev) => !prev)}
        >
          🌿 {locale === 'en' ? 'Coriander' : '香菜'} {hasCoriander ? '✓' : '✗'}
        </button>
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
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(217, 119, 6, 0.15)', color: '#d97706', fontWeight: 700 }}>
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
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d97706' }}>
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
                <span lang="zh-Latn" style={{ fontSize: '0.72rem', color: '#059669' }}>{line.pinyin}</span>
                <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.1rem' }}>
                  {line.ja}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 右側：名物名詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: '#d97706', fontWeight: 700, display: 'block' }}>
            {locale === 'en' ? '💡 Taiwan gua bao and four-herbs soup tips' : '💡 台湾名物「刈包（虎咬猪）」・四神湯豆知識（Guabao Tips）'}
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {localizedItem.guabaoGlossary.map((vocab, vIdx) => (
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
