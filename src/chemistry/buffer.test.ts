import { describe, it, expect } from 'vitest'

describe('Chemistry Buffer Solutions & Henderson-Hasselbalch Tests', () => {
  it('calculates pH of acetic acid / sodium acetate buffer and its resistance to strong acid HCl', () => {
    // pKa of acetic acid = 4.76
    const pKa = 4.76

    // Initial equimolar buffer: [HA] = 0.10 M, [A-] = 0.10 M
    const initialHa = 0.10 // M
    const initialA = 0.10 // M
    const initialPh = pKa + Math.log10(initialA / initialHa)
    expect(initialPh).toBeCloseTo(4.76, 2)

    // Add 0.010 mol HCl to 1.0 L of buffer:
    // A- + H+ -> HA
    const deltaH = 0.010 // mol/L
    const newA = initialA - deltaH // 0.090 M
    const newHa = initialHa + deltaH // 0.110 M
    const bufferedPh = pKa + Math.log10(newA / newHa) // 4.76 + log10(0.09/0.11) ≈ 4.673

    expect(bufferedPh).toBeCloseTo(4.67, 2)
    // pH shift is minimal (< 0.10 pH units)
    expect(Math.abs(bufferedPh - initialPh)).toBeLessThan(0.10)

    // Contrast with unbuffered pure water: adding 0.010 M HCl drops pH from 7.00 down to 2.00
    const unbufferedPh = -Math.log10(0.010) // 2.00
    expect(unbufferedPh).toBe(2.0)
  })

  it('determines buffer response to addition of strong base NaOH', () => {
    const pKa = 4.76
    const initialHa = 0.10
    const initialA = 0.10

    // Add 0.010 mol NaOH to 1.0 L of buffer:
    // HA + OH- -> A- + H2O
    const deltaOh = 0.010
    const newHa = initialHa - deltaOh // 0.090 M
    const newA = initialA + deltaOh // 0.110 M
    const bufferedPh = pKa + Math.log10(newA / newHa) // 4.76 + log10(0.11/0.09) ≈ 4.847

    expect(bufferedPh).toBeCloseTo(4.85, 2)
    expect(bufferedPh - 4.76).toBeCloseTo(0.087, 2)
  })

  it('verifies human blood physiological carbonic acid / bicarbonate buffer pH = 7.40', () => {
    // pKa of H2CO3 in plasma = 6.10
    const pKaBlood = 6.10

    // Typical arterial blood plasma concentrations:
    // [HCO3-] ≈ 24.0 mmol/L (mM)
    // [H2CO3 / dissolved CO2] ≈ 1.20 mmol/L (mM)
    const hco3Conc = 24.0
    const h2co3Conc = 1.20
    const ratio = hco3Conc / h2co3Conc // 20.0

    // pH = pKa + log10([HCO3-] / [H2CO3])
    const bloodPh = pKaBlood + Math.log10(ratio) // 6.10 + 1.301 = 7.401
    expect(bloodPh).toBeCloseTo(7.40, 2)

    // A ratio of 20:1 provides substantial buffer reserve against metabolic lactic acidosis
    expect(ratio).toBe(20)
  })
})
