import { describe, it, expect } from 'vitest'

/**
 * 現代大模型推論極速加速：推測解碼 (Speculative Decoding) 數學模型
 * 
 * 參數：
 * - draftAcceptanceRate (alpha): 草稿模型產出被大模型接受的平均機率 (通常 0.7 ~ 0.85)
 * - gamma (K): 草稿預測長度 (Lookahead Draft Steps, 通常 3 ~ 6)
 * - targetCostRatio (c): 小模型單步開銷佔大模型單步開銷的比例 (通常 0.05 ~ 0.10)
 */
export interface SpeculativeMetrics {
  expectedTokensPerStep: number // E[N] = (1 - alpha^(K+1)) / (1 - alpha)
  theoreticalSpeedup: number // E[N] / (1 + c * K)
  distributionIdentical: boolean
}

export function computeSpeculativeSpeedup(
  acceptanceRate: number, // alpha
  draftSteps: number, // K
  costRatio: number = 0.05, // c
): SpeculativeMetrics {
  const alpha = acceptanceRate
  const K = draftSteps

  // 計算等比級數和：1 + alpha + alpha^2 + ... + alpha^K
  let expectedTokens = 0
  for (let j = 0; j <= K; j++) {
    expectedTokens += Math.pow(alpha, j)
  }

  // 大模型 1 次並行評估 + 小模型 K 次草稿生成
  const totalCostInTargetUnits = 1 + costRatio * K
  const theoreticalSpeedup = Number((expectedTokens / totalCostInTargetUnits).toFixed(2))

  return {
    expectedTokensPerStep: Number(expectedTokens.toFixed(4)),
    theoreticalSpeedup,
    distributionIdentical: true,
  }
}

/**
 * 拒絕採樣判定：驗證 p(x) >= q(x) 時 100% 接受
 */
export function evaluateTokenAcceptance(
  targetProb: number, // p(x)
  draftProb: number, // q(x)
): { acceptProb: number; isAlwaysAccepted: boolean } {
  const acceptProb = Math.min(1.0, targetProb / draftProb)
  return {
    acceptProb: Number(acceptProb.toFixed(4)),
    isAlwaysAccepted: targetProb >= draftProb,
  }
}

describe('前沿 AI：推測解碼 (Speculative Decoding) 與拒絕採樣單元測試', () => {
  it('當目標大模型機率高於草稿小模型時保證 100% 接受', () => {
    // 目標大模型 p=0.6，草稿小模型 q=0.4
    const res = evaluateTokenAcceptance(0.6, 0.4)
    expect(res.acceptProb).toBe(1.0)
    expect(res.isAlwaysAccepted).toBe(true)

    // 反之若 p=0.2, q=0.5，以 0.2/0.5 = 0.4 (40%) 機率接受
    const res2 = evaluateTokenAcceptance(0.2, 0.5)
    expect(res2.acceptProb).toBe(0.4)
    expect(res2.isAlwaysAccepted).toBe(false)
  })

  it('在 80% 接受率與 4 步草稿下，每步期望產出 3.36 個 Token，實現 2.8 倍加速', () => {
    // alpha = 0.8, K = 4, 小模型開銷為大模型 5%
    const metrics = computeSpeculativeSpeedup(0.8, 4, 0.05)

    // E[N] = 1 + 0.8 + 0.64 + 0.512 + 0.4096 = 3.3616
    expect(metrics.expectedTokensPerStep).toBe(3.3616)
    // 總開銷 = 1 + 0.05 * 4 = 1.2
    // 加速比 = 3.3616 / 1.2 ≈ 2.80 倍
    expect(metrics.theoreticalSpeedup).toBe(2.8)
    expect(metrics.distributionIdentical).toBe(true)
  })
})
