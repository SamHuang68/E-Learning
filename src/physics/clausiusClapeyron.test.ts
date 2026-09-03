import { describe, it, expect } from 'vitest'

/**
 * 熱力學與統計物理：克勞修斯-克拉佩龍方程式 (Clausius-Clapeyron Equation)
 * 
 * 核心原理：
 * 1. 液-氣一級相變平衡條件: mu_liquid(T, P) = mu_gas(T, P)
 * 2. 忽略液體莫耳體積 (V_m,gas >> V_m,liq) 並將蒸氣視為理想氣體:
 *    d(ln P) / dT = Delta H_vap / (R * T^2)
 * 3. 雙點定積分形式:
 *    ln(P2 / P1) = -(Delta H_vap / R) * (1 / T2 - 1 / T1)
 * 4. 氣壓隨海拔升高而遞減，導致液體沸點降低 (如高原低壓低沸點現象)。
 */
export interface VaporPressureMetrics {
  t1Kelvin: number
  p1KPa: number
  deltaHvapJPerMol: number
  targetTKelvin: number
  predictedP2KPa: number
}

export function evaluateClausiusClapeyron(
  t1K: number,
  p1KPa: number,
  deltaHvapJPerMol: number,
  t2K: number,
  rGasConstant: number = 8.314, // J / (mol*K)
): VaporPressureMetrics {
  if (t1K <= 0 || t2K <= 0 || p1KPa <= 0) {
    throw new Error('Temperature and pressure must be positive')
  }

  const factor = -(deltaHvapJPerMol / rGasConstant) * (1 / t2K - 1 / t1K)
  const p2KPa = p1KPa * Math.exp(factor)

  return {
    t1Kelvin: t1K,
    p1KPa: p1KPa,
    deltaHvapJPerMol: deltaHvapJPerMol,
    targetTKelvin: t2K,
    predictedP2KPa: Number(p2KPa.toFixed(3)),
  }
}

describe('熱物理：克勞修斯-克拉佩龍相平衡蒸氣壓單元測試', () => {
  it('水在 100°C (373.15K) 蒸氣壓為 101.325 kPa，升溫至 120°C (393.15K) 時蒸氣壓翻倍暴增', () => {
    // 水的蒸發焓約 40660 J/mol
    const res120 = evaluateClausiusClapeyron(373.15, 101.325, 40660, 393.15)

    // 120°C 下水蒸氣壓約 198 kPa 左右 (壓力鍋物理原理)
    expect(res120.predictedP2KPa).toBeGreaterThan(190)
    expect(res120.predictedP2KPa).toBeLessThan(210)
  })

  it('在珠峰低溫低壓環境 (例如 344.15K 即 71°C) 下蒸氣壓驟降至約 33 kPa', () => {
    const res71 = evaluateClausiusClapeyron(373.15, 101.325, 40660, 344.15)
    // 71°C 下蒸氣壓與珠峰氣壓平衡 (~33 kPa)
    expect(res71.predictedP2KPa).toBeCloseTo(33.5, 0)
  })
})
