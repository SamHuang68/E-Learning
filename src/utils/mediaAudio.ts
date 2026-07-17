export function playClip(
  src: string,
  opts: { onEnd?: () => void; onError?: () => void } = {},
): () => void {
  if (!src || typeof Audio === 'undefined') {
    opts.onError?.()
    return () => undefined
  }

  let stopped = false
  const resolved =
    /^https?:\/\//i.test(src) || src.startsWith('/')
      ? src
      : `${(import.meta.env.BASE_URL || '/').replace(/\/?$/, '/')}${src.replace(/^\//, '')}`
  const audio = new Audio(resolved)

  const cleanup = () => {
    audio.onended = null
    audio.onerror = null
  }

  audio.onended = () => {
    cleanup()
    if (!stopped) opts.onEnd?.()
  }
  audio.onerror = () => {
    cleanup()
    if (!stopped) opts.onError?.()
  }

  void audio.play().catch(() => {
    cleanup()
    if (!stopped) opts.onError?.()
  })

  return () => {
    stopped = true
    cleanup()
    try {
      audio.pause()
      audio.currentTime = 0
    } catch {
      /* no-op fallback */
    }
  }
}
