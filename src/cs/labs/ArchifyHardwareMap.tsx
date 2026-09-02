import React from 'react'

interface Props {
  onEarnXp?: (amount: number) => void
}

export const ArchifyHardwareMap: React.FC<Props> = ({ onEarnXp }) => {
  const [explored, setExplored] = React.useState(false)

  const handleInteract = () => {
    if (!explored && onEarnXp) {
      setExplored(true)
      onEarnXp(20)
    }
  }

  return (
    <div className="math-lab-panel cs-arch-panel" style={{ padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
      {/* 頂部 Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🏛️</span>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>現代 AI 伺服器硬體全景架構圖</h2>
            <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
              Archify Showcase 2.16
            </span>
          </div>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--muted)', fontSize: '0.82rem' }}>
            由 Archify 引擎生成的向量架構圖，直觀展現 Host CPU、96GB RAM、PCIe Gen5 匯流排與 Dual GPU NVSwitch 全互聯拓撲。
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a
            href="./archify/ai-server-architecture.html"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleInteract}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              background: 'var(--accent, #6366f1)',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <span>↗ 全螢幕互動檢視</span>
          </a>
        </div>
      </div>

      {/* 核心架構階層導覽指標 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
        <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.05))', border: '1px solid var(--line)', padding: '0.75rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 700 }}>HOST SUBSYSTEM</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, marginTop: '0.2rem' }}>CPU + 96GB DDR5</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.2rem' }}>Linux OS 行程調度與大容量模型快取</div>
        </div>

        <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.05))', border: '1px solid var(--line)', padding: '0.75rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>INTERCONNECT BUS</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, marginTop: '0.2rem' }}>PCIe Gen5 x16</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.2rem' }}>雙向 64 GB/s 主機至設備 DMA 流水傳輸</div>
        </div>

        <div style={{ background: 'var(--card-bg, rgba(255,255,255,0.05))', border: '1px solid var(--line)', padding: '0.75rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 700 }}>GPU ACCELERATORS</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, marginTop: '0.2rem' }}>Dual GPU + NVSwitch</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.2rem' }}>900 GB/s All-to-All 網格消滅張量平行通訊牆</div>
        </div>
      </div>

      {/* 嵌入的 Archify 互動向量架構視窗 */}
      <div
        style={{
          flex: 1,
          minHeight: '480px',
          border: '1px solid var(--line)',
          borderRadius: '8px',
          overflow: 'hidden',
          background: 'var(--bg, #0d1117)',
          position: 'relative',
        }}
        onClick={handleInteract}
      >
        <iframe
          src="./archify/ai-server-architecture.html"
          title="Modern AI Server Architecture (Archify)"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
        />
      </div>
    </div>
  )
}
