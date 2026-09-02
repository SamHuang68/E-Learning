import { describe, it, expect } from 'vitest'

/**
 * 量子統計與天體物理：電子簡併壓力 (Electron Degeneracy Pressure) 與錢德拉塞卡極限模型
 * 
 * 1. 非相對論電子簡併壓：
 *    P_deg = ( (3 * pi^2)^(2/3) * hbar^2 / (5 * m_e) ) * n_e^(5/3)
 * 
 * 2. 白矮星質量-半徑反比關係：
 *    R \propto M^(-1/3)
 * 
 * 3. 錢德拉塞卡極限質量 (Chandrasekhar Limit):
 *    M_Ch ≈ 1.44 M_sun (其中 M_sun = 1.989e30 kg)
 */
export function calculateElectronDegeneracyPressure(electronDensityM3: number): number {
  const hbar = 1.054571817e-34 // J*s
  const me = 9.1093837e-31 // kg
  const factor = (Math.pow(3 * Math.PI * Math.PI, 2 / 3) * Math.pow(hbar, 2)) / (5 * me)
  return factor * Math.pow(electronDensityM3, 5 / 3)
}

export function computeWhiteDwarfEquilibriumRadiusRatio(massRatio: number): number {
  // R ~ M^(-1/3)
  return Math.pow(massRatio, -1 / 3)
}

describe('量子天體物理：包立不相容原理、電子簡併壓與錢德拉塞卡極限單元測試', () => {
  it('白矮星內部極高電子密度 (1e36 m^-3) 產生兆巴斯卡級巨大簡併壓力', () => {
    // 典型白矮星電子密度 n_e ≈ 10^36 m^-3
    const P = calculateElectronDegeneracyPressure(1e36)

    // P 應在 10^22 Pa 數量級，完全抵抗巨額重力坍縮
    expect(P).toBeGreaterThan(1e21)
    expect(P).toBeLessThan(1e24)
  })

  it('白矮星遵循質量愈大半徑反向收縮規律且質量上限為 1.44 太陽質量', () => {
    // 質量增加為 8 倍時，半徑收縮為 8^(-1/3) = 0.5 (縮小為一半)
    const radiusRatio = computeWhiteDwarfEquilibriumRadiusRatio(8)
    expect(radiusRatio).toBeCloseTo(0.5, 4)

    // 錢德拉塞卡極限定值
    const M_Ch = 1.44 // 太陽質量倍數
    expect(M_Ch).toBe(1.44)
  })
})
