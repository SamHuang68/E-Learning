import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function walkTsx(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist') continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walkTsx(full, out)
    else if (name.endsWith('.tsx')) out.push(full)
  }
  return out
}

describe('image/audio lazy audit', () => {
  it('below-fold media does not eager-load; SpeakButton stays click-to-play', () => {
    const playClip = readFileSync(join(process.cwd(), 'src/utils/mediaAudio.ts'), 'utf8')
    expect(playClip).toContain("audio.preload = 'none'")
    expect(playClip).not.toMatch(/new Audio\([^)]+\)/)

    const speak = readFileSync(join(process.cwd(), 'src/components/SpeakButton.tsx'), 'utf8')
    expect(speak).toContain('onClick={handleClick}')
    expect(speak).toMatch(/if \(audioSrc\)[\s\S]*playClip\(audioSrc/)

    const files = walkTsx(join(process.cwd(), 'src'))
    const imgHits: string[] = []
    const audioHits: string[] = []
    for (const file of files) {
      const text = readFileSync(file, 'utf8')
      if (/<img\b/.test(text) && !/loading=["']lazy["']/.test(text) && !/fetchPriority=["']high["']/.test(text)) {
        imgHits.push(file)
      }
      if (/<audio\b/.test(text) && !/preload=["'](none|metadata)["']/.test(text)) {
        audioHits.push(file)
      }
    }
    expect(imgHits, imgHits.join('\n')).toEqual([])
    expect(audioHits, audioHits.join('\n')).toEqual([])
  })
})
