import { describe, it, expect } from 'vitest'

describe('Physics Hall Effect, Carrier Density & Magnetic Sensing Tests', () => {
  it('calculates Hall voltage and identifies carrier sign in n-type semiconductor', () => {
    // Current I = 10 mA = 0.010 A
    // Magnetic field B = 0.50 T
    // Wafer thickness d = 0.10 mm = 1.0e-4 m
    // Electron density n = 1.0e21 m^-3
    // Elementary charge q = -1.60217663e-19 C
    const current = 0.010 // A
    const bField = 0.50 // T
    const thickness = 1.0e-4 // m
    const carrierDensity = 1.0e21 // m^-3
    const qElectron = -1.60217663e-19 // C

    // VH = (I * B) / (n * q * d)
    const hallVoltage = (current * bField) / (carrierDensity * qElectron * thickness) // ~ -0.31207 V
    const hallVoltageMv = hallVoltage * 1000

    expect(hallVoltageMv).toBeCloseTo(-312.1, 1)
    expect(hallVoltage).toBeLessThan(0) // Negative polarity confirms electron carrier

    // Hall coefficient RH = 1 / (n * q)
    const hallCoefficient = 1 / (carrierDensity * qElectron) // ~ -6.24e-3 m^3/C
    expect(hallCoefficient).toBeCloseTo(-0.00624, 5)
  })

  it('determines microscopic drift velocity vd from Hall electric field and magnetic field', () => {
    // At equilibrium, Lorentz force equals Hall electrostatic force: q * vd * B = q * EH => vd = EH / B
    const bField = 0.50 // T
    const width = 0.005 // m (5 mm wide semiconductor bar)
    const hallVoltage = 0.3121 // V (magnitude)

    // Hall electric field EH = VH / width
    const hallField = hallVoltage / width // 0.3121 / 0.005 = 62.42 V/m
    expect(hallField).toBeCloseTo(62.42, 2)

    // Drift velocity vd = EH / B
    const driftVelocity = hallField / bField // 62.42 / 0.50 = 124.84 m/s
    expect(driftVelocity).toBeCloseTo(124.84, 2)
  })

  it('verifies negligible nanovolt Hall voltage in metals due to ultra-high carrier density', () => {
    // Pure Copper: n = 8.49e28 m^-3
    const current = 1.0 // A
    const bField = 1.0 // T
    const thickness = 1.0e-3 // m (1 mm)
    const carrierDensityCopper = 8.49e28 // m^-3
    const qCharge = 1.60217663e-19 // C

    // VH = (I * B) / (n * q * d)
    const hallVoltageMetal = (current * bField) / (carrierDensityCopper * qCharge * thickness) // ~ 7.35e-8 V = 73.5 nV
    const hallVoltageNv = hallVoltageMetal * 1e9

    expect(hallVoltageNv).toBeCloseTo(73.5, 1)
    expect(hallVoltageMetal).toBeLessThan(1e-6) // < 1 uV, explaining why semiconductors are preferred for Hall sensors
  })
})
