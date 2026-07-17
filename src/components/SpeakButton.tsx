import { useEffect, useState } from 'react'
import {
  isSpeechSupported,
  speakEnglish,
  speakJapanese,
  warmVoices,
} from '../utils/speech'

type Props = {
  lang: 'ja' | 'en'
  text: string
  label?: string
  className?: string
}

export function SpeakButton({ lang, text, label, className }: Props) {
  const [speaking, setSpeaking] = useState(false)
  const supported = isSpeechSupported()
  const display = label ?? (lang === 'ja' ? '播放' : 'Speak')

  useEffect(() => {
    void warmVoices()
  }, [])

  function handleClick() {
    if (!supported || !text.trim() || speaking) return
    setSpeaking(true)
    const opts = {
      onEnd: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    }
    if (lang === 'ja') speakJapanese(text, opts)
    else speakEnglish(text, opts)
  }

  return (
    <button
      type="button"
      className={`speak-btn ${className ?? ''}`.trim()}
      onClick={handleClick}
      disabled={!supported || !text.trim() || speaking}
      aria-busy={speaking}
    >
      {speaking ? (lang === 'ja' ? '播放中…' : 'Playing…') : `🔊 ${display}`}
    </button>
  )
}
