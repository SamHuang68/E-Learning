import { useEffect, useId, useRef, useState } from 'react'
import { useI18n } from '../i18n/i18n'
import { isSpeechSupported, warmVoices } from '../utils/speech'
import { startAudioLesson } from '../utils/audioLessonPlayback'
import { hasLessonVoice } from '../utils/audioLessonVoices'
import type {
  AudioLessonLanguage,
  AudioLessonPhase,
  AudioLessonSegment,
} from '../utils/audioLessonTypes'
import './audioLesson.css'

type Props = {
  lessonId: string
  title?: string
  segments: AudioLessonSegment[]
}

type PlaybackScope = 'lesson' | 'examples' | 'replay'

function availableVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return []
  try {
    return window.speechSynthesis.getVoices()
  } catch {
    return []
  }
}

export function AudioLesson({ lessonId, title, segments }: Props) {
  const { locale } = useI18n()
  const en = locale === 'en'
  const headingId = useId()
  const statusId = useId()
  const supported = isSpeechSupported()
  const [voices, setVoices] = useState(availableVoices)
  const [voicesLoaded, setVoicesLoaded] = useState(() => availableVoices().length > 0)
  const [phase, setPhase] = useState<AudioLessonPhase | 'idle'>('idle')
  const [current, setCurrent] = useState(0)
  const [playback, setPlayback] = useState({ scope: 'lesson' as PlaybackScope, index: 0, total: 0 })
  const [rate, setRate] = useState(0.95)
  const [shadow, setShadow] = useState(true)
  const [error, setError] = useState('')
  const stopRef = useRef<(() => void) | null>(null)
  const runRef = useRef(0)
  const mountedRef = useRef(false)
  const voiceWaitRef = useRef<AbortController | null>(null)
  const contentKey = JSON.stringify(segments)
  const items = segments.filter((segment) => segment.text.trim() || segment.audioSrc)
  const examples = items.filter((segment) => segment.kind === 'example')
  const sourceText = items.some((segment) => Boolean(segment.audioSrc))
    ? en
      ? 'Plays supplied lesson audio when available, with system speech as fallback. This is not a pronunciation score. Voice availability and offline playback depend on your device; some voices need the network.'
      : '有音檔時使用教材提供的音訊，無法播放時回退系統合成語音。此功能不做發音評分；可用聲音與離線播放依裝置而定，部分聲音需要連線。'
    : en
      ? 'System-synthesized speech, not a human recording or pronunciation score. Voice availability and offline playback depend on your device; some voices need the network.'
      : '使用系統合成語音，非真人錄音或發音評分。可用聲音與離線播放依裝置而定，部分聲音需要連線。'
  const active = phase === 'preparing' || phase === 'playing' || phase === 'shadowing'

  function stop() {
    runRef.current += 1
    stopRef.current?.()
    stopRef.current = null
    setPhase('stopped')
  }

  useEffect(() => {
    mountedRef.current = true
    if (!supported) return
    let mounted = true
    const update = () => {
      if (!mounted) return
      const next = availableVoices()
      setVoices(next)
      if (next.length) setVoicesLoaded(true)
    }
    update()
    const synth = window.speechSynthesis
    synth.addEventListener('voiceschanged', update)
    const wait = new AbortController()
    voiceWaitRef.current = wait
    void warmVoices(wait.signal).then(() => {
      if (!mounted || wait.signal.aborted) return
      update()
      setVoicesLoaded(true)
    })
    return () => {
      mounted = false
      mountedRef.current = false
      voiceWaitRef.current?.abort()
      voiceWaitRef.current = null
      synth.removeEventListener('voiceschanged', update)
    }
  }, [supported])

  useEffect(() => {
    runRef.current += 1
    stopRef.current?.()
    stopRef.current = null
    setPhase('idle')
    setCurrent(0)
    setPlayback({ scope: 'lesson', index: 0, total: 0 })
    setError('')
    const hidden = () => {
      if (!document.hidden) return
      runRef.current += 1
      stopRef.current?.()
      stopRef.current = null
      setPhase((previous) => previous === 'preparing' || previous === 'playing' || previous === 'shadowing' ? 'stopped' : previous)
    }
    document.addEventListener('visibilitychange', hidden)
    return () => {
      runRef.current += 1
      stopRef.current?.()
      stopRef.current = null
      document.removeEventListener('visibilitychange', hidden)
    }
  }, [lessonId, contentKey, locale])

  const canPlay = (selection: AudioLessonSegment[]) => selection.length > 0 && selection.every(
    (segment) => Boolean(segment.audioSrc) || (supported && hasLessonVoice(segment.lang, voices)),
  )
  const missing = [...new Set(items.filter(
    (segment) => !segment.audioSrc && !hasLessonVoice(segment.lang, voices),
  ).map((segment) => segment.lang))]
  const languageName = (lang: AudioLessonLanguage) => lang === 'ja-JP'
    ? en ? 'Japanese' : '日語'
    : lang === 'en-US'
      ? en ? 'English' : '英語'
      : en ? 'Taiwan Mandarin' : '臺灣華語'

  function play(selection: AudioLessonSegment[], scope: PlaybackScope) {
    if (!canPlay(selection)) return
    runRef.current += 1
    const run = runRef.current
    stopRef.current?.()
    stopRef.current = null
    setError('')
    setPlayback({ scope, index: 0, total: selection.length })
    setPhase('preparing')
    const ownedStop = startAudioLesson(selection, {
      rate,
      shadow,
      onSegment: (index) => {
        if (run !== runRef.current) return
        const item = selection[index]
        setCurrent(items.findIndex((segment) => segment.id === item.id))
        setPlayback((previous) => ({ ...previous, index }))
      },
      onPhase: (next) => {
        if (run !== runRef.current) return
        setPhase(next)
      },
      onError: (code) => {
        if (run !== runRef.current) return
        setError(code)
        setPhase('error')
      },
    })
    if (run === runRef.current) stopRef.current = ownedStop
    else ownedStop()
  }

  const completeText = playback.scope === 'examples'
    ? en ? 'Examples finished' : '原文示範播放完成'
    : playback.scope === 'replay'
      ? en ? 'Current segment finished' : '當句播放完成'
      : en ? 'Lesson finished' : '導讀完成'
  const phaseText = phase === 'preparing'
    ? en ? 'Preparing audio' : '正在準備語音'
    : phase === 'playing'
    ? en ? 'Playing' : '播放中'
    : phase === 'shadowing'
      ? en ? 'Your turn: repeat the example aloud' : '輪到你：請跟讀剛才的原文'
      : phase === 'complete'
        ? completeText
        : phase === 'stopped'
          ? en ? 'Stopped' : '已停止'
          : phase === 'error'
            ? en ? 'Playback failed; try again' : '播放失敗，可重試'
            : en ? 'Ready when you are' : '準備好即可開始'
  const errorText = error === 'unsupported'
    ? en ? 'Speech is unavailable in this browser. Use a browser with system speech support.' : '此瀏覽器不支援系統語音，請使用支援語音的瀏覽器。'
    : error === 'voice-unavailable'
      ? en ? 'The requested voice is unavailable. Enable that language on your device, then check voices again.' : '缺少適用語音，請在裝置啟用該語言後重新檢查。'
      : error === 'empty-lesson'
        ? en ? 'There is no spoken content in this lesson.' : '本課目前沒有可播放內容。'
        : error === 'playback-not-started' || error === 'playback-start-timeout'
          ? en ? 'Audio did not start. Check device audio and voice availability, then retry. Network-based voices may need a connection.' : '未確認語音開始播放。請檢查裝置音訊與可用語音後重試；連線型聲音可能需要網路。'
        : en ? 'Playback failed. Check your device audio and connection, then try again.' : '播放失敗，請檢查裝置音訊與連線後重試。'

  return (
    <section className="audio-lesson" aria-labelledby={headingId} onKeyDown={(event) => {
      if (event.key === 'Escape' && active) stop()
    }}>
      <div className="audio-lesson-heading">
        <h3 id={headingId}>{title ?? (en ? 'Audio lesson' : '語音教學')}</h3>
        <span>{en ? 'Example · Explanation · Your turn' : '原文示範・解說・跟讀'}</span>
      </div>
      <div className="audio-lesson-settings">
        <label>
          {en ? 'Speed' : '語速'}
          <select value={rate} onChange={(event) => {
            if (active) stop()
            setRate(Number(event.target.value))
          }}>
            <option value={0.95}>{en ? 'Normal' : '正常'}</option>
            <option value={0.7}>{en ? 'Slow' : '慢速'}</option>
          </select>
        </label>
        <label>
          <input type="checkbox" checked={shadow} onChange={(event) => {
            if (active) stop()
            setShadow(event.target.checked)
          }} />
          {en ? 'Leave time to repeat' : '留白跟讀'}
        </label>
      </div>
      <div className="audio-lesson-actions" aria-describedby={statusId}>
        <button type="button" className="primary-btn inline" disabled={!canPlay(items)} onClick={() => play(items, 'lesson')}>
          {en ? 'Play lesson' : '播放導讀'}
        </button>
        <button type="button" className="ghost" disabled={!canPlay(examples)} onClick={() => play(examples, 'examples')}>
          {en ? 'Play examples' : '聽原文示範'}
        </button>
        <button type="button" className="ghost" disabled={!items[current] || !canPlay([items[current]])} onClick={() => play([items[current]], 'replay')}>
          {en ? 'Replay current' : '重播當句'}
        </button>
        <button type="button" className="ghost" disabled={!active} onClick={stop}>
          {en ? 'Stop' : '停止'}
        </button>
      </div>
      <p id={statusId} className="audio-lesson-status" role="status" aria-live="polite" aria-atomic="true">
        {phaseText}{active && playback.total ? ` · ${playback.index + 1}/${playback.total}` : ''}
      </p>
      {playback.total > 0 && items[current] ? (
        <div className="audio-lesson-current">
          <p className="audio-lesson-current-label">
            {active ? en ? 'Current segment' : '目前段落' : en ? 'Replay target' : '重播目標'}
            {` · ${items[current].kind === 'example' ? en ? 'Example' : '原文示範' : en ? 'Explanation' : '解說'} · ${languageName(items[current].lang)}`}
          </p>
          <p lang={items[current].lang}>{items[current].text}</p>
        </div>
      ) : null}
      {!items.length ? <p>{en ? 'No spoken content is available yet.' : '目前沒有可播放內容。'}</p> : null}
      {!supported && items.some((segment) => !segment.audioSrc) ? (
        <p className="audio-lesson-notice">{en ? 'System speech is not supported in this browser. The lesson text remains available.' : '此瀏覽器不支援系統語音；教材文字仍可使用。'}</p>
      ) : supported && missing.length ? (
        <p className="audio-lesson-notice">
          {!voicesLoaded
            ? en ? 'Loading system voices…' : '正在載入系統語音…'
            : en
              ? `Missing voices: ${missing.map(languageName).join(', ')}. Enable these languages on your device and check again.`
              : `缺少適用語音：${missing.map(languageName).join('、')}。請在裝置啟用這些語言後重新檢查。`}
          <button type="button" className="ghost" onClick={() => {
            setVoices(availableVoices())
            voiceWaitRef.current?.abort()
            const wait = new AbortController()
            voiceWaitRef.current = wait
            void warmVoices(wait.signal).then(() => {
              if (wait.signal.aborted) return
              if (!mountedRef.current) return
              setVoices(availableVoices())
              setVoicesLoaded(true)
            })
          }}>{en ? 'Check voices again' : '重新檢查語音'}</button>
        </p>
      ) : null}
      {phase === 'error' ? <p className="audio-lesson-notice" role="alert">{errorText}</p> : null}
      <p className="audio-lesson-source">
        {sourceText}
      </p>
    </section>
  )
}
