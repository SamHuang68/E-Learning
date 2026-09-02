import { describe, it, expect } from 'vitest'

/**
 * 現代大模型分散式訓練：Megatron-LM 張量平行 (Tensor Parallelism) 模型
 * 
 * 架構特徵：
 * 1. MHA (多頭注意力)：
 *    - Q, K, V 投影採用行平行 (Column Parallel)：切分頭數，無前向通訊
 *    - Output 投影採用列平行 (Row Parallel)：計算局部結果後進行 1 次 All-Reduce
 * 2. MLP (前饋網絡)：
 *    - 第一層 (Up-projection) 採用行平行 (Column Parallel)
 *    - 第二層 (Down-projection) 採用列平行 (Row Parallel) 後進行 1 次 All-Reduce
 * 
 * 每個 Transformer 層前向傳播嚴格產生 2 次 All-Reduce 通訊！
 * 
 * Ring-AllReduce 通訊量模型：
 * 每個 GPU 傳輸位元組數 = 2 * (N - 1) / N * M
 * 其中 N 為 TP 平行度 (GPU 數量)，M 為啟用張量大小 (SequenceLength * BatchSize * HiddenDim * ElementBytes)
 */
export interface TpCommunicationMetrics {
  tpDegree: number // N
  activationSizeBytes: number // M
  allReducePerLayerForward: number // 2
  bytesTransferredPerGpuPerLayer: number // 2 * [2 * (N-1)/N * M]
  nvlinkEfficiencyPercent: number
}

export function computeTensorParallelMetrics(
  tpDegree: number,
  batchSize: number,
  seqLen: number,
  hiddenDim: number,
  bytesPerElement: number = 2, // FP16/BF16
): TpCommunicationMetrics {
  const N = tpDegree
  const M = batchSize * seqLen * hiddenDim * bytesPerElement

  // 每次 All-Reduce 每個 GPU 傳輸的數據量
  const ringAllReducePerOp = (2 * (N - 1) / N) * M

  // 每個 Transformer 層有 2 次 All-Reduce
  const bytesTransferredPerGpu = 2 * ringAllReducePerOp

  return {
    tpDegree: N,
    activationSizeBytes: M,
    allReducePerLayerForward: 2,
    bytesTransferredPerGpuPerLayer: Math.round(bytesTransferredPerGpu),
    nvlinkEfficiencyPercent: 100,
  }
}

describe('前沿 AI 系統：Megatron-LM 張量平行 (Tensor Parallelism) 通訊架構測試', () => {
  it('單層 Transformer 在前向傳播中精準觸發 2 次 All-Reduce 聚合', () => {
    // 8 卡 GPU (TP=8), Batch=2, SeqLen=2048, HiddenDim=4096, BF16 (2 bytes)
    const metrics = computeTensorParallelMetrics(8, 2, 2048, 4096, 2)

    expect(metrics.allReducePerLayerForward).toBe(2)
    // 激活大小 M = 2 * 2048 * 4096 * 2 = 33,554,432 Bytes (32 MB)
    expect(metrics.activationSizeBytes).toBe(33554432)

    // Ring-AllReduce 係數 = 2 * (8 - 1) / 8 = 1.75
    // 兩次通訊量 = 2 * (1.75 * 32MB) = 3.5 * 32MB = 112 MB
    expect(metrics.bytesTransferredPerGpuPerLayer).toBe(117440512) // 112 MB
  })

  it('2 卡與 4 卡張量平行通訊量嚴格遵循 2*(N-1)/N 環形演算法理論下界', () => {
    // TP = 2: 係數 2 * 1 / 2 = 1.0 (傳輸 1 倍 M)
    const m2 = computeTensorParallelMetrics(2, 1, 1024, 1024, 2)
    // M = 1 * 1024 * 1024 * 2 = 2,097,152 Bytes (2 MB)
    // 兩次 All-Reduce: 2 * (1.0 * 2MB) = 4 MB
    expect(m2.bytesTransferredPerGpuPerLayer).toBe(2 * 2097152)

    // TP = 4: 係數 2 * 3 / 4 = 1.5
    const m4 = computeTensorParallelMetrics(4, 1, 1024, 1024, 2)
    expect(m4.bytesTransferredPerGpuPerLayer).toBe(Math.round(2 * 1.5 * 2097152))
  })
})
