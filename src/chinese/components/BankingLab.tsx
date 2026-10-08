import React, { useState } from 'react'
import { BANKING_DIALOGUES, CHINESE_SUPPORT_EN, type BankingDialogueItem } from '../data/bankingDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'
import { localizeChineseData } from '../teachingCopy'

interface Props {
  onEarnXp: (amount: number) => void
}

export const BankingLab: React.FC<Props> = ({ onEarnXp }) => {
  const { locale } = useI18n()
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [jpyInput, setJpyInput] = useState<number>(50000)
  const [ticketDrawn, setTicketDrawn] = useState<number | null>(null)

  const activeItem: BankingDialogueItem =
    BANKING_DIALOGUES[selectedIdx % BANKING_DIALOGUES.length]
  const localizedItem = localizeChineseData(activeItem, locale, CHINESE_SUPPORT_EN)
  const localizedDialogues = localizeChineseData(BANKING_DIALOGUES, locale, CHINESE_SUPPORT_EN)

  const exchangeRate = 0.215
  const estimatedTwd = Math.round(jpyInput * exchangeRate)

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleDrawTicket() {
    const randomTicket = Math.floor(Math.random() * 80) + 120
    setTicketDrawn(randomTicket)
    onEarnXp(10)
    playCorrectSound()
  }

  return (
    <div className="math-lab banking-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🏦</span> {locale === 'en' ? 'Taiwan Banking and Currency Exchange Lab' : '台灣銀行開戶與金融外幣兌換實驗室 (Banking & Finance Lab)'}
          </h3>
          <p lang={locale === 'en' ? 'en' : 'ja'} className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {locale === 'en'
              ? 'Practise essential Mandarin for opening an account, exchanging Japanese yen for Taiwan dollars, using a seal, and visiting an ATM.'
              : '台湾現地での「銀行口座開設（開戶）・日本円から台湾元への両替（換匯）・印章・ATM」など生活に必須の金融中国語を攻略！'}
          </p>
        </div>
      </div>

      {/* 換匯即時試算機與抽號碼牌 */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ fontSize: '1.8rem' }}>💱</div>
          <div>
            <strong style={{ fontSize: '0.88rem', display: 'block' }}>{locale === 'en' ? 'JPY ⇋ TWD calculator' : '日圓 ⇋ 新台幣即時試算 (JPY to TWD)'}</strong>
            <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {locale === 'en' ? 'Reference rate: 1 JPY ≈ 0.215 TWD' : '參考匯率：1 JPY ≈ 0.215 TWD'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input aria-label={locale === 'en' ? 'Japanese yen amount (JPY)' : '日圓金額 (JPY)'}
            type="number"
            value={jpyInput}
            step="10000"
            min="10000"
            max="1000000"
            onChange={(e) => setJpyInput(Number(e.target.value))}
            style={{
              padding: '0.3rem 0.5rem',
              borderRadius: '6px',
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              color: 'var(--text)',
              width: '100px',
              fontSize: '0.8rem',
            }}
          />
          <span style={{ fontSize: '0.78rem' }}>{locale === 'en' ? 'JPY ≈ ' : '円 ≈ '}</span>
          <strong style={{ fontSize: '0.95rem', color: '#10b981' }}>NT$ {estimatedTwd.toLocaleString()} {locale === 'en' ? 'TWD' : '元'}</strong>

          <button
            type="button"
            className="pill-btn"
            style={{ marginLeft: '0.3rem' }}
            onClick={handleDrawTicket}
          >
            {ticketDrawn
              ? locale === 'en' ? `🎟️ Queue number ${ticketDrawn}` : `🎟️ 號碼牌 ${ticketDrawn} 號`
              : locale === 'en' ? '🎟️ Take a queue number' : '🎟️ 抽取臨櫃號碼牌'}
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
            <span>{item.icon}</span> {locale === 'en' ? item.title : item.title.split('與')[0]}
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

        {/* 右側：台灣金融實用語彙 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'block' }}>
            {locale === 'en' ? '💡 Banking and exchange tips' : '💡 台湾銀行・両替豆知識（Banking Tips）'}
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {localizedItem.usefulVocabulary.map((vocab, vIdx) => (
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
