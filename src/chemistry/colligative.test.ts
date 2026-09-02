import { describe, it, expect } from 'vitest'

describe('Chemistry Colligative Properties & Osmotic Pressure Tests', () => {
  it('calculates freezing point depression delta_Tf = i * Kf * m for road de-icing salts', () => {
    // Water Kf = 1.86 °C*kg/mol
    const kfWater = 1.86 // °C*kg/mol

    // Adding 58.44 g NaCl (1.00 mol) into 1.00 kg water -> m = 1.00 mol/kg
    // Complete dissociation of NaCl: i = 2 (Na+ and Cl-)
    const mNaCl = 1.00 // mol/kg
    const iNaCl = 2.0
    const deltaTfNaCl = iNaCl * kfWater * mNaCl // 3.72 °C
    const freezingPointNaCl = 0.0 - deltaTfNaCl // -3.72 °C

    expect(deltaTfNaCl).toBeCloseTo(3.72, 2)
    expect(freezingPointNaCl).toBeCloseTo(-3.72, 2)

    // Adding 1.00 mol CaCl2 into 1.00 kg water -> i = 3 (Ca2+ and 2 Cl-)
    const iCaCl2 = 3.0
    const deltaTfCaCl2 = iCaCl2 * kfWater * mNaCl // 5.58 °C
    expect(deltaTfCaCl2).toBeCloseTo(5.58, 2)
    // Calcium chloride depresses freezing point 1.5 times more effectively per mole than sodium chloride
    expect(deltaTfCaCl2 / deltaTfNaCl).toBeCloseTo(1.5, 1)
  })

  it('determines boiling point elevation delta_Tb = i * Kb * m for non-volatile solute', () => {
    // Water Kb = 0.512 °C*kg/mol
    const kbWater = 0.512 // °C*kg/mol

    // 0.50 mol of glucose (non-electrolyte, i = 1) in 1.00 kg water
    const mGlucose = 0.50 // mol/kg
    const iGlucose = 1.0
    const deltaTb = iGlucose * kbWater * mGlucose // 0.256 °C
    const boilingPoint = 100.0 + deltaTb // 100.256 °C

    expect(deltaTb).toBeCloseTo(0.256, 3)
    expect(boilingPoint).toBeCloseTo(100.256, 3)
  })

  it('computes human physiological saline osmotic pressure Pi = i * C * R * T at body temperature', () => {
    // Physiological 0.90% (w/v) NaCl = 9.0 g NaCl per 1.0 L solution
    // Molar mass of NaCl = 58.44 g/mol -> Molarity C = 9.0 / 58.44 ≈ 0.154 mol/L
    const molarMassNaCl = 58.44 // g/mol
    const molarityNaCl = 9.0 / molarMassNaCl // ~ 0.1540 mol/L

    // Body temperature T = 37 °C = 310.15 K
    const tempK = 37 + 273.15 // 310.15 K
    const rGas = 0.082057 // L*atm / (mol*K)
    const iNaCl = 2.0 // Na+ and Cl-

    // Osmotic pressure Pi = i * C * R * T
    const osmoticPressureAtm = iNaCl * molarityNaCl * rGas * tempK // ~ 7.838 atm
    expect(osmoticPressureAtm).toBeCloseTo(7.84, 1)

    // Red blood cells placed in isotonic 0.9% saline maintain normal biconcave shape (no crenation or hemolysis)
    expect(osmoticPressureAtm).toBeGreaterThan(7.0)
    expect(osmoticPressureAtm).toBeLessThan(8.5)
  })
})
