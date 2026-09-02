import { describe, it, expect } from 'vitest'

/**
 * 分析化學波譜學：質譜儀 (Mass Spectrometry, MS) 同位素分子離子峰特徵模型
 * 
 * 原理：
 * 1. M+1 峰主要反映 13C (天然豐度 1.11%):
 *    (I_{M+1} / I_M) * 100% ≈ 1.1% * n_C
 *    反之：碳原子數 n_C ≈ (I_{M+1} / I_M) / 0.011
 * 
 * 2. M+2 峰用於鑑別特定雜原子同位素：
 *    - 單個氯原子 (35Cl : 37Cl ≈ 3 : 1 => M : M+2 ≈ 3 : 1 或 M+2 為 M 的 32.5%)
 *    - 單個溴原子 (79Br : 81Br ≈ 1 : 1 => M : M+2 ≈ 1 : 1 等高雙峰)
 */
export interface MassSpectrometryMetrics {
  estimatedCarbons: number
  hasChlorine: boolean
  hasBromine: boolean
  mToM2Ratio: number
}

export function analyzeIsotopePattern(
  intensityM: number,
  intensityM1: number,
  intensityM2: number,
): MassSpectrometryMetrics {
  if (intensityM <= 0) throw new Error('Base peak intensity must be positive')

  // 1. 估算碳數
  const cRatio = intensityM1 / intensityM
  const estimatedCarbons = Math.round(cRatio / 0.011)

  // 2. 檢測鹵素特徵
  const m2Ratio = intensityM2 / intensityM
  // 氯特徵：M+2 約為 30%~35% (3:1)
  const hasChlorine = m2Ratio >= 0.28 && m2Ratio <= 0.36
  // 溴特徵：M+2 約為 90%~105% (1:1)
  const hasBromine = m2Ratio >= 0.90 && m2Ratio <= 1.05

  return {
    estimatedCarbons,
    hasChlorine,
    hasBromine,
    mToM2Ratio: Number((intensityM / (intensityM2 || 1e-9)).toFixed(2)),
  }
}

describe('分析化學波譜學：質譜同位素峰比與分子式推導單元測試', () => {
  it('甲苯 (C7H8) M+1 強度約為 M 峰的 7.7% 精確反推碳原子數為 7', () => {
    // I_M = 100, I_{M+1} = 7.7, I_{M+2} = 0.3
    const res = analyzeIsotopePattern(100, 7.7, 0.3)
    expect(res.estimatedCarbons).toBe(7)
    expect(res.hasChlorine).toBe(false)
    expect(res.hasBromine).toBe(false)
  })

  it('氯苯 (C6H5Cl) 呈現 3:1 的 M 與 M+2 峰比特徵', () => {
    // I_M = 100, I_{M+1} = 6.6, I_{M+2} = 32.5
    const res = analyzeIsotopePattern(100, 6.6, 32.5)
    expect(res.estimatedCarbons).toBe(6)
    expect(res.hasChlorine).toBe(true)
    expect(res.hasBromine).toBe(false)
  })

  it('溴苯 (C6H5Br) 呈現 1:1 的等高 M 與 M+2 峰比特徵', () => {
    // I_M = 100, I_{M+1} = 6.6, I_{M+2} = 98.0
    const res = analyzeIsotopePattern(100, 6.6, 98.0)
    expect(res.estimatedCarbons).toBe(6)
    expect(res.hasChlorine).toBe(false)
    expect(res.hasBromine).toBe(true)
  })
})
