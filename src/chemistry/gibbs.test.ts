import { describe, it, expect } from 'vitest'

describe('Chemistry Gibbs Free Energy & van t Hoff Equilibrium Tests', () => {
  it('calculates standard free energy Delta G° from equilibrium constant K at 298.15 K', () => {
    const rGas = 8.31446 // J / (mol * K)
    const tempK = 298.15 // K

    // 1. When K = 1.0 => Delta G° = 0
    const deltaGZero = -rGas * tempK * Math.log(1.0)
    expect(deltaGZero).toBeCloseTo(0, 5)

    // 2. Strongly favorable reaction: K = 1.0e5
    const kFavorable = 1.0e5
    const deltaGFavorableJ = -rGas * tempK * Math.log(kFavorable) // ~ -28540 J/mol
    const deltaGFavorableKj = deltaGFavorableJ / 1000
    expect(deltaGFavorableKj).toBeCloseTo(-28.54, 2)
    expect(deltaGFavorableKj).toBeLessThan(0)

    // 3. Unfavorable reaction: K = 1.0e-4
    const kUnfavorable = 1.0e-4
    const deltaGUnfavorableJ = -rGas * tempK * Math.log(kUnfavorable) // ~ +22832 J/mol
    const deltaGUnfavorableKj = deltaGUnfavorableJ / 1000
    expect(deltaGUnfavorableKj).toBeCloseTo(22.83, 2)
    expect(deltaGUnfavorableKj).toBeGreaterThan(0)
  })

  it('determines temperature dependence of Haber ammonia equilibrium constant via van t Hoff equation', () => {
    // N2 + 3H2 <=> 2NH3, Delta H° = -92.2 kJ/mol = -92200 J/mol (exothermic)
    const rGas = 8.31446
    const deltaH = -92200 // J/mol
    const t1 = 298.15 // K (25 °C)
    const t2 = 673.15 // K (400 °C)

    // ln(K2 / K1) = (Delta H° / R) * (1/T1 - 1/T2)
    const invTempDiff = 1 / t1 - 1 / t2 // ~ 0.0018684 K^-1
    const lnRatio = (deltaH / rGas) * invTempDiff // ~ -20.72
    expect(lnRatio).toBeCloseTo(-20.72, 1)

    // The ratio K2 / K1 is vastly smaller than 1 (equilibrium drops precipitously at high temperature)
    const ratio = Math.exp(lnRatio) // ~ 1.00e-9
    expect(ratio).toBeLessThan(1e-8)
    expect(ratio).toBeGreaterThan(0)
  })

  it('verifies standard cell potential relation Delta G° = -n * F * E°cell', () => {
    // Daniell cell: n = 2, E° = 1.100 V, F = 96485 C/mol
    const nElectrons = 2
    const faraday = 96485.33 // C / mol
    const eCell = 1.100 // V

    // Delta G° = -n * F * E° (J/mol)
    const deltaGJ = -nElectrons * faraday * eCell // ~ -212267 J/mol
    const deltaGKj = deltaGJ / 1000 // ~ -212.27 kJ/mol

    expect(deltaGKj).toBeCloseTo(-212.27, 1)
    expect(deltaGKj).toBeLessThan(-200)
  })
})
