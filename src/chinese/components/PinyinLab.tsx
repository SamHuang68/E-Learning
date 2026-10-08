import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  CHINESE_SUPPORT_EN,
  CHINESE_TONES,
  INITIALS_DATA,
  FINALS_DATA,
  PINYIN_DRILL_WORDS,
  type ToneData,
  type PhonemeData,
} from '../data/pinyinBopomofo'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'
import { chineseTeachingCopy, localizeChineseData } from '../teachingCopy'
import { AudioLesson } from '../../components/AudioLesson'
import { speakChinese as speakChineseText } from '../../utils/speech'
import type { AudioLessonSegment } from '../../utils/audioLessonTypes'

interface Props {
  onEarnXp: (amount: number) => void
}

export const PinyinLab: React.FC<Props> = ({ onEarnXp }) => {
  const { locale } = useI18n()
  const [selectedTone, setSelectedTone] = useState<ToneData>(CHINESE_TONES[0])
  const [selectedInitial, setSelectedInitial] = useState<PhonemeData>(INITIALS_DATA[0])
  const [selectedFinal, setSelectedFinal] = useState<PhonemeData>(FINALS_DATA[0])
  const [activeTab, setActiveTab] = useState<'tones' | 'initials' | 'finals' | 'drills'>('tones')
  const stopSpeechRef = useRef<(() => void) | null>(null)
  const localizedTone = localizeChineseData(selectedTone, locale, CHINESE_SUPPORT_EN)
  const localizedInitial = localizeChineseData(selectedInitial, locale, CHINESE_SUPPORT_EN)
  const localizedFinal = localizeChineseData(selectedFinal, locale, CHINESE_SUPPORT_EN)
  const localizedTones = localizeChineseData(CHINESE_TONES, locale, CHINESE_SUPPORT_EN)
  const localizedInitials = localizeChineseData(INITIALS_DATA, locale, CHINESE_SUPPORT_EN)
  const localizedFinals = localizeChineseData(FINALS_DATA, locale, CHINESE_SUPPORT_EN)
  const localizedDrillWords = localizeChineseData(PINYIN_DRILL_WORDS, locale, CHINESE_SUPPORT_EN)
  const copy = (text: string) => chineseTeachingCopy(locale, text)
  const audioMaterialId = activeTab === 'tones'
    ? selectedTone.tone
    : activeTab === 'initials' ? selectedInitial.id : selectedFinal.id
  const audioSegments = useMemo<AudioLessonSegment[]>(() => {
    const lang = locale === 'en' ? 'en-US' : 'ja-JP'
    if (activeTab === 'tones') {
      const tone = localizeChineseData(selectedTone, locale, CHINESE_SUPPORT_EN)
      return [
        { id: 'tone-character', text: selectedTone.exampleChar, lang: 'zh-TW', kind: 'example' },
        { id: 'tone-pitch', text: tone.pitchDescriptionJa, lang, kind: 'explanation' },
        { id: 'tone-word', text: selectedTone.exampleZh, lang: 'zh-TW', kind: 'example' },
        { id: 'tone-meaning', text: tone.exampleMeaningJa, lang, kind: 'explanation' },
        { id: 'tone-tip', text: tone.exampleJa, lang, kind: 'explanation' },
      ]
    }
    const phoneme = activeTab === 'initials' ? selectedInitial : selectedFinal
    const localizedPhoneme = localizeChineseData(phoneme, locale, CHINESE_SUPPORT_EN)
    return [
      { id: 'phoneme-example', text: phoneme.exampleChar, lang: 'zh-TW', kind: 'example' },
      { id: 'phoneme-tip', text: localizedPhoneme.tipsJa, lang, kind: 'explanation' },
      { id: 'phoneme-meaning', text: localizedPhoneme.exampleMeaningJa, lang, kind: 'explanation' },
    ]
  }, [activeTab, selectedTone, selectedInitial, selectedFinal, locale])

  function speakChinese(text: string) {
    stopSpeechRef.current = speakChineseText(text, { rate: 0.9 })
  }

  useEffect(() => {
    const stop = () => {
      stopSpeechRef.current?.()
      stopSpeechRef.current = null
    }
    const handleHidden = () => {
      if (document.hidden) stop()
    }
    document.addEventListener('visibilitychange', handleHidden)
    return () => {
      document.removeEventListener('visibilitychange', handleHidden)
      stop()
    }
  }, [activeTab, locale])

  return (
    <div className="math-lab pinyin-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標題 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🗣️</span> {copy('拼音・注音與四聲聲調實驗室 (Pinyin, Bopomofo & Tones)')}
          </h3>
          <p lang={locale === 'en' ? 'en' : 'ja'} className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {copy('日本語にはない「四声の高さのカーブ」と「有気音・そり舌音・鼻母音」を完全可視化。カタカナの目安と発音ポイントで攻略！')}
          </p>
        </div>
      </div>

      {/* 模式分頁 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        <button aria-pressed={activeTab === 'tones'}
          type="button"
          className={`pill-btn ${activeTab === 'tones' ? 'active' : ''}`}
          onClick={() => setActiveTab('tones')}
        >
          {copy('🎵 四聲聲調曲線 (Tones)')}
        </button>
        <button aria-pressed={activeTab === 'initials'}
          type="button"
          className={`pill-btn ${activeTab === 'initials' ? 'active' : ''}`}
          onClick={() => setActiveTab('initials')}
        >
          {copy('🔤 聲母 21 音 (Initials)')}
        </button>
        <button aria-pressed={activeTab === 'finals'}
          type="button"
          className={`pill-btn ${activeTab === 'finals' ? 'active' : ''}`}
          onClick={() => setActiveTab('finals')}
        >
          {copy('🌊 韻母 16 音 (Finals)')}
        </button>
        <button aria-pressed={activeTab === 'drills'}
          type="button"
          className={`pill-btn ${activeTab === 'drills' ? 'active' : ''}`}
          onClick={() => setActiveTab('drills')}
        >
          {copy('⚡ 常用生活單字 (Drills)')}
        </button>
      </div>

      {/* 1. 四聲聲調可視化 */}
      {activeTab === 'tones' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '0.8rem' }}>
          {/* 左側：四聲調值 SVG 動態音高曲線 */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 700, alignSelf: 'flex-start', marginBottom: '0.4rem' }}>
              {copy('五度制調值座標 (5度標記法)')}
            </span>
            <svg role="img" aria-label={locale === 'en' ? 'Tone contours: tone 1 high and level at 55, tone 2 rising at 35, tone 3 dipping at 214, and tone 4 falling at 51' : '四聲調值：第一聲55高平、第二聲35上升、第三聲214降升、第四聲51下降'} viewBox="0 0 320 200" style={{ width: '100%', maxWidth: '320px', height: 'auto', background: 'var(--surface-soft)', borderRadius: '8px' }}>
              {/* 五度座標網格 5(高) ~ 1(低) */}
              {[5, 4, 3, 2, 1].map((val, idx) => {
                const y = 30 + idx * 35
                return (
                  <g key={val}>
                    <line x1="45" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                    <text x="35" y={y + 4} fill="var(--muted)" fontSize="10" fontWeight="bold" textAnchor="end">{val}</text>
                  </g>
                )
              })}

              {/* 第一聲 55 高平 */}
              <line
                x1="60"
                y1="30"
                x2="280"
                y2="30"
                stroke={selectedTone.tone === 1 ? '#f59e0b' : '#64748b'}
                strokeWidth={selectedTone.tone === 1 ? '4' : '2'}
              />
              <text x="290" y="34" fill={selectedTone.tone === 1 ? '#f59e0b' : '#64748b'} fontSize="10" fontWeight="bold">{locale === 'en' ? 'Tone 1 (55)' : '1聲(55)'}</text>

              {/* 第二聲 35 高升 */}
              <path
                d="M 60 100 Q 170 85 280 30"
                fill="none"
                stroke={selectedTone.tone === 2 ? '#10b981' : '#64748b'}
                strokeWidth={selectedTone.tone === 2 ? '4' : '2'}
              />
              <text x="290" y="48" fill={selectedTone.tone === 2 ? '#10b981' : '#64748b'} fontSize="10" fontWeight="bold">{locale === 'en' ? 'Tone 2 (35)' : '2聲(35)'}</text>

              {/* 第三聲 214 降升 */}
              <path
                d="M 60 135 Q 150 175 280 65"
                fill="none"
                stroke={selectedTone.tone === 3 ? '#3b82f6' : '#64748b'}
                strokeWidth={selectedTone.tone === 3 ? '4' : '2'}
              />
              <text x="290" y="70" fill={selectedTone.tone === 3 ? '#3b82f6' : '#64748b'} fontSize="10" fontWeight="bold">{locale === 'en' ? 'Tone 3 (214)' : '3聲(214)'}</text>

              {/* 第四聲 51 全降 */}
              <line
                x1="60"
                y1="30"
                x2="280"
                y2="170"
                stroke={selectedTone.tone === 4 ? '#ef4444' : '#64748b'}
                strokeWidth={selectedTone.tone === 4 ? '4' : '2'}
              />
              <text x="290" y="174" fill={selectedTone.tone === 4 ? '#ef4444' : '#64748b'} fontSize="10" fontWeight="bold">{locale === 'en' ? 'Tone 4 (51)' : '4聲(51)'}</text>
            </svg>

            {/* 四聲選單切換 */}
            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.6rem', width: '100%' }}>
              {localizedTones.map((t, index) => (
                <button aria-pressed={selectedTone.tone === t.tone}
                  key={t.tone}
                  type="button"
                  className={`pill-btn ${selectedTone.tone === t.tone ? 'active' : ''}`}
                  style={{ flex: 1, padding: '0.25rem', fontSize: '0.72rem', textAlign: 'center' }}
                  onClick={() => {
                    setSelectedTone(CHINESE_TONES[index])
                    speakChinese(t.exampleChar)
                  }}
                >
                  {locale === 'en' ? `Tone ${t.tone}` : `第${t.tone}聲`}
                </button>
              ))}
            </div>
          </div>

          {/* 右側：聲調詳細指南與發音示範 */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 lang={locale === 'en' ? 'en' : 'ja'} style={{ margin: 0, fontSize: '1rem', color: '#f59e0b' }}>{localizedTone.nameJa}</h4>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{copy('調符：')}{selectedTone.mark}</span>
              </div>
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                onClick={() => {
                  speakChinese(selectedTone.exampleChar)
                  onEarnXp(5)
                  playCorrectSound()
                }}
              >
                {copy('🔊 聽示範音')} ({selectedTone.exampleChar})
              </button>
            </div>

            <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block' }}>{copy('💡 日本語ネイティブ向け発音のコツ：')}</span>
              <p lang={locale === 'en' ? 'en' : 'ja'} style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', lineHeight: 1.45 }}>{localizedTone.pitchDescriptionJa}</p>
            </div>

            <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block' }}>{copy('📖 代表例詞：')}</span>
              <strong style={{ fontSize: '0.9rem' }}>
                {localizedTone.exampleZh} (<span lang={locale === 'en' ? 'en' : 'ja'}>{localizedTone.exampleMeaningJa}</span>)
              </strong>
              <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}><span lang={locale === 'en' ? 'en' : 'ja'}>{copy('ピンイン：')}</span><span lang="zh-Latn">{selectedTone.examplePinyin}</span></div>
              <div lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.74rem', color: '#10b981', marginTop: '0.2rem' }}>{localizedTone.exampleJa}</div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 聲母 (Initials) */}
      {activeTab === 'initials' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.4rem', marginBottom: '0.8rem' }}>
            {localizedInitials.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className="practice-card"
                aria-pressed={selectedInitial.id === item.id}
                style={{
                  padding: '0.5rem 0.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  borderColor: selectedInitial.id === item.id ? '#f59e0b' : 'var(--line)',
                  background: selectedInitial.id === item.id ? 'rgba(245, 158, 11, 0.1)' : 'var(--surface)',
                  cursor: 'pointer',
                  borderRadius: '8px',
                }}
                onClick={() => {
                  setSelectedInitial(INITIALS_DATA[index])
                  speakChinese(item.exampleChar)
                }}
              >
                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'baseline' }}>
                  <strong lang="zh-Latn" style={{ fontSize: '1rem' }}>{item.pinyin}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>{item.bopomofo}</span>
                </div>
                <span lang="ja" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{item.katakana}</span>
              </button>
            ))}
          </div>

          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '0.85rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.6rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <strong lang="zh-Latn" style={{ fontSize: '1.2rem' }}>{selectedInitial.pinyin}</strong>
                <span style={{ fontSize: '0.9rem', color: '#f59e0b' }}>{selectedInitial.bopomofo}</span>
                <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.72rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'var(--surface-soft)', border: '1px solid var(--line)' }}>
                  {localizedInitial.categoryJa}
                </span>
              </div>
              <p lang={locale === 'en' ? 'en' : 'ja'} style={{ margin: '0.3rem 0 0', fontSize: '0.78rem', color: 'var(--muted)' }}>
                {localizedInitial.tipsJa}
              </p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                speakChinese(selectedInitial.exampleChar)
                onEarnXp(5)
              }}
            >
              {copy('🔊 聽發音')} ({selectedInitial.exampleChar} · <span lang={locale === 'en' ? 'en' : 'ja'}>{localizedInitial.exampleMeaningJa}</span>)
            </button>
          </div>
        </div>
      )}

      {/* 3. 韻母 (Finals) */}
      {activeTab === 'finals' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.4rem', marginBottom: '0.8rem' }}>
            {localizedFinals.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className="practice-card"
                aria-pressed={selectedFinal.id === item.id}
                style={{
                  padding: '0.5rem 0.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  borderColor: selectedFinal.id === item.id ? '#38bdf8' : 'var(--line)',
                  background: selectedFinal.id === item.id ? 'rgba(56, 189, 248, 0.1)' : 'var(--surface)',
                  cursor: 'pointer',
                  borderRadius: '8px',
                }}
                onClick={() => {
                  setSelectedFinal(FINALS_DATA[index])
                  speakChinese(item.exampleChar)
                }}
              >
                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'baseline' }}>
                  <strong lang="zh-Latn" style={{ fontSize: '1rem' }}>{item.pinyin}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{item.bopomofo}</span>
                </div>
                <span lang="ja" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{item.katakana}</span>
              </button>
            ))}
          </div>

          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '0.85rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.6rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <strong lang="zh-Latn" style={{ fontSize: '1.2rem' }}>{selectedFinal.pinyin}</strong>
                <span style={{ fontSize: '0.9rem', color: '#38bdf8' }}>{selectedFinal.bopomofo}</span>
                <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.72rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'var(--surface-soft)', border: '1px solid var(--line)' }}>
                  {localizedFinal.categoryJa}
                </span>
              </div>
              <p lang={locale === 'en' ? 'en' : 'ja'} style={{ margin: '0.3rem 0 0', fontSize: '0.78rem', color: 'var(--muted)' }}>
                {localizedFinal.tipsJa}
              </p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                speakChinese(selectedFinal.exampleChar)
                onEarnXp(5)
              }}
            >
              {copy('🔊 聽發音')} ({selectedFinal.exampleChar} · <span lang={locale === 'en' ? 'en' : 'ja'}>{localizedFinal.exampleMeaningJa}</span>)
            </button>
          </div>
        </div>
      )}

      {/* 4. 常用單字拼音實戰 */}
      {activeTab === 'drills' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: '0.6rem' }}>
          {localizedDrillWords.map((w, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '10px',
                padding: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong style={{ fontSize: '1.05rem', display: 'block' }}>{w.zh}</strong>
                <div style={{ fontSize: '0.74rem', color: '#f59e0b' }}><span lang="zh-Latn">{w.pinyin}</span> · {w.bopomofo}</div>
                <div lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{w.ja}</div>
                <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '0.2rem' }}>💡 <span lang={locale === 'en' ? 'en' : 'ja'}>{w.tipJa}</span></div>
              </div>
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                onClick={() => {
                  speakChinese(w.zh)
                  onEarnXp(5)
                }}
              >
                {copy('🔊 跟讀')}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab !== 'drills' && (
        <AudioLesson
          lessonId={`chinese-pinyin:${activeTab}:${audioMaterialId}:${locale}`}
          segments={audioSegments}
        />
      )}
    </div>
  )
}
