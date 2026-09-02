import { describe, it, expect } from 'vitest'

describe('Physics AC Series RLC Circuit & Resonance Tests', () => {
  it('calculates natural resonant angular frequency and cyclic frequency', () => {
    // R = 10.0 Ohm, L = 0.25 H (250 mH), C = 10.0 uF = 1.0e-5 F
    const inductance = 0.25 // H
    const capacitance = 1.0e-5 // F

    // omega0 = 1 / sqrt(L * C)
    const omega0 = 1 / Math.sqrt(inductance * capacitance) // ~ 632.456 rad/s
    expect(omega0).toBeCloseTo(632.46, 2)

    // f0 = omega0 / (2 * pi)
    const f0 = omega0 / (2 * Math.PI) // ~ 100.66 Hz
    expect(f0).toBeCloseTo(100.66, 2)
  })

  it('proves zero net reactance, minimum impedance Z = R and zero phase shift at resonance', () => {
    const resistance = 10.0 // Ohm
    const inductance = 0.25 // H
    const capacitance = 1.0e-5 // F
    const omega0 = 1 / Math.sqrt(inductance * capacitance)

    // Inductive reactance XL = omega * L
    const xL = omega0 * inductance // ~ 158.11 Ohm
    // Capacitive reactance XC = 1 / (omega * C)
    const xC = 1 / (omega0 * capacitance) // ~ 158.11 Ohm

    expect(xL).toBeCloseTo(158.11, 2)
    expect(xC).toBeCloseTo(158.11, 2)
    expect(Math.abs(xL - xC)).toBeCloseTo(0, 5)

    // Total impedance Z = sqrt(R^2 + (XL - XC)^2) = R
    const impedanceResonance = Math.sqrt(Math.pow(resistance, 2) + Math.pow(xL - xC, 2))
    expect(impedanceResonance).toBe(resistance)

    // Phase angle phi = arctan((XL - XC) / R) = 0
    const phaseRad = Math.atan((xL - xC) / resistance)
    expect(phaseRad).toBe(0)
  })

  it('determines Quality Factor Q and half-power bandwidth Delta omega = R / L', () => {
    const resistance = 10.0 // Ohm
    const inductance = 0.25 // H
    const capacitance = 1.0e-5 // F
    const omega0 = 1 / Math.sqrt(inductance * capacitance)

    // Q = omega0 * L / R
    const qualityFactor = (omega0 * inductance) / resistance // ~ 15.811
    expect(qualityFactor).toBeCloseTo(15.81, 2)

    // Equivalent formula Q = (1 / R) * sqrt(L / C)
    const qEquivalent = (1 / resistance) * Math.sqrt(inductance / capacitance)
    expect(qEquivalent).toBeCloseTo(15.81, 2)

    // Bandwidth Delta omega = omega0 / Q = R / L
    const deltaOmega = omega0 / qualityFactor // 40.0 rad/s
    expect(deltaOmega).toBeCloseTo(40.0, 3)
    expect(resistance / inductance).toBeCloseTo(40.0, 3)
  })
})
