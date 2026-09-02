import { describe, it, expect } from 'vitest'

/**
 * 分散式儲存基石：LSM-Tree (Log-Structured Merge-tree) 數學模型
 * 
 * 參考：RocksDB, Cassandra, LevelDB
 * 
 * 核心機制：
 * 1. 寫入路徑：先寫入預寫日誌 WAL (順序寫入保證持久性) ➜ 寫入記憶體 MemTable (跳躍表 SkipList，O(log N))
 * 2. 凍結刷新：MemTable 達閾值轉為 Immutable MemTable，後台 Flush 成磁碟 L0 SSTable
 * 3. 分層壓縮 (Leveled Compaction)：
 *    - 放大倍數 T (預設 T = 10)，層數 L
 *    - Level i 大小上限為 Level (i-1) 的 T 倍
 *    - 當 Level i 超過容量時，挑選 SSTable 與 Level (i+1) 重疊鍵值的 SSTables 進行多路歸併排序
 * 
 * 放大指標計算：
 * - 寫入放大 (Write Amplification Factor, WAF)：
 *   WAF ≈ 1 (WAL) + 1 (Flush to L0) + T * (L - 1)
 * - 空間放大 (Space Amplification Factor, SAF)：
 *   SAF ≈ (1 + 1/T + 1/T^2 + ...) ≈ T / (T - 1)
 */
export interface LSMTreeMetrics {
  growthFactorT: number
  levelsCount: number
  waf: number
  saf: number
  l0KeyOverlap: boolean
  lnKeyOverlap: boolean
}

export function computeLSMTreeMetrics(
  growthFactorT: number = 10,
  levelsCount: number = 5,
): LSMTreeMetrics {
  if (growthFactorT <= 1 || levelsCount < 2) {
    throw new Error('Invalid LSM-Tree parameters')
  }

  // WAF: WAL 寫入 (1) + Flush (1) + 各層 Compaction (大約每層 T 次覆寫)
  const compactionWAF = growthFactorT * (levelsCount - 1)
  const waf = 1 + 1 + compactionWAF

  // SAF: 幾何級數和 T / (T - 1)
  const saf = Number((growthFactorT / (growthFactorT - 1)).toFixed(3))

  return {
    growthFactorT,
    levelsCount,
    waf,
    saf,
    l0KeyOverlap: true, // L0 是直接從 MemTable Flush 下來，Key 範圍會重疊
    lnKeyOverlap: false, // L1 以上經過 Compaction 排序切分，同層內 SSTable 鍵值嚴格不重疊
  }
}

describe('分散式儲存核心：LSM-Tree 寫入放大與分層壓縮單元測試', () => {
  it('在標準 5 層且放大因子 T=10 下精確推導寫入放大 WAF 與空間放大 SAF', () => {
    const metrics = computeLSMTreeMetrics(10, 5)

    // WAF = 2 + 10 * 4 = 42
    expect(metrics.waf).toBe(42)
    // SAF = 10 / 9 ≈ 1.111
    expect(metrics.saf).toBe(1.111)
  })

  it('L0 鍵值允許重疊，而 L1 及以上同層 SSTable 鍵值嚴格互斥不重疊', () => {
    const metrics = computeLSMTreeMetrics(10, 6)
    expect(metrics.l0KeyOverlap).toBe(true)
    expect(metrics.lnKeyOverlap).toBe(false)
  })
})
