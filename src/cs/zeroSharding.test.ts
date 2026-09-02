import { describe, it, expect } from 'vitest'

/**
 * 現代大模型分散式訓練：ZeRO-3 全分片 (Full Sharding) 通訊開銷精算模型
 * 
 * 參考：DeepSpeed ZeRO (Rajbhandari et al.) / PyTorch FSDP
 * 
 * 符號說明：
 * - N: GPU 數量 (例如 N = 8, 16, 64)
 * - M: 模型參數大小 (Bytes)
 * 
 * 通訊量推導 (每次訓練迭代每卡傳輸量)：
 * 1. 標準資料平行 (Standard DP):
 *    - 前向：無通訊 (0)
 *    - 反向：梯度 All-Reduce = 2 * (N - 1) / N * M
 *    - 總計 Comm_DP = 2 * (N - 1) / N * M
 * 
 * 2. ZeRO-3 (FSDP 全分片):
 *    - 前向：逐層 All-Gather 參數 = (N - 1) / N * M
 *    - 反向：逐層 All-Gather 參數 = (N - 1) / N * M
 *    - 反向：梯度 Reduce-Scatter = (N - 1) / N * M
 *    - 總計 Comm_ZeRO3 = 3 * (N - 1) / N * M
 * 
 * 通訊開銷比值：
 * Comm_ZeRO3 / Comm_DP = 3 / 2 = 1.5 倍 (僅增加 50% 通訊，換取顯存減少 N 倍！)
 */
export interface ZeroCommunicationMetrics {
  gpus: number
  modelBytes: number
  dpCommBytes: number
  zero3CommBytes: number
  commRatio: number
  memoryReductionFactor: number
}

export function computeZero3Communication(
  gpus: number,
  modelBytes: number,
): ZeroCommunicationMetrics {
  if (gpus <= 1) throw new Error('GPUs must be greater than 1')

  const factor = (gpus - 1) / gpus
  const dpCommBytes = 2 * factor * modelBytes
  const zero3CommBytes = 3 * factor * modelBytes
  const commRatio = Number((zero3CommBytes / dpCommBytes).toFixed(2))

  return {
    gpus,
    modelBytes,
    dpCommBytes: Number(dpCommBytes.toFixed(2)),
    zero3CommBytes: Number(zero3CommBytes.toFixed(2)),
    commRatio,
    memoryReductionFactor: gpus,
  }
}

describe('前沿 AI 訓練：ZeRO-3 (FSDP) 全分片通訊開銷與顯存攤銷單元測試', () => {
  it('ZeRO-3 通訊開銷相較於標準資料平行嚴格為 1.5 倍', () => {
    // 70B 模型 FP16 參數大小約 140 GB
    const modelBytes = 140e9
    const metrics8 = computeZero3Communication(8, modelBytes)
    const metrics64 = computeZero3Communication(64, modelBytes)

    expect(metrics8.commRatio).toBe(1.5)
    expect(metrics64.commRatio).toBe(1.5)
  })

  it('在 64 卡叢集下顯存獲得 64 倍均勻攤銷使萬億模型可訓練', () => {
    const metrics = computeZero3Communication(64, 200e9)
    expect(metrics.memoryReductionFactor).toBe(64)
  })
})
