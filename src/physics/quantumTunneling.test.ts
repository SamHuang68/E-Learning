import { describe, it, expect } from 'vitest'

/**
 * 近代物理：量子力學穿隧效應 (Quantum Tunneling) 模型
 * 
 * 矩形位壘 (高度 V_0, 寬度 L), 粒子質量 m, 能量 E (E < V_0)
 * 衰減常數：kappa = sqrt(2 * m * (V_0 - E)) / hbar
 * 寬位壘穿透係數：T ≈ 16 * (E / V_0) * (1 - E / V_0) * exp(-2 * kappa * L)
 * 
 * 常數：
 * - hbar = 1.054571817e-34 J*s
 * - m_e = 9.1093837e-31 kg (電子質量)
 * - 1 eV = 1.602176634e-19 J
 */
export const HBAR = 1.054571817e-34
export const M_ELECTRON = 9.1093837e-31
export const EV_TO_JOULE = 1.602176634e-19

export function computeTunnelingProbability(
  eEV: number,
  v0EV: number,
  widthNm: number,
): { kappaNmInv: number; transmission: number } {
  if (eEV >= v0EV) throw new Error('E must be less than V0 for tunneling')

  const deltaE = (v0EV - eEV) * EV_TO_JOULE
  const kappa = Math.sqrt(2 * M_ELECTRON * deltaE) / HBAR // 1/m
  const kappaNmInv = kappa * 1e-9 // 1/nm

  const L = widthNm * 1e-9 // m
  const prefactor = 16 * (eEV / v0EV) * (1 - eEV / v0EV)
  const transmission = prefactor * Math.exp(-2 * kappa * L)

  return {
    kappaNmInv: Number(kappaNmInv.toFixed(3)),
    transmission: Number(transmission.toExponential(4)),
  }
}

describe('量子物理：一維矩形位壘量子穿隧效應單元測試', () => {
  it('1 eV 電子穿隧 5 eV 勢壘其機率隨位壘寬度呈指數級急遽衰減', () => {
    // E = 1 eV, V0 = 5 eV, deltaE = 4 eV
    // kappa = sqrt(2 * 9.11e-31 * 4 * 1.602e-19) / 1.055e-34 ≈ 10.24 nm^-1
    const res1 = computeTunnelingProbability(1.0, 5.0, 0.5) // L = 0.5 nm
    const res2 = computeTunnelingProbability(1.0, 5.0, 1.0) // L = 1.0 nm

    expect(res1.kappaNmInv).toBeCloseTo(10.24, 1)

    // 寬度從 0.5 nm 增加到 1.0 nm (增加 0.5 nm)
    // 衰減倍數 ≈ exp(-2 * 10.24 * 0.5) = exp(-10.24) ≈ 3.5e-5
    expect(res2.transmission).toBeLessThan(res1.transmission * 1e-4)
  })

  it('當粒子能量趨近位壘頂部時穿透率顯著上升', () => {
    const lowE = computeTunnelingProbability(2.0, 5.0, 0.3)
    const highE = computeTunnelingProbability(4.5, 5.0, 0.3)

    expect(highE.transmission).toBeGreaterThan(lowE.transmission)
  })
})
