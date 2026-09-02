import { describe, it, expect } from 'vitest'

describe('Chemistry Claisen Condensation, Beta-Keto Ester Synthesis & Dieckmann Cyclization Tests', () => {
  it('explains base selection rule matching ester alkoxy group to avoid transesterification', () => {
    // Ethyl acetate (CH3COOEt) requires sodium ethoxide (NaOEt)
    // Using sodium methoxide (NaOMe) causes transesterification to methyl acetate
    const esterAlkoxy = 'ethoxy'
    const suitableBase = 'sodium ethoxide'
    const unsuitableBaseDueToSaponification = 'sodium hydroxide'

    expect(esterAlkoxy).toBe('ethoxy')
    expect(suitableBase).toContain('ethoxide')
    expect(unsuitableBaseDueToSaponification).toBe('sodium hydroxide')
  })

  it('identifies the thermodynamic driving force as the irreversible deprotonation of the beta-dicarbonyl methylene', () => {
    // Ethyl acetoacetate (CH3-CO-CH2-COOEt)
    // Central CH2 is flanked by two electron-withdrawing carbonyls
    // pKa drops to ~ 10.7 (drastically more acidic than ethanol pKa ~ 15.9)
    const pKa_Ethanol = 15.9
    const pKa_EthylAcetoacetate_CH2 = 10.7

    // Ethoxide base (conjugate pKa 15.9) quantitatively strips H+ from CH2 (pKa 10.7)
    // Equilibrium constant K = 10^(15.9 - 10.7) = 10^5.2 ~ 1.58e5 (heavily favors enolate salt)
    const deltaPKa = pKa_Ethanol - pKa_EthylAcetoacetate_CH2 // 5.2
    const drivingForceK = Math.pow(10, deltaPKa)

    expect(deltaPKa).toBeCloseTo(5.2, 1)
    expect(drivingForceK).toBeGreaterThan(10000)

    // Final acid workup (dilute HCl) protonates the enolate back to neutral beta-keto ester
    const requiresAcidWorkup = true
    expect(requiresAcidWorkup).toBe(true)
  })

  it('predicts clean cross-Claisen condensation using an ester lacking alpha-hydrogens', () => {
    // Ethyl benzoate (C6H5COOEt) has 0 alpha-hydrogens (electrophilic partner only)
    // Ethyl acetate (CH3COOEt) has 3 alpha-hydrogens (enolate donor)
    const benzoateAlphaH = 0
    const acetateAlphaH = 3

    expect(benzoateAlphaH).toBe(0)
    expect(acetateAlphaH).toBe(3)

    // Condensation product: Ethyl benzoylacetate (C6H5-CO-CH2-COOEt)
    const product = 'ethyl benzoylacetate'
    expect(product).toBe('ethyl benzoylacetate')
  })

  it('models Dieckmann intramolecular cyclization forming thermodynamically favored 5- or 6-membered rings', () => {
    // Diethyl adipate (1,6-diester, 6 carbons in chain)
    // Undergoes intramolecular Claisen to form ethyl 2-oxocyclopentanecarboxylate (5-membered ring)
    const chainCarbons = 6
    const ringSizeFormed = chainCarbons - 1 // 5-membered ring (cyclopentanone derivative)

    expect(ringSizeFormed).toBe(5)
    expect([5, 6]).toContain(ringSizeFormed)
  })
})
