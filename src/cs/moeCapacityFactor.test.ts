import { describe, it, expect } from 'vitest'

/**
 * 現代 AI 巨量模型架構：專家混合 (MoE) 容量因數 (Capacity Factor) 與負載均衡損失模型
 * 
 * 核心原理：
 * 1. 專家容量限制 (Expert Capacity):
 *    - 在分散式硬體 (如 8 卡 GPU All-to-All) 中，每張卡分配固定靜態 Tensor 緩衝區以避免記憶體溢出
 *    - Capacity = ceil((TotalTokens / NumExperts) * CapacityFactor)
 *    - CapacityFactor (C) 典型值為 1.0 ~ 1.5
 * 2. 溢出丟包 (Token Dropping):
 *    - 若路由到專家 e 的 token 數超出其 Capacity，多餘的 token 將被丟棄 (透過殘差連接旁路 pass through)
 * 3. 輔助負載均衡損失 (Auxiliary Balancing Loss, Fedus et al. 2022):
 *    - L_aux = alpha * NumExperts * sum_{e=1}^E (f_e * P_e)
 *    - f_e 為分配給專家 e 的 token 實際比例，P_e 為路由器對專家 e 的平均 Softmax 概率
 *    - 當負載完美均衡時 (f_e = 1/E, P_e = 1/E)，L_aux 取得最小值 alpha
 */
export interface MoECapacityMetrics {
  totalTokens: number
  numExperts: number
  capacityFactor: number
  expertCapacity: number
  tokensAssignedPerExpert: number[]
  droppedTokensCount: number
  droppedTokensRatio: number
  auxiliaryLoss: number
}

export function evaluateMoECapacity(
  tokensPerExpert: number[],
  capacityFactor: number = 1.0,
  auxLossWeightAlpha: number = 0.01,
): MoECapacityMetrics {
  const numExperts = tokensPerExpert.length
  const totalTokens = tokensPerExpert.reduce((sum, count) => sum + count, 0)
  if (numExperts === 0 || totalTokens === 0) {
    throw new Error('Invalid token distribution')
  }

  // 專家容量上限
  const capacity = Math.ceil((totalTokens / numExperts) * capacityFactor)

  let droppedCount = 0
  for (const count of tokensPerExpert) {
    if (count > capacity) {
      droppedCount += count - capacity
    }
  }

  // 計算負載均衡損失 L_aux: f_e * P_e
  // 假定理想情況下軟體路由概率 P_e ≈ f_e
  let sumFp = 0
  for (const count of tokensPerExpert) {
    const fe = count / totalTokens
    const pe = fe
    sumFp += fe * pe
  }
  const auxLoss = auxLossWeightAlpha * numExperts * sumFp

  return {
    totalTokens,
    numExperts,
    capacityFactor,
    expertCapacity: capacity,
    tokensAssignedPerExpert: [...tokensPerExpert],
    droppedTokensCount: droppedCount,
    droppedTokensRatio: Number((droppedCount / totalTokens).toFixed(4)),
    auxiliaryLoss: Number(auxLoss.toFixed(5)),
  }
}

describe('前沿 AI 架構：MoE 專家容量因數、丟包率與輔助平衡損失單元測試', () => {
  it('在負載完美均衡時 (8 專家各分配 32 個 Token, C=1.0) 達成 0 丟包且損失最小', () => {
    // 8 個專家，各 32 個 Token，總計 256 個 Token
    const tokens = new Array(8).fill(32)
    const metrics = evaluateMoECapacity(tokens, 1.0, 0.01)

    expect(metrics.expertCapacity).toBe(32)
    expect(metrics.droppedTokensCount).toBe(0)
    expect(metrics.droppedTokensRatio).toBe(0)
    // 均衡時: sum(1/64) = 8/64 = 1/8. L_aux = 0.01 * 8 * (1/8) = 0.01
    expect(metrics.auxiliaryLoss).toBeCloseTo(0.01, 4)
  })

  it('在負載極端偏斜時 (單一專家被過度選擇) 觸發高比例丟包', () => {
    // 總計 256 個 Token，但專家 0 湧入了 150 個 Token，其餘專家僅分到少量
    const skewedTokens = [150, 20, 20, 20, 15, 15, 10, 6]
    const metrics = evaluateMoECapacity(skewedTokens, 1.0, 0.01)

    expect(metrics.expertCapacity).toBe(32)
    // 專家 0 溢出: 150 - 32 = 118 個 Token 被丟棄
    expect(metrics.droppedTokensCount).toBe(118)
    expect(metrics.droppedTokensRatio).toBeGreaterThan(0.4) // 超過 40% 丟包
    expect(metrics.auxiliaryLoss).toBeGreaterThan(0.01) // 平衡損失顯著懲罰
  })
})
