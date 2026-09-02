import { describe, it, expect } from 'vitest'

/**
 * 分析化學與有機波譜學：核磁共振氫譜 (1H-NMR) 化學位移與自旋偶合裂分模型
 * 
 * 1. 化學位移公式 (ppm):
 *    delta = ((nu_sample - nu_TMS) / nu_0) * 1e6
 * 
 * 2. 自旋-自旋偶合 n + 1 裂分律 (Spin-Spin Splitting):
 *    - 若相鄰碳上有 n 個等價質子，該吸收峰分裂為 (n + 1) 重峰
 *    - 峰強度面積比依循巴斯卡三角形二項式係數 C(n, k)
 */
export interface NMRPeak {
  label: string
  chemicalShiftPpm: number
  neighborProtons: number
  multiplicity: string
  intensityRatio: number[]
}

const MULTIPLICITY_NAMES: Record<number, string> = {
  1: 'singlet (單峰)',
  2: 'doublet (雙重峰)',
  3: 'triplet (三重峰)',
  4: 'quartet (四重峰)',
  5: 'quintet (五重峰)',
  6: 'sextet (六重峰)',
  7: 'septet (七重峰)',
}

export function computePascalMultiplicity(n: number): { name: string; ratios: number[] } {
  const peaksCount = n + 1
  const ratios: number[] = []

  // 二項式係數 C(n, k)
  for (let k = 0; k <= n; k++) {
    ratios.push(combination(n, k))
  }

  const name = MULTIPLICITY_NAMES[peaksCount] || `${peaksCount}-let`
  return { name, ratios }
}

function combination(n: number, k: number): number {
  if (k < 0 || k > n) return 0
  if (k === 0 || k === n) return 1
  let c = 1
  for (let i = 1; i <= k; i++) {
    c = (c * (n - (k - i))) / i
  }
  return Math.round(c)
}

describe('有機化學波譜學：1H-NMR 自旋偶合裂分與巴斯卡二項式面積比單元測試', () => {
  it('乙醇乙基 -CH2- 鄰近 -CH3 (n=3) 質子時分裂為 1:3:3:1 的四重峰 (quartet)', () => {
    // -CH2- 旁邊有 3 個質子
    const res = computePascalMultiplicity(3)

    expect(res.name).toBe('quartet (四重峰)')
    expect(res.ratios).toEqual([1, 3, 3, 1])
  })

  it('乙醇甲基 -CH3 鄰近 -CH2- (n=2) 質子時分裂為 1:2:1 的三重峰 (triplet)', () => {
    const res = computePascalMultiplicity(2)

    expect(res.name).toBe('triplet (三重峰)')
    expect(res.ratios).toEqual([1, 2, 1])
  })

  it('無鄰近質子 (n=0，如第三丁基或孤立醛基) 呈現單峰 (singlet [1])', () => {
    const res = computePascalMultiplicity(0)

    expect(res.name).toBe('singlet (單峰)')
    expect(res.ratios).toEqual([1])
  })
})
