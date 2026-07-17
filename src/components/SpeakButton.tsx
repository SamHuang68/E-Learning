import { useEffect, useRef, useState } from 'react'
import {
  isSpeechSupported,
  speakEnglish,
  speakJapanese,
  warmVoices,
} from '../utils/speech'
import { playClip } from '../utils/mediaAudio'

type Props = {
  lang: 'ja' | 'en'
  text: string
  label?: string
  className?: string
  /** Prefabricated audio clip; falls back to TTS on error/missing. */
  audioSrc?: string
}

export function SpeakButton({ lang, text, label, className, audioSrc }: Props) {
  const [speaking, setSpeaking] = useState(false)
  const stopRef = useRef<(() => void) | null>(null)
  const supported = isSpeechSupported() || Boolean(audioSrc)
  const display = label ?? (lang === 'ja' ? '播放' : 'Speak')

  useEffect(() => {
    void warmVoices()
    return () => {
      stopRef.current?.()
      stopRef.current = null
    }
  }, [])

  function finish() {
    setSpeaking(false)
    stopRef.current = null
  }

  function speakTts() {
    if (!isSpeechSupported() || !text.trim()) {
      finish()
      return
    }
    const opts = { onEnd: finish, onError: finish }
    if (lang === 'ja') speakJapanese(text, opts)
    else speakEnglish(text, opts)
  }

  function handleClick() {
    if (!text.trim() && !audioSrc) return
    if (speaking) return
    setSpeaking(true)
    stopRef.current?.()

    if (audioSrc) {
      stopRef.current = playClip(audioSrc, {
        onEnd: finish,
        onError: () => speakTts(),
      })
      return
    }

    speakTts()
  }

  return (
    <button
      type="button"
      className={`speak-btn ${className ?? ''}`.trim()}
      onClick={handleClick}
      disabled={!supported || speaking || (!text.trim() && !audioSrc)}
      aria-busy={speaking}
    >
      {speaking ? (lang === 'ja' ? '播放中…' : 'Playing…') : `🔊 ${display}`}
    </button>
  )
}
