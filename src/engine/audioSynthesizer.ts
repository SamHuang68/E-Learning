/**
 * Web Audio API 輕量音效合成器 (AudioSynthesizer)
 *
 * 特性：
 * 1. 純前端振盪器 (OscillatorNode) 與增益節點 (GainNode) 即時合成，0 網路請求、0 外部資產依賴。
 * 2. 支援「答對金幣音效」、「連勝升階和弦」、「徽章解鎖慶祝音效」、「按鈕點擊清脆反饋」。
 * 3. 內建靜音開關與音量保護機制，支援 LocalStorage 持久化保存使用者靜音偏好。
 */

const STORAGE_KEY_MUTED = 'learning_audio_muted_v1'

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {
      /* ignore */
    })
  }
  return audioCtx
}

let memoryMuted = false

export function isAudioMuted(): boolean {
  try {
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(STORAGE_KEY_MUTED)
      if (val !== null) return val === 'true'
    }
  } catch {
    /* ignore */
  }
  return memoryMuted
}

export function setAudioMuted(muted: boolean): void {
  memoryMuted = muted
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_MUTED, muted ? 'true' : 'false')
    }
  } catch {
    /* ignore */
  }
}

export function toggleAudioMute(): boolean {
  const next = !isAudioMuted()
  setAudioMuted(next)
  return next
}

/**
 * 播放清脆點擊音效
 */
export function playClickSound(): void {
  if (isAudioMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(800, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04)

  gain.gain.setValueAtTime(0.08, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start()
  osc.stop(ctx.currentTime + 0.04)
}

/**
 * 播放答對金幣音效 (雙音階升調)
 */
export function playCorrectSound(): void {
  if (isAudioMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  const osc1 = ctx.createOscillator()
  const osc2 = ctx.createOscillator()
  const gain = ctx.createGain()

  osc1.type = 'sine'
  osc2.type = 'triangle'

  // E5 (659.25Hz) -> G#5 (830.61Hz)
  osc1.frequency.setValueAtTime(659.25, now)
  osc1.frequency.setValueAtTime(830.61, now + 0.08)

  osc2.frequency.setValueAtTime(1318.5, now)
  osc2.frequency.setValueAtTime(1661.22, now + 0.08)

  gain.gain.setValueAtTime(0.12, now)
  gain.gain.exponentialRampToValueAtTime(0.15, now + 0.08)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

  osc1.connect(gain)
  osc2.connect(gain)
  gain.connect(ctx.destination)

  osc1.start(now)
  osc2.start(now)
  osc1.stop(now + 0.3)
  osc2.stop(now + 0.3)
}

/**
 * 播放徽章解鎖與重大升級慶祝和弦 (Fanfare)
 */
export function playBadgeUnlockedSound(): void {
  if (isAudioMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  const freqs = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6 (大三和弦琶音)

  freqs.forEach((freq, index) => {
    const noteStart = now + index * 0.07
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, noteStart)

    gain.gain.setValueAtTime(0.14, noteStart)
    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.45)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(noteStart)
    osc.stop(noteStart + 0.45)
  })
}

/**
 * 播放答錯提示音效 (低音鋸齒波雙音)
 */
export function playWrongSound(): void {
  if (isAudioMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(220, now) // A3
  osc.frequency.setValueAtTime(196, now + 0.1) // G3

  gain.gain.setValueAtTime(0.06, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.25)
}
