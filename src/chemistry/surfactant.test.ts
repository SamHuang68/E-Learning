import { describe, it, expect } from 'vitest'

describe('Chemistry Surfactants, Critical Micelle Concentration & HLB Tests', () => {
  it('calculates Sodium Dodecyl Sulfate (SDS) mass concentration at CMC in grams per liter', () => {
    // SDS (NaC12H25SO4): MW = 288.37 g/mol
    // CMC in pure water at 25 °C ≈ 8.2 mM = 8.2e-3 mol/L
    const mwSds = 288.37 // g/mol
    const cmcMolar = 8.2e-3 // mol/L

    // Mass concentration = Molarity * MW (g/L)
    const massConcGPerL = cmcMolar * mwSds // ~ 2.3646 g/L
    expect(massConcGPerL).toBeCloseTo(2.36, 2)
    expect(massConcGPerL).toBeGreaterThan(2.0)
    expect(massConcGPerL).toBeLessThan(3.0)
  })

  it('evaluates surface tension inflection point before and above CMC plateau', () => {
    const gammaPureWater = 72.0 // mN/m at 25 °C
    const gammaPlateau = 38.0 // mN/m above CMC
    const cmcMolar = 8.2e-3 // mol/L

    // Function simulating surface tension vs log concentration
    function getSurfaceTension(conc: number): number {
      if (conc <= 0) return gammaPureWater
      if (conc >= cmcMolar) return gammaPlateau
      // Linear decrease with log concentration
      const progress = Math.log10(conc / 1e-5) / Math.log10(cmcMolar / 1e-5)
      return gammaPureWater - progress * (gammaPureWater - gammaPlateau)
    }

    // 1. Below CMC (1.0 mM): surface tension intermediate
    const gammaSubCmc = getSurfaceTension(1.0e-3)
    expect(gammaSubCmc).toBeLessThan(gammaPureWater)
    expect(gammaSubCmc).toBeGreaterThan(gammaPlateau)

    // 2. At and above CMC (10 mM & 50 mM): clamped at plateau
    expect(getSurfaceTension(1.0e-2)).toBe(gammaPlateau)
    expect(getSurfaceTension(5.0e-2)).toBe(gammaPlateau)
  })

  it('determines Griffin HLB value and classifies emulsion type (W/O vs O/W)', () => {
    // Griffin HLB formula: HLB = 20 * (M_hydrophilic / M_total)

    // Case 1: Non-ionic surfactant with Hydrophilic MW = 600, Total MW = 1000
    const mHydrophilic1 = 600
    const mTotal1 = 1000
    const hlb1 = 20 * (mHydrophilic1 / mTotal1) // 12.0
    expect(hlb1).toBe(12.0)
    // HLB 8 ~ 16 classifies as Oil-in-Water (O/W) emulsifier
    const isOilInWater = hlb1 >= 8 && hlb1 <= 16
    expect(isOilInWater).toBe(true)

    // Case 2: Hydrophobic lipophilic surfactant: Hydrophilic MW = 200, Total MW = 1000
    const mHydrophilic2 = 200
    const mTotal2 = 1000
    const hlb2 = 20 * (mHydrophilic2 / mTotal2) // 4.0
    expect(hlb2).toBe(4.0)
    // HLB 3 ~ 6 classifies as Water-in-Oil (W/O) emulsifier
    const isWaterInOil = hlb2 >= 3 && hlb2 <= 6
    expect(isWaterInOil).toBe(true)
  })
})
