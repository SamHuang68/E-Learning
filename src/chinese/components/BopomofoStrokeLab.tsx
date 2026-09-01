import React, { useState, useRef, useEffect } from 'react'
import { STROKE_CHARACTERS, type ChineseStrokeItem } from '../data/strokeOrders'
import { INITIALS_DATA, FINALS_DATA } from '../data/pinyinBopomofo'
import { playCorrectSound } from '../../engine/audioSynthesizer'

interface Props {
  onEarnXp: (amount: number) => void
}

export const BopomofoStrokeLab: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedChar, setSelectedChar] = useState<ChineseStrokeItem>(STROKE_CHARACTERS[0])
  const [activeSubTab, setActiveSubTab] = useState<'stroke' | 'bopomofo'>('stroke')
  const [selectedBopomofo, setSelectedBopomofo] = useState<string>('ㄅ')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-TW'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  // 繪製漢字九宮格與米字格背景
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
  }, [selectedChar, activeSubTab])

  function drawGrid(ctx: CanvasRenderingContext2D, size: number) {
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
  }

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
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    const me = e as React.MouseEvent
    return {
      x: me.clientX - rect.left,
      y: me.clientY - rect.top,
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
            <span>🖌️</span> 繁體漢字筆順與注音符號實驗室 (Bopomofo & Stroke Lab)
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            台湾で実際に使われる正体字（繁体字）の書き順ルールと、注音符号（ボポモフォ 37音）の発音を攻略！
          </p>
        </div>
      </div>

      {/* 子分頁切換 */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.8rem' }}>
        <button
          type="button"
          className={`pill-btn ${activeSubTab === 'stroke' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('stroke')}
        >
          ✍️ 繁體漢字筆順臨摹 (Stroke Order)
        </button>
        <button
          type="button"
          className={`pill-btn ${activeSubTab === 'bopomofo' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('bopomofo')}
        >
          🇹🇼 注音符號 37音矩陣 (Bopomofo Matrix)
        </button>
      </div>

      {activeSubTab === 'stroke' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
          {/* 左側：字元選擇與臨摹畫布 */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {STROKE_CHARACTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`pill-btn ${selectedChar.id === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedChar(item)
                    speakChinese(item.char)
                  }}
                >
                  {item.char} ({item.pinyin})
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '260px', height: '260px' }}>
              <canvas
                ref={canvasRef}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={() => setIsDrawing(false)}
                style={{
                  width: '260px',
                  height: '260px',
                  borderRadius: '8px',
                  background: '#0f172a',
                  cursor: 'crosshair',
                  touchAction: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="pill-btn" onClick={handleClear}>
                🧹 清空畫布
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
                🔊 聽發音 (+10 XP)
              </button>
            </div>
          </div>

          {/* 右側：筆順規則與部首解析 */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#f59e0b' }}>{selectedChar.char}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.1rem' }}>
                  {selectedChar.pinyin} · {selectedChar.bopomofo} · 部首：<strong>{selectedChar.radical}</strong> · {selectedChar.strokeCount} 畫
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block' }}>🇯🇵 日本語の意味：</span>
              <strong style={{ fontSize: '0.88rem' }}>{selectedChar.meaningJa}</strong>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700, display: 'block' }}>✍️ 筆順・書き順のルール：</span>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', lineHeight: 1.45 }}>{selectedChar.strokeRuleJa}</p>
            </div>

            <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block' }}>例文 (Example)：</span>
              <strong style={{ fontSize: '0.86rem', display: 'block', margin: '0.15rem 0' }}>{selectedChar.exampleSentenceZh}</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{selectedChar.exampleSentenceJa}</span>
            </div>
          </div>
        </div>
      ) : (
        /* 注音 37 符號矩陣 */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
          <div>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>
              【聲母 21 音】
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))', gap: '0.3rem' }}>
              {INITIALS_DATA.map((item) => (
                <button
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
                  <span style={{ fontSize: '0.65rem', color: '#f59e0b' }}>{item.pinyin}</span>
                </button>
              ))}
            </div>

            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--muted)', display: 'block', margin: '0.8rem 0 0.4rem' }}>
              【韻母 16 音】
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))', gap: '0.3rem' }}>
              {FINALS_DATA.map((item) => (
                <button
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
                  <span style={{ fontSize: '0.65rem', color: '#f59e0b' }}>{item.pinyin}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 符號詳解卡片 */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>注音符號 (Bopomofo)</span>
            <h2 style={{ fontSize: '4rem', margin: '0.4rem 0', color: '#f59e0b' }}>{selectedBopomofo}</h2>
            <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: 'var(--muted)' }}>
              台湾の小学校で最初に習う発音記号。クリックするとネイティブ発音を再生します。
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                speakChinese(selectedBopomofo)
                onEarnXp(5)
                playCorrectSound()
              }}
            >
              🔊 発音を聞く (+5 XP)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
