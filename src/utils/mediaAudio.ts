export function playClip(
  src: string,
  opts: { rate?: number; onStart?: () => void; onEnd?: () => void; onError?: (code?: string) => void } = {},
): () => void {
  if (!src || typeof Audio === 'undefined') {
    opts.onError?.()
    return () => undefined
  }

  let active = true
  let started = false
  let progressWatch: ReturnType<typeof setInterval> | undefined
  const resolved =
    /^https?:\/\//i.test(src) || src.startsWith('/')
      ? src
      : `${(import.meta.env.BASE_URL || '/').replace(/\/?$/, '/')}${src.replace(/^\//, '')}`
  const audio = new Audio()
  audio.playbackRate = opts.rate ?? 1
  audio.preload = 'none'
  audio.src = resolved

  const cleanup = () => {
    clearTimeout(startupTimer)
    clearInterval(progressWatch)
    audio.onplaying = null
    audio.onended = null
    audio.onerror = null
  }
  const resetAudio = () => {
    try {
      audio.pause()
      audio.currentTime = 0
    } catch {
      /* no-op fallback */
    }
  }
  const fail = (code: string) => {
    if (!active) return
    active = false
    cleanup()
    resetAudio()
    opts.onError?.(code)
  }
  const startupTimer = setTimeout(() => fail('playback-start-timeout'), 10000)
  audio.onplaying = () => {
    if (!active || started) return
    started = true
    clearTimeout(startupTimer)
    let lastPosition = audio.currentTime
    let lastProgressAt = Date.now()
    // 只限制連續無進度的等候；慢速與長音檔只要前進就持續播放。
    progressWatch = setInterval(() => {
      if (!active) return
      const position = audio.currentTime
      if (Number.isFinite(position)) {
        if (position > lastPosition) lastProgressAt = Date.now()
        lastPosition = position
      }
      if (Date.now() - lastProgressAt >= 10000) fail('playback-failed')
    }, 250)
    opts.onStart?.()
  }
  audio.onended = () => {
    if (!active) return
    if (!started) {
      fail('playback-not-started')
      return
    }
    active = false
    cleanup()
    opts.onEnd?.()
  }
  audio.onerror = () => fail('playback-failed')

  try {
    void audio.play().catch(() => fail('playback-failed'))
  } catch {
    fail('playback-failed')
  }

  return () => {
    if (!active) return
    active = false
    cleanup()
    resetAudio()
  }
}
