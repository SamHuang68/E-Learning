import { describe, it, expect } from 'vitest'

/**
 * 配位化學：平面四方形 Pt(II) 錯合物之反位效應 (Trans Effect) 決策模型
 * 
 * 反位效應強弱能力等級表 (數值愈大，促使其反位基團離去能力愈強):
 * CN-, CO, C2H4 (10) > PR3, H- (8) > I-, SCN- (6) > Br- (5) > Cl- (4) > py, NH3 (2) > OH-, H2O (1)
 */
export const TRANS_EFFECT_STRENGTH: Record<string, number> = {
  'CN-': 10,
  'CO': 10,
  'C2H4': 10,
  'PR3': 8,
  'H-': 8,
  'I-': 6,
  'SCN-': 6,
  'Br-': 5,
  'Cl-': 4,
  'py': 2,
  'NH3': 2,
  'OH-': 1,
  'H2O': 1,
}

/**
 * 預測平面四方形取代反應產物立體化學 (順式 Cis vs 反式 Trans)
 * 案例 1: 從 [PtCl4]^2- 連續與兩當量 NH3 反應
 * 案例 2: 從 [Pt(NH3)4]^2+ 連續與兩當量 Cl- 反應
 */
export function predictCisOrTransProduct(
  startingComplex: 'PtCl4_2minus' | 'PtNH34_2plus',
): 'cis-Pt(NH3)2Cl2' | 'trans-Pt(NH3)2Cl2' {
  if (startingComplex === 'PtCl4_2minus') {
    // 步驟 1: [PtCl4]^2- + NH3 -> [PtCl3(NH3)]^-
    // 步驟 2: [PtCl3(NH3)]^- 中，有兩個互為反位的 Cl-，以及一個與 NH3 反位的 Cl-。
    // 比較反位引導能力：Cl- (強度 4) vs NH3 (強度 2)。
    // 由於 Cl- 的反位效應強於 NH3，因此與 Cl- 反位的那個 Cl- 會被優先取代！
    // 結果：新進入的 NH3 會進入與原 NH3 鄰近的位置（順式）=> cis-Pt(NH3)2Cl2 (順鉑！)
    return 'cis-Pt(NH3)2Cl2'
  } else {
    // 步驟 1: [Pt(NH3)4]^2+ + Cl- -> [Pt(NH3)3Cl]^+
    // 步驟 2: [Pt(NH3)3Cl]^+ 中，Cl- (強度 4) 的反位效應強於 NH3 (強度 2)。
    // 因此與 Cl- 正反位 (Trans) 的 NH3 鍵最弱，最容易被第二個 Cl- 取代！
    // 結果：新進入的 Cl- 落在第一個 Cl- 的反位 => trans-Pt(NH3)2Cl2 (反鉑)
    return 'trans-Pt(NH3)2Cl2'
  }
}

describe('配位化學：反位效應 (Trans Effect) 與抗癌藥物順鉑合成單元測試', () => {
  it('Cl- 反位效應強於 NH3 使得從四氯合鉑出發能特異性合成出抗癌藥物順鉑 (Cisplatin)', () => {
    expect(TRANS_EFFECT_STRENGTH['Cl-']).toBeGreaterThan(TRANS_EFFECT_STRENGTH['NH3'])
    const product = predictCisOrTransProduct('PtCl4_2minus')
    expect(product).toBe('cis-Pt(NH3)2Cl2')
  })

  it('從四氨合鉑出發因 Cl- 反位誘導活性高而選擇性生成無抗癌活性的反鉑 (Transplatin)', () => {
    const product = predictCisOrTransProduct('PtNH34_2plus')
    expect(product).toBe('trans-Pt(NH3)2Cl2')
  })
})
