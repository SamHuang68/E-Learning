import { describe, it, expect } from 'vitest'

/**
 * 生物化學：米氏方程式 (Michaelis-Menten Kinetics) 與酵素抑制劑模型
 * 
 * 基礎反應速率公式：
 * v = (V_max * [S]) / (K_m + [S])
 * 
 * 抑制模式：
 * 1. 競爭性抑制 (Competitive Inhibition):
 *    - 抑制劑與受質競爭活性受體
 *    - 表觀 K_m' = K_m * (1 + [I] / K_i) > K_m
 *    - V_max 保持不變
 * 
 * 2. 非競爭性抑制 (Non-Competitive Inhibition):
 *    - 抑制劑接在別構位置，降低催化活性
 *    - 表觀 V_max' = V_max / (1 + [I] / K_i) < V_max
 *    - K_m 保持不變
 */
export function computeEnzymeRate(
  s: number, // 受質濃度 [S] (mM)
  vMax: number, // 最大初速率 V_max (umol / min)
  km: number, // 米氏常數 K_m (mM)
  inhibitorType: 'none' | 'competitive' | 'non-competitive' = 'none',
  inhibitorConc: number = 0, // [I] (mM)
  ki: number = 1.0, // 抑制常數 K_i (mM)
): { rate: number; apparentKm: number; apparentVmax: number } {
  let apparentKm = km
  let apparentVmax = vMax

  if (inhibitorType === 'competitive') {
    apparentKm = km * (1 + inhibitorConc / ki)
  } else if (inhibitorType === 'non-competitive') {
    apparentVmax = vMax / (1 + inhibitorConc / ki)
  }

  const rate = (apparentVmax * s) / (apparentKm + s)

  return {
    rate: Number(rate.toFixed(3)),
    apparentKm: Number(apparentKm.toFixed(3)),
    apparentVmax: Number(apparentVmax.toFixed(3)),
  }
}

describe('酵素動力學：米氏方程式與競爭/非競爭抑制單元測試', () => {
  it('當受質濃度等於 Km 時反應速率精確為最大速率的一半 (0.5 * Vmax)', () => {
    const vMax = 100
    const km = 5
    const res = computeEnzymeRate(5, vMax, km)

    expect(res.rate).toBe(50.0)
  })

  it('競爭性抑制使表觀 Km 增加但極高受質濃度下仍可達到原始 Vmax', () => {
    const vMax = 100
    const km = 4
    // [I] = 2, Ki = 1 => 1 + [I]/Ki = 3 => apparentKm = 12
    const res = computeEnzymeRate(12, vMax, km, 'competitive', 2, 1)

    expect(res.apparentKm).toBe(12.0)
    expect(res.apparentVmax).toBe(100.0)
    // [S] = 12 = apparentKm => rate = 50.0
    expect(res.rate).toBe(50.0)
  })

  it('非競爭性抑制降低表觀 Vmax 且受質飽和時亦無法恢復', () => {
    const vMax = 100
    const km = 4
    // [I] = 1, Ki = 1 => apparentVmax = 100 / 2 = 50
    const res = computeEnzymeRate(400, vMax, km, 'non-competitive', 1, 1)

    expect(res.apparentVmax).toBe(50.0)
    expect(res.apparentKm).toBe(4.0)
    // S 遠大於 Km 時速率趨近 50 而非 100
    expect(res.rate).toBeGreaterThan(49.0)
    expect(res.rate).toBeLessThanOrEqual(50.0)
  })
})
