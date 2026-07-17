import { useEffect, useMemo, useRef, useState } from 'react'
import type { SpeakableCard } from '../data/practiceTypes'
import { SpeakButton } from './SpeakButton'

type SimplePrompt = { id: string; text: string; lang: 'ja' | 'en' }

type Props = {
  prompts: SpeakableCard[] | SimplePrompt[]
  onComplete: (count: number) => void
}

function promptText(prompt: SpeakableCard | SimplePrompt): string {
  return 'text' in prompt ? prompt.text : (prompt.speakText ?? prompt.sentence)
}

function promptLang(prompt: SpeakableCard | SimplePrompt): 'ja' | 'en' {
  return 'lang' in prompt ? prompt.lang : 'ja'
}

function promptTitle(prompt: SpeakableCard | SimplePrompt): string {
  return 'head' in prompt ? prompt.head : prompt.text
}

export function SpeakingLab({ prompts, onComplete }: Props) {
  const [index, setIndex] = useState(0)
  const [recording, setRecording] = useState(false)
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)
  const [doneIds, setDoneIds] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const mediaSupported = typeof MediaRecorder !== 'undefined'
  const prompt = prompts[index]
  const doneSet = useMemo(() => new Set(doneIds), [doneIds])

  useEffect(() => {
    return () => {
      if (recordingUrl) URL.revokeObjectURL(recordingUrl)
      recorderRef.current?.stream.getTracks().forEach((track) => track.stop())
    }
  }, [recordingUrl])

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
    } catch {
      setMessage('無法啟用麥克風；仍可標記跟讀完成。')
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
          <SpeakButton lang={promptLang(prompt)} text={promptText(prompt)} label="播放範句" />
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
