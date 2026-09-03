import { describe, it, expect } from 'vitest'

/**
 * 有機化學：親電芳香取代反應 (EAS) 定向效應與 Arenium Ion (sigma-Complex) 穩定性模型
 * 
 * 核心原理：
 * 1. 芳香環親電進攻產生碳陽離子中間體 (Arenium Ion / Wheland 中間體 / sigma-Complex)
 * 2. 給電子基團 (EDG, 如 -OH, -OCH3, -NH2, -CH3):
 *    - 活化苯環 (Activating)
 *    - 在鄰位 (Ortho) 與對位 (Para) 進攻時，產生額外 1 個所有原子滿足八隅體的特穩定共振結構 (共 4 個共振式)
 *    - 導向：鄰位/對位 (Ortho/Para-directing)
 * 3. 吸電子基團 (EWG, 如 -NO2, -CF3, -CN, -CHO):
 *    - 鈍化苯環 (Deactivating)
 *    - 在鄰/對位進攻時會產生正電荷與強正電基團直接相鄰的極不穩定排斥結構；因此間位 (Meta) 活化能相對更低
 *    - 導向：間位 (Meta-directing)
 * 4. 鹵素基團 (-F, -Cl, -Br, -I):
 *    - 誘導吸電子 (-I > +M) 導致環被整體鈍化 (Deactivating)
 *    - 但孤對電子共軛 (+M) 使鄰/對位中間體多出一個完整八隅體共振式
 *    - 獨特導向：鈍化但為「鄰位/對位」定向 (Deactivating Ortho/Para-directing)！
 */
export type EASDirectingType = 'ortho-para-activating' | 'ortho-para-deactivating' | 'meta-deactivating'

export interface EASSubstituentProfile {
  substituent: string
  electronicEffect: 'strongly-activating' | 'moderately-activating' | 'weakly-activating' | 'weakly-deactivating' | 'strongly-deactivating'
  directingType: EASDirectingType
  majorIsomerTarget: 'ortho-para' | 'meta'
  resonanceContributorsOrthoPara: number
  resonanceContributorsMeta: number
}

export function classifyEASSubstituent(substituent: string): EASSubstituentProfile {
  switch (substituent) {
    case '-OH':
    case '-OCH3':
    case '-NH2':
      return {
        substituent,
        electronicEffect: 'strongly-activating',
        directingType: 'ortho-para-activating',
        majorIsomerTarget: 'ortho-para',
        resonanceContributorsOrthoPara: 4, // 額外多出未共用電子對參與的完整八隅體共振式
        resonanceContributorsMeta: 3,
      }
    case '-CH3':
    case '-CH2CH3':
      return {
        substituent,
        electronicEffect: 'weakly-activating',
        directingType: 'ortho-para-activating',
        majorIsomerTarget: 'ortho-para',
        resonanceContributorsOrthoPara: 3, // 超共軛穩定三級碳陽離子
        resonanceContributorsMeta: 3,
      }
    case '-Cl':
    case '-Br':
    case '-F':
      return {
        substituent,
        electronicEffect: 'weakly-deactivating',
        directingType: 'ortho-para-deactivating', // 鹵素特徵：鈍化但鄰對位定向
        majorIsomerTarget: 'ortho-para',
        resonanceContributorsOrthoPara: 4, // 孤對電子可參與共振
        resonanceContributorsMeta: 3,
      }
    case '-NO2':
    case '-CF3':
    case '-CN':
    default:
      return {
        substituent,
        electronicEffect: 'strongly-deactivating',
        directingType: 'meta-deactivating',
        majorIsomerTarget: 'meta',
        resonanceContributorsOrthoPara: 3, // 鄰對位會遭遇正電荷相鄰的高排斥不穩定結構
        resonanceContributorsMeta: 3,
      }
  }
}

describe('有機化學：親電芳香取代 (EAS) 定向基與中間體共振結構單元測試', () => {
  it('羥基 (-OH) 為強活化基且鄰對位中間體具備 4 個共振極限結構', () => {
    const profile = classifyEASSubstituent('-OH')
    expect(profile.electronicEffect).toBe('strongly-activating')
    expect(profile.majorIsomerTarget).toBe('ortho-para')
    expect(profile.resonanceContributorsOrthoPara).toBe(4)
  })

  it('氯基 (-Cl) 呈現獨特的鈍化但鄰對位定向特徵', () => {
    const profile = classifyEASSubstituent('-Cl')
    expect(profile.directingType).toBe('ortho-para-deactivating')
    expect(profile.majorIsomerTarget).toBe('ortho-para')
    expect(profile.resonanceContributorsOrthoPara).toBe(4)
  })

  it('硝基 (-NO2) 為強鈍化間位定向基', () => {
    const profile = classifyEASSubstituent('-NO2')
    expect(profile.electronicEffect).toBe('strongly-deactivating')
    expect(profile.majorIsomerTarget).toBe('meta')
    expect(profile.directingType).toBe('meta-deactivating')
  })
})
