import { describe, it, expect } from 'vitest'

describe('Physics Ampere Circuital Law & Solenoid Magnetic Field Tests', () => {
  it('calculates magnetic flux density B at distance r from a long straight current wire', () => {
    // Current I = 10.0 A
    // Distance r = 5.0 cm = 0.050 m
    // mu0 = 4 * pi * 1e-7 T*m/A
    const current = 10.0 // A
    const distance = 0.050 // m
    const mu0 = 4 * Math.PI * 1e-7 // T * m / A

    // B = (mu0 * I) / (2 * pi * r)
    const bFieldTeslas = (mu0 * current) / (2 * Math.PI * distance) // 4.0e-5 T
    const bFieldMicroTeslas = bFieldTeslas * 1e6 // 40.0 uT

    expect(bFieldMicroTeslas).toBeCloseTo(40.0, 3)
    expect(bFieldTeslas).toBeCloseTo(4.0e-5, 8)
  })

  it('determines uniform interior magnetic field B of a long solenoid via Ampere law', () => {
    // Solenoid length L = 0.50 m, N = 1000 turns => n = 2000 turns/m
    // Current I = 2.50 A
    const length = 0.50 // m
    const turns = 1000
    const current = 2.50 // A
    const mu0 = 4 * Math.PI * 1e-7

    const turnDensity = turns / length // 2000 m^-1
    expect(turnDensity).toBe(2000)

    // B = mu0 * n * I = (4 * pi * 1e-7) * 2000 * 2.50 = 2 * pi * 1e-3 T ≈ 6.283 mT
    const bFieldInterior = mu0 * turnDensity * current // ~ 0.00628318 T
    const bFieldMilliTeslas = bFieldInterior * 1000

    expect(bFieldMilliTeslas).toBeCloseTo(6.283, 3)
    expect(bFieldInterior).toBeGreaterThan(0.006)
  })

  it('computes toroid magnetic field and magnetic energy density uB = B^2 / (2 * mu0)', () => {
    const turns = 800
    const current = 3.0 // A
    const meanRadius = 0.10 // m (10 cm)
    const mu0 = 4 * Math.PI * 1e-7

    // B = (mu0 * N * I) / (2 * pi * r) = (4*pi*1e-7 * 800 * 3) / (2 * pi * 0.10)
    //   = (2 * 1e-7 * 2400) / 0.10 = 4.8e-3 T = 4.80 mT
    const bToroid = (mu0 * turns * current) / (2 * Math.PI * meanRadius) // 0.0048 T
    expect(bToroid * 1000).toBeCloseTo(4.80, 2)

    // Magnetic energy density uB = B^2 / (2 * mu0)
    const energyDensityJoulesPerM3 = Math.pow(bToroid, 2) / (2 * mu0) // ~ 9.167 J/m^3
    expect(energyDensityJoulesPerM3).toBeCloseTo(9.17, 2)
    expect(energyDensityJoulesPerM3).toBeGreaterThan(8.0)
  })
})
