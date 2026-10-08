import React, { useState, useRef, useEffect, useCallback } from 'react'
import { CHINESE_SUPPORT_EN as STROKE_SUPPORT_EN, STROKE_CHARACTERS, type ChineseStrokeItem } from '../data/strokeOrders'
import { CHINESE_SUPPORT_EN as PINYIN_SUPPORT_EN, INITIALS_DATA, FINALS_DATA } from '../data/pinyinBopomofo'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { useI18n } from '../../i18n/i18n'
import { localizeChineseData } from '../teachingCopy'

interface Props {
  onEarnXp: (amount: number) => void
}

export const BopomofoStrokeLab: React.FC<Props> = ({ onEarnXp }) => {
  const { locale } = useI18n()
  const [selectedChar, setSelectedChar] = useState<ChineseStrokeItem>(STROKE_CHARACTERS[0])
  const [activeSubTab, setActiveSubTab] = useState<'stroke' | 'bopomofo'>('stroke')
  const [selectedBopomofo, setSelectedBopomofo] = useState<string>('ㄅ')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const localizedChar = localizeChineseData(selectedChar, locale, STROKE_SUPPORT_EN)
  const localizedInitials = localizeChineseData(INITIALS_DATA, locale, PINYIN_SUPPORT_EN)
  const localizedFinals = localizeChineseData(FINALS_DATA, locale, PINYIN_SUPPORT_EN)

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  // 繪製漢字九宮格與米字格背景
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, size: number) => {
    ctx.clearRect(0, 0, size, size)
    // 外框
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, size, size)

    // 米字格虛線
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])

    // 十字
    ctx.beginPath()
    ctx.moveTo(size / 2, 0)
    ctx.lineTo(size / 2, size)
    ctx.moveTo(0, size / 2)
    ctx.lineTo(size, size / 2)
    ctx.stroke()

    // 對角線
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(size, size)
    ctx.moveTo(size, 0)
    ctx.lineTo(0, size)
    ctx.stroke()
    ctx.setLineDash([])

    // 淺色漢字底圖供臨摹
    ctx.font = 'bold 160px "Noto Sans TC", sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(selectedChar.char, size / 2, size / 2 + 10)
  }, [selectedChar])

  useEffect(() => {
    if (activeSubTab !== 'stroke' || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 260
    canvas.width = size * (window.devicePixelRatio || 1)
    canvas.height = size * (window.devicePixelRatio || 1)
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)

    drawGrid(ctx, size)
  }, [selectedChar, activeSubTab, drawGrid])

  function handleClear() {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    drawGrid(ctx, 260)
  }

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    if (!canvasRef.current) return { x: 0, y: 0 }
    const rect = canvasRef.current.getBoundingClientRect()
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * 260 / rect.width,
        y: (e.touches[0].clientY - rect.top) * 260 / rect.height,
      }
    }
    const me = e as React.MouseEvent
    return {
      x: (me.clientX - rect.left) * 260 / rect.width,
      y: (me.clientY - rect.top) * 260 / rect.height,
    }
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    setIsDrawing(true)
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    const pos = getPos(e)
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 8
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  }

  return (
    <div className="math-lab bopomofo-stroke-lab" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🖌️</span> {locale === 'en' ? 'Traditional Character Stroke and Bopomofo Lab' : '繁體漢字筆順與注音符號實驗室 (Bopomofo & Stroke Lab)'}
          </h3>
          <p lang={locale === 'en' ? 'en' : 'ja'} className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {locale === 'en'
              ? 'Practise stroke order for Traditional Chinese characters and the pronunciation of all 37 Bopomofo symbols used in Taiwan.'
              : '台湾で実際に使われる正体字（繁体字）の書き順ルールと、注音符号（ボポモフォ 37音）の発音を攻略！'}
          </p>
        </div>
      </div>

      {/* 子分頁切換 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.8rem' }}>
        <button aria-pressed={activeSubTab === 'stroke'}
          type="button"
          className={`pill-btn ${activeSubTab === 'stroke' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('stroke')}
        >
          {locale === 'en' ? '✍️ Stroke-order practice' : '✍️ 繁體漢字筆順臨摹 (Stroke Order)'}
        </button>
        <button aria-pressed={activeSubTab === 'bopomofo'}
          type="button"
          className={`pill-btn ${activeSubTab === 'bopomofo' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('bopomofo')}
        >
          {locale === 'en' ? '🇹🇼 37-symbol Bopomofo matrix' : '🇹🇼 注音符號 37音矩陣 (Bopomofo Matrix)'}
        </button>
      </div>

      {activeSubTab === 'stroke' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '0.8rem' }}>
          {/* 左側：字元選擇與臨摹畫布 */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {STROKE_CHARACTERS.map((item) => (
                <button aria-pressed={selectedChar.id === item.id}
                  key={item.id}
                  type="button"
                  className={`pill-btn ${selectedChar.id === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedChar(item)
                    speakChinese(item.char)
                  }}
                >
                  {item.char} (<span lang="zh-Latn">{item.pinyin}</span>)
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '260px', aspectRatio: '1' }}>
              <canvas
                ref={canvasRef}
                role="img"
                aria-label={locale === 'en'
                  ? `Tracing canvas for ${selectedChar.char}; stroke-order guidance appears below`
                  : `漢字「${selectedChar.char}」臨摹畫布；筆順說明列於下方`}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={() => setIsDrawing(false)}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  background: '#0f172a',
                  cursor: 'crosshair',
                  touchAction: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="pill-btn" onClick={handleClear}>
                {locale === 'en' ? '🧹 Clear canvas' : '🧹 清空畫布'}
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  speakChinese(selectedChar.char)
                  onEarnXp(10)
                  playCorrectSound()
                }}
              >
                {locale === 'en' ? '🔊 Play pronunciation (+10 XP)' : '🔊 聽發音 (+10 XP)'}
              </button>
            </div>
          </div>

          {/* 右側：筆順規則與部首解析 */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#f59e0b' }}>{selectedChar.char}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.1rem' }}>
                  <span lang="zh-Latn">{selectedChar.pinyin}</span> · {selectedChar.bopomofo} · {locale === 'en' ? 'Radical' : '部首'}: <strong>{selectedChar.radical}</strong> · {selectedChar.strokeCount} {locale === 'en' ? 'strokes' : '畫'}
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block' }}>{locale === 'en' ? 'English meaning:' : '🇯🇵 日本語の意味：'}</span>
              <strong lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.88rem' }}>{localizedChar.meaningJa}</strong>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700, display: 'block' }}>{locale === 'en' ? '✍️ Stroke-order tip' : '✍️ Stroke Order Tip / 筆順教學提示 (zh-Hant / en)'}</span>
              <p lang={locale === 'en' ? 'en' : 'ja'} style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', lineHeight: 1.45 }}>{localizedChar.strokeRuleJa}</p>
              <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'var(--muted)' }}>
                <strong>{locale === 'en' ? 'Stroke sequence:' : 'Stroke Sequence (筆順步驟):'}</strong> {selectedChar.strokeSequence.map((s, i) => `${i+1}.${s}`).join(' → ')}
              </div>
              <div style={{ marginTop: '0.3rem', fontSize: '0.7rem', color: '#94a3b8' }}>
                {locale === 'en' ? 'Follow the numbered order to write the character correctly.' : 'Tip: Follow the numbered order for correct writing. / 按照編號順序書寫以確保正確筆順。'}
              </div>
            </div>

            <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block' }}>{locale === 'en' ? 'Target example:' : '例文 (Example)：'}</span>
              <strong style={{ fontSize: '0.86rem', display: 'block', margin: '0.15rem 0' }}>{selectedChar.exampleSentenceZh}</strong>
              <span lang={locale === 'en' ? 'en' : 'ja'} style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{localizedChar.exampleSentenceJa}</span>
            </div>
          </div>
        </div>
      ) : (
        /* 注音 37 符號矩陣 */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '0.8rem' }}>
          <div>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>
              {locale === 'en' ? '21 initials' : '【聲母 21 音】'}
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))', gap: '0.3rem' }}>
              {localizedInitials.map((item) => (
                <button aria-pressed={selectedBopomofo === item.bopomofo}
                  key={item.bopomofo}
                  type="button"
                  className="practice-card"
                  style={{
                    padding: '0.45rem 0.2rem',
                    textAlign: 'center',
                    borderRadius: '8px',
                    borderColor: selectedBopomofo === item.bopomofo ? '#f59e0b' : 'var(--line)',
                    background: selectedBopomofo === item.bopomofo ? 'rgba(245, 158, 11, 0.15)' : 'var(--surface)',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedBopomofo(item.bopomofo)
                    speakChinese(item.pinyin)
                  }}
                >
                  <strong style={{ fontSize: '1.1rem', display: 'block' }}>{item.bopomofo}</strong>
                  <span lang="zh-Latn" style={{ fontSize: '0.65rem', color: '#f59e0b' }}>{item.pinyin}</span>
                </button>
              ))}
            </div>

            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--muted)', display: 'block', margin: '0.8rem 0 0.4rem' }}>
              {locale === 'en' ? '16 finals' : '【韻母 16 音】'}
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))', gap: '0.3rem' }}>
              {localizedFinals.map((item) => (
                <button aria-pressed={selectedBopomofo === item.bopomofo}
                  key={item.bopomofo}
                  type="button"
                  className="practice-card"
                  style={{
                    padding: '0.45rem 0.2rem',
                    textAlign: 'center',
                    borderRadius: '8px',
                    borderColor: selectedBopomofo === item.bopomofo ? '#f59e0b' : 'var(--line)',
                    background: selectedBopomofo === item.bopomofo ? 'rgba(245, 158, 11, 0.15)' : 'var(--surface)',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedBopomofo(item.bopomofo)
                    speakChinese(item.pinyin)
                  }}
                >
                  <strong style={{ fontSize: '1.1rem', display: 'block' }}>{item.bopomofo}</strong>
                  <span lang="zh-Latn" style={{ fontSize: '0.65rem', color: '#f59e0b' }}>{item.pinyin}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 符號詳解卡片 */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{locale === 'en' ? 'Bopomofo symbol' : '注音符號 (Bopomofo)'}</span>
            <h2 style={{ fontSize: '4rem', margin: '0.4rem 0', color: '#f59e0b' }}>{selectedBopomofo}</h2>
            <p lang={locale === 'en' ? 'en' : 'ja'} style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: 'var(--muted)' }}>
              {locale === 'en'
                ? 'This phonetic script is taught first in Taiwan primary schools. Select a symbol to hear its pronunciation.'
                : '台湾の小学校で最初に習う発音記号。クリックするとネイティブ発音を再生します。'}
            </p>
            <button lang={locale === 'en' ? 'en' : 'ja'}
              type="button"
              className="btn-primary"
              onClick={() => {
                speakChinese(selectedBopomofo)
                onEarnXp(5)
                playCorrectSound()
              }}
            >
              {locale === 'en' ? '🔊 Play pronunciation (+5 XP)' : '🔊 発音を聞く (+5 XP)'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
