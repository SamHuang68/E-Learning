import { describe, it, expect } from 'vitest'

/**
 * 現代大模型參數量化高效微調 LoRA (Low-Rank Adaptation) 數學模型
 * 
 * 參數：
 * - inDim (k): 輸入維度 (如 4096)
 * - outDim (d): 輸出維度 (如 4096)
 * - rank (r): 低秩維度 (通常 4, 8, 16, 32, 64)
 * - alpha: 縮放常數 (通常設為 2 * rank 或 16/32)
 */
export interface LoRAMetrics {
  originalWeightParams: number // d * k
  loraTrainableParams: number // (d + k) * r
  paramReductionPercent: number
  scalingFactor: number // alpha / r
}

export function computeLoRAParameters(
  inDim: number,
  outDim: number,
  rank: number,
  alpha: number = 16,
): LoRAMetrics {
  const originalWeightParams = inDim * outDim
  const loraTrainableParams = (inDim + outDim) * rank
  const paramReductionPercent = Number(
    (((originalWeightParams - loraTrainableParams) / originalWeightParams) * 100).toFixed(2),
  )
  const scalingFactor = alpha / rank

  return {
    originalWeightParams,
    loraTrainableParams,
    paramReductionPercent,
    scalingFactor,
  }
}

/**
 * 模擬 LoRA 零初始化不變性與權重融合 (Weight Merging)
 */
export function simulateLoRAForwardAndMerge(
  w0: number[][], // 原矩陣 (d x k)
  rank: number,
  alpha: number,
): { isDeltaZeroAtInit: boolean; mergedW: number[][] } {
  const d = w0.length
  const k = w0[0].length

  // B 初始化為 0 (d x r)
  const B = Array.from({ length: d }, () => new Array(rank).fill(0))
  // A 隨機高斯初始化 (r x k) - 此處以常數模擬
  const A = Array.from({ length: rank }, () => new Array(k).fill(0.01))

  // 計算 Delta W = (alpha / r) * (B x A)
  const scaling = alpha / rank
  const deltaW = Array.from({ length: d }, () => new Array(k).fill(0))

  let isDeltaZeroAtInit = true
  for (let i = 0; i < d; i++) {
    for (let j = 0; j < k; j++) {
      let sum = 0
      for (let p = 0; p < rank; p++) {
        sum += B[i][p] * A[p][j]
      }
      deltaW[i][j] = scaling * sum
      if (deltaW[i][j] !== 0) isDeltaZeroAtInit = false
    }
  }

  // 融合 W_merged = W0 + Delta W
  const mergedW = Array.from({ length: d }, (_, i) =>
    Array.from({ length: k }, (_, j) => w0[i][j] + deltaW[i][j]),
  )

  return { isDeltaZeroAtInit, mergedW }
}

describe('前沿 AI 演算法：LoRA 低秩矩陣適應微調單元測試', () => {
  it('4096 維度下 rank=8 的 LoRA 參數量劇減 99.61%', () => {
    const metrics = computeLoRAParameters(4096, 4096, 8, 16)

    // 原矩陣參數量：4096 * 4096 = 16,777,216
    expect(metrics.originalWeightParams).toBe(16777216)
    // LoRA 參數量：(4096 + 4096) * 8 = 65,536
    expect(metrics.loraTrainableParams).toBe(65536)
    // 參數縮減率高達 99.61%
    expect(metrics.paramReductionPercent).toBe(99.61)
    expect(metrics.scalingFactor).toBe(2.0)
  })

  it('LoRA 透過 B=0 初始化保證微調起點之輸出完全等於未微調之基準模型', () => {
    // 簡單 2x2 矩陣測試
    const w0 = [
      [1.5, -0.8],
      [2.3, 0.4],
    ]
    const res = simulateLoRAForwardAndMerge(w0, 2, 16)

    expect(res.isDeltaZeroAtInit).toBe(true)
    // 融合後的權重與原權重完全一致
    expect(res.mergedW).toEqual(w0)
  })
})
