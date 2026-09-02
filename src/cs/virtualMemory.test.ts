import { describe, it, expect } from 'vitest'

/**
 * 虛擬記憶體 (Virtual Memory) 與 TLB 有效存取時間 (EMAT) 模型
 * 
 * EMAT (Effective Memory Access Time):
 * - TLB 命中 (機率 α): 耗時 T_TLB + T_RAM (TLB 查出物理頁框，再讀一次主存取出數據)
 * - TLB 未命中 (機率 1 - α): 耗時 T_TLB + 2 * T_RAM (查 TLB 沒中 -> 查主存頁表取得 PFN -> 查主存取得數據)
 * 
 * EMAT = α * (T_TLB + T_RAM) + (1 - α) * (T_TLB + 2 * T_RAM)
 *      = T_TLB + (2 - α) * T_RAM
 */
export function calculateEmat(
  tlbHitRate: number, // α (0.0 ~ 1.0)
  tlbAccessTimeNs: number, // 例如 10 ns
  ramAccessTimeNs: number, // 例如 100 ns
): number {
  return Number((tlbAccessTimeNs + (2 - tlbHitRate) * ramAccessTimeNs).toFixed(2))
}

/**
 * 分頁置換演算法模擬器 (Page Replacement Simulator)
 * 支援 FIFO 與 LRU
 */
export function simulatePageFaults(
  referenceString: number[],
  frameCount: number,
  algorithm: 'FIFO' | 'LRU',
): { pageFaultCount: number; hitCount: number; faultRate: number } {
  let pageFaultCount = 0
  let hitCount = 0
  const frames: number[] = []
  // 對於 LRU，記錄各頁面最近訪問的時間戳
  const lastUsedMap = new Map<number, number>()

  referenceString.forEach((page, timeStep) => {
    if (frames.includes(page)) {
      hitCount += 1
      if (algorithm === 'LRU') {
        lastUsedMap.set(page, timeStep)
      }
    } else {
      pageFaultCount += 1
      if (frames.length < frameCount) {
        frames.push(page)
      } else {
        if (algorithm === 'FIFO') {
          // 移除最早進來的頁面 (隊首)
          frames.shift()
          frames.push(page)
        } else {
          // LRU: 找到 lastUsedMap 中時間戳最小的頁面
          let lruPage = frames[0]
          let minTime = lastUsedMap.get(lruPage) ?? 0

          for (const f of frames) {
            const t = lastUsedMap.get(f) ?? 0
            if (t < minTime) {
              minTime = t
              lruPage = f
            }
          }

          const idx = frames.indexOf(lruPage)
          frames.splice(idx, 1)
          frames.push(page)
        }
      }
      lastUsedMap.set(page, timeStep)
    }
  })

  const faultRate = Number(((pageFaultCount / referenceString.length) * 100).toFixed(1))

  return { pageFaultCount, hitCount, faultRate }
}

describe('虛擬記憶體 (Virtual Memory) 與分頁置換單元測試', () => {
  it('TLB 命中率 95% 時之有效記憶體存取時間 EMAT 精算', () => {
    // TLB 耗時 10ns, RAM 耗時 100ns, 命中率 95%
    // EMAT = 10 + (2 - 0.95) * 100 = 10 + 105 = 115 ns
    const emat = calculateEmat(0.95, 10, 100)
    expect(emat).toBe(115.0)

    // 若完全沒有 TLB (命中率 0%)，EMAT = 10 + 200 = 210 ns
    const noTlbEmat = calculateEmat(0.0, 10, 100)
    expect(noTlbEmat).toBe(210.0)
  })

  it('經典貝拉迪異常 (Belady Anomaly) 實證：FIFO 在 4 頁框下分頁缺失反比 3 頁框多', () => {
    // 經典 Belady 異常參考字串
    const beladySequence = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]

    // 3 個頁框
    const fifo3 = simulatePageFaults(beladySequence, 3, 'FIFO')
    // 4 個頁框
    const fifo4 = simulatePageFaults(beladySequence, 4, 'FIFO')

    // 驚人事實：3 個頁框發生 9 次分頁缺失，4 個頁框反而發生 10 次分頁缺失！
    expect(fifo3.pageFaultCount).toBe(9)
    expect(fifo4.pageFaultCount).toBe(10)
    expect(fifo4.pageFaultCount).toBeGreaterThan(fifo3.pageFaultCount)
  })

  it('LRU 堆疊演算法 (Stack Algorithm) 絕不受貝拉迪異常影響', () => {
    const beladySequence = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]

    const lru3 = simulatePageFaults(beladySequence, 3, 'LRU')
    const lru4 = simulatePageFaults(beladySequence, 4, 'LRU')

    // LRU 在 3 頁框時 10 次缺失，在 4 頁框時降為 8 次缺失，嚴格遞減！
    expect(lru3.pageFaultCount).toBe(10)
    expect(lru4.pageFaultCount).toBe(8)
    expect(lru4.pageFaultCount).toBeLessThan(lru3.pageFaultCount)
  })
})
