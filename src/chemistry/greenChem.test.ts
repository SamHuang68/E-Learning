import { describe, it, expect } from 'vitest'

describe('Chemistry Green Chemistry & Atom Economy Tests', () => {
  it('calculates 100% atom economy for ideal catalytic addition reactions', () => {
    // Ethene hydration to Ethanol: C2H4 (28 g/mol) + H2O (18 g/mol) -> C2H5OH (46 g/mol)
    const mwEthene = 28.05
    const mwWater = 18.02
    const totalReactantsMw = mwEthene + mwWater
    const mwEthanol = 46.07

    const atomEconomy = (mwEthanol / totalReactantsMw) * 100
    expect(atomEconomy).toBeCloseTo(100.0, 1)
  })

  it('computes reduced atom economy when stoichiometric byproducts are generated', () => {
    // Bromination: C6H6 (Benzene, 78) + Br2 (160) -> C6H5Br (Bromobenzene, 157) + HBr (81)
    const mwBenzene = 78.11
    const mwBromine = 159.81
    const totalReactantsMw = mwBenzene + mwBromine // 237.92
    const mwTarget = 157.01 // Bromobenzene

    const atomEconomy = (mwTarget / totalReactantsMw) * 100 // ~ 66.0%
    expect(atomEconomy).toBeCloseTo(66.0, 1)
  })

  it('determines E-factor (Environmental Factor) and waste-to-product ratio', () => {
    // A pharmaceutical synthesis produces 50 kg of chemical waste to generate 1 kg of active drug
    const massWasteKg = 50
    const massProductKg = 1
    const eFactor = massWasteKg / massProductKg

    expect(eFactor).toBe(50)
    // Green chemistry seeks to minimize E-factor towards zero via recyclable heterogeneous catalysts
    expect(eFactor > 0).toBe(true)
  })
})
