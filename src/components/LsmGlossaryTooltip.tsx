import React, { useState } from 'react'

interface GlossaryEntry {
  term: string
  zh: string
  en: string
  defZh: string
  defEn: string
}

const lsmGlossary: Record<string, GlossaryEntry> = {
  memtable: {
    term: 'MemTable',
    zh: '記憶體表',
    en: 'MemTable',
    defZh: '記憶體中的 SkipList 結構，支援 O(log N) 寫入與查詢，作為寫入緩衝區。',
    defEn: 'In-memory SkipList buffer for O(log N) writes/queries, acting as write buffer before flush to SSTable.',
  },
  wal: {
    term: 'WAL',
    zh: '預寫日誌',
    en: 'Write-Ahead Log',
    defZh: '順序追加的持久性日誌，保證崩潰恢復，寫入先記錄 WAL 再更新 MemTable。',
    defEn: 'Sequential durability log; writes are appended to WAL before MemTable update for crash safety.',
  },
  sstable: {
    term: 'SSTable',
    zh: '排序字串表',
    en: 'Sorted String Table',
    defZh: '不可變的磁碟檔案，經排序與壓縮，每層 L0~LN 存放鍵值範圍資料，內嵌 Bloom Filter。',
    defEn: 'Immutable on-disk sorted files; each level L0-LN holds key-range data with embedded Bloom Filters.',
  },
  bloom: {
    term: 'Bloom Filter',
    zh: '布隆過濾器',
    en: 'Bloom Filter',
    defZh: '記憶體位元陣列 + 多雜湊，零假陰性快速排除不存在的 Key，消除讀取放大。',
    defEn: 'Bit-array + k-hashes in memory; zero false negatives to skip non-existent keys, mitigating read amplification.',
  },
  compaction: {
    term: 'Compaction',
    zh: '壓縮/歸併',
    en: 'Compaction',
    defZh: 'Leveled Compaction：多路歸併排序，將上層 SSTable 與下層重疊者合併，控制讀取放大與空間放大。',
    defEn: 'Leveled Compaction: multi-way merge-sort of overlapping SSTables across levels to bound read/space amplification.',
  },
}

interface Props {
  termKey: keyof typeof lsmGlossary
  children: React.ReactNode
}

export const LsmGlossaryTooltip: React.FC<Props> = ({ termKey, children }) => {
  const [show, setShow] = useState(false)
  const entry = lsmGlossary[termKey]
  if (!entry) return <>{children}</>

  return (
    <span
      style={{ position: 'relative', cursor: 'help', borderBottom: '1px dotted var(--accent, #6366f1)' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      aria-label={`${entry.zh} / ${entry.en}`}
    >
      {children}
      {show && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--card-bg, #1e293b)',
            color: 'var(--text)',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            whiteSpace: 'pre-wrap',
            maxWidth: '320px',
            zIndex: 100,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            border: '1px solid var(--line)',
          }}
        >
          <strong>{entry.zh} / {entry.en}</strong>
          <br />
          {entry.defZh}
          <br />
          {entry.defEn}
        </div>
      )}
    </span>
  )
}
