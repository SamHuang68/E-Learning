import { useEffect, useMemo, useRef, useState } from 'react'
import type { SpeakableCard } from '../data/practiceTypes'
import { SpeakButton } from './SpeakButton'

type SimplePrompt = { id: string; text: string; lang: 'ja' | 'en' }

type Props = {
  prompts: SpeakableCard[] | SimplePrompt[]
  lang?: 'ja' | 'en'
  onComplete: (count: number) => void
}

type SpeechRecognitionResultLike = {
  0?: { transcript: string }
}

type SpeechRecognitionEventLike = {
  resultIndex: number
  results: ArrayLike<SpeechRecognitionResultLike>
}

type MinimalSpeechRecognition = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type SpeechRecognitionCtor = new () => MinimalSpeechRecognition

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

function promptKeywordSource(prompt: SpeakableCard | SimplePrompt): string {
  if ('head' in prompt) return `${prompt.head} ${prompt.sentence}`
  return prompt.text
}

function normalizeKeywordText(value: string): string {
  return value
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/[\p{P}\p{S}]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function keywordTokens(prompt: SpeakableCard | SimplePrompt): string[] {
  const source = promptKeywordSource(prompt)
  const spaced = normalizeKeywordText(source)
  const latinTokens = spaced.split(' ').filter((token) => token.length >= 3)
  if (latinTokens.length > 1) return [...new Set(latinTokens)].slice(0, 6)

  return [
    ...new Set(
      source
        .split(/[、。！？!?\s]+/)
        .map((token) => normalizeKeywordText(token))
        .filter((token) => token.length >= 2),
    ),
  ].slice(0, 6)
}

function speechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const speechWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null
}

