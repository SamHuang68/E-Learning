import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { orangePractice } from './data/practice/orange'

const root = fileURLToPath(new URL('../../', import.meta.url))
const cards = orangePractice['orange:6'].passage
const ids = ['orange-6-p1', 'orange-6-p2', 'orange-6-p3']

function stripTagPadding(text: string): string {
  let end = text.length
  while (end > 0 && text.charCodeAt(end - 1) === 0) end--
  return text.slice(0, end)
}

function readTagText(payload: Buffer): string {
  const encoding = payload[0]
  let text = payload.subarray(1)
  if (encoding === 1) {
    if (text[0] === 0xfe && text[1] === 0xff) text = Buffer.from(text.subarray(2)).swap16()
    else if (text[0] === 0xff && text[1] === 0xfe) text = text.subarray(2)
    return stripTagPadding(text.toString('utf16le'))
  }
  if (encoding === 3) return stripTagPadding(text.toString('utf8'))
  if (encoding === 0) return stripTagPadding(text.toString('latin1'))
  throw new Error('教材音檔使用未支援的 ID3 文字編碼')
}

// CI 直接檢查隨教材交付的位元組；不呼叫 Windows 聲音、FFmpeg 或產音腳本。
function inspectMp3(bytes: Buffer) {
  expect(bytes.subarray(0, 3).toString('ascii')).toBe('ID3')
  expect(bytes[3]).toBe(3)
  expect(bytes[5]).toBe(0)
  const tagSize = ((bytes[6] & 0x7f) << 21) | ((bytes[7] & 0x7f) << 14) |
    ((bytes[8] & 0x7f) << 7) | (bytes[9] & 0x7f)
  const audioOffset = 10 + tagSize
  expect(audioOffset).toBeLessThan(bytes.length)
  const tags = new Map<string, string>()
  let offset = 10
  while (offset + 10 <= audioOffset && bytes[offset] !== 0) {
    const id = bytes.subarray(offset, offset + 4).toString('ascii')
    const size = bytes.readUInt32BE(offset + 4)
    expect(size).toBeGreaterThan(0)
    expect(offset + 10 + size).toBeLessThanOrEqual(audioOffset)
    const payload = bytes.subarray(offset + 10, offset + 10 + size)
    if (id.startsWith('T')) tags.set(id, readTagText(payload))
    offset += 10 + size
  }

  const bitrates = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
  const sampleRates = [44100, 48000, 32000]
  let frames = 0
  let durationMs = 0
  offset = audioOffset
  while (offset < bytes.length) {
    expect(offset + 4).toBeLessThanOrEqual(bytes.length)
    const header = bytes.readUInt32BE(offset)
    expect(header >>> 21).toBe(0x7ff)
    expect((header >>> 19) & 3).toBe(3) // MPEG-1
    expect((header >>> 17) & 3).toBe(1) // Layer III
    const bitrate = bitrates[(header >>> 12) & 15]
    const sampleRate = sampleRates[(header >>> 10) & 3]
    expect(bitrate).toBe(128)
    expect(sampleRate).toBe(44100)
    expect((header >>> 6) & 3).toBe(3) // 單聲道
    const length = Math.floor(144000 * bitrate / sampleRate) + ((header >>> 9) & 1)
    expect(offset + length).toBeLessThanOrEqual(bytes.length)
    durationMs += 1152 / sampleRate * 1000
    offset += length
    frames++
  }
  expect(frames).toBeGreaterThan(20)
  expect(offset).toBe(bytes.length)
  return { tags, durationMs }
}

describe('短聽力辨識的三筆教材音檔契約', () => {
  it('只涵蓋原有三筆課文與相對音檔來源', () => {
    expect(cards.map((card) => card.id)).toEqual(ids)
    for (const card of cards) expect(card.audio?.src).toBe(`audio/toeic/${card.id}.mp3`)
  })

  it.each(cards)('$id 的實體音檔、原文與本機合成來源一致', (card) => {
    const audio = card.audio
    expect(audio).toBeDefined()
    if (!audio) throw new Error(`教材缺少音檔契約：${card.id}`)
    const bytes = readFileSync(resolve(root, 'public', audio.src))
    expect(bytes.length).toBeGreaterThan(1000)
    const { tags, durationMs } = inspectMp3(bytes)
    const text = card.speakText ?? card.sentence
    const textHash = createHash('sha256').update(text, 'utf8').digest('hex')
    expect(tags.get('TIT2')).toBe(text)
    expect(tags.get('TPE1')).toBe('Microsoft David Desktop')
    expect(audio.speaker).toBe(tags.get('TPE1'))
    expect(tags.get('TALB')).toBe('TOEIC 本機系統語音合成教材（非真人錄音）')
    expect(tags.get('TLAN')).toBe('eng')
    const provenance = [...tags.values()].join('\n')
    expect(provenance).toContain(`來源：orange:6/${card.id}`)
    expect(provenance).toContain(`文字 SHA-256：${textHash}`)
    expect(provenance).toContain('語言：en-US')
    expect(provenance).toContain('非真人錄音')
    expect(audio.durationMs).toBeGreaterThan(0)
    expect(Math.abs((audio.durationMs ?? 0) - durationMs)).toBeLessThanOrEqual(2)

    const readme = readFileSync(resolve(root, 'public/audio/toeic/README.md'), 'utf8')
    const assetHash = createHash('sha256').update(bytes).digest('hex')
    expect(readme).toContain('本機系統語音合成')
    expect(readme).toContain('非真人錄音')
    expect(readme).toContain(`${card.id}.mp3`)
    expect(readme).toContain(assetHash)
  })
})
