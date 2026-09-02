import { describe, it, expect } from 'vitest'

/**
 * TPU 脈動陣列 (Systolic Array) 運算週期模型
 * 
 * 在 N x N 脈動陣列中執行矩陣乘法 C = A x B：
 * - 矩陣 A 由左側按對角線 skew 輸入
 * - 矩陣 B 由頂部按對角線 skew 輸入
 * - 每個 PE (Processing Element) 執行單週期 MAC (Multiply-Accumulate)
 * - 首個輸出在第 2N - 1 週期產生
 * - 全部 N x N 矩陣乘加運算在 3N - 2 週期完全輸出完畢！
 */
export interface SystolicArrayMetrics {
  arrayDim: number // N
  totalMacOperations: number // 2 * N^3
  systolicCycles: number // 3N - 2
  cpuSequentialOps: number
  hardwareSpeedupCyclesRatio: number
}

export function computeSystolicArrayPerformance(N: number): SystolicArrayMetrics {
  const totalMacOperations = 2 * Math.pow(N, 3)
  const systolicCycles = 3 * N - 2
  const cpuSequentialOps = Math.pow(N, 3) // 簡化乘法次數
  const hardwareSpeedupCyclesRatio = Number((cpuSequentialOps / systolicCycles).toFixed(1))

  return {
    arrayDim: N,
    totalMacOperations,
    systolicCycles,
    cpuSequentialOps,
    hardwareSpeedupCyclesRatio,
  }
}

/**
 * FlashAttention 記憶體存取 (IO Complexity) 演算法模型
 * 
 * 傳統 Self-Attention:
 * 1. 計算 S = Q * K^T ➜ 寫入 HBM (O(N^2) IO)
 * 2. 計算 P = Softmax(S) ➜ 讀取 S 並寫入 P (O(N^2) IO)
 * 3. 計算 O = P * V ➜ 讀取 P 並寫入 O (O(N^2) IO)
 * 總 HBM 讀寫量受限於記憶體頻寬 (Memory-Bound)。
 * 
 * FlashAttention-2:
 * 採用 SRAM 晶上快取分塊 (Tiling Block Size B) 與線上 Softmax (Online Softmax)。
 * HBM IO 總量降為 O(N * d^2 / SRAM_Size)，完全不需要物化 N x N 注意力矩陣！
 */
export function estimateAttentionHbmIo(
  seqLen: number,
  headDim: number,
  bytesPerElement: number = 2, // FP16
): { standardAttentionHbmIoBytes: number; flashAttentionHbmIoBytes: number; ioReductionFactor: number } {
  // 標準 Attention 需在 HBM 寫入/讀取 N x N 矩陣 S 與 P
  // HBM IO ≈ 4 * N * d + 2 * N^2 (中間注意力矩陣)
  const standardBytes = (4 * seqLen * headDim + 2 * Math.pow(seqLen, 2)) * bytesPerElement

  // FlashAttention 僅讀寫 Q, K, V 與輸出 O，不儲存 N x N 中間矩陣
  // HBM IO ≈ 4 * N * d (僅線性於序列長度 N)
  const flashBytes = (4 * seqLen * headDim) * bytesPerElement

  const ioReductionFactor = Number((standardBytes / flashBytes).toFixed(1))

  return {
    standardAttentionHbmIoBytes: standardBytes,
    flashAttentionHbmIoBytes: flashBytes,
    ioReductionFactor,
  }
}

describe('現代 AI 晶片架構 (TPU 脈動陣列 & FlashAttention) 單元測試', () => {
  it('TPU 脈動陣列將 256x256 矩陣乘法運算週期自 O(N^3) 劇降至 3N-2 週期', () => {
    const N = 256
    const perf = computeSystolicArrayPerformance(N)

    // 總 MAC 運算次數 = 2 * 256^3 = 33,554,432 次
    expect(perf.totalMacOperations).toBe(33554432)

    // 脈動陣列時脈週期 = 3 * 256 - 2 = 766 週期！
    expect(perf.systolicCycles).toBe(766)

    // 相較於純量循序 256^3 (16,777,216) 次循環，硬體並行吞吐倍數超過 20,000 倍！
    expect(perf.hardwareSpeedupCyclesRatio).toBeGreaterThan(20000)
  })

  it('FlashAttention-2 在長文本 (SeqLen=4096) 下將 HBM 顯存 IO 吞吐減少數十倍', () => {
    // 序列長度 N = 4096, 標頭維度 d = 64, FP16 (2 bytes)
    const ioMetrics = estimateAttentionHbmIo(4096, 64, 2)

    // 標準 Attention 因物化 4096 x 4096 浮點數矩陣，需消耗龐大 HBM 頻寬
    expect(ioMetrics.standardAttentionHbmIoBytes).toBeGreaterThan(30 * 1024 * 1024) // > 30 MB

    // FlashAttention-2 晶上在線分塊 (Tiling)，完全免除中間矩陣讀寫
    expect(ioMetrics.flashAttentionHbmIoBytes).toBeLessThan(3 * 1024 * 1024) // ~ 2 MB

    // IO 頻寬開銷縮減達到 17 倍以上！
    expect(ioMetrics.ioReductionFactor).toBeGreaterThanOrEqual(17)
  })
})
