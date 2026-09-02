import { describe, it, expect } from 'vitest'

describe('Physics LC Circuit Oscillations, Energy Conservation & Radiated EM Waves Tests', () => {
  it('calculates LC circuit resonant frequency and AM radio band frequency', () => {
    // Inductance L = 50.0 uH (5.0e-5 H)
    // Capacitance C = 200.0 pF (2.0e-10 F)
    const L = 5.0e-5 // H
    const C = 2.0e-10 // F

    // LC product = 1.0e-14 s^2 => sqrt(LC) = 1.0e-7 s
    const omega0 = 1 / Math.sqrt(L * C) // 1.0e7 rad/s
    expect(omega0).toBeCloseTo(1.0e7, 1)

    // Frequency f0 = omega0 / (2 * pi)
    const f0 = omega0 / (2 * Math.PI) // ~ 1,591,549 Hz (~ 1.59 MHz)
    expect(f0).toBeCloseTo(1591549.43, 2)
  })

  it('demonstrates strict electromagnetic energy conservation between capacitor and inductor', () => {
    const L = 5.0e-5 // H
    const C = 2.0e-10 // F
    const omega0 = 1.0e7 // rad/s
    const Q0 = 6.0e-6 // C (6.0 uC)

    // Maximum electric field energy in capacitor: UE_max = Q0^2 / (2 * C)
    const UEMax = (Q0 * Q0) / (2 * C) // 0.090 J (90.0 mJ)
    expect(UEMax).toBeCloseTo(0.090, 5)

    // Peak current I0 = omega0 * Q0
    const I0 = omega0 * Q0 // 60.0 A
    expect(I0).toBeCloseTo(60.0, 3)

    // Maximum magnetic field energy in inductor: UB_max = 0.5 * L * I0^2
    const UBMax = 0.5 * L * (I0 * I0) // 0.090 J
    expect(UBMax).toBeCloseTo(0.090, 5)
    expect(UEMax).toBe(UBMax)

    // Check at an intermediate phase angle theta = pi/3 (cos^2 = 0.25, sin^2 = 0.75):
    const q_t = Q0 * Math.cos(Math.PI / 3) // Q0 / 2
    const i_t = -I0 * Math.sin(Math.PI / 3) // -I0 * sqrt(3) / 2

    const uE_instant = (q_t * q_t) / (2 * C) // 0.25 * UEMax
    const uB_instant = 0.5 * L * (i_t * i_t) // 0.75 * UBMax
    const totalEnergy = uE_instant + uB_instant

    expect(totalEnergy).toBeCloseTo(0.090, 5)
  })

  it('computes radiated electromagnetic wavelength for broadcast transmission', () => {
    const c = 3.0e8 // m/s
    const f0 = 1.0e7 / (2 * Math.PI) // ~ 1.591549e6 Hz

    // Wavelength lambda = c / f0 = 2 * pi * c * sqrt(LC)
    const lambda = c / f0 // ~ 188.50 m
    expect(lambda).toBeCloseTo(188.50, 2)
  })
})
