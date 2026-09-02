import { describe, it, expect } from 'vitest'

/**
 * 混合專家模型 (Mixture of Experts, MoE) 稀疏門控路由模型
 * 
 * 門控網路 G(x):
 * 1. 計算所有專家的相符分數 logits: H(x) = x * W_g
 * 2. 選出 Top-k 分數最高的專家索引
 * 3. 僅對這 k 個專家計算 Softmax 歸一化權重，其餘專家的權重設為 0 (稀疏啟動)
 */
export interface MoERoutingResult {
  selectedExpertIndices: number[]
  normalizedWeights: number[]
  sparseGatingVector: number[]
}

export function computeTopKMoERouting(
  expertLogits: number[], // 各專家的門控未歸一化分數
  k: number = 2,
): MoERoutingResult {
  const expertCount = expertLogits.length
  // 建立包含索引的結構並依分數降冪排序
  const indexedLogits = expertLogits.map((val, idx) => ({ idx, val }))
  indexedLogits.sort((a, b) => b.val - a.val)

  const topKItems = indexedLogits.slice(0, k)
  const selectedExpertIndices = topKItems.map((item) => item.idx)

  // 數值穩定 Softmax
  const maxLogit = Math.max(...topKItems.map((item) => item.val))
  const expValues = topKItems.map((item) => Math.exp(item.val - maxLogit))
  const sumExp = expValues.reduce((acc, v) => acc + v, 0)
  const normalizedWeights = expValues.map((v) => Number((v / sumExp).toFixed(4)))

  // 構造稀疏向量 (長度為 expertCount)
  const sparseGatingVector = new Array(expertCount).fill(0)
  selectedExpertIndices.forEach((expertIdx, i) => {
    sparseGatingVector[expertIdx] = normalizedWeights[i]
  })

  return {
    selectedExpertIndices,
    normalizedWeights,
    sparseGatingVector,
  }
}

/**
 * 輔助負載均衡損失 (Load Balancing Auxiliary Loss) 計算
 * 防止特定熱門專家被頻繁選取導致計算坍塌 (Routing Collapse)
 * L_aux = alpha * E * sum_{i=1}^E (f_i * P_i)
 */
export function computeMoELoadBalancingLoss(
  tokensPerExpert: number[], // 各專家實際分配到的 token 數
  averageProbPerExpert: number[], // 門控預測該專家的平均機率
  alpha: number = 0.01,
): number {
  const E = tokensPerExpert.length
  const totalTokens = tokensPerExpert.reduce((a, b) => a + b, 0)
  const f = tokensPerExpert.map((c) => c / totalTokens)

  let dotProduct = 0
  for (let i = 0; i < E; i++) {
    dotProduct += f[i] * averageProbPerExpert[i]
  }

  const loss = alpha * E * dotProduct
  return Number(loss.toFixed(6))
}

describe('前沿 AI 架構：混合專家模型 (MoE) 稀疏路由單元測試', () => {
  it('Top-2 門控路由精準啟動前 2 名專家且權重總和為 1.0', () => {
    // 8 個專家的門控 Logits 分數
    const logits = [1.2, 3.5, 0.4, 2.8, -0.5, 1.8, 0.1, 2.1]
    // 預期最高分：專家 1 (3.5) 與 專家 3 (2.8)
    const routing = computeTopKMoERouting(logits, 2)

    expect(routing.selectedExpertIndices).toEqual([1, 3])
    expect(routing.selectedExpertIndices.length).toBe(2)

    // 歸一化權重總和逼近 1.0
    const sumWeight = routing.normalizedWeights.reduce((a, b) => a + b, 0)
    expect(sumWeight).toBeCloseTo(1.0, 3)

    // 稀疏向量中其餘 6 個專家權重必須精確為 0
    expect(routing.sparseGatingVector[0]).toBe(0)
    expect(routing.sparseGatingVector[2]).toBe(0)
    expect(routing.sparseGatingVector[4]).toBe(0)
    expect(routing.sparseGatingVector[1]).toBeGreaterThan(routing.sparseGatingVector[3])
  })

  it('負載均衡損失在完全均勻分派時達到理論極小值', () => {
    const E = 8
    // 完全均勻分派：每個專家各 100 tokens, 平均預測機率 1/8 = 0.125
    const uniformTokens = new Array(E).fill(100)
    const uniformProbs = new Array(E).fill(1 / E)

    const optimalLoss = computeMoELoadBalancingLoss(uniformTokens, uniformProbs, 0.01)
    // 0.01 * 8 * (8 * (1/8 * 1/8)) = 0.01 * 8 * (1/8) = 0.01
    expect(optimalLoss).toBeCloseTo(0.01, 5)

    // 若產生嚴重負載傾斜 (所有 token 全塞給專家 0)
    const skewedTokens = [800, 0, 0, 0, 0, 0, 0, 0]
    const skewedProbs = [1.0, 0, 0, 0, 0, 0, 0, 0]
    const skewedLoss = computeMoELoadBalancingLoss(skewedTokens, skewedProbs, 0.01)
    // 0.01 * 8 * (1 * 1) = 0.08 (損失大幅膨脹 8 倍)
    expect(skewedLoss).toBe(0.08)
    expect(skewedLoss).toBeGreaterThan(optimalLoss)
  })
})
