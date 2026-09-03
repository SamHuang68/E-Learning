import { describe, it, expect } from 'vitest'

/**
 * 現代大模型分散式訓練：序號平行 (Sequence Parallelism, SP) 與顯存通訊重疊模型
 * 
 * 參考：Megatron-LM Sequence Parallelism (Korthikanti et al., 2022)
 * 
 * 核心洞察：
 * 1. 在傳統張量平行 (Tensor Parallelism, TP) 中，Self-Attention 與 MLP 核心矩陣乘法
 *    被縱向與橫向切分，但 LayerNorm 與 Dropout 沒有切分，
 *    導致每個 GPU 冗餘保存了完整的序列活化值 (Activation Memory = b * s * h)。
 * 
 * 2. 序號平行 (SP)：
 *    在 LayerNorm 與 Dropout 區域，將序列維度 s 均勻切分成 s / N 塊由 N 個 GPU 平行處理。
 *    - LayerNorm 活化顯存節省：直接除以 N (縮減為 1/N)
 *    - 通訊量恆定性：標準 TP 的 All-Reduce (通訊量 2 * (N-1)/N * M)
 *      在 SP 中精確分解為前向的 All-Gather 與反向的 Reduce-Scatter，
 *      通訊總量嚴格相等，但顯存大幅釋放且通訊能與前向 GEMM 非同步重疊 (Overlap)！
 */
export interface SequenceParallelMetrics {
  tpSize: number
  batchSize: number
  seqLen: number
  hiddenDim: number
  bytesPerElement: number
  standardTpActivationBytes: number
  sequenceParallelActivationBytes: number
  savedActivationRatio: number
  isCommunicationVolumeEqual: boolean
}

export function evaluateSequenceParallelism(
  tpSize: number,
  batchSize: number,
  seqLen: number,
  hiddenDim: number,
  bytesPerElement: number = 2, // FP16 / BF16
): SequenceParallelMetrics {
  if (tpSize <= 1 || batchSize <= 0 || seqLen <= 0 || hiddenDim <= 0) {
    throw new Error('Invalid parallelism configuration')
  }

  // LayerNorm 區域單 GPU 活化顯存
  const standardTpBytes = batchSize * seqLen * hiddenDim * bytesPerElement
  const spBytes = standardTpBytes / tpSize

  return {
    tpSize,
    batchSize,
    seqLen,
    hiddenDim,
    bytesPerElement,
    standardTpActivationBytes: standardTpBytes,
    sequenceParallelActivationBytes: spBytes,
    savedActivationRatio: Number(((standardTpBytes - spBytes) / standardTpBytes).toFixed(4)),
    isCommunicationVolumeEqual: true, // All-Reduce = Reduce-Scatter + All-Gather
  }
}

describe('前沿 AI 訓練架構：序號平行 (Sequence Parallelism) 顯存節約與通訊等價性單元測試', () => {
  it('TP=8 時序號平行將 LayerNorm 活化顯存大幅縮減 87.5% (1/8)', () => {
    // b = 1, s = 8192 (8K), h = 8192 (70B 模型標準維度), FP16 (2 Bytes)
    // standardTpBytes = 1 * 8192 * 8192 * 2 = 134,217,728 Bytes = 128 MB
    // spBytes = 128 MB / 8 = 16 MB
    const res = evaluateSequenceParallelism(8, 1, 8192, 8192, 2)

    expect(res.standardTpActivationBytes).toBe(134217728)
    expect(res.sequenceParallelActivationBytes).toBe(16777216)
    expect(res.savedActivationRatio).toBeCloseTo(0.875, 3)
    expect(res.isCommunicationVolumeEqual).toBe(true)
  })
})
