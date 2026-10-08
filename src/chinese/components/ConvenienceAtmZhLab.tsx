import React, { useState } from 'react'
import { CHINESE_SUPPORT_EN, CONVENIENCE_ATM_DIALOGUES, type ConvenienceAtmDialogueItem } from '../data/convenienceAtmZhDialogues'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'
import { localizeChineseData } from '../teachingCopy'

interface Props {
  onEarnXp: (amount: number) => void
}

export const ConvenienceAtmZhLab: React.FC<Props> = ({ onEarnXp }) => {
  const { locale } = useI18n()
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [atmAction, setAtmAction] = useState('跨行轉帳 (手續費15元)')
  const [ecoCupApplied, setEcoCupApplied] = useState(false)
  const [completed, setCompleted] = useState(false)

  const activeItem: ConvenienceAtmDialogueItem =
    CONVENIENCE_ATM_DIALOGUES[selectedIdx % CONVENIENCE_ATM_DIALOGUES.length]
  const localizedItem = localizeChineseData(activeItem, locale, CHINESE_SUPPORT_EN)
  const localizedDialogues = localizeChineseData(CONVENIENCE_ATM_DIALOGUES, locale, CHINESE_SUPPORT_EN)
  const serviceLabels: Record<string, string> = {
    '跨行轉帳 (手續費15元)': 'Interbank transfer (NT$15 fee)',
    '手機無卡提款 (一次性序號)': 'Cardless mobile withdrawal (one-time code)',
    '超商取貨 (末三碼核對居留證)': 'Store pickup (verify the last three ID digits)',
    '水電瓦斯帳單條碼代收': 'Pay utility bills by barcode',
  }

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  function handleProcessAction() {
    setCompleted(true)
    onEarnXp(10)
    playCorrectSound()
    setTimeout(() => setCompleted(false), 3500)
  }

  return (
    <div className="math-lab convenience-atm-zh-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🏪</span> {locale === 'en' ? 'Taiwan Convenience Store and ATM Finance Lab' : '台灣超商生活智慧與 ATM 金融實驗室 (Convenience Store & ATM Finance Lab)'}
          </h3>
          <p lang={locale === 'en' ? 'en' : 'ja'} className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {locale === 'en'
              ? 'Practise Mandarin for interbank ATM transfers, cardless withdrawals, parcel pickup with ID, utility payments, and reusable-cup discounts.'
              : '台湾超商の超便利機能！「ATM跨行轉帳（他行振込15元）・無卡提款・身分證領包裹・自備環保杯現省五元」の実戦フレーズを完全マスター！'}
          </p>
        </div>
      </div>

      {/* 超商 ATM 與生活服務模擬器 */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.12))',
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
          <div style={{ fontSize: '1.8rem' }}>🏧 ☕</div>
          <div>
            <strong style={{ fontSize: '0.9rem', display: 'block' }}>{locale === 'en' ? 'Convenience and Finance Hub' : '超商金融與生活櫃台 (Convenience & Finance Hub)'}</strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>
              {completed
                ? locale === 'en' ? '✓ Transaction complete. Receipt saved to your mobile barcode carrier. (+10 XP)' : '✓ 交易完成！發票存入手機條碼載具！(+10 XP)'
                : locale === 'en' ? `Selected service: ${serviceLabels[atmAction]}${ecoCupApplied ? ' · NT$5 reusable-cup discount' : ''}` : `選擇服務：${atmAction}${ecoCupApplied ? '・自備環保杯現折 5 元' : ''}`}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <label htmlFor="atm-action" className="sr-only">{locale === 'en' ? 'Convenience-store ATM service' : '超商 ATM 服務'}</label>
          <select
            id="atm-action"
            aria-label={locale === 'en' ? 'Convenience-store ATM service' : '超商 ATM 服務'}
            value={atmAction}
            onChange={(e) => setAtmAction(e.target.value)}
            style={{
              padding: '0.35rem 0.5rem',
              borderRadius: '6px',
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontSize: '0.78rem',
            }}
          >
            {Object.entries(serviceLabels).map(([value, english]) => (
              <option key={value} value={value}>{locale === 'en' ? english : value}</option>
            ))}
          </select>

          <button aria-pressed={ecoCupApplied}
            type="button"
            className={`pill-btn ${ecoCupApplied ? 'active' : ''}`}
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
            onClick={() => setEcoCupApplied((prev) => !prev)}
          >
            {ecoCupApplied
              ? locale === 'en' ? '✓ NT$5 reusable-cup discount' : '✓ 已折5元 (環保杯)'
              : locale === 'en' ? '🥤 Bring a reusable cup' : '🥤 自備環保杯'}
          </button>

          <button
            type="button"
            className="btn-primary"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.76rem',
              background: completed ? '#10b981' : 'linear-gradient(135deg, #10b981, #059669)',
            }}
            onClick={handleProcessAction}
          >
            {completed
              ? locale === 'en' ? 'Completed' : '處理完成'
              : locale === 'en' ? '💳 Confirm transaction' : '💳 確認執行交易'}
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
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700 }}>
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

        {/* 右側：超商金融生活重要單詞 */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'block' }}>
            {locale === 'en' ? '💡 Convenience-store and ATM tips' : '💡 台湾超商金融・生活エチケット（Convenience & ATM Tips）'}
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.3rem' }}>
            {localizedItem.convenienceGlossary.map((vocab, vIdx) => (
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
                  <strong style={{ fontSize: '0.88rem', color: '#10b981' }}>{vocab.termZh}</strong>
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
