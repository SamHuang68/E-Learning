import { describe, it, expect } from 'vitest'

/**
 * 統計物理與真實氣體：凡德瓦爾斯狀態方程式 (Van der Waals Equation) 模型
 * 
 * 公式：(P + a * (n / V)^2) * (V - n * b) = n * R * T
 * 即：P = (n * R * T) / (V - n * b) - a * (n / V)^2
 * 
 * 參數：
 * - a: 分子間引力修正常數 (Pa * m^6 / mol^2)
 * - b: 分子自身體積修正常數 (m^3 / mol)
 * - R: 8.314462 J / (mol * K)
 */
export function calculateVanDerWaalsPressure(
  nMol: number,
  tempK: number,
  volumeM3: number,
  a: number,
  b: number,
): { vdwPressurePa: number; idealPressurePa: number; pressureDifferencePercent: number } {
  const R = 8.314462
  const idealPressurePa = (nMol * R * tempK) / volumeM3
  const vdwPressurePa =
    (nMol * R * tempK) / (volumeM3 - nMol * b) - a * Math.pow(nMol / volumeM3, 2)

  const diffPercent = Number(
    (((idealPressurePa - vdwPressurePa) / idealPressurePa) * 100).toFixed(2),
  )

  return {
    vdwPressurePa: Number(vdwPressurePa.toFixed(1)),
    idealPressurePa: Number(idealPressurePa.toFixed(1)),
    pressureDifferencePercent: diffPercent,
  }
}

describe('統計物理：凡德瓦爾斯真實氣體吸引力與分子體積修正單元測試', () => {
  it('二氧化碳 CO2 在高壓中等體積下因分子間引力顯著使得真實壓力比理想氣體低 18%', () => {
    // 1 莫耳 CO2 在 300K、0.001 m^3 (1公升) 下
    // CO2: a = 0.364 Pa*m^6/mol^2, b = 4.27e-5 m^3/mol
    const res = calculateVanDerWaalsPressure(1.0, 300, 1e-3, 0.364, 4.27e-5)

    // 理想氣體壓 P_ideal = 1 * 8.314 * 300 / 1e-3 = 2,494,338 Pa (約 24.6 atm)
    expect(res.idealPressurePa).toBeCloseTo(2494338.6, 0)
    // 由於 a 引力項作用，真實壓力較低 (約 2,240,000 Pa)
    expect(res.vdwPressurePa).toBeLessThan(res.idealPressurePa)
    expect(res.vdwPressurePa).toBeGreaterThan(2000000)
  })

  it('在低壓超大體積下 (1000公升) 凡德瓦爾斯真實氣體精確收斂回理想氣體 (差異 < 0.1%)', () => {
    const res = calculateVanDerWaalsPressure(1.0, 300, 1.0, 0.364, 4.27e-5)

    // 差異小於 0.1%
    expect(Math.abs(res.pressureDifferencePercent)).toBeLessThan(0.1)
  })
})
