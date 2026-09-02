import { describe, it, expect } from 'vitest'

/**
 * 量子光學：愛因斯坦係數與雷射粒子數反轉 (Population Inversion) 閾值模型
 * 
 * 核心原理：
 * 1. 增益係數 g(nu) 正比於反轉粒子數密度差:
 *    Delta N = N2 - (g2 / g1) * N1
 *    當 Delta N > 0 時稱為「粒子數反轉 (Population Inversion)」，
 *    受激輻射大於受激吸收，光信號在介質中獲得指數放大！
 * 
 * 2. 雷射諧振腔閾值條件 (Threshold Condition):
 *    單程增益乘上兩端反射率必須大於損耗:
 *    R1 * R2 * exp(2 * (g_th - alpha) * L) = 1
 *    g_th = alpha + (1 / (2 * L)) * ln(1 / (R1 * R2))
 */
export interface LaserThresholdMetrics {
  deltaN: number
  hasInversion: boolean
  thresholdGainMInv: number
  isAboveLasingThreshold: boolean
}

export function evaluateLaserThreshold(
  n2: number, // 高能階粒子密度 (m^-3)
  n1: number, // 低能階粒子密度 (m^-3)
  cavityLengthM: number, // 諧振腔長度 L (m)
  r1: number, // 鏡面 1 反射率 (如 0.99)
  r2: number, // 鏡面 2 反射率 (如 0.90)
  internalLossAlphaMInv: number, // 腔內損耗 alpha (m^-1)
  smallSignalGainMInv: number, // 小訊號增益 g_0 (m^-1)
): LaserThresholdMetrics {
  if (cavityLengthM <= 0 || r1 <= 0 || r2 <= 0 || r1 > 1 || r2 > 1) {
    throw new Error('Invalid laser cavity parameters')
  }

  const deltaN = n2 - n1
  const mirrorLoss = (1 / (2 * cavityLengthM)) * Math.log(1 / (r1 * r2))
  const thresholdGain = internalLossAlphaMInv + mirrorLoss

  return {
    deltaN,
    hasInversion: deltaN > 0,
    thresholdGainMInv: Number(thresholdGain.toFixed(4)),
    isAboveLasingThreshold: deltaN > 0 && smallSignalGainMInv >= thresholdGain,
  }
}

describe('量子光學：雷射粒子數反轉與諧振腔閾值單元測試', () => {
  it('當 N2 > N1 且小訊號增益超過閾值增益時順利起振發射雷射', () => {
    // L = 0.1 m, R1 = 0.99, R2 = 0.95, alpha = 0.05 m^-1
    // mirrorLoss = (1 / 0.2) * ln(1 / (0.99 * 0.95)) = 5 * ln(1 / 0.9405) = 5 * 0.06136 = 0.3068 m^-1
    // g_th = 0.05 + 0.3068 = 0.3568 m^-1
    const res = evaluateLaserThreshold(1e18, 2e17, 0.1, 0.99, 0.95, 0.05, 0.50)

    expect(res.hasInversion).toBe(true)
    expect(res.thresholdGainMInv).toBeCloseTo(0.3568, 3)
    expect(res.isAboveLasingThreshold).toBe(true)
  })

  it('未達成粒子數反轉 (N2 <= N1) 時無法起振', () => {
    const res = evaluateLaserThreshold(1e17, 5e17, 0.1, 0.99, 0.95, 0.05, 0.50)
    expect(res.hasInversion).toBe(false)
    expect(res.isAboveLasingThreshold).toBe(false)
  })
})
