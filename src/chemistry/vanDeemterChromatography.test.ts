import { describe, it, expect } from 'vitest'

/**
 * 分析化學色譜分離學：范第姆特方程式 (Van Deemter Equation) 與最優流速模型
 * 
 * 核心原理：
 * 1. 理論塔板高度 (HETP, Height Equivalent to a Theoretical Plate):
 *    H = A + (B / u) + C * u
 *    - A: 渦流擴散項 (Eddy diffusion, A = 2 * lambda * d_p)，與流速無關
 *    - B / u: 縱向分子擴散項 (Longitudinal diffusion, B = 2 * gamma * D_m)，流速越慢擴散越大
 *    - C * u: 傳質阻力項 (Mass transfer resistance, C = C_s + C_m)，流速越快傳質不充分
 * 
 * 2. 柱效極值點推導：
 *    dH / du = - (B / u^2) + C = 0
 *    => 最優載氣/流動相線速度: u_opt = sqrt(B / C)
 *    => 最小理論塔板高度 (最高分離柱效): H_min = A + 2 * sqrt(B * C)
 */
export interface VanDeemterMetrics {
  aParamMm: number
  bParamMm2PerS: number
  cParamS: number
  optimalVelocityMmPerS: number
  minPlateHeightMm: number
  plateHeightAtFlow: (u: number) => number
}

export function evaluateVanDeemter(
  aMm: number,
  bMm2PerS: number,
  cS: number,
): VanDeemterMetrics {
  if (aMm < 0 || bMm2PerS <= 0 || cS <= 0) {
    throw new Error('Invalid Van Deemter constants')
  }

  const uOpt = Math.sqrt(bMm2PerS / cS)
  const hMin = aMm + 2 * Math.sqrt(bMm2PerS * cS)

  return {
    aParamMm: aMm,
    bParamMm2PerS: bMm2PerS,
    cParamS: cS,
    optimalVelocityMmPerS: Number(uOpt.toFixed(4)),
    minPlateHeightMm: Number(hMin.toFixed(4)),
    plateHeightAtFlow: (u: number) => {
      if (u <= 0) throw new Error('Velocity must be positive')
      return aMm + bMm2PerS / u + cS * u
    },
  }
}

describe('分析化學：范第姆特色譜柱效與極值最優流速單元測試', () => {
  it('在最優流速 u_opt 下達成最小理論塔板高度 H_min', () => {
    // A = 0.5 mm, B = 2.0 mm^2/s, C = 0.08 s
    // u_opt = sqrt(2.0 / 0.08) = sqrt(25) = 5.0 mm/s
    // H_min = 0.5 + 2 * sqrt(2.0 * 0.08) = 0.5 + 2 * sqrt(0.16) = 0.5 + 2 * 0.4 = 1.3 mm
    const model = evaluateVanDeemter(0.5, 2.0, 0.08)

    expect(model.optimalVelocityMmPerS).toBe(5.0)
    expect(model.minPlateHeightMm).toBe(1.3)

    // 驗證流速偏移最優點時 H 都會變大（分離柱效下降）
    const hOpt = model.plateHeightAtFlow(5.0)
    const hLow = model.plateHeightAtFlow(2.0)
    const hHigh = model.plateHeightAtFlow(10.0)

    expect(hOpt).toBeCloseTo(1.3, 4)
    expect(hLow).toBeGreaterThan(hOpt)
    expect(hHigh).toBeGreaterThan(hOpt)
  })
})
