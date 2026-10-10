import { useEffect, useId, useRef, useState } from 'react'
import { useI18n } from '../i18n/i18n'
import { isSpeechSupported, warmVoices } from '../utils/speech'
import { startAudioLesson } from '../utils/audioLessonPlayback'
import { hasLessonVoice } from '../utils/audioLessonVoices'
import { loadAudioLessonPreferences, saveAudioLessonPreferences, type AudioLessonPreferences } from '../utils/storage'
import { checkExcerpt, recordCheckPhase, type AudioCheck } from '../utils/語音檢查'
import { AudioCheckPanel, AudioSourceLabel } from './語音檢查面板'
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

type PlaybackScope = 'lesson' | 'remaining' | 'examples' | 'replay' | 'check'

function availableVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return []
  try {
    return window.speechSynthesis.getVoices()
  } catch {
    return []
  }
}

function secondsUntil(deadline: number) {
  return Math.max(0, Math.ceil((deadline - performance.now()) / 1000))
}

function ShadowCountdown({ deadline, en }: { deadline: number; en: boolean }) {
  const [seconds, setSeconds] = useState(() => secondsUntil(deadline))
  useEffect(() => {
    const timer = window.setInterval(() => {
      const next = secondsUntil(deadline)
      setSeconds(next)
      if (next === 0) window.clearInterval(timer)
    }, 200)
    return () => window.clearInterval(timer)
  }, [deadline])
  return <p className="audio-lesson-preferences audio-lesson-countdown" role="timer" aria-live="off">
    {en ? `About ${seconds} ${seconds === 1 ? 'second' : 'seconds'} left to repeat` : `留白剩餘約 ${seconds} 秒`}
  </p>
}

