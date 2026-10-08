import { useEffect, useRef, useState } from 'react'
import {
  isSpeechSupported,
  notifyPlaybackRequest,
  speakEnglish,
  speakJapanese,
  stopSpeaking,
  subscribeSpeechRequests,
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
  const mountedRef = useRef(false)
  const ownRequestRef = useRef(false)
  const supported = isSpeechSupported() || Boolean(audioSrc)
  const display = label ?? (lang === 'ja' ? '播放' : 'Speak')

  useEffect(() => {
    const voiceWait = new AbortController()
    mountedRef.current = true
    setSpeaking(false)
    void warmVoices(voiceWait.signal)
    const unsubscribe = subscribeSpeechRequests(() => {
      if (!ownRequestRef.current) stopOwned()
    })
    const stopForPageLifecycle = () => { voiceWait.abort(); stopOwned() }
    const hidden = () => { if (document.hidden) stopForPageLifecycle() }
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', hidden)
    window.addEventListener('pagehide', stopForPageLifecycle)
    return () => {
      mountedRef.current = false
      voiceWait.abort()
      unsubscribe()
      if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', hidden)
      window.removeEventListener('pagehide', stopForPageLifecycle)
      stopOwned()
    }
  }, [lang, text, audioSrc])

  function finish() {
    if (mountedRef.current) setSpeaking(false)
    stopRef.current = null
  }

  function stopOwned() {
    const stop = stopRef.current
    stopRef.current = null
    stop?.()
    finish()
  }

  function speakTts() {
    if (!isSpeechSupported() || !text.trim()) {
      finish()
      return
    }
    const opts = { onEnd: finish, onError: finish, onCancel: finish }
    const previousGuard = ownRequestRef.current
    ownRequestRef.current = true
    try {
      stopRef.current = lang === 'ja' ? speakJapanese(text, opts) : speakEnglish(text, opts)
    } finally {
      ownRequestRef.current = previousGuard
    }
  }

  function handleClick() {
    if (!text.trim() && !audioSrc) return
    if (speaking) return
    stopOwned()
    setSpeaking(true)
    ownRequestRef.current = true
    try {
      if (audioSrc) {
        notifyPlaybackRequest()
        stopSpeaking()
        let clipActive = true
        const stopClip = playClip(audioSrc, {
          onEnd: () => {
            if (!clipActive) return
            clipActive = false
            finish()
          },
          onError: () => {
            if (!clipActive) return
            clipActive = false
            stopRef.current?.()
            speakTts()
          },
        })
        if (clipActive) stopRef.current = stopClip
        else stopClip()
      } else speakTts()
    } finally {
      ownRequestRef.current = false
    }
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
