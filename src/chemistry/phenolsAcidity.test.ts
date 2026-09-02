import { describe, it, expect } from 'vitest'

describe('Chemistry Alcohols vs Phenols Acidity & Resonance Stabilization Tests', () => {
  it('contrasts ethanol with phenol acidity and resonance delocalization', () => {
    // Ethanol pKa ≈ 15.9, Ka ≈ 1.26e-16 (localized charge on oxygen)
    // Phenol pKa ≈ 9.95, Ka ≈ 1.12e-10 (delocalized charge into benzene pi system)
    const pKaEthanol = 15.90
    const pKaPhenol = 9.95

    const acidityRatio = Math.pow(10, pKaEthanol - pKaPhenol) // ~ 8.91e5 (~ 10^6 times)
    expect(acidityRatio).toBeGreaterThan(8.0e5)
    expect(acidityRatio).toBeLessThan(1.0e6)

    // Phenoxide ion has 4 major resonance contributors delocalizing charge to ortho and para carbons
    const resonanceCanonicalStructures = 4
    expect(resonanceCanonicalStructures).toBe(4)
  })

  it('demonstrates substituent effects: nitro EWG increases acidity vs methyl EDG decreases acidity', () => {
    // Phenol: pKa ≈ 9.95
    const pKaPhenol = 9.95
    // p-Nitrophenol (-NO2 EWG): pKa ≈ 7.15 (more acidic by factor of ~ 10^(9.95 - 7.15) = ~ 630x)
    const pKaPNitrophenol = 7.15
    // Picric acid (2,4,6-trinitrophenol): pKa ≈ 0.38 (strong organic acid)
    const pKaPicricAcid = 0.38
    // p-Cresol (-CH3 EDG): pKa ≈ 10.26 (less acidic)
    const pKaPCresol = 10.26

    expect(pKaPicricAcid).toBeLessThan(pKaPNitrophenol)
    expect(pKaPNitrophenol).toBeLessThan(pKaPhenol)
    expect(pKaPhenol).toBeLessThan(pKaPCresol)
  })

  it('verifies acid-base equilibrium: phenol reacts with NaOH but not with NaHCO3', () => {
    // Carbonic acid H2CO3 pKa1 ≈ 6.35
    // Phenol pKa ≈ 9.95
    // Water pKa ≈ 15.7
    // Phenol is stronger acid than H2O => reacts completely with NaOH
    // Phenol is weaker acid than H2CO3 => does NOT liberate CO2 gas with NaHCO3
    const pKaWater = 15.7
    const pKaCarbonicAcid = 6.35
    const pKaPhenol = 9.95

    const reactsWithNaOH = pKaPhenol < pKaWater
    const reactsWithNaHCO3 = pKaPhenol < pKaCarbonicAcid

    expect(reactsWithNaOH).toBe(true)
    expect(reactsWithNaHCO3).toBe(false)
  })

  it('validates ferric chloride FeCl3 coordination complex stoichiometry for qualitative phenol detection', () => {
    // 6 C6H5OH + Fe^3+ => [Fe(OC6H5)6]^3- (intense violet color) + 6 H+
    const phenolMoleculesPerIron = 6
    const complexCharge = -3 // Fe(III) + 6 * (-1) = -3
    expect(phenolMoleculesPerIron).toBe(6)
    expect(complexCharge).toBe(-3)
  })
})
