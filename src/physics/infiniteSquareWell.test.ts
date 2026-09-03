import { describe, it, expect } from 'vitest'

/**
 * 量子力學基礎：一維無限深對稱位能井 (Infinite Square Well) 能階與本徵函數模型
 * 
 * 核心原理：
 * 1. 薛丁格定態方程式: -(hbar^2 / (2m)) * d^2 psi / dx^2 = E * psi
 * 2. 邊界條件: psi(0) = 0, psi(L) = 0
 * 3. 能量本徵值 (Energy Eigenvalues):
 *    E_n = (n^2 * h^2) / (8 * m * L^2) = (n^2 * pi^2 * hbar^2) / (2 * m * L^2)
 *    - 基態零點能 (Zero-Point Energy, n=1): E_1 > 0，體現海森堡測不準原理
 * 4. 歸一化本徵波函數 (Normalized Wavefunctions):
 *    psi_n(x) = sqrt(2/L) * sin((n * pi * x) / L)
 * 5. 正交歸一性 (Orthonormality):
 *    \int_0^L psi_m(x) * psi_n(x) dx = delta_{mn} (m=n 為 1，m!=n 為 0)
 */
export interface SquareWellEnergyLevel {
  quantumNumberN: number
  energyJoules: number
  energyEV: number
  wavelengthDeBroglieM: number
  probabilityDensityCenter: number // 在 x = L/2 處的機率密度 |psi(L/2)|^2
}

export function calculateInfiniteWellLevel(
  n: number,
  wellWidthM: number = 1e-9, // 1 nm 奈米井
  particleMassKg: number = 9.109e-31, // 電子質量
  hbar: number = 1.05457e-34, // J*s
): SquareWellEnergyLevel {
  if (n <= 0 || !Number.isInteger(n)) {
    throw new Error('Quantum number n must be a positive integer')
  }

  const h = 2 * Math.PI * hbar
  const energyJ = (Math.pow(n, 2) * Math.pow(h, 2)) / (8 * particleMassKg * Math.pow(wellWidthM, 2))
  const energyEV = energyJ / 1.602e-19

  // 德布羅意波長: lambda_n = 2L / n
  const deBroglieLambda = (2 * wellWidthM) / n

  // x = L/2 處波函數數值: psi_n(L/2) = sqrt(2/L) * sin(n * pi / 2)
  const psiCenter = Math.sqrt(2 / wellWidthM) * Math.sin((n * Math.PI) / 2)
  const probCenter = Math.pow(psiCenter, 2)

  return {
    quantumNumberN: n,
    energyJoules: energyJ,
    energyEV: Number(energyEV.toFixed(4)),
    wavelengthDeBroglieM: deBroglieLambda,
    probabilityDensityCenter: Number(probCenter.toFixed(2)),
  }
}

describe('量子力學：一維無限深位能井能階與波函數對稱性單元測試', () => {
  it('基態 (n=1) 具有非零零點能且中心機率密度達到極大', () => {
    const ground = calculateInfiniteWellLevel(1, 1e-9)
    expect(ground.energyEV).toBeGreaterThan(0) // 零點能 > 0
    // 在 1nm 井中，電子基態約 0.376 eV
    expect(ground.energyEV).toBeCloseTo(0.376, 1)
    // n=1 時 sin(pi/2) = 1，中心點波函數最大，機率密度 |psi|^2 = 2/L = 2e9
    expect(ground.probabilityDensityCenter).toBe(2e9)
  })

  it('第一受激態 (n=2) 能量為基態的 4 倍，且中心點為節點 (機率密度為 0)', () => {
    const ground = calculateInfiniteWellLevel(1, 1e-9)
    const excited1 = calculateInfiniteWellLevel(2, 1e-9)

    // 能階正比於 n^2: E_2 = 4 * E_1
    expect(excited1.energyEV).toBeCloseTo(4 * ground.energyEV, 2)

    // n=2 時 sin(2 * pi / 2) = sin(pi) = 0，中心為對稱波節 (Node)
    expect(excited1.probabilityDensityCenter).toBe(0)
  })
})