export function AudioLesson({ lessonId, title, segments }: Props) {
  const { locale } = useI18n()
  const en = locale === 'en'
  const headingId = useId()
  const statusId = useId()
  const navigationId = useId()
  const supported = isSpeechSupported()
  const [voices, setVoices] = useState(availableVoices)
  const [voicesLoaded, setVoicesLoaded] = useState(() => availableVoices().length > 0)
  const [phase, setPhase] = useState<AudioLessonPhase | 'idle'>('idle')
  const [current, setCurrent] = useState(0)
  const [playback, setPlayback] = useState({ scope: 'lesson' as PlaybackScope, index: 0, total: 0 })
  const [preferences, setPreferences] = useState(loadAudioLessonPreferences)
  const { rate, shadow, shadowLength } = preferences
  const [preferencesSaved, setPreferencesSaved] = useState(true)
  const [error, setError] = useState('')
  const [diagnostic, setDiagnostic] = useState<AudioCheck | null>(null)
  const [checkText, setCheckText] = useState<string | null>(null)
  const [shadowTiming, setShadowTiming] = useState({ deadline: 0 })
  const stopRef = useRef<(() => void) | null>(null)
  const continueRef = useRef<(() => void) | null>(null)
  const runRef = useRef(0)
  const mountedRef = useRef(false)
  const voiceWaitRef = useRef<AbortController | null>(null)
  const contentKey = JSON.stringify(segments)
  const items = segments.filter((segment) => segment.text.trim() || segment.audioSrc)
  const remaining = current >= 0 ? items.slice(current) : []
  const examples = items.filter((segment) => segment.kind === 'example')
  const samples = [...new Set(items.map((segment) => segment.lang))].flatMap((lang) => {
    const segment = items.find((item) => item.lang === lang && item.text.trim())
    const sample = segment ? checkExcerpt(segment) : null
    return sample ? [sample] : []
  })
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
    continueRef.current = null
    setShadowTiming({ deadline: 0 })
    stopRef.current?.()
    stopRef.current = null
    setPhase('stopped')
    setDiagnostic((previous) => previous ? recordCheckPhase(previous, 'stopped') : null)
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
    continueRef.current = null
    setShadowTiming({ deadline: 0 })
    stopRef.current?.()
    stopRef.current = null
    setPhase('idle')
    setCurrent(0)
    setPlayback({ scope: 'lesson', index: 0, total: 0 })
    setError('')
    setDiagnostic(null)
    setCheckText(null)
    const hidden = () => {
      if (!document.hidden) return
      runRef.current += 1
      continueRef.current = null
      setShadowTiming({ deadline: 0 })
      stopRef.current?.()
      stopRef.current = null
      setPhase((previous) => previous === 'preparing' || previous === 'playing' || previous === 'shadowing' ? 'stopped' : previous)
      setDiagnostic((previous) => previous && ['preparing', 'playing', 'shadowing'].includes(previous.phase)
        ? recordCheckPhase(previous, 'stopped') : previous)
    }
    document.addEventListener('visibilitychange', hidden)
    return () => {
      runRef.current += 1
      continueRef.current = null
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
    continueRef.current = null
    setShadowTiming({ deadline: 0 })
    stopRef.current?.()
    stopRef.current = null
    setError('')
    setPlayback({ scope, index: 0, total: selection.length })
    setPhase('preparing')
    setCheckText(scope === 'check' ? selection[0].text : null)
    setDiagnostic({ startedAt: Date.now(), rate, isCheck: scope === 'check', phase: 'preparing',
      source: null, error: null, heard: null, started: false, events: [] })
    const ownedStop = startAudioLesson(selection, {
      rate,
      shadow: scope === 'check' ? false : shadow,
      shadowLength,
      onShadowing: (continuePlayback, deadline) => {
        if (run !== runRef.current) return
        continueRef.current = continuePlayback
        setShadowTiming({ deadline })
      },
      onSource: (source) => {
        if (run !== runRef.current) return
        setDiagnostic((previous) => previous ? { ...previous, source } : null)
      },
      onSegment: (index) => {
        if (run !== runRef.current) return
        const item = selection[index]
        setCurrent(items.findIndex((segment) => segment.id === item.id))
        setPlayback((previous) => ({ ...previous, index }))
      },
      onPhase: (next) => {
        if (run !== runRef.current) return
        if (next !== 'shadowing') {
          continueRef.current = null
          setShadowTiming({ deadline: 0 })
        }
        setPhase(next)
        setDiagnostic((previous) => previous ? recordCheckPhase(previous, next) : null)
      },
      onError: (code) => {
        if (run !== runRef.current) return
        setError(code)
        setPhase('error')
        setDiagnostic((previous) => previous ? { ...previous, error: code } : null)
      },
    })
    if (run === runRef.current) stopRef.current = ownedStop
    else ownedStop()
  }

  function refreshVoices() {
    setVoices(availableVoices())
    voiceWaitRef.current?.abort()
    const wait = new AbortController()
    voiceWaitRef.current = wait
    void warmVoices(wait.signal).then(() => {
      if (wait.signal.aborted || !mountedRef.current) return
      setVoices(availableVoices())
      setVoicesLoaded(true)
    })
  }

  function changePreferences(next: AudioLessonPreferences) {
    if (active) stop()
    setPreferences(next)
    setPreferencesSaved(saveAudioLessonPreferences(next))
  }

  function selectSegment(index: number) {
    if (!Number.isInteger(index) || index < 0 || index >= items.length) return
    stop()
    setCurrent(index)
    setPlayback({ scope: 'replay', index: 0, total: 1 })
    setPhase('idle')
    setError('')
    setDiagnostic(null)
    setCheckText(null)
  }

  function segmentLabel(segment: AudioLessonSegment, index: number) {
    const text = Array.from(segment.text.trim().replace(/\s+/g, ' '))
    const excerpt = text.length ? text.slice(0, 70).join('') + (text.length > 70 ? '…' : '')
      : en ? 'Lesson audio' : '教材音檔'
    return `${index + 1} / ${items.length} · ${segment.kind === 'example' ? en ? 'Example' : '原文示範' : en ? 'Explanation' : '解說'} · ${languageName(segment.lang)} · ${excerpt}`
  }

  const completeText = playback.scope === 'check'
    ? en ? 'Test events finished; confirm whether you heard it' : '試播事件已結束，請確認是否聽到'
    : playback.scope === 'remaining'
      ? en ? 'Remaining segments finished' : '剩餘段落播放完成'
    : playback.scope === 'examples'
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
          ? en ? 'Audio did not start. Check site muting, device audio and voice availability, then retry. Network-based voices may need a connection.' : '未確認語音開始播放。請檢查網站靜音、裝置音訊與可用語音後重試；連線型聲音可能需要網路。'
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
            changePreferences({ ...preferences, rate: event.target.value === '0.7' ? 0.7 : 0.95 })
          }}>
            <option value={0.95}>{en ? 'Normal' : '正常'}</option>
            <option value={0.7}>{en ? 'Slow' : '慢速'}</option>
          </select>
        </label>
        <label>
          <input type="checkbox" checked={shadow} onChange={(event) => {
            changePreferences({ ...preferences, shadow: event.target.checked })
          }} />
          {en ? 'Leave time to repeat' : '留白跟讀'}
        </label>
        <label>
          {en ? 'Repeat time' : '留白長度'}
          <select value={shadowLength} disabled={!shadow} onChange={(event) => {
            changePreferences({ ...preferences, shadowLength: event.target.value === 'extended' ? 'extended' : 'standard' })
          }}>
            <option value="standard">{en ? 'Standard' : '標準'}</option>
            <option value="extended">{en ? 'Longer (2×)' : '加長（2 倍）'}</option>
          </select>
        </label>
      </div>
      <p className="audio-lesson-preferences">
        {en ? 'Preferences stay in this browser; they are not included in progress exports or sync.' : '偏好僅限本瀏覽器，不會隨學習進度匯出或同步。'}
      </p>
      {!preferencesSaved ? <p className="audio-lesson-notice" role="alert">
        {en ? 'Preferences could not be saved. These settings still apply here, but reopening may restore the previous values.' : '偏好未能儲存。此畫面仍使用新設定，重新開啟可能回復舊值。'}
      </p> : null}
      {items.length > 0 ? <div className="audio-lesson-navigation">
        <label>
          {en ? 'Choose segment' : '選擇段落'}
          <select value={current} aria-describedby={navigationId} onChange={(event) => selectSegment(Number(event.target.value))}>
            {items.map((segment, index) => <option key={segment.id} value={index}>{segmentLabel(segment, index)}</option>)}
          </select>
        </label>
        <div className="audio-lesson-actions">
          <button type="button" className="ghost" disabled={current <= 0} onClick={() => selectSegment(current - 1)}>{en ? 'Previous segment' : '上一段'}</button>
          <button type="button" className="ghost" disabled={current >= items.length - 1} onClick={() => selectSegment(current + 1)}>{en ? 'Next segment' : '下一段'}</button>
        </div>
        <p id={navigationId}>{en ? 'Changing the selection stops playback. Replay current plays one segment; Play from here continues to the end. Earlier examples and their repeat time are skipped.' : '更換段落會停止目前播放。「重播當句」播放單段；「從此段播放」接續到課尾，不補播前方原文或其留白。'}</p>
      </div> : null}
      <div className="audio-lesson-actions" aria-describedby={statusId}>
        <button type="button" className="primary-btn inline" disabled={!canPlay(items)} onClick={() => play(items, 'lesson')}>
          {en ? 'Play lesson' : '播放導讀'}
        </button>
        <button type="button" className="ghost" aria-describedby={items.length ? navigationId : undefined} disabled={!canPlay(remaining)} onClick={() => play(remaining, 'remaining')}>
          {en ? 'Play from here' : '從此段播放'}
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
        <button type="button" className="ghost" disabled={phase !== 'shadowing'} onClick={() => {
          const continuePlayback = continueRef.current
          continueRef.current = null
          continuePlayback?.()
        }}>
          {en ? 'Continue now' : '立即接續'}
        </button>
      </div>
      <p id={statusId} className="audio-lesson-status" role="status" aria-live="polite" aria-atomic="true">
        {phaseText}{active && playback.total ? ` · ${playback.index + 1}/${playback.total}` : ''}
      </p>
      {phase === 'shadowing' && shadowTiming.deadline > 0
        ? <ShadowCountdown key={shadowTiming.deadline} deadline={shadowTiming.deadline} en={en} /> : null}
      {phase === 'shadowing' ? <p className="audio-lesson-preferences">
        {en
          ? 'The lesson continues automatically after repeat time. Choose Continue now when you are ready. The last group finishes playback.'
          : '留白結束後會自動接續；練習完成可按「立即接續」。最後一組會結束播放。'}
      </p> : null}
      {playback.total > 0 && items[current] ? (
        <div className="audio-lesson-current">
          <p className="audio-lesson-current-label">
            {playback.scope === 'check' ? en ? 'Test excerpt' : '試播節錄' : active ? en ? 'Current segment' : '目前段落' : en ? 'Replay target' : '重播目標'}
            {` · ${items[current].kind === 'example' ? en ? 'Example' : '原文示範' : en ? 'Explanation' : '解說'} · ${languageName(items[current].lang)}`}
          </p>
          <p lang={items[current].lang}>{checkText ?? items[current].text}</p>
          {playback.scope === 'check' ? <p>{en ? 'Replay current plays the full source segment.' : '「重播當句」會播放完整原始段落。'}</p> : null}
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
          <button type="button" className="ghost" onClick={refreshVoices}>{en ? 'Check voices again' : '重新檢查語音'}</button>
        </p>
      ) : null}
      {phase === 'error' ? <p className="audio-lesson-notice" role="alert">{errorText}</p> : null}
      {diagnostic?.source ? <AudioSourceLabel source={diagnostic.source} en={en} /> : null}
      <AudioCheckPanel en={en} check={diagnostic} samples={samples} canPlay={canPlay}
        languageName={languageName} onPlay={(sample) => play([sample], 'check')} onRefresh={refreshVoices}
        onHeard={(heard) => setDiagnostic((previous) => previous ? { ...previous, heard } : null)} />
      <p className="audio-lesson-source">
        {sourceText}
      </p>
    </section>
  )
}
