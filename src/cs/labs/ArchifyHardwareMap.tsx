import React, { useState } from 'react'

interface Props {
  onEarnXp?: (amount: number) => void
}

type DiagramKind =
  | 'ai-server'
  | 'lsm-tree'
  | 'cache-coherence'
  | 'process-lifecycle'
  | 'tcp-handshake'

export const ArchifyHardwareMap: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramKind>('ai-server')
  const [explored, setExplored] = useState(false)

  const handleInteract = () => {
    if (!explored && onEarnXp) {
      setExplored(true)
      onEarnXp(20)
    }
  }

  const diagramMeta = {
    'ai-server': {
      title: '現代 AI 伺服器硬體全景架構圖',
      subtitle: 'Host CPU (96GB RAM)、PCIe Gen5 與 Dual GPU NVSwitch 900 GB/s 全互聯拓撲',
      file: './archify/ai-server-architecture.html',
      badge: 'Archify Showcase 2.16',
      stats: [
        { label: 'HOST SUBSYSTEM', title: 'CPU + 96GB DDR5', desc: 'Linux OS 行程調度與大容量模型快取', color: '#06b6d4' },
        { label: 'INTERCONNECT BUS', title: 'PCIe Gen5 x16', desc: '雙向 64 GB/s 主機至設備 DMA 流水傳輸', color: '#10b981' },
        { label: 'GPU ACCELERATORS', title: 'Dual GPU + NVSwitch', desc: '900 GB/s All-to-All 網格消滅張量平行通訊牆', color: '#f43f5e' },
      ],
    },
    'lsm-tree': {
      title: '分散式儲存 LSM-Tree 讀寫與壓縮架構圖',
      subtitle: 'WAL 預寫日誌、記憶體 SkipList MemTable 與磁碟 L0~L2 分層壓縮管線',
      file: './archify/lsm-tree-architecture.html',
      badge: 'Archify Standard 2.16',
      stats: [
        { label: 'IN-MEMORY BUFFER', title: 'MemTable (SkipList)', desc: '無鎖並發 O(log N) 寫入與點查', color: '#06b6d4' },
        { label: 'DURABILITY LOG', title: 'WAL Sequential I/O', desc: '順序寫入消滅磁頭尋道代價保證崩潰安全', color: '#10b981' },
        { label: 'STORAGE COMPACTION', title: 'Leveled Compaction', desc: '分層多路歸併排序，Bloom Filter 杜絕無效訪存', color: '#f43f5e' },
      ],
    },
    'cache-coherence': {
      title: 'MESI 快取一致性匯流排監聽時序圖',
      subtitle: 'CPU Core 0 讀取缺失、Core 1 攔截刷新與 DRAM 主存回寫狀態機時序',
      file: './archify/cache-coherence-sequence.html',
      badge: 'Archify Sequence 2.16',
      stats: [
        { label: 'SNOOPING INTERCONNECT', title: 'BusRd Broadcast', desc: '匯流排廣播監聽與仲裁者狀態追蹤', color: '#06b6d4' },
        { label: 'CACHE INTERVENTION', title: 'Flush Line X', desc: '擁有 Modified 髒資料的核心直接截斷主存並提供數據', color: '#10b981' },
        { label: 'STATE DOWNGRADE', title: 'Transition to Shared (S)', desc: '雙核心安全降級為 Shared 狀態保持嚴格一致性', color: '#f43f5e' },
      ],
    },
    'process-lifecycle': {
      title: '作業系統五狀態行程生命週期轉移圖',
      subtitle: 'CFS 調度佇列 (Ready ➜ Running)、I/O 睡眠等待 (Blocked) 與殭屍回收 (Terminated)',
      file: './archify/process-lifecycle.html',
      badge: 'Archify Lifecycle 2.16',
      stats: [
        { label: 'CFS SCHEDULER', title: 'Ready ➜ Running', desc: '紅黑樹尋找最小 vruntime 進行排程分發', color: '#06b6d4' },
        { label: 'I/O ASYNCHRONY', title: 'Running ➜ Blocked', desc: '阻塞等待磁碟或網路中斷，完全釋放 CPU 核心', color: '#10b981' },
        { label: 'PROCESS REAPING', title: 'Zombie ➜ Reaped', desc: 'waitpid() 釋放 PCB 結構，PID 1 領養孤兒行程', color: '#f43f5e' },
      ],
    },
    'tcp-handshake': {
      title: 'TCP 三向交握與四向揮手時序圖',
      subtitle: '連線建立 (SYN / SYN+ACK / ACK)、雙工數據傳輸與 TIME_WAIT 2MSL 狀態機',
      file: './archify/tcp-handshake-sequence.html',
      badge: 'Archify Sequence 2.16',
      stats: [
        { label: 'SYN NEGOTIATION', title: '3-Way Handshake', desc: 'ISN 初始序號同步與 MSS 窗口協商', color: '#06b6d4' },
        { label: 'HALF-CLOSE', title: '4-Way Teardown', desc: 'FIN / ACK 雙向非對稱釋放與 CLOSE_WAIT', color: '#10b981' },
        { label: '2MSL DRAIN', title: 'TIME_WAIT & 2MSL', desc: '等待 2MSL 確保最終 ACK 到達並排空網路殘留封包', color: '#f43f5e' },
      ],
    },
  }[selectedDiagram]

  return (
    <div className="math-lab-panel cs-arch-panel" style={{ padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
      {/* 頂部 Header 與切換膠囊 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.4rem' }}>🏛️</span>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{diagramMeta.title}</h2>
            <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
              {diagramMeta.badge}
            </span>
          </div>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--muted)', fontSize: '0.82rem' }}>
            {diagramMeta.subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* 切換不同架構圖按鈕 (五向切換膠囊) */}
          <div style={{ display: 'flex', background: 'var(--line)', padding: '2px', borderRadius: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedDiagram('ai-server')}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.78rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: selectedDiagram === 'ai-server' ? 'var(--card-bg, #1e293b)' : 'transparent',
                color: selectedDiagram === 'ai-server' ? 'var(--accent, #6366f1)' : 'var(--muted)',
                fontWeight: selectedDiagram === 'ai-server' ? 700 : 500,
              }}
            >
              AI 伺服器
            </button>
            <button
              onClick={() => setSelectedDiagram('lsm-tree')}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.78rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: selectedDiagram === 'lsm-tree' ? 'var(--card-bg, #1e293b)' : 'transparent',
                color: selectedDiagram === 'lsm-tree' ? 'var(--accent, #6366f1)' : 'var(--muted)',
                fontWeight: selectedDiagram === 'lsm-tree' ? 700 : 500,
              }}
            >
              LSM-Tree
            </button>
            <button
              onClick={() => setSelectedDiagram('cache-coherence')}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.78rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: selectedDiagram === 'cache-coherence' ? 'var(--card-bg, #1e293b)' : 'transparent',
                color: selectedDiagram === 'cache-coherence' ? 'var(--accent, #6366f1)' : 'var(--muted)',
                fontWeight: selectedDiagram === 'cache-coherence' ? 700 : 500,
              }}
            >
              MESI 匯流排
            </button>
            <button
              onClick={() => setSelectedDiagram('process-lifecycle')}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.78rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: selectedDiagram === 'process-lifecycle' ? 'var(--card-bg, #1e293b)' : 'transparent',
                color: selectedDiagram === 'process-lifecycle' ? 'var(--accent, #6366f1)' : 'var(--muted)',
                fontWeight: selectedDiagram === 'process-lifecycle' ? 700 : 500,
              }}
            >
              行程生命週期
            </button>
            <button
              onClick={() => setSelectedDiagram('tcp-handshake')}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.78rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: selectedDiagram === 'tcp-handshake' ? 'var(--card-bg, #1e293b)' : 'transparent',
                color: selectedDiagram === 'tcp-handshake' ? 'var(--accent, #6366f1)' : 'var(--muted)',
                fontWeight: selectedDiagram === 'tcp-handshake' ? 700 : 500,
              }}
            >
              TCP 交握時序
            </button>
          </div>

          <a
            href={diagramMeta.file}
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
        {diagramMeta.stats.map((stat, idx) => (
          <div key={idx} style={{ background: 'var(--card-bg, rgba(255,255,255,0.05))', border: '1px solid var(--line)', padding: '0.75rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: stat.color, fontWeight: 700 }}>{stat.label}</div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, marginTop: '0.2rem' }}>{stat.title}</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{stat.desc}</div>
          </div>
        ))}
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
          key={selectedDiagram}
          src={diagramMeta.file}
          title={diagramMeta.title}
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
