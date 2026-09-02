import { describe, it, expect } from 'vitest'

/**
 * 凝聚態物理：超導態邁斯納效應 (Meissner Effect) 與磁通量量子化模型
 * 
 * 1. 倫敦穿透深度表面磁場衰減：
 *    B(x) = B0 * exp(-x / lambda_L)
 * 
 * 2. 磁通量量子 (Magnetic Flux Quantum):
 *    Phi_0 = h / (2 * e)
 *    h = 6.62607015e-34 J*s, e = 1.602176634e-19 C
 *    Phi_0 ≈ 2.067833848e-15 Wb (Tesla * m^2)
 */
export function calculateLondonPenetrationField(
  surfaceFieldB0: number, // B0 (Tesla)
  depthMeters: number, // x (m)
  penetrationDepthMeters: number, // lambda_L (m)
): number {
  return surfaceFieldB0 * Math.exp(-depthMeters / penetrationDepthMeters)
}

export function computeMagneticFluxQuantum(): number {
  const h = 6.62607015e-34
  const e = 1.602176634e-19
  // 由於超導載子為庫珀對 (Cooper Pair, 電荷量 q = 2e)，磁通量子為 h / (2e)
  return h / (2 * e)
}

describe('超導物理：邁斯納效應與庫珀對磁通量量子化單元測試', () => {
  it('超導體表面 100nm 處磁感應強度呈指數衰減 (邁斯納完全抗磁性屏蔽)', () => {
    const B0 = 1.0 // 表面外加 1.0 Tesla
    const lambdaL = 50e-9 // 穿透深度 50 nm
    const depth = 150e-9 // 深度 150 nm (3 個穿透深度)

    // B(150nm) = 1.0 * exp(-3) ≈ 0.0498 Tesla (衰減超過 95%)
    const B = calculateLondonPenetrationField(B0, depth, lambdaL)
    expect(B).toBeCloseTo(0.0498, 3)

    // 在塊材深處 (如 1 μm = 1000 nm)，內部磁場嚴格趨近於 0
    const BDeep = calculateLondonPenetrationField(B0, 1e-6, lambdaL)
    expect(BDeep).toBeLessThan(1e-8)
  })

  it('庫珀對電荷 2e 決定基本磁通量量子 Phi_0 精確值約為 2.0678e-15 Wb', () => {
    const phi0 = computeMagneticFluxQuantum()
    // Phi_0 ≈ 2.0678e-15 Wb
    expect(phi0 * 1e15).toBeCloseTo(2.0678, 3)
  })
})
