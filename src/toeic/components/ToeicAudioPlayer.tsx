import React, { useState, useEffect, useRef } from 'react'
import { TOEIC_ACCENTS, type ToeicAccentCode, findBestVoiceForAccent } from '../data/accents'
import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'

type Props = {
  text: string
  translation?: string
  phoneticOrRhythm?: string
  onPlaybackComplete?: () => void
  instructionLang?: 'zh' | 'ja'
}

/**
 * TOEIC 四國口音智慧播放器與跟讀字幕元件 (ToeicAudioPlayer)
 * 支援美/英/澳/加 4 國指定口音、0.8x~1.5x 變速、逐詞同步視覺高亮與影子跟讀。
 */
export const ToeicAudioPlayer: React.FC<Props> = ({
  text,
  translation,
  phoneticOrRhythm,
  onPlaybackComplete,
  instructionLang = 'zh',
}) => {
  const { locale } = useI18n()
  const supportLang = toeicSupportLang(locale, instructionLang)
  const accents = useMemo(
    () => localizeToeicData(TOEIC_ACCENTS, locale, instructionLang),
    [instructionLang, locale],
  )
  const pick = (copy: { zh: string; ja: string; en: string }) => copy[supportLang]
  const [selectedAccent, setSelectedAccent] = useState<ToeicAccentCode>('en-US')
  const [playbackRate, setPlaybackRate] = useState<number>(1.0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1)
  const [isShadowingMode, setIsShadowingMode] = useState<boolean>(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const words = text.split(/\s+/)

  // 載入系統可用語音清單
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices()
      setVoices(available)
    }

    updateVoices()
    window.speechSynthesis.onvoiceschanged = updateVoices
  }, [])

  // 播放控制
  function handlePlay() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    window.speechSynthesis.cancel() // 停止前次播放
    setCurrentWordIndex(-1)

    const utterance = new SpeechSynthesisUtterance(text)
    utteranceRef.current = utterance

    utterance.rate = playbackRate
    utterance.lang = selectedAccent

    const matchedVoice = findBestVoiceForAccent(voices, selectedAccent)
    if (matchedVoice) {
      utterance.voice = matchedVoice
    }

    utterance.onstart = () => {
      setIsPlaying(true)
    }

    // 邊界字詞同步高亮 (Word Boundary Synchronization)
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex
        const textBefore = text.slice(0, charIndex)
        const wordIdx = textBefore.trim().length > 0 ? textBefore.trim().split(/\s+/).length : 0
        setCurrentWordIndex(wordIdx)
      }
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setCurrentWordIndex(-1)
      if (onPlaybackComplete) onPlaybackComplete()

      // 影子跟讀循環模式 (Shadowing Loop)
      if (isShadowingMode) {
        setTimeout(() => {
          handlePlay()
        }, 1200)
      }
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      setCurrentWordIndex(-1)
    }

    window.speechSynthesis.speak(utterance)
  }

  function handleStop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsPlaying(false)
    setCurrentWordIndex(-1)
  }

  const currentAccentInfo = accents.find((a) => a.code === selectedAccent) ?? accents[0]

  return (
    <div className="toeic-audio-player-card">
      {/* 口音切換標籤列 */}
      <div className="accent-picker-row">
        <span className="picker-label">
          🎧 {pick({ zh: '多益聽力口音：', ja: 'TOEICリスニングのアクセント：', en: 'TOEIC listening accents:' })}
        </span>
        <div className="accent-buttons-group">
          {accents.map((accent) => {
            const isSelected = accent.code === selectedAccent
            return (
              <button
                key={accent.code}
                type="button"
                className={`accent-chip ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  setSelectedAccent(accent.code)
                  if (isPlaying) handleStop()
                }}
              >
                <span>{accent.flag}</span>
                <span>{accent.name.split(' (')[0]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 口音特徵小卡 */}
      <div className="accent-feature-tip">
        <strong>{currentAccentInfo.flag} {currentAccentInfo.name}：</strong>
        <span>{currentAccentInfo.features}（{currentAccentInfo.testWeight}）</span>
      </div>

      {/* 逐詞同步字幕與跟讀高亮區 */}
      <div className="captions-display-box">
        <div className="english-words-stream">
          {words.map((w, idx) => {
            const isHighlighted = idx === currentWordIndex
            return (
              <span
                key={`word-${idx}`}
                className={`word-span ${isHighlighted ? 'highlight' : ''}`}
              >
                {w}{' '}
              </span>
            )
          })}
        </div>

        {phoneticOrRhythm && (
          <div className="rhythm-hint-row">
            <span className="rhythm-tag">
              {pick({ zh: '節奏與重音：', ja: 'リズムと強勢：', en: 'Rhythm and stress: ' })}
            </span>
            <code>{phoneticOrRhythm}</code>
          </div>
        )}

        {translation && (
          <div className="translation-row">
            <span>
              {pick({ zh: '中文語意：', ja: '意味：', en: 'Meaning: ' })}{translation}
            </span>
          </div>
        )}
      </div>

      {/* 播放控制工具列 */}
      <div className="player-controls-bar">
        <div className="playback-buttons">
          {!isPlaying ? (
            <button type="button" className="btn-play-primary" onClick={handlePlay}>
              ▶ {pick({ zh: '播放聽力音訊', ja: 'リスニング音声を再生', en: 'Play audio' })}
            </button>
          ) : (
            <button type="button" className="btn-stop" onClick={handleStop}>
              ⏹ {pick({ zh: '停止播放', ja: '再生を停止', en: 'Stop' })}
            </button>
          )}

          <button
            type="button"
            className={`btn-shadowing-toggle ${isShadowingMode ? 'active' : ''}`}
            onClick={() => setIsShadowingMode((prev) => !prev)}
          >
            🔁 {pick({ zh: '影子跟讀循環', ja: 'シャドーイング・ループ', en: 'Shadowing loop' })}{' '}
            {isShadowingMode
              ? pick({ zh: '(開啟中)', ja: '（オン）', en: '(on)' })
              : pick({ zh: '(關閉)', ja: '（オフ）', en: '(off)' })}
          </button>
        </div>

        <div className="speed-controls">
          <span className="speed-label">
            {pick({ zh: '語速：', ja: '速度：', en: 'Speed: ' })}
          </span>
          {[0.8, 1.0, 1.2, 1.5].map((rate) => (
            <button
              key={rate}
              type="button"
              className={`speed-pill ${playbackRate === rate ? 'active' : ''}`}
              onClick={() => {
                setPlaybackRate(rate)
                if (isPlaying) {
                  handleStop()
                  setTimeout(() => handlePlay(), 100)
                }
              }}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
