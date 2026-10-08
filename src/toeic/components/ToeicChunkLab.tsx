import React, { useEffect, useRef, useState } from 'react'
import { TOEIC_CHUNK_WEEKS, type BusinessChunk } from '../data/chunks'
import './ToeicChunkLab.css'
import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'

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
  const { locale } = useI18n()
  const supportLang = toeicSupportLang(locale, instructionLang)
  const isJa = supportLang === 'ja'
  const isEn = supportLang === 'en'
  const copy = (zh: string, ja: string, en: string) => isEn ? en : isJa ? ja : zh
  const weeks = useMemo(
    () => TOEIC_CHUNK_WEEKS.map((week) => localizeToeicData(week, locale, instructionLang)),
    [instructionLang, locale],
  )
  const currentWeek = weeks[0]
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
          {copy('← 返回今日學習', '← 今日学習に戻る', '← Back to today')}
        </button>
        <button type="button" className="btn-story-mode" onClick={onOpenStoryReview}>
          {copy('📖 查看本週微故事與 3 秒判斷對照表 →', '📖 今週のストーリー復習と判断表 →', '📖 Open this week’s story and three-second decision guide →')}
        </button>
      </div>

      <div className="chunk-hero-box">
        <div className="week-badge-row">
          <span className="week-pill">{copy(`第 ${currentWeek.weekId} 週 · 5 個高頻商務語塊`, `第 ${currentWeek.weekId} 週 · 必須ビジネスチャンク 5 選`, `Week ${currentWeek.weekId} · Five essential business chunks`)}</span>
          <span className="cert-pill">{currentWeek.certificateBand.toUpperCase()} {copy('級核心', 'レベルコア', 'core')}</span>
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
            <span className="tag-pill">{copy('🎧 核心語塊', '🎧 コアチャンク', '🎧 Core chunk')}</span>
            <h1>{activeChunk.chunk}</h1>
            <p className="chunk-meaning-lg">{isJa ? (activeChunk.meaningJa ?? activeChunk.meaningZh) : activeChunk.meaningZh}</p>
            <p className="action-signal-note">
              🎯 <strong>{copy('動作觸發訊號：', 'アクションシグナル：', 'Action signal:')}</strong>{isJa ? (activeChunk.actionSignalJa ?? activeChunk.actionSignal) : activeChunk.actionSignal}
            </p>
          </div>

          <aside className="rhythm-card">
            <span className="rhythm-tag">{copy('RHYTHM HINT · 語調重音與弱讀', 'RHYTHM HINT · 強勢と弱形', 'RHYTHM HINT · Stress and reduction')}</span>
            <p className="rhythm-stress">{activeChunk.rhythmHint.stress}</p>
            <p className="rhythm-desc">{isJa ? (activeChunk.rhythmHint.noteJa ?? activeChunk.rhythmHint.note) : activeChunk.rhythmHint.note}</p>
          </aside>
        </div>

        {/* 三階段跟讀訓練控制台 */}
        <div className="shadowing-console-card">
          <div className="console-head">
            <div>
              <h3>{copy('一個 Chunk，練三次 (3-Step Shadowing)', '1つのチャンクを3回練習（3-Step Shadowing）', 'Practise One Chunk Three Times')}</h3>
              <p>{copy('每一輪只做一件事：先聽抓連音 ➜ 看著跟 ➜ 留白自己說', '各ラウンドは一つに集中：音のつながりを聴く ➜ 見ながら復唱 ➜ 自分で言う', 'Focus on one task per round: hear the linking ➜ shadow with the text ➜ say it independently.')}</p>
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
                  🇺🇸 {copy('美式', '米', 'US')}
                </button>
                <button
                  type="button"
                  className={`btn-speed ${selectedAccent === 'en-GB' ? 'active' : ''}`}
                  aria-pressed={selectedAccent === 'en-GB'}
                  style={{ fontSize: '0.7rem', padding: '0.15rem 0.35rem' }}
                  onClick={() => { stopPlayback(); setSelectedAccent('en-GB') }}
                >
                  🇬🇧 {copy('英式', '英', 'UK')}
                </button>
                <button
                  type="button"
                  className={`btn-speed ${selectedAccent === 'en-AU' ? 'active' : ''}`}
                  aria-pressed={selectedAccent === 'en-AU'}
                  style={{ fontSize: '0.7rem', padding: '0.15rem 0.35rem' }}
                  onClick={() => { stopPlayback(); setSelectedAccent('en-AU') }}
                >
                  🇦🇺 {copy('澳式', '豪', 'AU')}
                </button>
                <button
                  type="button"
                  className={`btn-speed ${selectedAccent === 'en-CA' ? 'active' : ''}`}
                  aria-pressed={selectedAccent === 'en-CA'}
                  style={{ fontSize: '0.7rem', padding: '0.15rem 0.35rem' }}
                  onClick={() => { stopPlayback(); setSelectedAccent('en-CA') }}
                >
                  🇨🇦 {copy('加式', '加', 'CA')}
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.2rem' }}>
                <button
                  type="button"
                  className={`btn-speed ${speechRate === 0.8 ? 'active' : ''}`}
                  aria-pressed={speechRate === 0.8}
                  onClick={() => { stopPlayback(); setSpeechRate(0.8) }}
                >
                  0.8× {copy('慢速', '低速', 'Slow')}
                </button>
                <button
                  type="button"
                  className={`btn-speed ${speechRate === 1.0 ? 'active' : ''}`}
                  aria-pressed={speechRate === 1.0}
                  onClick={() => { stopPlayback(); setSpeechRate(1.0) }}
                >
                  1.0× {copy('原速', '通常', 'Normal')}
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
              <span className="step-title">{copy('先聽抓重音', 'まず強勢を聴く', 'Hear the stress')}</span>
              <span className="step-description">{copy('不急著說，先聽出哪裡重讀、哪裡弱讀。', 'すぐ話さず、強く読む所と弱く読む所を聴き取ります。', 'Listen first and identify stressed and reduced words before speaking.')}</span>
            </button>
            <button
              type="button"
              className={`step-card ${shadowStep === 2 ? 'active' : ''}`}
              aria-pressed={shadowStep === 2}
              onClick={() => setShadowStep(2)}
            >
              <span className="step-num">2</span>
              <span className="step-title">{copy('看著貼聲跟', '文を見ながら復唱', 'Shadow with the text')}</span>
              <span className="step-description">{copy('看著英文算式，盡量貼著聲音節奏跟讀。', '英文を見ながら、音声のリズムに合わせて復唱します。', 'Follow the text and match the recording’s rhythm as closely as possible.')}</span>
            </button>
            <button
              type="button"
              className={`step-card ${shadowStep === 3 ? 'active' : ''}`}
              aria-pressed={shadowStep === 3}
              onClick={() => setShadowStep(3)}
            >
              <span className="step-num">3</span>
              <span className="step-title">{copy('留白自己說', '空白で自分から話す', 'Say it independently')}</span>
              <span className="step-description">{copy('利用音訊結束後的空白，自己大聲說一次。', '音声後の空白で、自分から一度声に出します。', 'Use the pause after the audio to say the phrase aloud on your own.')}</span>
            </button>
          </div>

          <div className="audio-action-row">
            <button
              type="button"
              className="btn-primary btn-play-chunk"
              onClick={handlePlayThreeTimes}
              disabled={isSpeaking || !speechSupported}
            >
              {isSpeaking ? copy('語音朗讀中…', '音声再生中…', 'Playing…') : copy('▶ 播放三遍跟讀（慢速 ➜ 原速 ➜ 留白）', '▶ 3回シャドーイング（低速 ➜ 通常 ➜ 空白）', '▶ Play three rounds (slow ➜ normal ➜ independent)')}
            </button>
            <button type="button" className="ghost" disabled={!isSpeaking} onClick={stopPlayback}>
              {copy('停止播放', '停止', 'Stop')}
            </button>
            <span className="action-hint" role="status" aria-live="polite">
              {!speechSupported
                ? copy('此瀏覽器無法播放語音，仍可閱讀例句練習。', 'このブラウザでは音声を再生できません。例文を読んで練習できます。', 'This browser cannot play speech. You can still practise with the examples.')
                : playbackError
                  ? copy('語音無法播放，請重試或改用其他系統語音。', '音声を再生できません。再試行するか、別のシステム音声を選んでください。', 'Speech could not play. Try again or choose another system voice.')
                  : isSpeaking
                    ? copy('語音朗讀中，可隨時停止。', '音声を再生中です。いつでも停止できます。', 'Speech is playing. You can stop it at any time.')
                    : copy('點擊按鈕啟動智慧語音三輪跟讀引導', 'ボタンを押して3回の音声練習を開始します', 'Select the button to start the three-round audio guide.')}
            </span>
          </div>
        </div>

        {/* 3 個實用情境例句 */}
        <div className="examples-section">
          <h3>{copy('三個直接能用的商務例句', 'すぐ使えるビジネス例文3選', 'Three Ready-to-Use Business Examples')}</h3>
          <div className="examples-list">
            {activeChunk.examples.map((ex, idx) => (
              <div key={idx} className="example-item-card">
                <span className="ex-num">{idx + 1}</span>
                <div className="ex-text-content">
                  <h4 className="ex-en">{ex.en}</h4>
                  {(isJa ? (ex.ja ?? ex.zh) : ex.zh) !== ex.en ? (
                    <p className="ex-zh">{isJa ? (ex.ja ?? ex.zh) : ex.zh}</p>
                  ) : null}
                  {ex.note && <div className="ex-note">💡 {ex.note}</div>}
                </div>
                <button
                  type="button"
                  className="btn-play-ex"
                  onClick={() => speakSentence(ex.en)}
                  title={copy('點擊跟讀', 'クリックして復唱', 'Play and repeat')}
                  aria-label={`${copy('跟讀', '復唱', 'Repeat')}: ${ex.en}`}
                  disabled={!speechSupported}
                >
                  🔊 {copy('跟讀', '復唱', 'Repeat')}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 常見時態變形與避坑地雷 */}
        <div className="variations-pitfall-grid">
          <div className="variations-card">
            <h4>{copy('常見時態變形 (Real Variations)', 'よく使う形の変化 (Real Variations)', 'Common Real-World Variations')}</h4>
            <div className="var-list">
              {activeChunk.variations.map((v, i) => (
                <div key={i} className="var-row">
                  <strong className="var-en">{v.en}</strong>
                  {(isJa ? (v.ja ?? v.zh) : v.zh) !== v.en ? (
                    <span className="var-zh">{isJa ? (v.ja ?? v.zh) : v.zh}</span>
                  ) : null}
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
            <span className="pitfall-tag">{copy('⚠ 避坑指南：不要直譯！', '⚠ 注意：直訳しないこと', '⚠ Pitfall: Do Not Translate Literally')}</span>
            <div className="pitfall-wrong">❌ {copy('錯誤用法：', '誤った用法：', 'Incorrect:')} {activeChunk.pitfall.wrong}</div>
            <p className="pitfall-reason">{isJa ? (activeChunk.pitfall.reasonJa ?? activeChunk.pitfall.reason) : activeChunk.pitfall.reason}</p>
          </div>
        </div>

        {/* Mini-Dialog */}
        <div className="mini-dialog-section">
          <h3>{copy('情境迷你對話 (Mini-Dialogue)', '場面別ミニ対話 (Mini-Dialogue)', 'Scenario Mini-Dialogue')}</h3>
          <div className="dialog-box">
            <div className="turn-a">
              <span className="avatar">A</span>
              <div className="bubble">
                <p className="d-en">{activeChunk.miniDialog.speakerA.en}</p>
                {(isJa
                  ? (activeChunk.miniDialog.speakerA.ja ?? activeChunk.miniDialog.speakerA.zh)
                  : activeChunk.miniDialog.speakerA.zh) !== activeChunk.miniDialog.speakerA.en ? (
                    <p className="d-zh">
                      {isJa
                        ? (activeChunk.miniDialog.speakerA.ja ?? activeChunk.miniDialog.speakerA.zh)
                        : activeChunk.miniDialog.speakerA.zh}
                    </p>
                  ) : null}
              </div>
            </div>
            <div className="turn-b">
              <span className="avatar">B</span>
              <div className="bubble">
                <p className="d-en">{activeChunk.miniDialog.speakerB.en}</p>
                {(isJa
                  ? (activeChunk.miniDialog.speakerB.ja ?? activeChunk.miniDialog.speakerB.zh)
                  : activeChunk.miniDialog.speakerB.zh) !== activeChunk.miniDialog.speakerB.en ? (
                    <p className="d-zh">
                      {isJa
                        ? (activeChunk.miniDialog.speakerB.ja ?? activeChunk.miniDialog.speakerB.zh)
                        : activeChunk.miniDialog.speakerB.zh}
                    </p>
                  ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* 換你說：遮擋式主動回想 (Retrieval Practice) */}
        <div className="production-section">
          <div className="prod-head">
            <h3>{copy('換你說 (Retrieval Practice)', '自分で言ってみよう (Retrieval Practice)', 'Your Turn: Retrieval Practice')}</h3>
            <p>{copy('先別看答案！看中文試著大聲說出完整英文，再展開核對。', '答えを見る前に、日本語から完全な英文を声に出し、その後で確認します。', 'Before revealing the answer, say the complete English sentence aloud from the prompt.')}</p>
          </div>
          <div className="prod-list">
            {activeChunk.production.map((p, i) => (
              <details key={i} className="prod-accordion">
                <summary className="prod-summary">
                  <span className="prod-idx">{i + 1}.</span> {isJa ? (p.promptJa ?? p.promptZh) : p.promptZh}
                </summary>
                <div className="prod-answer-reveal">
                  <strong>{p.answerEn}</strong>
                  <button
                    type="button"
                    className="btn-play-mini"
                    onClick={() => speakSentence(p.answerEn)}
                  >
                    🔊 {copy('聽標準發音', '模範発音を聴く', 'Play model pronunciation')}
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
