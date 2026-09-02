import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Archify SKILL 網頁架構可視化與應用整合測試', () => {
  it('已生成高規格 Archify 現代 AI 伺服器硬體全景架構圖 HTML', () => {
    const htmlPath = path.resolve(process.cwd(), 'public/archify/ai-server-architecture.html')
    expect(fs.existsSync(htmlPath)).toBe(true)

    const content = fs.readFileSync(htmlPath, 'utf8')
    // 包含關鍵節點與架構邊界
    expect(content).toContain('Host CPU &amp; Kernel')
    expect(content).toContain('NVSwitch Fabric')
    expect(content).toContain('PCIe Gen5 Bus')
    expect(content).toContain('GPU Accelerator')
  })

  it('架構定義 JSON 規範有效且具備 showcase 品質規格', () => {
    const jsonPath = path.resolve(process.cwd(), 'public/archify/ai-server.architecture.json')
    expect(fs.existsSync(jsonPath)).toBe(true)

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    expect(data.schema_version).toBe(1)
    expect(data.diagram_type).toBe('architecture')
    expect(data.meta.quality_profile).toBe('showcase')
    expect(data.components.length).toBeGreaterThanOrEqual(8)
    expect(data.connections.length).toBeGreaterThanOrEqual(6)
  })
})
