import { describe, it, expect } from 'vitest'

/**
 * 物理化學與電化學：能斯特方程式 (Nernst Equation) 與非標準態電池電動勢
 * 
 * 核心原理：
 * 1. 氧化還原反應自由能關係: Delta G = Delta G^\circ + R * T * ln(Q)
 * 2. 結合 Delta G = -n * F * E:
 *    E = E^\circ - (R * T / (n * F)) * ln(Q)
 * 3. 在 298.15 K (25°C) 下轉化為常用常用對數形式:
 *    E = E^\circ - (0.05916 / n) * log10(Q)
 * 4. 平衡狀態下 (E = 0, Q = K):
 *    E^\circ = (0.05916 / n) * log10(K) => log10(K) = (n * E^\circ) / 0.05916
 */
export interface NernstCellMetrics {
  standardEmfV: number
  electronsN: number
  reactionQuotientQ: number
  cellEmfV: number
  deltaGJoules: number
  isSpontaneous: boolean
}

export function evaluateNernstCell(
  eStandardV: number,
  nElectrons: number,
  qQuotient: number,
  tempKelvin: number = 298.15,
  faradayConst: number = 96485, // C / mol e-
  rGasConst: number = 8.314, // J / (mol*K)
): NernstCellMetrics {
  if (nElectrons <= 0 || qQuotient <= 0) {
    throw new Error('Electrons count and quotient Q must be positive')
  }

  // E = E0 - (RT / nF) * ln(Q)
  const nernstFactor = (rGasConst * tempKelvin) / (nElectrons * faradayConst)
  const cellEmf = eStandardV - nernstFactor * Math.log(qQuotient)
  const deltaG = -nElectrons * faradayConst * cellEmf

  return {
    standardEmfV: eStandardV,
    electronsN: nElectrons,
    reactionQuotientQ: qQuotient,
    cellEmfV: Number(cellEmf.toFixed(4)),
    deltaGJoules: Number(deltaG.toFixed(1)),
    isSpontaneous: cellEmf > 0,
  }
}

describe('物理化學：能斯特方程式非標準態電動勢與自發性單元測試', () => {
  it('丹尼爾電池 (Zn + Cu2+ -> Zn2+ + Cu) 在標準態下 (Q=1, E0=1.10V) 電動勢恰為 1.10V', () => {
    const std = evaluateNernstCell(1.10, 2, 1.0)
    expect(std.cellEmfV).toBe(1.10)
    expect(std.isSpontaneous).toBe(true)
    expect(std.deltaGJoules).toBeLessThan(0) // 放熱自發反應
  })

  it('當產物離子濃度高於反應物 ([Zn2+]/[Cu2+] = 100, Q=100) 時電動勢降為 1.0408V', () => {
    // E = 1.10 - (0.05916 / 2) * log10(100) = 1.10 - 0.05916 = 1.04084V
    const cell = evaluateNernstCell(1.10, 2, 100.0)
    expect(cell.cellEmfV).toBeCloseTo(1.0408, 3)
    expect(cell.isSpontaneous).toBe(true)
  })
})
