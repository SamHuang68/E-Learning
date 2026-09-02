import { describe, it, expect } from 'vitest'

/**
 * 階層式快取架構與位址欄位分解模型
 * 
 * 32-bit 位址 = [Tag 位元 | Set Index 位元 | Byte Offset 位元]
 * - Byte Offset = log2(Cache Line Size in Bytes)
 * - Number of Sets = Total Cache Size / (Associativity * Cache Line Size)
 * - Set Index Bits = log2(Number of Sets)
 * - Tag Bits = 32 - Set Index Bits - Byte Offset Bits
 */
export interface CacheAddressBreakdown {
  totalSizeBytes: number
  lineSizeBytes: number
  associativityWays: number
  numSets: number
  offsetBits: number
  indexBits: number
  tagBits: number
}

export function parseCacheAddressFields(
  totalSizeKB: number,
  lineSizeBytes: number,
  associativityWays: number,
  addressBits: number = 32,
): CacheAddressBreakdown {
  const totalSizeBytes = totalSizeKB * 1024
  const offsetBits = Math.round(Math.log2(lineSizeBytes))
  const numSets = totalSizeBytes / (associativityWays * lineSizeBytes)
  const indexBits = Math.round(Math.log2(numSets))
  const tagBits = addressBits - indexBits - offsetBits

  return {
    totalSizeBytes,
    lineSizeBytes,
    associativityWays,
    numSets,
    offsetBits,
    indexBits,
    tagBits,
  }
}

/**
 * 多核心快取一致性 MESI 協定狀態機模型
 * 狀態：
 * M: Modified (已修改，獨占，與記憶體不一致)
 * E: Exclusive (獨占，未修改，與記憶體一致)
 * S: Shared (共享，唯讀，多核可能同時持有)
 * I: Invalid (無效)
 */
export type MesiState = 'M' | 'E' | 'S' | 'I'

export interface CoreCacheLine {
  coreId: number
  state: MesiState
  data: number
}

export function simulateMesiWrite(
  cores: CoreCacheLine[],
  writingCoreId: number,
  newData: number,
): { updatedCores: CoreCacheLine[]; busMessage: string } {
  const targetCore = cores.find((c) => c.coreId === writingCoreId)
  if (!targetCore) throw new Error('Core not found')

  const updatedCores = cores.map((core) => {
    if (core.coreId === writingCoreId) {
      return { ...core, state: 'M' as MesiState, data: newData }
    } else {
      // 其他核心原本若為 S, E 或 M，收到匯流排 Invalidation 訊號後全部失效 (轉為 I)
      return { ...core, state: 'I' as MesiState }
    }
  })

  return {
    updatedCores,
    busMessage: `Core ${writingCoreId} issued Invalidate / Read-With-Intent-To-Modify (RWITM) to bus`,
  }
}

describe('快取階層架構與多核心 MESI 一致性單元測試', () => {
  it('32KB 8-Way 64B 快取行之 Tag, Index, Offset 位元劃分精算', () => {
    // 32 KB 快取, 64-byte line, 8-way set associative, 32-bit address
    const layout = parseCacheAddressFields(32, 64, 8, 32)

    // Offset = log2(64) = 6 bits
    expect(layout.offsetBits).toBe(6)
    // Sets = 32768 / (8 * 64) = 32768 / 512 = 64 sets
    expect(layout.numSets).toBe(64)
    // Index = log2(64) = 6 bits
    expect(layout.indexBits).toBe(6)
    // Tag = 32 - 6 - 6 = 20 bits
    expect(layout.tagBits).toBe(20)
  })

  it('全關聯 (Fully Associative) 快取無 Index 位元全由 Tag 比對', () => {
    // 16 KB, 64-byte line, Fully Associative (Ways = 256, Sets = 1)
    const fullyAssoc = parseCacheAddressFields(16, 64, 256, 32)
    expect(fullyAssoc.numSets).toBe(1)
    expect(fullyAssoc.indexBits).toBe(0)
    expect(fullyAssoc.offsetBits).toBe(6)
    expect(fullyAssoc.tagBits).toBe(26) // 32 - 6 = 26 bits
  })

  it('多核心 MESI 寫入觸發 Bus Invalidate 使其他核心狀態轉為 Invalid', () => {
    // 初始狀態：Core 0 與 Core 1 同時共享讀取該變數，皆處於 Shared (S)
    const initialCores: CoreCacheLine[] = [
      { coreId: 0, state: 'S', data: 42 },
      { coreId: 1, state: 'S', data: 42 },
    ]

    // Core 0 寫入新值 99
    const result = simulateMesiWrite(initialCores, 0, 99)

    // Core 0 轉為 Modified (M)，數據更新為 99
    expect(result.updatedCores.find((c) => c.coreId === 0)?.state).toBe('M')
    expect(result.updatedCores.find((c) => c.coreId === 0)?.data).toBe(99)

    // Core 1 受到匯流排失效廣播，狀態強制轉為 Invalid (I)
    expect(result.updatedCores.find((c) => c.coreId === 1)?.state).toBe('I')
    expect(result.busMessage).toContain('Invalidate')
  })
})
