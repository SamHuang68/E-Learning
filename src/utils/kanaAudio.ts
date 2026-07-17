type SpeakOptions = {
  onStart?: () => void
  onEnd?: () => void
  onError?: () => void
}

/**
 * Web Audio playback — avoids HTMLAudioElement's "first clip quieter" quirk
 * (browser media pipeline warm-up / soft open on the first <audio>.play()).
 */
let ctx: AudioContext | null = null
const bufferCache = new Map<string, AudioBuffer>()
let activeSource: AudioBufferSourceNode | null = null
let playGen = 0

function audioBase() {
  const base = import.meta.env.BASE_URL || '/'
  return base.endsWith('/') ? `${base}audio/kana/` : `${base}/audio/kana/`
}

async function getCtx(): Promise<AudioContext> {
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    ctx = new AC()
  }
  if (ctx.state === 'suspended') await ctx.resume()
  return ctx
}

/** Call from a click handler so the audio graph is unlocked before sequences. */
export async function warmKanaAudio() {
  await getCtx()
}

export function stopKanaAudio() {
  playGen += 1
  if (activeSource) {
    try {
      activeSource.stop()
    } catch {
      /* already stopped */
    }
    activeSource.disconnect()
    activeSource = null
  }
}

async function loadBuffer(romaji: string): Promise<AudioBuffer> {
  const key = romaji.trim().toLowerCase()
  const cached = bufferCache.get(key)
  if (cached) return cached

  const audioCtx = await getCtx()
  const res = await fetch(`${audioBase()}${encodeURIComponent(key)}.mp3`)
  if (!res.ok) throw new Error(`missing kana audio: ${key}`)
  const raw = await res.arrayBuffer()
  // slice() so decodeAudioData gets a detachable copy in older browsers
  const decoded = await audioCtx.decodeAudioData(raw.slice(0))
  bufferCache.set(key, decoded)
  return decoded
}

function startBuffer(buffer: AudioBuffer, options: SpeakOptions, gen: number) {
  if (!ctx || gen !== playGen) {
    options.onError?.()
    return
  }

  const source = ctx.createBufferSource()
  const gain = ctx.createGain()
  // Explicit full gain — same for every mora including the first.
  gain.gain.value = 1
  source.buffer = buffer
  source.connect(gain)
  gain.connect(ctx.destination)

  activeSource = source
  options.onStart?.()

  source.onended = () => {
    if (activeSource === source) activeSource = null
    if (gen === playGen) options.onEnd?.()
  }

  try {
    source.start(0)
  } catch {
    activeSource = null
    options.onError?.()
  }
}

/** Play one mora by romaji using bundled MP3 (shared by hira/kata). */
export function playKanaRomaji(romaji: string, options: SpeakOptions = {}) {
  const key = romaji.trim().toLowerCase()
  if (!key) {
    options.onError?.()
    return
  }

  stopKanaAudio()
  const gen = playGen

  void (async () => {
    try {
      const buffer = await loadBuffer(key)
      if (gen !== playGen) return
      startBuffer(buffer, options, gen)
    } catch {
      if (gen === playGen) options.onError?.()
    }
  })()
}

export async function playKanaSequence(
  romajiList: string[],
  gapMs = 350,
  onIndex?: (index: number) => void,
  signal?: { cancelled: boolean },
) {
  // Unlock + decode ahead of time so clip #1 isn't the cold start.
  await getCtx()
  await Promise.all(
    [...new Set(romajiList.map((r) => r.trim().toLowerCase()).filter(Boolean))].map(
      (key) => loadBuffer(key).catch(() => null),
    ),
  )

  for (let i = 0; i < romajiList.length; i += 1) {
    if (signal?.cancelled) break
    onIndex?.(i)
    await new Promise<void>((resolve) => {
      let done = false
      const finish = () => {
        if (done) return
        done = true
        resolve()
      }
      playKanaRomaji(romajiList[i], {
        onEnd: finish,
        onError: finish,
      })
      window.setTimeout(finish, 2000)
    })
    if (signal?.cancelled) break
    if (i < romajiList.length - 1) {
      await new Promise((r) => setTimeout(r, gapMs))
    }
  }
}