export function SpeakingLab({ prompts, lang = 'ja', onComplete }: Props) {
  const [index, setIndex] = useState(0)
  const [recording, setRecording] = useState(false)
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)
  const [doneIds, setDoneIds] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [transcript, setTranscript] = useState('')
  const [keywordChecks, setKeywordChecks] = useState<
    Array<{ token: string; matched: boolean }>
  >([])
  const [recognizing, setRecognizing] = useState(false)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const recognitionRef = useRef<MinimalSpeechRecognition | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const mediaSupported = typeof MediaRecorder !== 'undefined'
  const speechSupported = speechRecognitionCtor() !== null
  const prompt = prompts[index]
  const doneSet = useMemo(() => new Set(doneIds), [doneIds])

  useEffect(() => {
    return () => {
      if (recordingUrl) URL.revokeObjectURL(recordingUrl)
      recorderRef.current?.stream.getTracks().forEach((track) => track.stop())
      recognitionRef.current?.abort()
    }
  }, [recordingUrl])

  useEffect(() => {
    setTranscript('')
    setKeywordChecks([])
    setMessage('')
    recognitionRef.current?.abort()
    setRecognizing(false)
  }, [prompt?.id])

  function updateKeywordChecks(nextTranscript: string) {
    if (!prompt) return
    const normalizedTranscript = normalizeKeywordText(nextTranscript)
    setKeywordChecks(
      keywordTokens(prompt).map((token) => ({
        token,
        matched: normalizedTranscript.includes(token),
      })),
    )
  }

  function startKeywordCapture() {
    if (!prompt) return
    const Recognition = speechRecognitionCtor()
    if (!Recognition) {
      setMessage('此瀏覽器不支援語音辨識；可手動標記跟讀完成。')
      return
    }

    try {
      recognitionRef.current?.abort()
      const recognition = new Recognition()
      recognition.lang = promptLang(prompt, lang) === 'ja' ? 'ja-JP' : 'en-US'
      recognition.interimResults = false
      recognition.maxAlternatives = 1
      recognition.onresult = (event) => {
        const heard = Array.from(
          { length: event.results.length - event.resultIndex },
          (_, offset) => event.results[event.resultIndex + offset]?.[0]?.transcript ?? '',
        )
          .join(' ')
          .trim()
        if (!heard) return
        setTranscript((previous) => {
          const next = `${previous} ${heard}`.trim()
          updateKeywordChecks(next)
          return next
        })
      }
      recognition.onerror = () => {
        setMessage('語音辨識暫時失敗；仍可標記跟讀完成。')
      }
      recognition.onend = () => {
        setRecognizing(false)
      }
      recognitionRef.current = recognition
      recognition.start()
      setRecognizing(true)
      setMessage('正在辨識關鍵字，請跟讀範句。')
    } catch {
      setRecognizing(false)
      setMessage('無法啟用語音辨識；仍可標記跟讀完成。')
    }
  }

  async function startRecording() {
    if (!mediaSupported || !navigator.mediaDevices?.getUserMedia) {
      setMessage('此瀏覽器不支援錄音；仍可標記跟讀完成。')
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
      setMessage('')
      if (speechSupported) startKeywordCapture()
    } catch {
      setMessage('無法啟用麥克風；仍可標記跟讀完成。')
    }
  }

  function stopRecording() {
    recorderRef.current?.stop()
    recognitionRef.current?.stop()
    if (transcript) updateKeywordChecks(transcript)
    setRecording(false)
  }

  function markDone() {
    if (!prompt || doneSet.has(prompt.id)) return
    if (speechSupported && !transcript && !recognizing) startKeywordCapture()
    if (transcript) updateKeywordChecks(transcript)
    const nextDone = [...doneIds, prompt.id]
    setDoneIds(nextDone)
    onComplete(nextDone.length)
  }

  if (!prompt) {
    return (
      <section className="practice-view speaking-lab">
        <p className="eyebrow">SPEAKING</p>
        <div className="practice-card">
          <div className="flash-face">
            <strong>沒有跟讀句</strong>
            <p>No speaking prompts are available.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="practice-view speaking-lab">
      <p className="eyebrow">SPEAKING · SHADOWING</p>
      <h1>
        跟讀實驗室
        <span>
          {index + 1} / {prompts.length}
        </span>
      </h1>
      <div className="practice-card">
        <div className="flash-face">
          <strong>{promptTitle(prompt)}</strong>
          <p>{promptText(prompt)}</p>
          {'meaning' in prompt ? (
            <span className="flash-meaning">{prompt.meaning}</span>
          ) : null}
        </div>
        <div className="flash-actions">
          <SpeakButton lang={promptLang(prompt, lang)} text={promptText(prompt)} label="播放範句" />
          {mediaSupported ? (
            recording ? (
              <button type="button" className="primary-btn inline" onClick={stopRecording}>
                停止錄音
              </button>
            ) : (
              <button type="button" className="ghost" onClick={() => void startRecording()}>
                開始錄音
              </button>
            )
          ) : (
            <span className="status-line warn">此瀏覽器不支援 MediaRecorder。</span>
          )}
          {speechSupported ? (
            <button
              type="button"
              className={recognizing ? 'primary-btn inline' : 'ghost'}
              onClick={startKeywordCapture}
              disabled={recognizing}
            >
              {recognizing ? '辨識中…' : '辨識關鍵字'}
            </button>
          ) : (
            <span className="status-line warn">此瀏覽器不支援語音辨識 checklist。</span>
          )}
          <button
            type="button"
            className={doneSet.has(prompt.id) ? 'ghost' : 'primary-btn inline'}
            onClick={markDone}
          >
            {doneSet.has(prompt.id) ? '已完成' : '標記跟讀完成'}
          </button>
        </div>
        {recordingUrl ? (
          <audio controls src={recordingUrl} aria-label="你的錄音回放" />
        ) : null}
        {message ? <p className="status-line warn">{message}</p> : null}
        {transcript ? (
          <p className="status-line">Transcript: {transcript}</p>
        ) : null}
        {keywordChecks.length > 0 ? (
          <div className="keyword-checklist" aria-label="Speaking keyword checklist">
            {keywordChecks.map((check) => (
              <span key={check.token} className={check.matched ? 'matched' : 'missed'}>
                {check.matched ? '✓' : '✗'} {check.token}
              </span>
            ))}
          </div>
        ) : null}
        <div className="flash-actions">
          <button
            type="button"
            className="ghost"
            disabled={index <= 0}
            onClick={() => setIndex((current) => Math.max(0, current - 1))}
          >
            ← 上一句
          </button>
          <button
            type="button"
            className="ghost"
            disabled={index >= prompts.length - 1}
            onClick={() => setIndex((current) => Math.min(prompts.length - 1, current + 1))}
          >
            下一句 →
          </button>
        </div>
      </div>
    </section>
  )
}
