import { describe, it, expect } from 'vitest'

/**
 * 物理有機化學：親電芳香取代反應 (EAS) 與 Hammett 方程式模型
 * 
 * 公式：log10(k / k_0) = sigma * rho
 * 
 * 參數：
 * - sigma: 取代基常數 (Substituent Constant)
 *   - 電子供予基 (EDG, 如 -OCH3, -CH3): sigma < 0
 *   - 電子吸引基 (EWG, 如 -NO2, -CN): sigma > 0
 * - rho: 反應常數 (Reaction Constant)
 *   - 親電芳香取代 (EAS) 通常帶負電 (rho < 0，因為過渡態具有部分正電荷)
 */
export interface HammettSubstituent {
  name: string
  sigmaPara: number
  type: 'activating-ortho-para' | 'deactivating-meta'
}

export const HAMMETT_SUBSTITUENTS: Record<string, HammettSubstituent> = {
  methoxy: { name: '-OCH3', sigmaPara: -0.27, type: 'activating-ortho-para' },
  methyl: { name: '-CH3', sigmaPara: -0.17, type: 'activating-ortho-para' },
  hydrogen: { name: '-H', sigmaPara: 0.0, type: 'activating-ortho-para' },
  chloro: { name: '-Cl', sigmaPara: 0.23, type: 'activating-ortho-para' },
  nitro: { name: '-NO2', sigmaPara: 0.78, type: 'deactivating-meta' },
}

export function computeRelativeRate(substituentKey: string, rho: number): number {
  const sub = HAMMETT_SUBSTITUENTS[substituentKey]
  if (!sub) throw new Error(`Unknown substituent: ${substituentKey}`)

  // log10(k / k0) = sigma * rho => k / k0 = 10^(sigma * rho)
  const logRatio = sub.sigmaPara * rho
  return Number(Math.pow(10, logRatio).toFixed(6))
}

describe('物理有機化學：Hammett 方程式與親電芳香取代 (EAS) 速率預測單元測試', () => {
  it('在親電取代反應中 (rho = -4.0)，強致活基 -OCH3 使反應速率暴增 12 倍', () => {
    // sigma = -0.27, rho = -4.0 => log(k/k0) = (-0.27) * (-4.0) = +1.08
    // k / k0 = 10^1.08 ≈ 12.02
    const rateRatio = computeRelativeRate('methoxy', -4.0)
    expect(rateRatio).toBeGreaterThan(11.0)
    expect(rateRatio).toBeLessThan(13.0)
  })

  it('強去活基 -NO2 (sigma = +0.78) 使反應速率暴跌至原來的千分之一以下', () => {
    // sigma = 0.78, rho = -4.0 => log(k/k0) = -3.12
    // k / k0 = 10^(-3.12) ≈ 0.000758
    const rateRatio = computeRelativeRate('nitro', -4.0)
    expect(rateRatio).toBeLessThan(0.001)
  })
})
