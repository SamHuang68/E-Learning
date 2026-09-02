import { describe, it, expect } from 'vitest'

/**
 * 資料庫索引核心：B+ 樹 (B+ Tree) 結構模型
 * 
 * 特性：
 * - 階數 M (扇出 Fanout): 每個內部節點最多有 M 個子節點，最少 ceil(M/2) 個
 * - 內部節點只存鍵 (Keys)，葉子節點存放真實資料 (Record Pointer)
 * - 葉子節點具有雙向鏈結指標 (Next / Prev)，支援 O(log_M N) 定位後以 O(k) 順序範圍掃描
 */
export interface BPlusTreeMetrics {
  fanoutM: number
  totalRecords: number
  treeHeight: number // ceil(log_M(N))
  diskIoReadsPerLookup: number // 等於 treeHeight
}

export function computeBPlusTreeMetrics(
  fanoutM: number,
  totalRecords: number,
): BPlusTreeMetrics {
  // 樹高 h 使得 M^h >= N => h = ceil(log_M(N))
  const height = Math.max(1, Math.ceil(Math.log(totalRecords) / Math.log(fanoutM)))
  return {
    fanoutM,
    totalRecords,
    treeHeight: height,
    diskIoReadsPerLookup: height,
  }
}

/**
 * 模擬 B+ 樹葉子節點鏈結的範圍查詢 (Range Scan)
 */
export function simulateBPlusTreeRangeScan(
  sortedLeaves: Array<{ key: number; data: string }>,
  minKey: number,
  maxKey: number,
): string[] {
  // 1. 透過索引找到第一個 >= minKey 的位置
  let startIndex = sortedLeaves.findIndex((item) => item.key >= minKey)
  if (startIndex === -1) return []

  // 2. 順著葉子節點指針連續讀取，直到 key > maxKey
  const results: string[] = []
  for (let i = startIndex; i < sortedLeaves.length; i++) {
    if (sortedLeaves[i].key > maxKey) break
    results.push(sortedLeaves[i].data)
  }

  return results
}

describe('資料庫核心：B+ 樹高扇出樹高與順序範圍查詢單元測試', () => {
  it('扇出 M=200 時，一千萬 (10M) 筆資料僅需 4 次磁碟 I/O 即可定位目標', () => {
    // 4KB/16KB 頁框大小下扇出常為 100~300
    const metrics = computeBPlusTreeMetrics(200, 10_000_000)

    // 200^3 = 8,000,000 < 10M, 200^4 = 1,600,000,000 > 10M
    // 樹高嚴格為 4
    expect(metrics.treeHeight).toBe(4)
    expect(metrics.diskIoReadsPerLookup).toBe(4)
  })

  it('B+ 樹葉子節點鏈結結構支援高效率範圍檢索 (Range Query)', () => {
    const leaves = [
      { key: 10, data: 'Rec-10' },
      { key: 25, data: 'Rec-25' },
      { key: 30, data: 'Rec-30' },
      { key: 45, data: 'Rec-45' },
      { key: 50, data: 'Rec-50' },
      { key: 65, data: 'Rec-65' },
    ]

    // 檢索 key 在 [25, 50] 區間內的資料
    const rangeResult = simulateBPlusTreeRangeScan(leaves, 25, 50)

    expect(rangeResult).toEqual(['Rec-25', 'Rec-30', 'Rec-45', 'Rec-50'])
  })
})
