import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Archify SKILL 網頁架構可視化與應用整合測試', () => {
  it('已生成高規格 Archify 現代 AI 伺服器硬體全景架構圖 HTML', () => {
    const htmlPath = path.resolve(process.cwd(), 'public/archify/ai-server-architecture.html')
    expect(fs.existsSync(htmlPath)).toBe(true)

    const content = fs.readFileSync(htmlPath, 'utf8')
    expect(content).toContain('Host CPU &amp; Kernel')
    expect(content).toContain('NVSwitch Fabric')
    expect(content).toContain('PCIe Gen5 Bus')
    expect(content).toContain('GPU Accelerator')
  })

  it('已生成高規格 Archify 分散式儲存 LSM-Tree 架構圖 HTML', () => {
    const htmlPath = path.resolve(process.cwd(), 'public/archify/lsm-tree-architecture.html')
    expect(fs.existsSync(htmlPath)).toBe(true)

    const content = fs.readFileSync(htmlPath, 'utf8')
    expect(content).toContain('Active MemTable')
    expect(content).toContain('WAL Disk Log')
    expect(content).toContain('Compaction Engine')
  })

  it('已生成高規格 Archify MESI 快取一致性匯流排監聽時序圖 HTML', () => {
    const htmlPath = path.resolve(process.cwd(), 'public/archify/cache-coherence-sequence.html')
    expect(fs.existsSync(htmlPath)).toBe(true)

    const content = fs.readFileSync(htmlPath, 'utf8')
    expect(content).toContain('Core 0 L1')
    expect(content).toContain('Coherence Bus')
    expect(content).toContain('Core 1 L1')
    expect(content).toContain('DRAM Controller')
  })

  it('已生成高規格 Archify 作業系統行程五狀態生命週期轉移圖 HTML', () => {
    const htmlPath = path.resolve(process.cwd(), 'public/archify/process-lifecycle.html')
    expect(fs.existsSync(htmlPath)).toBe(true)

    const content = fs.readFileSync(htmlPath, 'utf8')
    expect(content).toContain('New State')
    expect(content).toContain('Ready State')
    expect(content).toContain('Running State')
    expect(content).toContain('Blocked State')
    expect(content).toContain('Terminated')
  })

  it('四份架構定義 JSON 規範皆有效且符合標準規範', () => {
    const aiJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'public/archify/ai-server.architecture.json'), 'utf8'))
    expect(aiJson.components.length).toBeGreaterThanOrEqual(8)

    const lsmJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'public/archify/lsm-tree.architecture.json'), 'utf8'))
    expect(lsmJson.components.length).toBeGreaterThanOrEqual(7)

    const seqJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'public/archify/cache-coherence.sequence.json'), 'utf8'))
    expect(seqJson.participants.length).toBe(4)

    const procJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'public/archify/process.architecture.json'), 'utf8'))
    expect(procJson.components.length).toBe(5)
  })
})
