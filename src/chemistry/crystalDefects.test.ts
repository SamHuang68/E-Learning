import { describe, it, expect } from 'vitest'

/**
 * 固態晶體點缺陷 (Point Defects) 物理化學模型
 * 
 * 1. 蕭基缺陷 (Schottky Defect):
 *    - 陰陽離子成對離開晶格形成空位 (Vacancy Pair)
 *    - 晶體維持電中性
 *    - 晶體質量不變，但因空缺使體積微幅膨脹，整體密度下降 (Density Decreases)
 *    - 典型代表：NaCl, KCl, CsCl (陰陽離子半徑相近的高配位數晶體)
 * 
 * 2. 弗蘭克缺陷 (Frenkel Defect):
 *    - 較小的離子 (通常為陽離子) 脫離格點移入晶格間隙 (Interstitial)
 *    - 形成空位-間隙對 (Vacancy-Interstitial Pair)
 *    - 晶體未損失原子，體積幾乎不變，整體密度保持不變 (Density Remains Constant)
 *    - 典型代表：AgCl, AgBr, ZnS (陽離子顯著小於陰離子的低配位數晶體)
 */
export interface CrystalDefectProperties {
  defectType: 'Schottky' | 'Frenkel'
  densityEffect: 'decreases' | 'unchanged'
  typicalCompounds: string[]
  ionSizeRatioRequirement: string
}

export function classifyPointDefect(
  defectType: 'Schottky' | 'Frenkel',
): CrystalDefectProperties {
  if (defectType === 'Schottky') {
    return {
      defectType: 'Schottky',
      densityEffect: 'decreases',
      typicalCompounds: ['NaCl', 'KCl', 'CsCl'],
      ionSizeRatioRequirement: 'Cation and anion sizes are comparable (high coordination)',
    }
  } else {
    return {
      defectType: 'Frenkel',
      densityEffect: 'unchanged',
      typicalCompounds: ['AgCl', 'AgBr', 'ZnS'],
      ionSizeRatioRequirement: 'Cation is significantly smaller than anion (low coordination)',
    }
  }
}

describe('固態化學：晶體點缺陷 (Schottky vs Frenkel) 單元測試', () => {
  it('蕭基缺陷因陰陽離子對空缺造成晶體密度下降', () => {
    const schottky = classifyPointDefect('Schottky')
    expect(schottky.densityEffect).toBe('decreases')
    expect(schottky.typicalCompounds).toContain('NaCl')
  })

  it('弗蘭克缺陷因離子僅移至間隙位置故晶體密度保持不變', () => {
    const frenkel = classifyPointDefect('Frenkel')
    expect(frenkel.densityEffect).toBe('unchanged')
    expect(frenkel.typicalCompounds).toContain('AgCl')
  })
})
