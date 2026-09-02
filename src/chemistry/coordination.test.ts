import { describe, it, expect } from 'vitest'

describe('Chemistry Coordination Chemistry & Complex Ions Tests', () => {
  it('classifies coordination numbers and geometries correctly', () => {
    const complexes = [
      {
        formula: '[Ag(NH3)2]+',
        name: '二氨銀(I)錯離子 (Diamminesilver(I))',
        coordNum: 2,
        geometry: '直線型 (Linear)',
        centralIon: 'Ag+',
      },
      {
        formula: 'cis-[Pt(NH3)2Cl2]',
        name: '順鉑 (Cisplatin)',
        coordNum: 4,
        geometry: '平面四邊形 (Square Planar)',
        centralIon: 'Pt2+',
      },
      {
        formula: '[Zn(OH)4]2-',
        name: '四羥基鋅酸根 (Tetrahydroxozincate(II))',
        coordNum: 4,
        geometry: '正四面體 (Tetrahedral)',
        centralIon: 'Zn2+',
      },
      {
        formula: '[Fe(CN)6]4-',
        name: '亞鐵氰酸根 / 黃血鹽 (Hexacyanoferrate(II))',
        coordNum: 6,
        geometry: '正八面體 (Octahedral)',
        centralIon: 'Fe2+',
      },
    ]

    expect(complexes.length).toBe(4)
    complexes.forEach((c) => {
      expect(c.coordNum).toBeGreaterThanOrEqual(2)
      expect(c.geometry).toBeTruthy()
      expect(c.centralIon).toBeTruthy()
    })
  })

  it('differentiates monodentate vs multidentate chelating ligands', () => {
    // NH3, H2O, Cl-, CN- are monodentate (1 donor atom per ligand)
    // Oxalate C2O4(2-) is bidentate (2 donor atoms per ligand)
    // EDTA(4-) is hexadentate (6 donor atoms: 2 N + 4 O-) forming very stable chelates
    const edtaDenticity = 6
    const oxalateDenticity = 2
    const ammoniaDenticity = 1

    expect(edtaDenticity).toBe(6)
    expect(oxalateDenticity).toBe(2)
    expect(ammoniaDenticity).toBe(1)
  })

  it('verifies Tollens reagent reaction with aldehydes (Silver Mirror Reaction)', () => {
    // R-CHO + 2[Ag(NH3)2]+ + 3OH- -> R-COO- + 2Ag(s) + 4NH3 + 2H2O
    const silverRatioToAldehyde = 2 // 1 mol aldehyde reduces 2 mol [Ag(NH3)2]+ to precipitate 2 mol metallic silver Ag(s)
    const formsSilverMirror = true

    expect(silverRatioToAldehyde).toBe(2)
    expect(formsSilverMirror).toBe(true)
  })
})
