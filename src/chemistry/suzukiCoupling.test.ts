import { describe, it, expect } from 'vitest'

/**
 * 諾貝爾化學獎：鈀催化鈴木-宮浦交叉偶聯反應 (Suzuki-Miyaura Cross-Coupling) 催化循環模型
 * 
 * 反應式：Ar-X + Ar'-B(OH)2 + Base --[Pd(0)]--> Ar-Ar' + B(OH)3 + X-
 * 
 * 四大基元步驟：
 * 1. 氧化加成 (Oxidative Addition): Pd(0) -> Ar-Pd(II)-X (鈀氧化數從 0 變為 +2)
 * 2. 鹼活化與配位基交換 (Base Activation): OH- 活化芳基硼酸形成四配位硼酸鹽 Ar'-B(OH)3^-
 * 3. 金屬轉移 (Transmetalation): 芳基 Ar' 由硼轉移至鈀，生成雙芳基鈀錯合物 Ar-Pd(II)-Ar'
 * 4. 還原消除 (Reductive Elimination): 兩芳基偶聯生成聯芳烴 Ar-Ar'，同時鈀還原回 Pd(0)
 */
export interface SuzukiCatalyticStep {
  step: number
  name: string
  palladiumOxidationState: '0' | '+2'
  roleOfBase: string
  productFormed: string
}

export const SUZUKI_CYCLE: SuzukiCatalyticStep[] = [
  {
    step: 1,
    name: 'Oxidative Addition',
    palladiumOxidationState: '+2',
    roleOfBase: 'None',
    productFormed: 'Ar-Pd(II)-X',
  },
  {
    step: 2,
    name: 'Base Activation',
    palladiumOxidationState: '+2',
    roleOfBase: 'Converts neutral arylboronic acid into nucleophilic organoborate Ar-B(OH)3-',
    productFormed: 'Ar-Pd(II)-OH + [Ar-B(OH)3]-',
  },
  {
    step: 3,
    name: 'Transmetalation',
    palladiumOxidationState: '+2',
    roleOfBase: 'Facilitates nucleophilic aryl transfer from boron to palladium',
    productFormed: 'Ar-Pd(II)-Ar',
  },
  {
    step: 4,
    name: 'Reductive Elimination',
    palladiumOxidationState: '0',
    roleOfBase: 'None',
    productFormed: 'Biaryl (Ar-Ar) + regenerated Pd(0)',
  },
]

describe('有機金屬催化：鈴木-宮浦偶聯反應 (Suzuki-Miyaura) 催化循環單元測試', () => {
  it('氧化加成由零價鈀 Pd(0) 氧化為二價鈀 Pd(II)', () => {
    const s1 = SUZUKI_CYCLE.find((s) => s.step === 1)!
    expect(s1.palladiumOxidationState).toBe('+2')
    expect(s1.productFormed).toContain('Ar-Pd(II)-X')
  })

  it('鹼的存在不可或缺：將中性芳基硼酸轉化為親核性硼酸鹽以驅動金屬轉移', () => {
    const s2 = SUZUKI_CYCLE.find((s) => s.step === 2)!
    expect(s2.roleOfBase).toContain('Ar-B(OH)3-')

    const s4 = SUZUKI_CYCLE.find((s) => s.step === 4)!
    expect(s4.palladiumOxidationState).toBe('0')
    expect(s4.productFormed).toContain('Biaryl')
  })
})
