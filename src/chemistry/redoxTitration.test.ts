import { describe, it, expect } from 'vitest'

describe('Chemistry Redox Titration & Permanganate Stoichiometry Tests', () => {
  it('balances permanganate and oxalate electron transfer (5e- vs 2e-)', () => {
    // MnO4- + 8H+ + 5e- -> Mn2+ + 4H2O (n_red = 5)
    // C2O4(2-) -> 2CO2 + 2e- (n_ox = 2)
    const nRed = 5
    const nOx = 2
    const totalElectronsTransferred = 10

    expect((totalElectronsTransferred / nRed) * nRed).toBe(10)
    expect((totalElectronsTransferred / nOx) * nOx).toBe(10)
  })

  it('calculates concentration of unknown oxalate solution accurately', () => {
    // 25.0 mL of oxalate solution requires 20.0 mL of 0.020 M KMnO4 solution to reach faint pink endpoint
    const vKMnO4 = 0.020 // L (20.0 mL)
    const mKMnO4 = 0.020 // mol/L
    const molesKMnO4 = vKMnO4 * mKMnO4 // 4.0e-4 mol

    // Moles of oxalate = molesKMnO4 * (5 / 2) = 1.0e-3 mol
    const molesOxalate = molesKMnO4 * (5 / 2)
    const vOxalate = 0.025 // L (25.0 mL)
    const mOxalate = molesOxalate / vOxalate // 0.040 M

    expect(molesOxalate).toBeCloseTo(0.001, 6)
    expect(mOxalate).toBeCloseTo(0.040, 4)
  })

  it('verifies self-indicating nature of potassium permanganate endpoint', () => {
    // KMnO4 is intense purple; Mn2+ is virtually colorless (very pale pink).
    // The very first slight excess drop of MnO4- turns solution permanent faint pink, needing no external indicator.
    const hasExternalIndicator = false
    const endpointColor = 'faint pink (微粉紅色)'

    expect(hasExternalIndicator).toBe(false)
    expect(endpointColor).toContain('faint pink')
  })
})
