import { describe, it, expect } from 'vitest'

describe('Physics Transformers, Mutual Inductance & High-Voltage Grid Power Loss Tests', () => {
  it('verifies turns ratio and step-up output voltage for grid transmission', () => {
    // Primary winding Np = 500 turns, primary voltage Vp = 11.0 kV (11,000 V)
    // Secondary winding Ns = 15,000 turns
    const Np = 500
    const Ns = 15000
    const Vp = 11000 // V

    const turnsRatio = Ns / Np // 30
    expect(turnsRatio).toBe(30)

    // Secondary voltage Vs = Vp * (Ns / Np)
    const Vs = Vp * turnsRatio // 330,000 V (330 kV)
    expect(Vs).toBe(330000)
  })

  it('proves transmission Joule heating power loss reduction is proportional to (1 / turnsRatio)^2', () => {
    // Power to transmit P = 66.0 MW (6.6e7 W)
    // Line resistance R_line = 8.0 ohms
    const power = 6.6e7 // W
    const rLine = 8.0 // ohms

    // Current at 11 kV without step-up
    const I_low = power / 11000 // 6000 A
    expect(I_low).toBe(6000)

    // Current at 330 kV with step-up
    const I_high = power / 330000 // 200 A
    expect(I_high).toBe(200)
    expect(I_low / I_high).toBe(30) // Current reduced 30-fold

    // Joule heating loss Ploss = I^2 * R
    const lossLow = I_low * I_low * rLine // 288 MW (catastrophic)
    const lossHigh = I_high * I_high * rLine // 320,000 W (0.32 MW)

    expect(lossLow).toBe(2.88e8)
    expect(lossHigh).toBe(3.2e5)

    // Loss reduction ratio = 30^2 = 900
    const lossReductionFactor = lossLow / lossHigh
    expect(lossReductionFactor).toBe(900)

    // Efficiency at high voltage
    const lossFractionHighVoltage = lossHigh / power // ~ 0.00485 (0.485%)
    expect(lossFractionHighVoltage).toBeLessThan(0.005)
  })

  it('calculates residential step-down transformer turns ratio for 110V output', () => {
    // Distribution line 22,000 V (22 kV) to residential 110 V
    const vDistribution = 22000 // V
    const vResidential = 110 // V

    const stepDownRatio = vDistribution / vResidential // 200 : 1
    expect(stepDownRatio).toBe(200)
  })
})
