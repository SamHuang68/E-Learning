import { describe, it, expect } from 'vitest'

/**
 * 物理化學與膠體化學：Zeta 電位 (Zeta Potential) 與 DLVO 雙電層膠體穩定性模型
 * 
 * 核心原理：
 * 1. 膠體分散系雙電層模型 (Electrical Double Layer, EDL):
 *    - 顆粒表面固定電荷 (Stern 緊密層)
 *    - 擴散層 (Gouy-Chapman 擴散雙電層)
 *    - 流體動力學剪切面 (Shear / Sliding Plane) 處的電位即為 Zeta 電位 (zeta)
 * 2. 亨利方程式 (Henry's Equation) 電泳遷移率:
 *    U_E = (2 * epsilon * zeta * f(kappa*a)) / (3 * eta)
 *    - 在水溶液且鹽濃度正常下 (Smoluchowski 極限): f(kappa*a) = 1.5 => U_E = (epsilon * zeta) / eta
 * 3. DLVO 穩定性判別標準:
 *    - |zeta| >= 30 mV: 靜電斥力勢壘顯著高於熱運動能 k_B * T，膠體懸浮體系高度穩定不易團聚
 *    - 15 mV <= |zeta| < 30 mV: 處於臨界過渡態，具輕度凝集傾向
 *    - |zeta| < 15 mV: 雙電層斥力塌陷，凡得瓦吸引力主導，膠體迅速聚沉 (Flocculation / Coagulation)
 */
export type ColloidStabilityLevel = 'highly-stable' | 'moderately-stable' | 'rapid-coagulation'

export interface ZetaPotentialMetrics {
  zetaPotentialMv: number
  electrophoreticMobilityUmCmPerVs: number
  stabilityLevel: ColloidStabilityLevel
  repulsionBarrierAdequate: boolean
}

export function evaluateZetaColloidStability(
  zetaMv: number,
  viscosityCp: number = 0.89, // 水在 25°C 黏度 ≈ 0.89 cP = 0.89e-3 Pa*s
  dielectricConstant: number = 78.5, // 水相對介電常數
): ZetaPotentialMetrics {
  // Smoluchowski 方程: U_E = (epsilon_r * epsilon_0 * zeta) / eta
  // 介電常數 epsilon = 78.5 * 8.854e-12 F/m
  const epsilon0 = 8.854e-12
  const epsilon = dielectricConstant * epsilon0
  const etaPaS = viscosityCp * 1e-3
  const zetaV = zetaMv * 1e-3

  const mobilityM2PerVs = (epsilon * zetaV) / etaPaS
  const mobilityUmCmPerVs = mobilityM2PerVs * 1e4 * 1e4 // 換算常用單位 um*cm / (V*s)

  const absZeta = Math.abs(zetaMv)
  let stability: ColloidStabilityLevel = 'rapid-coagulation'
  let adequate = false

  if (absZeta >= 30) {
    stability = 'highly-stable'
    adequate = true
  } else if (absZeta >= 15) {
    stability = 'moderately-stable'
    adequate = false
  } else {
    stability = 'rapid-coagulation'
    adequate = false
  }

  return {
    zetaPotentialMv: zetaMv,
    electrophoreticMobilityUmCmPerVs: Number(mobilityUmCmPerVs.toFixed(3)),
    stabilityLevel: stability,
    repulsionBarrierAdequate: adequate,
  }
}

describe('物理化學：Zeta 電位與 DLVO 膠體分散系穩定性單元測試', () => {
  it('當 Zeta 電位絕對值達到 42 mV 時判定為高度穩定分散系', () => {
    const res = evaluateZetaColloidStability(-42.0)
    expect(res.stabilityLevel).toBe('highly-stable')
    expect(res.repulsionBarrierAdequate).toBe(true)
    expect(res.electrophoreticMobilityUmCmPerVs).toBeLessThan(0) // 帶負電荷向陽極遷移
  })

  it('當 Zeta 電位因加入高價反離子降至 8 mV 時觸發膠體快速聚沉', () => {
    const res = evaluateZetaColloidStability(8.0)
    expect(res.stabilityLevel).toBe('rapid-coagulation')
    expect(res.repulsionBarrierAdequate).toBe(false)
  })
})
