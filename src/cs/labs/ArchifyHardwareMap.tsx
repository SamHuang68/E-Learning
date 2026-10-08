import React, { useState } from 'react'
import { ContentProvenance } from '../../components/ContentProvenance'
import { useI18n } from '../../i18n/i18n'
import { LsmGlossaryTooltip } from '../../components/LsmGlossaryTooltip'
import { DeferredArchifyIframe } from './DeferredArchifyIframe'

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
  const { t, locale } = useI18n()
  const copy = (zhHant: string, en: string) => locale === 'en' ? en : zhHant

  const handleInteract = () => {
    if (!explored && onEarnXp) {
      setExplored(true)
      onEarnXp(20)
    }
  }

  const diagramMeta = {
    'ai-server': {
      title: copy('現代企業級 AI 伺服器硬體全景架構圖 (DGX/HGX 業界標竿)', 'Enterprise AI Server Architecture: DGX/HGX Reference Design'),
      subtitle: copy('雙路伺服器 CPU、2TB DDR5 ECC、8x SXM GPU、NVSwitch 與 400Gb/s InfiniBand 拓撲', 'Dual server CPUs, 2 TB DDR5 ECC, eight SXM GPUs, NVSwitch, and a 400 Gb/s InfiniBand topology'),
      file: './archify/ai-server-architecture.html',
      badge: 'Archify Showcase 2.16',
      stats: [
        { label: 'HOST SUBSYSTEM', title: 'Dual CPU + 2TB ECC', desc: copy('雙路伺服器 CPU 配備 2TB ECC 記憶體與 30TB NVMe', 'Dual server CPUs with 2 TB of ECC memory and 30 TB of NVMe storage'), color: '#06b6d4' },
        { label: 'HIGH-SPEED FABRIC', title: 'NVSwitch (900 GB/s)', desc: copy('4x NVSwitch 提供 8 卡全互聯，降低跨 GPU 張量平行通訊瓶頸', 'Four NVSwitch chips connect all eight GPUs and reduce tensor-parallel communication bottlenecks'), color: '#10b981' },
        { label: 'GPU ACCELERATORS', title: '8x SXM H100/H200', desc: copy('8x SXM Tensor Core GPU 合計提供約 1.1TB HBM3e', 'Eight SXM Tensor Core GPUs provide approximately 1.1 TB of HBM3e in total'), color: '#f43f5e' },
      ],
    },
    'lsm-tree': {
      title: copy('分散式儲存 LSM-Tree 讀寫與壓縮架構圖', 'Distributed LSM-Tree Read, Write, and Compaction Architecture'),
      subtitle: copy('WAL、SkipList MemTable 與磁碟 L0–L2 分層壓縮管線', 'Write-ahead logging, a SkipList MemTable, and leveled L0–L2 disk compaction'),
      file: './archify/lsm-tree-architecture.html',
      badge: 'Archify Standard 2.16',
      stats: [
        { label: 'IN-MEMORY BUFFER', title: 'MemTable (SkipList)', desc: copy('無鎖 O(log N) 並發寫入與點查', 'Lock-free O(log N) concurrent writes and point lookups'), color: '#06b6d4' },
        { label: 'DURABILITY LOG', title: 'WAL Sequential I/O', desc: copy('以順序寫入降低尋道成本並支援當機復原', 'Sequential writes reduce seek cost and support crash recovery'), color: '#10b981' },
        { label: 'STORAGE COMPACTION', title: 'Leveled Compaction', desc: copy('分層多路歸併排序，Bloom filter 避免不必要的磁碟讀取', 'Leveled merge sorting with Bloom filters that avoid unnecessary disk reads'), color: '#f43f5e' },
      ],
    },
    'cache-coherence': {
      title: copy('MESI 快取一致性匯流排監聽時序圖', 'MESI Cache-Coherence Bus-Snooping Sequence'),
      subtitle: copy('Core 0 讀取缺失、Core 1 介入刷新與 DRAM 回寫狀態機', 'A Core 0 read miss, Core 1 intervention, and DRAM writeback state transitions'),
      file: './archify/cache-coherence-sequence.html',
      badge: 'Archify Sequence 2.16',
      stats: [
        { label: 'SNOOPING INTERCONNECT', title: 'BusRd Broadcast', desc: copy('匯流排廣播監聽與仲裁器狀態追蹤', 'Broadcast snooping with arbiter state tracking'), color: '#06b6d4' },
        { label: 'CACHE INTERVENTION', title: 'Flush Line X', desc: copy('持有 Modified 髒資料的核心直接供應最新資料', 'The core holding the Modified line supplies the newest data directly'), color: '#10b981' },
        { label: 'STATE DOWNGRADE', title: 'Transition to Shared (S)', desc: copy('兩個核心降級為 Shared 並維持一致性', 'Both cores downgrade to Shared while preserving coherence'), color: '#f43f5e' },
      ],
    },
    'process-lifecycle': {
      title: t('cs.archify.process.title'),
      subtitle: t('cs.archify.process.subtitle'),
      file: './archify/process-lifecycle.html',
      badge: 'Archify Lifecycle 2.16',
      stats: [
        { label: t('cs.archify.process.stat.scheduler'), title: 'Ready ➜ Running', desc: copy('紅黑樹選出最小 vruntime 的工作進行排程', 'A red-black tree selects the runnable task with the smallest vruntime'), color: '#06b6d4' },
        { label: t('cs.archify.process.stat.io'), title: 'Running ➜ Blocked', desc: copy('工作等待磁碟或網路中斷時釋放 CPU 核心', 'A task releases the CPU while waiting for disk or network completion'), color: '#10b981' },
        { label: t('cs.archify.process.stat.reap'), title: 'Zombie ➜ Reaped', desc: copy('waitpid() 釋放 PCB；PID 1 接管孤兒行程', 'waitpid() releases the PCB; PID 1 adopts orphaned processes'), color: '#f43f5e' },
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
      title: copy('Transformer 自注意力與 KV Cache 架構圖', 'Transformer Self-Attention and KV-Cache Architecture'),
      subtitle: copy('QKV 線性投影、FlashAttention-2 SRAM Tiling 與 HBM PagedAttention 資料流', 'QKV projections, FlashAttention-2 SRAM tiling, and HBM PagedAttention dataflow'),
      file: './archify/transformer-attention.html',
      badge: 'Archify Architecture 2.16',
      stats: [
        { label: 'SRAM TILING', title: 'FlashAttention-2', desc: copy('在晶上 SRAM 以 Online Softmax 避免二次方 HBM 存取', 'Online Softmax in on-chip SRAM avoids quadratic HBM traffic'), color: '#06b6d4' },
        { label: 'PAGED KV CACHE', title: 'HBM Paged Memory', desc: copy('仿照虛擬記憶體分頁以降低顯存碎片', 'Virtual-memory-style paging reduces accelerator-memory fragmentation'), color: '#10b981' },
        { label: 'TENSOR ENGINE', title: 'FP8 Matrix GEMM', desc: copy('TMA 非同步傳輸與 Tensor Core 矩陣乘法重疊執行', 'TMA asynchronous transfers overlap Tensor Core matrix multiplication'), color: '#f43f5e' },
      ],
    },
    'percolator-txn': {
      title: copy('Percolator 分散式事務兩階段提交時序圖', 'Percolator Distributed-Transaction Two-Phase Commit Sequence'),
      subtitle: copy('TSO 全域時間戳、Primary Lock 錨點提交與 Secondary Lock 快照隔離', 'Timestamp-oracle ordering, primary-lock commit anchoring, and secondary-lock snapshot isolation'),
      file: './archify/percolator-transaction.html',
      badge: 'Archify Sequence 2.16',
      stats: [
        { label: 'TSO TIMESTAMP', title: 'StartTS / CommitTS', desc: copy('全域單調遞增時間戳協調跨分區順序', 'Globally monotonic timestamps coordinate ordering across partitions'), color: '#06b6d4' },
        { label: 'PRIMARY LOCK', title: 'Single Truth Anchor', desc: copy('Primary 行的原子提交是事務成功的唯一錨點', 'Atomic commit of the primary row is the single success anchor'), color: '#10b981' },
        { label: 'SNAPSHOT READ', title: 'Lock-Free Reads', desc: copy('讀取 write[commit_ts <= read_ts] 而不阻塞寫入', 'Reads select write[commit_ts <= read_ts] without blocking writers'), color: '#f43f5e' },
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
          <div style={{ display: 'flex', background: 'var(--line)', padding: '2px', borderRadius: '6px', flexWrap: 'wrap' }} role="group" aria-label={copy('選擇架構圖', 'Choose an architecture diagram')}>
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
              {copy('AI 伺服器 (DGX/HGX)', 'AI Server (DGX/HGX)')}
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
              {copy('MESI 匯流排', 'MESI Bus')}
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
              {copy('行程生命週期', 'Process Lifecycle')}
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
              {copy('TCP 交握時序', 'TCP Handshake')}
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
              {copy('Transformer 注意力', 'Transformer Attention')}
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
              {copy('Percolator 事務', 'Percolator Transactions')}
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
              <span lang={locale}>{t('cs.archify.git.pill')}</span>
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
            <span>{copy('↗ 全螢幕互動檢視', '↗ Open interactive full screen')}</span>
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
        <DeferredArchifyIframe key={`${selectedDiagram}-${locale}`} src={diagramMeta.file} title={diagramMeta.title} />
      </div>
      <ContentProvenance>
        {selectedDiagram === 'ai-server'
          ? copy('VERIFY：DGX/HGX 規格依公開產品資料整理；不是正式認證或實機量測。', 'VERIFY: DGX/HGX specifications are summarized from public product material; this is not certification or a physical measurement.')
          : selectedDiagram === 'transformer-attention'
            ? copy('VERIFY：FlashAttention / PagedAttention 描述依公開論文與實作文件整理；數值為教學示意。', 'VERIFY: FlashAttention and PagedAttention descriptions are based on public papers and implementation documents; values are instructional illustrations.')
            : selectedDiagram === 'git-mental-model'
              ? t('cs.archify.git.subtitle')
              : copy('VERIFY：架構圖為教學示意；請以原始論文、RFC 或廠商文件核對實作細節。', 'VERIFY: The diagram is instructional. Confirm implementation details against the original paper, RFC, or vendor documentation.')}
      </ContentProvenance>
    </div>
  )
}
