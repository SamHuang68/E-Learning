import { describe, it, expect } from 'vitest'

/**
 * 流體力學：連續方程式與白努利定律——文丘里效應 (Venturi Effect) 數學模型
 * 
 * 連續方程式 (不可壓縮流體):
 * A1 * v1 = A2 * v2 => v2 = v1 * (A1 / A2)
 * 
 * 水平流管白努利方程式:
 * P1 + 0.5 * rho * v1^2 = P2 + 0.5 * rho * v2^2
 * 
 * 喉部壓降 (Pressure Drop Delta P = P1 - P2):
 * Delta P = 0.5 * rho * (v2^2 - v1^2) = 0.5 * rho * v1^2 * ((A1 / A2)^2 - 1)
 */
export interface VenturiResult {
  v1MPerS: number
  v2MPerS: number
  pressureDropPa: number
  isThroatPressureLower: boolean
}

export function computeVenturiEffect(
  a1M2: number, // 入口管截面積 (m^2)
  a2M2: number, // 喉部收縮截面積 (m^2)
  v1MPerS: number, // 入口流速 (m/s)
  fluidDensityKgM3: number = 1000, // 流體密度 (水: 1000 kg/m^3)
): VenturiResult {
  if (a1M2 <= 0 || a2M2 <= 0 || v1MPerS <= 0) {
    throw new Error('Invalid geometric or velocity parameters')
  }

  const v2 = v1MPerS * (a1M2 / a2M2)
  const pressureDrop = 0.5 * fluidDensityKgM3 * (v2 * v2 - v1MPerS * v1MPerS)

  return {
    v1MPerS,
    v2MPerS: Number(v2.toFixed(3)),
    pressureDropPa: Number(pressureDrop.toFixed(2)),
    isThroatPressureLower: pressureDrop > 0,
  }
}

describe('流體力學：文丘里效應壓降與流速連續性單元測試', () => {
  it('截面積減半時流速加倍且喉部產生顯著負壓差', () => {
    // A1 = 0.04 m^2, A2 = 0.02 m^2 (面積比 2:1)
    // v1 = 2 m/s, 水密度 = 1000 kg/m^3
    // v2 = 2 * (0.04 / 0.02) = 4 m/s
    // Delta P = 0.5 * 1000 * (4^2 - 2^2) = 500 * (16 - 4) = 6000 Pa
    const res = computeVenturiEffect(0.04, 0.02, 2.0, 1000)

    expect(res.v2MPerS).toBe(4.0)
    expect(res.pressureDropPa).toBe(6000)
    expect(res.isThroatPressureLower).toBe(true)
  })

  it('截面積相等時無流速變化與壓降 (Delta P = 0)', () => {
    const res = computeVenturiEffect(0.05, 0.05, 3.0, 1000)

    expect(res.v2MPerS).toBe(3.0)
    expect(res.pressureDropPa).toBe(0)
    expect(res.isThroatPressureLower).toBe(false)
  })
})
