import { describe, it, expect } from 'vitest'

/**
 * 廣義相對論：史瓦西黑洞 (Schwarzschild Black Hole) 事件視界與重力時間膨脹模型
 * 
 * 史瓦西半徑：r_s = (2 * G * M) / c^2
 * 重力時間膨脹：dt_inf = dt_0 / sqrt(1 - r_s / r)
 * 
 * 常數：
 * - G = 6.67430e-11 m^3 / (kg * s^2)
 * - c = 299792458 m/s
 * - M_sun = 1.98847e30 kg
 */
export const G_CONST = 6.6743e-11
export const C_LIGHT = 299792458
export const M_SUN = 1.98847e30

export function computeSchwarzschildRadius(massKg: number): number {
  return (2 * G_CONST * massKg) / (C_LIGHT * C_LIGHT)
}

export function computeGravitationalTimeDilation(
  radiusM: number,
  massKg: number,
): { rsM: number; dilationFactor: number } {
  const rs = computeSchwarzschildRadius(massKg)
  if (radiusM <= rs) {
    throw new Error('Inside or at the event horizon')
  }
  const factor = 1 / Math.sqrt(1 - rs / radiusM)
  return {
    rsM: Number(rs.toFixed(2)),
    dilationFactor: Number(factor.toFixed(4)),
  }
}

describe('廣義相對論：史瓦西事件視界與引力時間膨脹單元測試', () => {
  it('太陽質量黑洞之史瓦西半徑約為 2.95 公里', () => {
    const rsSun = computeSchwarzschildRadius(M_SUN)
    // rs ≈ 2953 公尺 (約 2.95 km)
    expect(rsSun).toBeGreaterThan(2940)
    expect(rsSun).toBeLessThan(2970)
  })

  it('在 1.25 倍史瓦西半徑處引力時間膨脹係數達 2.236 倍', () => {
    // r = 1.25 * rs => 1 - rs/r = 1 - 1/1.25 = 1 - 0.8 = 0.2
    // factor = 1 / sqrt(0.2) ≈ 2.2361
    const mass = M_SUN
    const rs = computeSchwarzschildRadius(mass)
    const res = computeGravitationalTimeDilation(1.25 * rs, mass)

    expect(res.dilationFactor).toBeCloseTo(2.2361, 3)
  })
})
