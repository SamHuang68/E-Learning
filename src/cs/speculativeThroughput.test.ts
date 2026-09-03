import { describe, it, expect } from 'vitest'

/**
 * 現代 AI 推論加速：投機解碼 (Speculative Decoding, Leviathan et al. 2023)
 * 驗收長度期望值與硬體吞吐加速比模型
 * 
 * 核心原理：
 * 1. 投機解碼設定：
 *    - 輕量草稿小模型 (Draft Model, M_q): 快速自回歸生成 K 個候選 token，耗時 K * T_draft
 *    - 強大目標大模型 (Target Model, M_p): 單步並行打分驗證所有 K 個 token，耗時 T_target (利用 Tensor Core 批次前向)
 * 2. 驗收概率與期望長度 E[tau]:
 *    - 設單 token 平均驗收率為 alpha (通常介於 0.6 ~ 0.85)
 *    - 若前 i 個通過而第 i+1 個被拒絕，目標模型在該處修正重採樣 1 個 token
 *    - 期望產出 token 數: E[tau] = (1 - alpha^(K+1)) / (1 - alpha)
 * 3. 系統理論加速比 (Theoretical Speedup Ratio):
 *    - 傳統自回歸產生 E[tau] 個 token 需耗時: E[tau] * T_target
 *    - 投機解碼單輪循環總耗時: K * T_draft + T_target
 *    - Speedup = (E[tau] * T_target) / (K * T_draft + T_target)
 */
export interface SpeculativeMetrics {
  kTokens: number
  acceptanceRateAlpha: number
  expectedAcceptedTokens: number
  roundLatencyMs: number
  baselineLatencyMs: number
  speedupRatio: number
}

export function computeSpeculativeSpeedup(
  kTokens: number,
  acceptanceRateAlpha: number,
  tDraftMs: number,
  tTargetMs: number,
): SpeculativeMetrics {
  if (kTokens <= 0 || acceptanceRateAlpha < 0 || acceptanceRateAlpha > 1) {
    throw new Error('Invalid speculative decoding parameters')
  }

  // 計算幾何級數期望值: E[tau] = (1 - alpha^(K+1)) / (1 - alpha)
  const expectedTokens =
    acceptanceRateAlpha === 1
      ? kTokens + 1
      : (1 - Math.pow(acceptanceRateAlpha, kTokens + 1)) / (1 - acceptanceRateAlpha)

  const roundLatency = kTokens * tDraftMs + tTargetMs
  const baselineLatency = expectedTokens * tTargetMs
  const speedup = baselineLatency / roundLatency

  return {
    kTokens,
    acceptanceRateAlpha,
    expectedAcceptedTokens: Number(expectedTokens.toFixed(3)),
    roundLatencyMs: Number(roundLatency.toFixed(2)),
    baselineLatencyMs: Number(baselineLatency.toFixed(2)),
    speedupRatio: Number(speedup.toFixed(3)),
  }
}

describe('現代大模型推論：投機解碼期望長度與硬體加速比單元測試', () => {
  it('在典型工業參數下 (alpha=0.75, K=4, T_draft=2ms, T_target=25ms) 實現 2 倍以上真實加速', () => {
    // 草稿模型為 1B (2ms/token)，目標模型為 70B (25ms/step)，K = 4 個候選，驗收率 75%
    const metrics = computeSpeculativeSpeedup(4, 0.75, 2.0, 25.0)

    // E[tau] = (1 - 0.75^5) / (1 - 0.75) = (1 - 0.2373) / 0.25 = 0.7627 / 0.25 = 3.051 tokens
    expect(metrics.expectedAcceptedTokens).toBeCloseTo(3.051, 2)

    // 投機輪耗時: 4 * 2 + 25 = 33 ms
    expect(metrics.roundLatencyMs).toBe(33.0)

    // 基線消耗時間: 3.051 * 25 = 76.27 ms
    expect(metrics.baselineLatencyMs).toBeCloseTo(76.27, 1)

    // 加速比: 76.27 / 33 = 2.31x
    expect(metrics.speedupRatio).toBeGreaterThan(2.2)
    expect(metrics.speedupRatio).toBeLessThan(2.5)
  })

  it('驗收率過低時 (alpha=0.2) 投機解碼加速比小於 1 (產生負優化)', () => {
    const metrics = computeSpeculativeSpeedup(4, 0.2, 5.0, 25.0)
    // 當草稿模型品質太差時，驗收率低且額外負擔了草稿生成時間，加速比跌破 1.0
    expect(metrics.speedupRatio).toBeLessThan(1.0)
  })
})
