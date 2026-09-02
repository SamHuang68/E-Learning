import { describe, it, expect } from 'vitest'

/**
 * 物理化學與熱力學：范特霍夫方程式 (Van 't Hoff Equation)
 * 
 * 公式推導：
 * ln(K2 / K1) = - (Delta H_deg / R) * (1 / T2 - 1 / T1)
 * 
 * 物理含義：
 * 1. 若為吸熱反應 (Delta H_deg > 0):
 *    升溫 (T2 > T1 => 1/T2 < 1/T1 => 1/T2 - 1/T1 < 0)
 *    則 ln(K2 / K1) > 0 => K2 > K1 (平衡常數增大，平衡正向移動)
 * 
 * 2. 若為放熱反應 (Delta H_deg < 0):
 *    升溫則 ln(K2 / K1) < 0 => K2 < K1 (平衡常數縮小，平衡逆向移動)
 */
export interface VanTHoffResult {
  deltaHJoulesPerMole: number
  t1Kelvin: number
  t2Kelvin: number
  k1: number
  k2: number
  isEndothermic: boolean
  ratioK2ToK1: number
}

export function computeVanTHoffEquilibrium(
  deltaHJoulesPerMole: number,
  t1Kelvin: number,
  t2Kelvin: number,
  k1: number,
  rGasConstant: number = 8.314, // J/(mol*K)
): VanTHoffResult {
  if (t1Kelvin <= 0 || t2Kelvin <= 0 || k1 <= 0) {
    throw new Error('Temperatures and initial K must be strictly positive')
  }

  const exponent = (-deltaHJoulesPerMole / rGasConstant) * (1 / t2Kelvin - 1 / t1Kelvin)
  const k2 = k1 * Math.exp(exponent)

  return {
    deltaHJoulesPerMole,
    t1Kelvin,
    t2Kelvin,
    k1,
    k2: Number(k2.toPrecision(5)),
    isEndothermic: deltaHJoulesPerMole > 0,
    ratioK2ToK1: Number((k2 / k1).toFixed(4)),
  }
}

describe('物理化學熱力學：范特霍夫方程式平衡常數隨溫度相變單元測試', () => {
  it('吸熱反應 (Delta H > 0) 升溫時平衡常數顯著增大', () => {
    // 某吸熱分解反應：Delta H = +50,000 J/mol (+50 kJ/mol)
    // T1 = 298.15 K (25°C), T2 = 348.15 K (75°C), K1 = 1.0
    const res = computeVanTHoffEquilibrium(50000, 298.15, 348.15, 1.0)

    expect(res.isEndothermic).toBe(true)
    expect(res.k2).toBeGreaterThan(res.k1)
    expect(res.ratioK2ToK1).toBeGreaterThan(1.0)
  })

  it('放熱反應 (Delta H < 0) 升溫時平衡常數減小', () => {
    // 哈伯法製氨：Delta H = -92,200 J/mol (-92.2 kJ/mol)
    // T1 = 300 K, T2 = 500 K, K1 = 100
    const res = computeVanTHoffEquilibrium(-92200, 300, 500, 100)

    expect(res.isEndothermic).toBe(false)
    expect(res.k2).toBeLessThan(res.k1)
    expect(res.ratioK2ToK1).toBeLessThan(1.0)
  })
})
