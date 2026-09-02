import { describe, it, expect } from 'vitest'

/**
 * 有機金屬化學：威爾金森觸媒 (Wilkinson's Catalyst) 均相加氫催化循環模型
 * 
 * 觸媒分子：RhCl(PPh3)3 (16 電子, Rh(I), 平面四方形)
 * 
 * 四大基元反應步驟：
 * 1. 配位基解離 (Ligand Dissociation): 失去 1 個 PPh3 -> 14 電子 RhCl(PPh3)2
 * 2. 氧化加成 (Oxidative Addition): H2 加成 -> 18 電子 Rh(III)Cl(H)2(PPh3)2
 * 3. 烯烴配位與遷移插入 (Migratory Insertion): 烯烴配位並插入 Rh-H 鍵形成烷基錯合物
 * 4. 還原消除 (Reductive Elimination): 釋放烷烴產物並再生 14 電子 Rh(I) 活性觸媒
 */
export interface CatalyticStep {
  stepName: string
  rhodiumOxidationState: '+1' | '+3'
  valenceElectronCount: 14 | 16 | 18
  keyTransformation: string
}

export const WILKINSON_CYCLE: CatalyticStep[] = [
  {
    stepName: 'Ligand Dissociation',
    rhodiumOxidationState: '+1',
    valenceElectronCount: 14,
    keyTransformation: 'RhCl(PPh3)3 loses PPh3 to expose open coordination site',
  },
  {
    stepName: 'Oxidative Addition',
    rhodiumOxidationState: '+3',
    valenceElectronCount: 18,
    keyTransformation: 'H2 molecule oxidatively adds across Rh(I) to form cis-dihydride Rh(III)',
  },
  {
    stepName: 'Migratory Insertion',
    rhodiumOxidationState: '+3',
    valenceElectronCount: 16,
    keyTransformation: 'Olefin coordinates and inserts into Rh-H bond to form rhodium-alkyl complex',
  },
  {
    stepName: 'Reductive Elimination',
    rhodiumOxidationState: '+1',
    valenceElectronCount: 14,
    keyTransformation: 'Alkyl and second hydride eliminate as alkane, regenerating Rh(I) active catalyst',
  },
]

describe('有機金屬催化：威爾金森觸媒烯烴均相加氫反應循環單元測試', () => {
  it('氧化加成使銠氧化數由 +1 升高至 +3 且價電子數由 14 增至 18', () => {
    const oxAdd = WILKINSON_CYCLE.find((s) => s.stepName === 'Oxidative Addition')!
    expect(oxAdd.rhodiumOxidationState).toBe('+3')
    expect(oxAdd.valenceElectronCount).toBe(18)
  })

  it('最後一步還原消除釋出飽和烷烴產物並使銠還原回 +1 活性催化態', () => {
    const redElim = WILKINSON_CYCLE.find((s) => s.stepName === 'Reductive Elimination')!
    expect(redElim.rhodiumOxidationState).toBe('+1')
    expect(redElim.valenceElectronCount).toBe(14)
    expect(redElim.keyTransformation).toContain('alkane')
  })
})
