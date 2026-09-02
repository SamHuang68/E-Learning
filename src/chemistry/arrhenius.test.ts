import { describe, it, expect } from 'vitest'

describe('Chemistry Arrhenius Equation, Activation Energy & Catalysis Tests', () => {
  it('calculates activation energy Ea from rate doubling between 25 °C and 35 °C', () => {
    // Standard rule of thumb: reaction rate doubles (k2 / k1 = 2.0) for every 10 °C rise
    const rGas = 8.31446 // J / (mol * K)
    const t1 = 25 + 273.15 // 298.15 K
    const t2 = 35 + 273.15 // 308.15 K
    const rateRatio = 2.0

    // ln(k2 / k1) = (Ea / R) * (1/T1 - 1/T2)
    // Ea = (R * ln(rateRatio)) / (1/T1 - 1/T2)
    const invTempDiff = 1 / t1 - 1 / t2 // ~ 1.089e-4 K^-1
    const eaJoules = (rGas * Math.log(rateRatio)) / invTempDiff // ~ 52893 J/mol
    const eaKjPerMol = eaJoules / 1000 // ~ 52.89 kJ/mol

    expect(eaKjPerMol).toBeCloseTo(52.9, 1)
    expect(eaKjPerMol).toBeGreaterThan(50.0)
    expect(eaKjPerMol).toBeLessThan(55.0)
  })

  it('determines catalytic rate acceleration factor for lowered activation energy', () => {
    // Hydrogen peroxide decomposition:
    // Uncatalyzed Ea = 75.0 kJ/mol (75,000 J/mol)
    // Catalyzed Ea = 56.0 kJ/mol (56,000 J/mol) with MnO2 / Pt catalyst
    const rGas = 8.31446 // J / (mol * K)
    const tempK = 298.15 // 25 °C
    const eaUncatalyzed = 75000 // J/mol
    const eaCatalyzed = 56000 // J/mol

    // deltaEa = eaUncatalyzed - eaCatalyzed = 19,000 J/mol
    const deltaEa = eaUncatalyzed - eaCatalyzed // 19000 J/mol
    expect(deltaEa).toBe(19000)

    // Rate acceleration factor = exp(deltaEa / (R * T))
    const accelerationFactor = Math.exp(deltaEa / (rGas * tempK)) // ~ 2133.6
    expect(accelerationFactor).toBeGreaterThan(2000)
    expect(accelerationFactor).toBeLessThan(2300)
    expect(Math.round(accelerationFactor)).toBe(2131)
  })

  it('verifies reaction rate constant ratio k2/k1 at elevated industrial temperature (500 K vs 300 K)', () => {
    const rGas = 8.31446
    const t1 = 300.0 // K
    const t2 = 500.0 // K
    const ea = 60000 // 60 kJ/mol

    // ln(k2 / k1) = (Ea / R) * (1/300 - 1/500) = (60000 / 8.31446) * (200 / 150000) = 7216.35 * 0.0013333 ≈ 9.6218
    const lnRatio = (ea / rGas) * (1 / t1 - 1 / t2)
    const ratio = Math.exp(lnRatio) // ~ 15090

    expect(lnRatio).toBeCloseTo(9.62, 2)
    expect(ratio).toBeGreaterThan(10000)
    expect(ratio).toBeLessThan(20000)
  })
})
