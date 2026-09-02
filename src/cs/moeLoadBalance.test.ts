import { describe, it, expect } from 'vitest'

/**
 * 現代大模型稀疏專家架構 (MoE)：輔助負載均衡損失 (Auxiliary Load Balancing Loss) 模型
 * 
 * 參考：Switch Transformers (Fedus et al.) / Mixtral 8x7B
 * 
 * 公式：
 * L_balance = alpha * E * \sum_{i=1}^E (f_i * P_i)
 * 
 * 符號說明：
 * - E: 專家總數 (如 E = 8)
 * - f_i: 實際分派給專家 i 的 Token 比例 (sum_i f_i = 1)
 * - P_i: 路由器網路分配給專家 i 的平均機率 (sum_i P_i = 1)
 * - alpha: 輔助損失超參數權重 (預設 0.01)
 * 
 * 數學極值性質：
 * - 完美均勻分佈 (f_i = 1/E, P_i = 1/E):
 *   L_balance = alpha * E * (E * (1/E)^2) = alpha (達到全局理論最小值！)
 * - 極端坍塌崩潰 (所有 Token 湧向單一專家):
 *   L_balance = alpha * E * 1.0 = alpha * E (損失膨脹 E 倍，強烈懲罰路由集中)
 */
export interface MoELoadBalanceMetrics {
  numExperts: number
  actualFractions: number[] // f_i
  averageProbabilities: number[] // P_i
  balanceLoss: number
  isPerfectBalance: boolean
}

export function computeMoELoadBalancingLoss(
  actualTokenCounts: number[], // 每個專家分派到的 token 數
  routingProbSums: number[], // 每個專家的累計機率總和
  totalTokens: number,
  alpha: number = 0.01,
): MoELoadBalanceMetrics {
  const E = actualTokenCounts.length
  const f = actualTokenCounts.map((count) => count / totalTokens)
  const P = routingProbSums.map((pSum) => pSum / totalTokens)

  let dotProduct = 0
  for (let i = 0; i < E; i++) {
    dotProduct += f[i] * P[i]
  }

  const balanceLoss = Number((alpha * E * dotProduct).toFixed(6))
  const minPossibleLoss = Number(alpha.toFixed(6))

  return {
    numExperts: E,
    actualFractions: f.map((v) => Number(v.toFixed(4))),
    averageProbabilities: P.map((v) => Number(v.toFixed(4))),
    balanceLoss,
    isPerfectBalance: Math.abs(balanceLoss - minPossibleLoss) < 1e-5,
  }
}

describe('前沿 AI：稀疏專家混合 (MoE) 負載均衡輔助損失單元測試', () => {
  it('當 8 位專家負載完美均勻時輔助損失達到理論下界 alpha (0.01)', () => {
    const E = 8
    const tokens = 800
    // 每個專家獲得 100 個 token，平均機率皆為 1/8 = 0.125
    const counts = new Array(E).fill(100)
    const probSums = new Array(E).fill(100) // 100 / 800 = 0.125

    const metrics = computeMoELoadBalancingLoss(counts, probSums, tokens, 0.01)

    // L_balance = 0.01 * 8 * (8 * 0.125 * 0.125) = 0.01 * 8 * (8 * 1/64) = 0.01
    expect(metrics.balanceLoss).toBe(0.01)
    expect(metrics.isPerfectBalance).toBe(true)
  })

  it('當發生路由坍塌 (所有 Token 湧向單一專家) 時損失膨脹 8 倍懲罰', () => {
    const E = 8
    const tokens = 800
    // 全部 800 個 token 湧向 Expert 0
    const counts = [800, 0, 0, 0, 0, 0, 0, 0]
    const probSums = [800, 0, 0, 0, 0, 0, 0, 0]

    const metrics = computeMoELoadBalancingLoss(counts, probSums, tokens, 0.01)

    // L_balance = 0.01 * 8 * (1.0 * 1.0) = 0.08 (正好是 0.01 * E = 8 倍)
    expect(metrics.balanceLoss).toBe(Number((0.01 * E).toFixed(6)))
    expect(metrics.isPerfectBalance).toBe(false)
  })
})
