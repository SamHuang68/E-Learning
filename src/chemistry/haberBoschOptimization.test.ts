import { describe, it, expect } from 'vitest'

/**
 * 化學工程：哈柏-博施法 (Haber-Bosch Process) 工業合成氨熱力學與動力學折衷模型
 * 
 * 反應式：N2(g) + 3 H2(g) <=> 2 NH3(g), ΔH° = -92.4 kJ/mol
 * 
 * 1. 熱力學平衡 (Le Chatelier's Principle):
 *    - 低溫 (T < 300°C): 平衡產率高 (K_p 大，放熱反應)，但速率極慢
 *    - 高壓 (P = 150 ~ 250 atm): 氣體莫耳數 4 -> 2，平衡向右大幅移動
 * 
 * 2. 動力學速率 (Arrhenius):
 *    - 高溫 (T > 600°C): 碰撞頻率高，反應迅速達到平衡，但平衡產率極低 (< 5%)
 * 
 * 3. 工業最優化折衷條件 (Optimal Trade-off):
 *    - 溫度：400°C ~ 500°C (兼具 15%~20% 單程產率與幾秒內快速反應)
 *    - 壓力：150 ~ 200 atm
 *    - 觸媒：鐵觸媒 (Fe3O4 還原之多孔鐵催化劑，搭配 K2O、Al2O3 助催化劑)
 */
export interface IndustrialSynthesisCondition {
  temperatureCelsius: number
  pressureAtm: number
  catalyst: string
  equilibriumYieldPercent: number
  timeToEquilibriumSeconds: number
  overallFeasibility: 'optimal' | 'too-slow' | 'too-low-yield'
}

export function evaluateHaberBoschConditions(
  tempC: number,
  pressureAtm: number,
  hasIronCatalyst: boolean,
): IndustrialSynthesisCondition {
  // 簡化模擬模型
  let equilibriumYield = 0
  let timeToEq = 0

  // 溫度愈高平衡產率愈低 (放熱反應)
  // 壓力愈高平衡產率愈高
  equilibriumYield = (500 / (tempC + 273)) * Math.sqrt(pressureAtm) * 3.2
  equilibriumYield = Math.min(95, Math.max(2, equilibriumYield))

  // 速率取決於溫度與觸媒
  const baseTime = Math.exp(5000 / (tempC + 273))
  timeToEq = hasIronCatalyst ? baseTime / 100 : baseTime * 10

  let feasibility: 'optimal' | 'too-slow' | 'too-low-yield' = 'optimal'
  if (tempC < 300 || (!hasIronCatalyst && tempC < 450)) {
    feasibility = 'too-slow'
  } else if (tempC > 650 || equilibriumYield < 5) {
    feasibility = 'too-low-yield'
  }

  return {
    temperatureCelsius: tempC,
    pressureAtm,
    catalyst: hasIronCatalyst ? 'Fe/K2O/Al2O3' : 'None',
    equilibriumYieldPercent: Number(equilibriumYield.toFixed(1)),
    timeToEquilibriumSeconds: Number(timeToEq.toFixed(1)),
    overallFeasibility: feasibility,
  }
}

describe('化學工程：哈柏法合成氨平衡與動力學折衷單元測試', () => {
  it('450°C 與 200 atm 配合鐵觸媒達成工業最佳折衷狀態', () => {
    const res = evaluateHaberBoschConditions(450, 200, true)

    expect(res.overallFeasibility).toBe('optimal')
    // 平衡產率在 15% 以上
    expect(res.equilibriumYieldPercent).toBeGreaterThan(15)
    expect(res.catalyst).toContain('Fe')
  })

  it('若無觸媒且在 200°C 低溫下反應速率過慢無法進行工業生產', () => {
    const res = evaluateHaberBoschConditions(200, 200, false)
    expect(res.overallFeasibility).toBe('too-slow')
  })
})
