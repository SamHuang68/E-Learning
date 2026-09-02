import { describe, it, expect } from 'vitest'

/**
 * 威廉森醚合成法 (Williamson Ether Synthesis) 與 SN2/E2 機轉競爭決策模型
 * 
 * 反應式：R-O^- Na^+ + R'-X -> R-O-R' + NaX
 * 
 * 決策原則：
 * 1. 親核試劑：醇鈉 (Alkoxide) 或酚鈉 (Phenoxide) 為強親核試劑且具強鹼性。
 * 2. 受體鹵烷 (Substrate R'-X)：
 *    - 甲基鹵烷 (Methyl) 或一級鹵烷 (1°)：空間位阻小，純走 SN2 機轉，高產率生成不對稱醚。
 *    - 二級鹵烷 (2°)：SN2 與 E2 競爭，產率降低。
 *    - 三級鹵烷 (3°)：空間位阻極大，醇鈉拔取 β-H 發生 E2 消除反應，主產物為烯烴，無法合成醚！
 */
export interface EtherReactionOutcome {
  substrateType: 'methyl' | 'primary' | 'secondary' | 'tertiary'
  mechanism: 'SN2' | 'SN2+E2' | 'E2'
  majorProductType: 'ether' | 'alkene'
  canSynthesizeTargetEther: boolean
}

export function evaluateWilliamsonRoute(
  substrateType: 'methyl' | 'primary' | 'secondary' | 'tertiary',
): EtherReactionOutcome {
  switch (substrateType) {
    case 'methyl':
    case 'primary':
      return {
        substrateType,
        mechanism: 'SN2',
        majorProductType: 'ether',
        canSynthesizeTargetEther: true,
      }
    case 'secondary':
      return {
        substrateType,
        mechanism: 'SN2+E2',
        majorProductType: 'ether',
        canSynthesizeTargetEther: true,
      }
    case 'tertiary':
      return {
        substrateType,
        mechanism: 'E2',
        majorProductType: 'alkene',
        canSynthesizeTargetEther: false, // 致命陷阱：無法生成三級醚
      }
  }
}

describe('有機化學：威廉森醚合成法 (Williamson Synthesis) SN2 與 E2 競爭單元測試', () => {
  it('合成甲基三級丁基醚 (MTBE) 之最佳路線為三級丁醇鈉與甲基碘 (1°/甲基基質)', () => {
    // 路線 A：三級丁醇鈉 (t-BuO-) + 碘甲烷 (CH3I, methyl)
    const routeA = evaluateWilliamsonRoute('methyl')
    expect(routeA.mechanism).toBe('SN2')
    expect(routeA.majorProductType).toBe('ether')
    expect(routeA.canSynthesizeTargetEther).toBe(true)

    // 路線 B：甲醇鈉 (MeO-) + 2-溴-2-甲基丙烷 (t-BuBr, tertiary)
    const routeB = evaluateWilliamsonRoute('tertiary')
    expect(routeB.mechanism).toBe('E2')
    expect(routeB.majorProductType).toBe('alkene') // 主要生成異丁烯 (2-methylpropene)
    expect(routeB.canSynthesizeTargetEther).toBe(false)
  })

  it('乙醇鈉進攻一級溴乙烷高產率生成二乙醚且依循 SN2 雙分子動力學', () => {
    const outcome = evaluateWilliamsonRoute('primary')
    expect(outcome.mechanism).toBe('SN2')
    expect(outcome.canSynthesizeTargetEther).toBe(true)
  })
})
