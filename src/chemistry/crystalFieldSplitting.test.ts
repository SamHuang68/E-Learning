import { describe, it, expect } from 'vitest'

/**
 * 八面體錯合物晶體場分裂能 (Octahedral Crystal Field Splitting) 物理化學模型
 * 
 * d 軌域在八面體場中分裂為：
 * - 低能態 t2g (3 個軌域，每個貢獻 -0.4 Δo)
 * - 高能態 eg (2 個軌域，每個貢獻 +0.6 Δo)
 * 
 * 競爭機制：
 * - 弱場配位基 (Weak-field): Δo < P (成對能) => 高自旋 (High-Spin, 先均勻半滿再成對)
 * - 強場配位基 (Strong-field): Δo > P => 低自旋 (Low-Spin, 先填滿 t2g)
 */
export interface OctahedralDConfiguration {
  dElectrons: number
  spinState: 'high-spin' | 'low-spin'
  t2gCount: number
  egCount: number
  unpairedElectrons: number
  cfseDeltaO: number // 晶體場穩定化能 (以 Δo 為單位)
}

export function computeOctahedralDOrbitals(
  dElectrons: number, // 1 到 10
  isStrongField: boolean,
): OctahedralDConfiguration {
  if (dElectrons < 1 || dElectrons > 10) throw new Error('d electrons must be between 1 and 10')

  let t2gCount = 0
  let egCount = 0
  let spinState: 'high-spin' | 'low-spin' = isStrongField ? 'low-spin' : 'high-spin'

  if (dElectrons <= 3) {
    // d1 ~ d3: 無論強弱場皆依序填入 t2g
    t2gCount = dElectrons
    egCount = 0
  } else if (dElectrons >= 8) {
    // d8 ~ d10: t2g 必為 6，其餘填入 eg
    t2gCount = 6
    egCount = dElectrons - 6
  } else {
    // d4 ~ d7: 存在高低自旋差異
    if (isStrongField) {
      // 低自旋：優先填滿 t2g (最多 6 個)
      t2gCount = Math.min(6, dElectrons)
      egCount = dElectrons - t2gCount
      spinState = 'low-spin'
    } else {
      // 高自旋：t2g 先放 3 個，eg 放 2 個，剩下再回 t2g
      if (dElectrons <= 5) {
        t2gCount = 3
        egCount = dElectrons - 3
      } else {
        t2gCount = dElectrons - 2
        egCount = 2
      }
      spinState = 'high-spin'
    }
  }

  // 計算不成對電子數
  const t2gUnpaired = t2gCount <= 3 ? t2gCount : 6 - t2gCount
  const egUnpaired = egCount <= 2 ? egCount : 4 - egCount
  const unpairedElectrons = t2gUnpaired + egUnpaired

  // CFSE = -0.4 * t2g + 0.6 * eg
  const cfseDeltaO = Number((-0.4 * t2gCount + 0.6 * egCount).toFixed(2))

  return {
    dElectrons,
    spinState,
    t2gCount,
    egCount,
    unpairedElectrons,
    cfseDeltaO,
  }
}

describe('配位化學：八面體晶體場分裂能 (Crystal Field Splitting) 單元測試', () => {
  it('d6 鐵(II)錯合物在強場 (CN-) 下為反磁性低自旋 (0 個不成對電子, CFSE = -2.4 Δo)', () => {
    // [Fe(CN)6]^4-, Fe2+ 為 d6, 強場配位基 (CN-)
    const lowSpinFe = computeOctahedralDOrbitals(6, true)

    // t2g 填滿 6 個電子，eg 為 0
    expect(lowSpinFe.t2gCount).toBe(6)
    expect(lowSpinFe.egCount).toBe(0)
    expect(lowSpinFe.unpairedElectrons).toBe(0) // 完全抗磁性 (Diamagnetic)
    // CFSE = -0.4 * 6 = -2.4 Δo
    expect(lowSpinFe.cfseDeltaO).toBe(-2.4)
  })

  it('d6 鐵(II)錯合物在弱場 (H2O) 下為順磁性高自旋 (4 個不成對電子, CFSE = -0.4 Δo)', () => {
    // [Fe(H2O)6]^2-, Fe2+ 為 d6, 弱場配位基 (H2O)
    const highSpinFe = computeOctahedralDOrbitals(6, false)

    // t2g 有 4 個電子，eg 有 2 個電子
    expect(highSpinFe.t2gCount).toBe(4)
    expect(highSpinFe.egCount).toBe(2)
    expect(highSpinFe.unpairedElectrons).toBe(4) // 高度順磁性 (Paramagnetic)
    // CFSE = -0.4 * 4 + 0.6 * 2 = -1.6 + 1.2 = -0.4 Δo
    expect(highSpinFe.cfseDeltaO).toBe(-0.4)
  })
})
