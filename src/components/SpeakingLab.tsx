import { useEffect, useMemo, useRef, useState } from 'react'
import type { SpeakableCard } from '../data/practiceTypes'
import { useI18n } from '../i18n/i18n'
import { SpeakButton } from './SpeakButton'
import { formatSpeakingMessage, type SpeakingMessageCode } from './speakingCopy'

type SimplePrompt = { id: string; text: string; lang: 'ja' | 'en' }

type Props = {
  prompts: SpeakableCard[] | SimplePrompt[]
  lang?: 'ja' | 'en'
  onComplete: (count: number) => void
}

function promptText(prompt: SpeakableCard | SimplePrompt): string {
  return 'text' in prompt ? prompt.text : (prompt.speakText ?? prompt.sentence)
}

function promptLang(
  prompt: SpeakableCard | SimplePrompt,
  fallback: 'ja' | 'en',
): 'ja' | 'en' {
  return 'lang' in prompt ? prompt.lang : fallback
}

function promptTitle(prompt: SpeakableCard | SimplePrompt): string {
  return 'head' in prompt ? prompt.head : prompt.text
}

export function SpeakingLab({ prompts, lang = 'ja', onComplete }: Props) {
  const { locale } = useI18n()
  const isEn = locale === 'en'
  const [index, setIndex] = useState(0)
  const [recording, setRecording] = useState(false)
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)
  const [doneIds, setDoneIds] = useState<string[]>([])
  const [messageCode, setMessageCode] = useState<SpeakingMessageCode>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const mediaSupported = typeof MediaRecorder !== 'undefined'
  const prompt = prompts[index]
  const doneSet = useMemo(() => new Set(doneIds), [doneIds])
  const message = formatSpeakingMessage(locale, messageCode)

  useEffect(() => {
    return () => {
      if (recordingUrl) URL.revokeObjectURL(recordingUrl)
      recorderRef.current?.stream.getTracks().forEach((track) => track.stop())
    }
  }, [recordingUrl])

  async function startRecording() {
    if (!mediaSupported || !navigator.mediaDevices?.getUserMedia) {
      setMessageCode('unsupported')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType })
        setRecordingUrl((previous) => {
          if (previous) URL.revokeObjectURL(previous)
          return URL.createObjectURL(blob)
        })
        stream.getTracks().forEach((track) => track.stop())
      }
      recorderRef.current = recorder
      recorder.start()
      setRecording(true)
      setMessageCode(null)
    } catch {
      setMessageCode('microphone-error')
    }
  }

  function stopRecording() {
    recorderRef.current?.stop()
    setRecording(false)
  }

  function markDone() {
    if (!prompt || doneSet.has(prompt.id)) return
    const nextDone = [...doneIds, prompt.id]
    setDoneIds(nextDone)
    onComplete(nextDone.length)
  }

  if (!prompt) {
    return (
      <section className="practice-view speaking-lab" lang={locale}>
        <p className="eyebrow">SPEAKING</p>
        <div className="practice-card">
          <div className="flash-face">
            <strong>{isEn ? 'No shadowing prompts available' : '沒有跟讀句'}</strong>
            <p>No speaking prompts are available.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="practice-view speaking-lab" lang={locale}>
      <p className="eyebrow">SPEAKING · SHADOWING</p>
      <h1>
        {isEn ? 'Shadowing Lab' : '跟讀實驗室'}
        <span>
          {index + 1} / {prompts.length}
        </span>
      </h1>
      <div className="practice-card">
        <div className="flash-face">
          <strong lang={promptLang(prompt, lang)}>{promptTitle(prompt)}</strong>
          <p lang={promptLang(prompt, lang)}>{promptText(prompt)}</p>
          {'meaning' in prompt ? (
            <span className="flash-meaning">{prompt.meaning}</span>
          ) : null}
        </div>
        <div className="flash-actions">
          <SpeakButton
            lang={promptLang(prompt, lang)}
            text={promptText(prompt)}
            label={isEn ? 'Play model sentence' : '播放範句'}
          />
          {mediaSupported ? (
            recording ? (
              <button type="button" className="primary-btn inline" onClick={stopRecording}>
                {isEn ? 'Stop recording' : '停止錄音'}
              </button>
            ) : (
              <button type="button" className="ghost" onClick={() => void startRecording()}>
                {isEn ? 'Start recording' : '開始錄音'}
              </button>
            )
          ) : (
            <span className="status-line warn">
              {isEn ? 'This browser does not support MediaRecorder.' : '此瀏覽器不支援 MediaRecorder。'}
            </span>
          )}
          <button
            type="button"
            className={doneSet.has(prompt.id) ? 'ghost' : 'primary-btn inline'}
            onClick={markDone}
          >
            {doneSet.has(prompt.id)
              ? isEn ? 'Completed' : '已完成'
              : isEn ? 'Mark shadowing complete' : '標記跟讀完成'}
          </button>
        </div>
        {recording && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              height: '32px',
              margin: '0.5rem 0',
              padding: '0.3rem',
              background: 'rgba(239, 68, 68, 0.08)',
              borderRadius: '8px',
            }}
          >
            {[14, 26, 12, 28, 18, 30, 16, 24, 12, 26, 20, 10].map((h, i) => (
              <span
                key={i}
                style={{
                  width: '4px',
                  height: `${h}px`,
                  borderRadius: '2px',
                  background: '#ef4444',
                  animation: `pulse 0.6s infinite alternate ${i * 0.08}s`,
                }}
              />
            ))}
            <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600, marginLeft: '6px' }}>
              {isEn
                ? '🎙️ Recording · Shadow the sentence into your microphone'
                : '🎙️ 錄音進行中 · 請對著麥克風跟讀'}
            </span>
          </div>
        )}
        {recordingUrl ? (
          <audio
            controls
            preload="none"
            src={recordingUrl}
            aria-label={isEn ? 'Play back your recording' : '你的錄音回放'}
            style={{ width: '100%', marginTop: '0.4rem' }}
          />
        ) : null}
        <p className={message ? 'status-line warn' : undefined} role="status" aria-live="polite">{message}</p>
        <div className="flash-actions">
          <button
            type="button"
            className="ghost"
            disabled={index <= 0}
            onClick={() => setIndex((current) => Math.max(0, current - 1))}
          >
            {isEn ? '← Previous sentence' : '← 上一句'}
          </button>
          <button
            type="button"
            className="ghost"
            disabled={index >= prompts.length - 1}
            onClick={() => setIndex((current) => Math.min(prompts.length - 1, current + 1))}
          >
            {isEn ? 'Next sentence →' : '下一句 →'}
          </button>
        </div>
      </div>
    </section>
  )
}
