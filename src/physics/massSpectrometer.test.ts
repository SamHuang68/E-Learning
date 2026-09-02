import { describe, it, expect } from 'vitest'

describe('Physics Mass Spectrometry Velocity Selector, Deflection & Cyclotron Resonance Tests', () => {
  it('selects unique particle speed independent of charge and mass in crossed E & B fields', () => {
    // Electric field E = 1.2e5 V/m
    // Magnetic field B1 = 0.40 T
    const E = 1.2e5 // V/m
    const B1 = 0.40 // T

    // Velocity selector balance: q*E = q*v*B1 => v = E / B1
    const v = E / B1 // 3.0e5 m/s
    expect(v).toBe(3.0e5)
  })

  it('resolves Lithium-6 and Lithium-7 isotopes by spatial diameter separation on detector plate', () => {
    const v = 3.0e5 // m/s
    const B2 = 0.50 // T
    const q = 1.602e-19 // C
    const u = 1.6605e-27 // kg per atomic mass unit

    // 6Li+: m = 6.015 u, 7Li+: m = 7.016 u
    const m6 = 6.015 * u // ~ 9.9879e-27 kg
    const m7 = 7.016 * u // ~ 11.650e-27 kg

    // Radius R = m * v / (q * B2)
    const R6 = (m6 * v) / (q * B2) // ~ 0.03741 m (3.74 cm)
    const R7 = (m7 * v) / (q * B2) // ~ 0.04363 m (4.36 cm)

    expect(R6).toBeCloseTo(0.0374, 4)
    expect(R7).toBeCloseTo(0.0436, 4)

    // Separation distance between impact spots on photographic plate delta_D = 2 * (R7 - R6)
    const deltaD = 2 * (R7 - R6) // ~ 0.01245 m (1.25 cm)
    expect(deltaD).toBeCloseTo(0.0125, 4)
    expect(deltaD * 100).toBeGreaterThan(1.0) // > 1 cm resolution
  })

  it('calculates cyclotron RF frequency and maximum relativistic kinetic energy of accelerated protons', () => {
    const B = 1.50 // T
    const q = 1.602e-19 // C
    const mp = 1.673e-27 // kg
    const Rmax = 0.80 // m (Dee radius)

    // Cyclotron resonance frequency f = q * B / (2 * pi * mp)
    const f = (q * B) / (2 * Math.PI * mp) // ~ 22.86 MHz
    expect(f / 1.0e6).toBeCloseTo(22.86, 2)

    // Maximum kinetic energy Ek_max = (q * B * Rmax)^2 / (2 * mp)
    const EkJoules = Math.pow(q * B * Rmax, 2) / (2 * mp) // ~ 1.104e-11 J
    const EkMeV = EkJoules / (1.602e-19 * 1.0e6) // ~ 68.94 MeV
    expect(EkMeV).toBeCloseTo(68.9, 1)
  })
})
