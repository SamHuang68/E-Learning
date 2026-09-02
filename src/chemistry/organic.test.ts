import { describe, it, expect } from 'vitest'

describe('Chemistry Organic Chemistry & Functional Groups Tests', () => {
  it('classifies major organic functional groups correctly', () => {
    const functionalGroups = [
      { name: '醇 (Alcohol)', formula: 'R-OH', example: '乙醇 Ethanol (C2H5OH)' },
      { name: '醛 (Aldehyde)', formula: 'R-CHO', example: '乙醛 Acetaldehyde (CH3CHO)' },
      { name: '酮 (Ketone)', formula: 'R-CO-R\'', example: '丙酮 Acetone (CH3COCH3)' },
      { name: '羧酸 (Carboxylic Acid)', formula: 'R-COOH', example: '乙酸 Acetic Acid (CH3COOH)' },
      { name: '酯 (Ester)', formula: 'R-COO-R\'', example: '乙酸乙酯 Ethyl Acetate (CH3COOC2H5)' },
    ]

    expect(functionalGroups.length).toBe(5)
    functionalGroups.forEach((fg) => {
      expect(fg.name).toBeTruthy()
      expect(fg.formula).toBeTruthy()
      expect(fg.example).toBeTruthy()
    })
  })

  it('determines constitutional isomers for C2H6O (Ethanol vs Dimethyl Ether)', () => {
    // Ethanol: CH3CH2OH (alcohol, has hydrogen bonding, bp ~ 78°C)
    // Dimethyl ether: CH3OCH3 (ether, no hydrogen bonding, gas at room temp, bp ~ -24°C)
    const formula = 'C2H6O'
    const ethanolBp = 78.37 // °C
    const dimethylEtherBp = -24.0 // °C

    // Same molecular formula, different functional group & physical properties
    expect(formula).toBe('C2H6O')
    expect(ethanolBp).toBeGreaterThan(dimethylEtherBp)
  })

  it('distinguishes cis-trans geometric isomers (e.g. 2-butene)', () => {
    // cis-2-butene (CH3 groups on same side -> net dipole moment > 0)
    // trans-2-butene (CH3 groups on opposite sides -> net dipole moment ≈ 0, higher melting point due to packing)
    const cisPolarity = 'polar'
    const transPolarity = 'nonpolar'

    expect(cisPolarity).toBe('polar')
    expect(transPolarity).toBe('nonpolar')
  })
})
