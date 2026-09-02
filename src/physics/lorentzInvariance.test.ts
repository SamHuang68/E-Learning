import { describe, it, expect } from 'vitest'

/**
 * 狹義相對論：勞侖茲變換 (Lorentz Transformation) 與四維時空間隔不變量模型
 * 
 * 勞侖茲因子：gamma = 1 / sqrt(1 - (v/c)^2)
 * 時空間隔不變量：s^2 = c^2 * (dt)^2 - (dx)^2
 * 
 * 轉換關係 (沿 x 軸移動速度 v):
 * ct' = gamma * (ct - (v/c) * x)
 * x'  = gamma * (x - (v/c) * ct)
 */
export const C_LIGHT = 299792458 // m/s

export function computeLorentzFactor(velocityMPerS: number): number {
  const beta = velocityMPerS / C_LIGHT
  if (beta >= 1.0) throw new Error('Velocity cannot reach or exceed light speed')
  return 1 / Math.sqrt(1 - beta * beta)
}

export function transformSpacetime(
  ct: number,
  x: number,
  velocityMPerS: number,
): { ctPrime: number; xPrime: number; intervalOriginal: number; intervalPrime: number } {
  const gamma = computeLorentzFactor(velocityMPerS)
  const beta = velocityMPerS / C_LIGHT

  const ctPrime = gamma * (ct - beta * x)
  const xPrime = gamma * (x - beta * ct)

  const intervalOriginal = ct * ct - x * x
  const intervalPrime = ctPrime * ctPrime - xPrime * xPrime

  return {
    ctPrime,
    xPrime,
    intervalOriginal: Number(intervalOriginal.toFixed(4)),
    intervalPrime: Number(intervalPrime.toFixed(4)),
  }
}

describe('相對論物理：勞侖茲變換與四維時空間隔不變量單元測試', () => {
  it('0.8c 高速慣性系下時空間隔 s^2 在座標變換前後嚴格守恆 (不變量)', () => {
    const v = 0.8 * C_LIGHT
    const ct = 1000 // 公尺單位
    const x = 500 // 公尺單位

    const res = transformSpacetime(ct, x, v)

    // s^2 = ct^2 - x^2 = 1000^2 - 500^2 = 750,000
    expect(res.intervalOriginal).toBe(750000)
    // 變換後的 s'^2 必須精確等於 750,000
    expect(res.intervalPrime).toBe(750000)
  })

  it('在 0.6c 速度下勞侖茲因子精確為 1.25 (時間膨脹 25%)', () => {
    const gamma = computeLorentzFactor(0.6 * C_LIGHT)
    // gamma = 1 / sqrt(1 - 0.36) = 1 / 0.8 = 1.25
    expect(gamma).toBeCloseTo(1.25, 4)
  })
})
