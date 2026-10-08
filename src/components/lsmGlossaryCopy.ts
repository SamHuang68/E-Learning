import type { UiLocale } from '../i18n/locale'

interface GlossaryEntry {
  term: string
  zh: string
  en: string
  defZh: string
  defEn: string
}

const lsmGlossary = {
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
} satisfies Record<string, GlossaryEntry>

export type LsmGlossaryTermKey = keyof typeof lsmGlossary

export interface LsmGlossaryCopy {
  label: string
  heading: string
  definitions: string[]
}

export interface LsmTooltipInteractionState {
  hovered: boolean
  focused: boolean
  dismissed: boolean
}

export function isLsmTooltipVisible({
  hovered,
  focused,
  dismissed,
}: LsmTooltipInteractionState): boolean {
  return !dismissed && (hovered || focused)
}

export function getLsmGlossaryCopy(locale: UiLocale, termKey: LsmGlossaryTermKey): LsmGlossaryCopy {
  const entry = lsmGlossary[termKey]

  if (locale === 'en') {
    return {
      label: entry.en,
      heading: entry.en,
      definitions: [entry.defEn],
    }
  }

  return {
    label: `${entry.zh} / ${entry.en}`,
    heading: `${entry.zh} / ${entry.en}`,
    definitions: [entry.defZh, entry.defEn],
  }
}
