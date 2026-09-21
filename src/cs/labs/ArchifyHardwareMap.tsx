import React, { useState } from 'react'
import { ContentProvenance } from '../../components/ContentProvenance'
import { useI18n } from '../../i18n/i18n'
import { LsmGlossaryTooltip } from '../../components/LsmGlossaryTooltip'

interface Props {
  onEarnXp?: (amount: number) => void
}

type DiagramKind =
  | 'ai-server'
  | 'lsm-tree'
  | 'cache-coherence'
  | 'process-lifecycle'
  | 'tcp-handshake'
  | 'transformer-attention'
  | 'percolator-txn'
  | 'git-mental-model'

export const ArchifyHardwareMap: React.FC<Props> = ({ onEarnXp }) => {
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramKind>('ai-server')
  const [explored, setExplored] = useState(false)
  const { t } = useI18n()

  const handleInteract = () => {
    if (!explored && onEarnXp) {
      setExplored(true)
      onEarnXp(20)
    }
  }

  const diagramMeta = {
    'ai-server': {
      title: '現代企業級 AI 伺服器硬體全景架構圖 (DGX/HGX 業界標竿)',
      subtitle: 'Dual Server CPU (2TB DDR5 ECC)、8x SXM GPU、NVSwitch 900 GB/s 全互聯與 400Gb/s InfiniBand 拓撲',
      file: './archify/ai-server-architecture.html',
      badge: 'Archify Showcase 2.16',
      stats: [
        { label: 'HOST SUBSYSTEM', title: 'Dual CPU + 2TB ECC', desc: '雙路伺服器 CPU 配備 2TB (2048GB) 高速 ECC 記憶體與 30TB NVMe', color: '#06b6d4' },
        { label: 'HIGH-SPEED FABRIC', title: 'NVSwitch (900 GB/s)', desc: '4x NVSwitch 晶片實現 8 卡全互聯，消滅跨 GPU 張量平行通訊牆', color: '#10b981' },
        { label: 'GPU ACCELERATORS', title: '8x SXM H100/H200', desc: '8x SXM 封裝 Tensor Core GPU，總計高達 1.1TB HBM3e 顯存', color: '#f43f5e' },
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
      title: t('cs.archify.process.title'),
      subtitle: t('cs.archify.process.subtitle'),
      file: './archify/process-lifecycle.html',
      badge: 'Archify Lifecycle 2.16',
      stats: [
        { label: t('cs.archify.process.stat.scheduler'), title: 'Ready ➜ Running', desc: '紅黑樹尋找最小 vruntime 進行排程分發', color: '#06b6d4' },
        { label: t('cs.archify.process.stat.io'), title: 'Running ➜ Blocked', desc: '阻塞等待磁碟或網路中斷，完全釋放 CPU 核心', color: '#10b981' },
        { label: t('cs.archify.process.stat.reap'), title: 'Zombie ➜ Reaped', desc: 'waitpid() 釋放 PCB 結構，PID 1 領養孤兒行程', color: '#f43f5e' },
      ],
    },
    'tcp-handshake': {
      title: t('cs.archify.tcp.title'),
      subtitle: t('cs.archify.tcp.subtitle'),
      file: './archify/tcp-handshake-sequence.html',
      badge: 'Archify Sequence 2.16',
      stats: [
        { label: t('cs.archify.tcp.stat.syn'), title: t('cs.archify.tcp.stat.syn.title'), desc: t('cs.archify.tcp.stat.syn.desc'), color: '#06b6d4' },
        { label: t('cs.archify.tcp.stat.halfclose'), title: t('cs.archify.tcp.stat.halfclose.title'), desc: t('cs.archify.tcp.stat.halfclose.desc'), color: '#10b981' },
        { label: t('cs.archify.tcp.stat.msl'), title: t('cs.archify.tcp.stat.msl.title'), desc: t('cs.archify.tcp.stat.msl.desc'), color: '#f43f5e' },
      ],
    },
    'transformer-attention': {
      title: 'Transformer 自注意力與 KV Cache 架構圖',
      subtitle: 'QKV 線性投影、SRAM Tiling (FlashAttention-2) 與 HBM PagedAttention 記憶體流',
      file: './archify/transformer-attention.html',
      badge: 'Archify Architecture 2.16',
      stats: [
        { label: 'SRAM TILING', title: 'FlashAttention-2', desc: '在 256KB 晶上 SRAM 計算 Online Softmax 消除二次方訪存', color: '#06b6d4' },
        { label: 'PAGED KV CACHE', title: 'HBM Paged Memory', desc: '仿照 OS 虛擬分頁消除顯存碎片，吞吐量暴增 2.5 倍', color: '#10b981' },
        { label: 'TENSOR ENGINE', title: 'FP8 Matrix GEMM', desc: '非同步傳輸 TMA 與 Tensor Core 矩陣相乘雙倍 TFLOPS', color: '#f43f5e' },
      ],
    },
    'percolator-txn': {
      title: 'Percolator 分散式事務兩階段提交時序圖',
      subtitle: 'TSO 全局時間戳、Primary Lock 錨點提交與 Secondary 鎖解耦快照隔離',
      file: './archify/percolator-transaction.html',
      badge: 'Archify Sequence 2.16',
      stats: [
        { label: 'TSO TIMESTAMP', title: 'StartTS / CommitTS', desc: '全域單調遞增時間戳，保證跨分區線性一致性', color: '#06b6d4' },
        { label: 'PRIMARY LOCK', title: 'Single Truth Anchor', desc: 'Primary 行原子提交為唯一成功標誌，故障自癒', color: '#10b981' },
        { label: 'SNAPSHOT READ', title: 'Lock-Free Reads', desc: '讀取 write[commit_ts <= read_ts] 無鎖不阻塞寫入', color: '#f43f5e' },
      ],
    },
    'git-mental-model': {
      title: t('cs.archify.git.title'),
      subtitle: t('cs.archify.git.subtitle'),
      file: './archify/git-mental-model-sequence.html',
      badge: 'Archify Sequence JSON',
      stats: [
        { label: t('cs.archify.git.stat.commit'), title: t('cs.archify.git.stat.commit.title'), desc: t('cs.archify.git.stat.commit.desc'), color: '#06b6d4' },
        { label: t('cs.archify.git.stat.branch'), title: t('cs.archify.git.stat.branch.title'), desc: t('cs.archify.git.stat.branch.desc'), color: '#10b981' },
        { label: t('cs.archify.git.stat.merge'), title: t('cs.archify.git.stat.merge.title'), desc: t('cs.archify.git.stat.merge.desc'), color: '#f43f5e' },
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
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{diagramMeta.title}</h2>
            <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
              {diagramMeta.badge}
            </span>
          </div>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--muted)', fontSize: '0.82rem' }}>
            {diagramMeta.subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* 切換不同架構圖按鈕 (七向切換膠囊) */}
          <div style={{ display: 'flex', background: 'var(--line)', padding: '2px', borderRadius: '6px', flexWrap: 'wrap' }} role="group" aria-label="選擇架構圖">
            <button
              type="button"
              aria-pressed={selectedDiagram === 'ai-server'}
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
              AI 伺服器 (DGX/HGX)
            </button>
            <button
              type="button"
              aria-pressed={selectedDiagram === 'lsm-tree'}
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
              type="button"
              aria-pressed={selectedDiagram === 'cache-coherence'}
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
              type="button"
              aria-pressed={selectedDiagram === 'process-lifecycle'}
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
              type="button"
              aria-pressed={selectedDiagram === 'tcp-handshake'}
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
            <button
              type="button"
              aria-pressed={selectedDiagram === 'transformer-attention'}
              onClick={() => setSelectedDiagram('transformer-attention')}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.78rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: selectedDiagram === 'transformer-attention' ? 'var(--card-bg, #1e293b)' : 'transparent',
                color: selectedDiagram === 'transformer-attention' ? 'var(--accent, #6366f1)' : 'var(--muted)',
                fontWeight: selectedDiagram === 'transformer-attention' ? 700 : 500,
              }}
            >
              Transformer 注意力
            </button>
            <button
              type="button"
              aria-pressed={selectedDiagram === 'percolator-txn'}
              onClick={() => setSelectedDiagram('percolator-txn')}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.78rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: selectedDiagram === 'percolator-txn' ? 'var(--card-bg, #1e293b)' : 'transparent',
                color: selectedDiagram === 'percolator-txn' ? 'var(--accent, #6366f1)' : 'var(--muted)',
                fontWeight: selectedDiagram === 'percolator-txn' ? 700 : 500,
              }}
            >
              Percolator 事務
            </button>
            <button
              type="button"
              aria-pressed={selectedDiagram === 'git-mental-model'}
              onClick={() => setSelectedDiagram('git-mental-model')}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.78rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: selectedDiagram === 'git-mental-model' ? 'var(--card-bg, #1e293b)' : 'transparent',
                color: selectedDiagram === 'git-mental-model' ? 'var(--accent, #6366f1)' : 'var(--muted)',
                fontWeight: selectedDiagram === 'git-mental-model' ? 700 : 500,
              }}
            >
              {t('cs.archify.git.pill')}
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
            <div style={{ fontSize: '0.92rem', fontWeight: 700, marginTop: '0.2rem' }}>
              {selectedDiagram === 'lsm-tree' ? (
                stat.label.includes('IN-MEMORY') ? <LsmGlossaryTooltip termKey="memtable">{stat.title}</LsmGlossaryTooltip> :
                stat.label.includes('DURABILITY') ? <LsmGlossaryTooltip termKey="wal">{stat.title}</LsmGlossaryTooltip> :
                stat.label.includes('STORAGE') ? <LsmGlossaryTooltip termKey="compaction">{stat.title}</LsmGlossaryTooltip> :
                stat.title
              ) : stat.title}
            </div>
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
      <ContentProvenance>
        {selectedDiagram === 'ai-server'
          ? 'VERIFY：DGX/HGX 規格依公開產品資料整理（雙路 CPU、SXM GPU、NVSwitch、InfiniBand），非正式認證或實機量測。'
          : selectedDiagram === 'transformer-attention'
            ? 'VERIFY：FlashAttention / PagedAttention 描述依公開論文與實作文件整理，數值為教學示意。'
            : selectedDiagram === 'git-mental-model'
              ? t('cs.archify.git.subtitle')
              : 'VERIFY：架構圖為教學示意，請以原始論文／RFC／廠商文件核對實作細節。'}
      </ContentProvenance>
    </div>
  )
}
