import React, { useEffect, useRef, useState } from 'react'
import { TOEIC_CHUNK_WEEKS, type BusinessChunk } from '../data/chunks'
import './ToeicChunkLab.css'

type Props = {
  onBack: () => void
  onOpenStoryReview: () => void
  instructionLang?: 'zh' | 'ja'
}

/**
 * TOEIC 商務語塊跟讀實驗室 (ToeicChunkLab)
 * 實踐 English Chunker 語塊教學法：三階段跟讀、Rhythm Hint、時態變形、避坑指南與主動回想產出。
 */
export const ToeicChunkLab: React.FC<Props> = ({ onBack, onOpenStoryReview, instructionLang = 'zh' }) => {
  const currentWeek = TOEIC_CHUNK_WEEKS[0]
  const [selectedChunkId, setSelectedChunkId] = useState<string>(currentWeek.chunks[0].id)
  const [speechRate, setSpeechRate] = useState<number>(1.0)
  const [selectedAccent, setSelectedAccent] = useState<string>('en-US')
  const [shadowStep, setShadowStep] = useState<1 | 2 | 3>(1)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [playbackError, setPlaybackError] = useState(false)
  const playback = useRef({ run: 0, timer: 0, utterance: null as SpeechSynthesisUtterance | null })
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window

  function cancelPlayback() {
    const active = playback.current
    active.run += 1
    window.clearTimeout(active.timer)
    active.timer = 0
    if (active.utterance) {
      active.utterance.onend = null
      active.utterance.onerror = null
      active.utterance = null
      window.speechSynthesis.cancel()
    }
  }

  useEffect(() => () => cancelPlayback(), [])

  function stopPlayback() {
    cancelPlayback()
    setIsSpeaking(false)
  }

  const isJa = instructionLang === 'ja'
  const activeChunk: BusinessChunk =
    currentWeek.chunks.find((c) => c.id === selectedChunkId) ?? currentWeek.chunks[0]

  // Keep every delayed round in one cancellable run, including the silent gaps.
  function playLines(lines: Array<{ text: string; rate: number }>) {
    if (!speechSupported) return
    cancelPlayback()
    window.speechSynthesis.cancel()
    setPlaybackError(false)
    setIsSpeaking(true)
    const run = playback.current.run
    function play(index: number) {
      if (run !== playback.current.run) return
      const utterance = new SpeechSynthesisUtterance(lines[index].text)
      playback.current.utterance = utterance
      utterance.lang = selectedAccent
      utterance.rate = lines[index].rate
      utterance.onend = () => {
        if (run !== playback.current.run) return
        playback.current.utterance = null
        if (index + 1 < lines.length) {
          playback.current.timer = window.setTimeout(() => play(index + 1), index === 0 ? 500 : 600)
        } else {
          setIsSpeaking(false)
        }
      }
      utterance.onerror = () => {
        if (run !== playback.current.run) return
        playback.current.utterance = null
        setIsSpeaking(false)
        setPlaybackError(true)
      }
      window.speechSynthesis.speak(utterance)
    }
    play(0)
  }

  function speakSentence(text: string) {
    playLines([{ text, rate: speechRate }])
  }

  function handlePlayThreeTimes() {
    playLines([0.8, 1, 1].map((rate) => ({ text: activeChunk.chunk, rate })))
  }

  return (
    <div className="toeic-chunk-lab">
      {/* 頂部導航與週主題 */}
      <div className="chunk-top-bar">
        <button type="button" className="btn-back" onClick={onBack}>
          {isJa ? '← 今日学習に戻る' : '← 返回今日學習'}
        </button>
        <button type="button" className="btn-story-mode" onClick={onOpenStoryReview}>
          {isJa ? '📖 今週のストーリー復習と判断表 →' : '📖 查看本週微故事與 3 秒判斷對照表 →'}
        </button>
      </div>

      <div className="chunk-hero-box">
        <div className="week-badge-row">
          <span className="week-pill">{isJa ? `第 ${currentWeek.weekId} 週 · 必須ビジネスチャンク 5 選` : `第 ${currentWeek.weekId} 週 · 5 個高頻商務語塊`}</span>
          <span className="cert-pill">{currentWeek.certificateBand.toUpperCase()} {isJa ? 'レベルコア' : '級核心'}</span>
        </div>
        <h2>{isJa ? (currentWeek.themeTitleJa ?? currentWeek.themeTitle) : currentWeek.themeTitle}</h2>
        <p className="hero-sub">{isJa ? (currentWeek.themeSubtitleJa ?? currentWeek.themeSubtitle) : currentWeek.themeSubtitle}</p>

        {/* 5 個語塊水平選單 */}
        <div className="chunks-tabs-grid">
          {currentWeek.chunks.map((item, idx) => {
            const isSelected = item.id === activeChunk.id
            return (
              <button
                key={item.id}
                type="button"
                className={`chunk-tab-card ${isSelected ? 'active' : ''}`}
                aria-pressed={isSelected}
                onClick={() => {
                  stopPlayback()
                  setSelectedChunkId(item.id)
                }}
              >
                <span className="chunk-num">Lesson 0{idx + 1}</span>
                <strong className="chunk-en">{item.chunk}</strong>
                <span className="chunk-zh">{isJa ? (item.meaningJa ?? item.meaningZh) : item.meaningZh}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 單一語塊深度學習卡 */}
      <div className="chunk-detail-container">
        {/* 標題與語調卡 */}
        <div className="chunk-header-card">
          <div className="chunk-main-title">
            <span className="tag-pill">{isJa ? '🎧 コアチャンク' : '🎧 核心語塊'}</span>
            <h1>{activeChunk.chunk}</h1>
            <p className="chunk-meaning-lg">{isJa ? (activeChunk.meaningJa ?? activeChunk.meaningZh) : activeChunk.meaningZh}</p>
            <p className="action-signal-note">
              🎯 <strong>{isJa ? 'アクションシグナル：' : '動作觸發訊號：'}</strong>{isJa ? (activeChunk.actionSignalJa ?? activeChunk.actionSignal) : activeChunk.actionSignal}
            </p>
          </div>

          <aside className="rhythm-card">
            <span className="rhythm-tag">RHYTHM HINT · 語調重音與弱讀</span>
            <p className="rhythm-stress">{activeChunk.rhythmHint.stress}</p>
            <p className="rhythm-desc">{activeChunk.rhythmHint.note}</p>
          </aside>
        </div>

        {/* 三階段跟讀訓練控制台 */}
        <div className="shadowing-console-card">
          <div className="console-head">
            <div>
              <h3>一個 Chunk，練三次 (3-Step Shadowing)</h3>
              <p>每一輪只做一件事：先聽抓連音 ➜ 看著跟 ➜ 留白自己說</p>
            </div>
            <div className="audio-speed-controls" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.2rem' }}>
                <button
                  type="button"
                  className={`btn-speed ${selectedAccent === 'en-US' ? 'active' : ''}`}
                  aria-pressed={selectedAccent === 'en-US'}
                  style={{ fontSize: '0.7rem', padding: '0.15rem 0.35rem' }}
                  onClick={() => { stopPlayback(); setSelectedAccent('en-US') }}
                >
                  🇺🇸 美
                </button>
                <button
                  type="button"
                  className={`btn-speed ${selectedAccent === 'en-GB' ? 'active' : ''}`}
                  aria-pressed={selectedAccent === 'en-GB'}
                  style={{ fontSize: '0.7rem', padding: '0.15rem 0.35rem' }}
                  onClick={() => { stopPlayback(); setSelectedAccent('en-GB') }}
                >
                  🇬🇧 英
                </button>
                <button
                  type="button"
                  className={`btn-speed ${selectedAccent === 'en-AU' ? 'active' : ''}`}
                  aria-pressed={selectedAccent === 'en-AU'}
                  style={{ fontSize: '0.7rem', padding: '0.15rem 0.35rem' }}
                  onClick={() => { stopPlayback(); setSelectedAccent('en-AU') }}
                >
                  🇦🇺 澳
                </button>
                <button
                  type="button"
                  className={`btn-speed ${selectedAccent === 'en-CA' ? 'active' : ''}`}
                  aria-pressed={selectedAccent === 'en-CA'}
                  style={{ fontSize: '0.7rem', padding: '0.15rem 0.35rem' }}
                  onClick={() => { stopPlayback(); setSelectedAccent('en-CA') }}
                >
                  🇨🇦 加
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.2rem' }}>
                <button
                  type="button"
                  className={`btn-speed ${speechRate === 0.8 ? 'active' : ''}`}
                  aria-pressed={speechRate === 0.8}
                  onClick={() => { stopPlayback(); setSpeechRate(0.8) }}
                >
                  0.8× 慢速
                </button>
                <button
                  type="button"
                  className={`btn-speed ${speechRate === 1.0 ? 'active' : ''}`}
                  aria-pressed={speechRate === 1.0}
                  onClick={() => { stopPlayback(); setSpeechRate(1.0) }}
                >
                  1.0× 原速
                </button>
              </div>
            </div>
          </div>

          <div className="steps-cards-row">
            <button
              type="button"
              className={`step-card ${shadowStep === 1 ? 'active' : ''}`}
              aria-pressed={shadowStep === 1}
              onClick={() => setShadowStep(1)}
            >
              <span className="step-num">1</span>
              <span className="step-title">先聽抓重音</span>
              <span className="step-description">不急著說，先聽出哪裡重讀、哪裡弱讀。</span>
            </button>
            <button
              type="button"
              className={`step-card ${shadowStep === 2 ? 'active' : ''}`}
              aria-pressed={shadowStep === 2}
              onClick={() => setShadowStep(2)}
            >
              <span className="step-num">2</span>
              <span className="step-title">看著貼聲跟</span>
              <span className="step-description">看著英文算式，盡量貼著聲音節奏跟讀。</span>
            </button>
            <button
              type="button"
              className={`step-card ${shadowStep === 3 ? 'active' : ''}`}
              aria-pressed={shadowStep === 3}
              onClick={() => setShadowStep(3)}
            >
              <span className="step-num">3</span>
              <span className="step-title">留白自己說</span>
              <span className="step-description">利用音訊結束後的空白，自己大聲說一次。</span>
            </button>
          </div>

          <div className="audio-action-row">
            <button
              type="button"
              className="btn-primary btn-play-chunk"
              onClick={handlePlayThreeTimes}
              disabled={isSpeaking || !speechSupported}
            >
              {isSpeaking ? '語音朗讀中...' : '▶ 播放三遍跟讀 (慢速 ➜ 原速 ➜ 留白)'}
            </button>
            <button type="button" className="ghost" disabled={!isSpeaking} onClick={stopPlayback}>
              {isJa ? '停止' : '停止播放'}
            </button>
            <span className="action-hint" role="status" aria-live="polite">
              {!speechSupported ? '此瀏覽器無法播放語音，仍可閱讀例句練習。'
                : playbackError ? '語音無法播放，請重試或改用其他系統語音。'
                  : isSpeaking ? '語音朗讀中，可隨時停止。' : '點擊按鈕啟動智慧語音三輪跟讀引導'}
            </span>
          </div>
        </div>

        {/* 3 個實用情境例句 */}
        <div className="examples-section">
          <h3>三個直接能用的商務例句</h3>
          <div className="examples-list">
            {activeChunk.examples.map((ex, idx) => (
              <div key={idx} className="example-item-card">
                <span className="ex-num">{idx + 1}</span>
                <div className="ex-text-content">
                  <h4 className="ex-en">{ex.en}</h4>
                  <p className="ex-zh">{ex.zh}</p>
                  {ex.note && <div className="ex-note">💡 {ex.note}</div>}
                </div>
                <button
                  type="button"
                  className="btn-play-ex"
                  onClick={() => speakSentence(ex.en)}
                  title="點擊跟讀"
                  aria-label={`跟讀：${ex.en}`}
                  disabled={!speechSupported}
                >
                  🔊 跟讀
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 常見時態變形與避坑地雷 */}
        <div className="variations-pitfall-grid">
          <div className="variations-card">
            <h4>常見時態變形 (Real Variations)</h4>
            <div className="var-list">
              {activeChunk.variations.map((v, i) => (
                <div key={i} className="var-row">
                  <strong className="var-en">{v.en}</strong>
                  <span className="var-zh">{v.zh}</span>
                  <button
                    type="button"
                    className="btn-play-mini"
                    aria-label={`跟讀：${v.en}`}
                    disabled={!speechSupported}
                    onClick={() => speakSentence(v.en)}
                  >
                    🔊
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pitfall-card">
            <span className="pitfall-tag">⚠ 避坑指南：不要直譯！</span>
            <div className="pitfall-wrong">❌ 錯誤用法：{activeChunk.pitfall.wrong}</div>
            <p className="pitfall-reason">{activeChunk.pitfall.reason}</p>
          </div>
        </div>

        {/* Mini-Dialog */}
        <div className="mini-dialog-section">
          <h3>情境迷你對話 (Mini-Dialogue)</h3>
          <div className="dialog-box">
            <div className="turn-a">
              <span className="avatar">A</span>
              <div className="bubble">
                <p className="d-en">{activeChunk.miniDialog.speakerA.en}</p>
                <p className="d-zh">{activeChunk.miniDialog.speakerA.zh}</p>
              </div>
            </div>
            <div className="turn-b">
              <span className="avatar">B</span>
              <div className="bubble">
                <p className="d-en">{activeChunk.miniDialog.speakerB.en}</p>
                <p className="d-zh">{activeChunk.miniDialog.speakerB.zh}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 換你說：遮擋式主動回想 (Retrieval Practice) */}
        <div className="production-section">
          <div className="prod-head">
            <h3>換你說 (Retrieval Practice)</h3>
            <p>先別看答案！看中文試著大聲說出完整英文，再展開核對。</p>
          </div>
          <div className="prod-list">
            {activeChunk.production.map((p, i) => (
              <details key={i} className="prod-accordion">
                <summary className="prod-summary">
                  <span className="prod-idx">{i + 1}.</span> {p.promptZh}
                </summary>
                <div className="prod-answer-reveal">
                  <strong>{p.answerEn}</strong>
                  <button
                    type="button"
                    className="btn-play-mini"
                    onClick={() => speakSentence(p.answerEn)}
                  >
                    🔊 聽標準發音
                  </button>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
