import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Archify SKILL 網頁架構可視化與應用整合測試', () => {
  it('已生成高規格 Archify 現代企業級 AI 伺服器全景架構圖 HTML (市場標竿 DGX/HGX SOTA)', () => {
    const htmlPath = path.resolve(process.cwd(), 'public/archify/ai-server-architecture.html')
    expect(fs.existsSync(htmlPath)).toBe(true)

    const content = fs.readFileSync(htmlPath, 'utf8')
    expect(content).toContain('Dual Server CPUs')
    expect(content).toContain('Host RAM (2TB ECC)')
    expect(content).toContain('8x SXM GPU Array')
    expect(content).toContain('NVSwitch Fabric')
    expect(content).toContain('InfiniBand Network')
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

  it('已生成高規格 Archify TCP 三向交握與四向揮手時序圖 HTML', () => {
    const htmlPath = path.resolve(process.cwd(), 'public/archify/tcp-handshake-sequence.html')
    expect(fs.existsSync(htmlPath)).toBe(true)

    const content = fs.readFileSync(htmlPath, 'utf8')
    expect(content).toContain('Client App')
    expect(content).toContain('Client TCP')
    expect(content).toContain('Server TCP')
    expect(content).toContain('Server App')
  })

  it('已生成高規格 Archify Transformer 自注意力與 KV Cache 架構圖 HTML', () => {
    const htmlPath = path.resolve(process.cwd(), 'public/archify/transformer-attention.html')
    expect(fs.existsSync(htmlPath)).toBe(true)

    const content = fs.readFileSync(htmlPath, 'utf8')
    expect(content).toContain('Token Embedding')
    expect(content).toContain('Q, K, V Projections')
    expect(content).toContain('SRAM Tiling Buffer')
    expect(content).toContain('Paged KV Cache')
    expect(content).toContain('Tensor Core GEMM')
  })

  it('已生成高規格 Archify Percolator 分散式事務兩階段提交時序圖 HTML', () => {
    const htmlPath = path.resolve(process.cwd(), 'public/archify/percolator-transaction.html')
    expect(fs.existsSync(htmlPath)).toBe(true)

    const content = fs.readFileSync(htmlPath, 'utf8')
    expect(content).toContain('Client')
    expect(content).toContain('TSO')
    expect(content).toContain('Primary')
    expect(content).toContain('Secondary')
  })

  it('七份架構定義 JSON 規範皆有效且符合標準規範', () => {
    const aiJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'public/archify/ai-server.architecture.json'), 'utf8'))
    expect(aiJson.components.length).toBeGreaterThanOrEqual(8)

    const lsmJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'public/archify/lsm-tree.architecture.json'), 'utf8'))
    expect(lsmJson.components.length).toBeGreaterThanOrEqual(7)

    const seqJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'public/archify/cache-coherence.sequence.json'), 'utf8'))
    expect(seqJson.participants.length).toBe(4)

    const procJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'public/archify/process.architecture.json'), 'utf8'))
    expect(procJson.components.length).toBe(5)

    const tcpJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'public/archify/tcp-handshake.sequence.json'), 'utf8'))
    expect(tcpJson.participants.length).toBe(4)
    expect(tcpJson.messages.length).toBe(12)

    const attnJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'public/archify/transformer-attention.architecture.json'), 'utf8'))
    expect(attnJson.components.length).toBe(6)
    expect(attnJson.connections.length).toBe(6)

    const percJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'public/archify/percolator-transaction.sequence.json'), 'utf8'))
    expect(percJson.participants.length).toBe(4)
    expect(percJson.messages.length).toBe(12)
  })
})
