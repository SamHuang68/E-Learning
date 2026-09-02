import { describe, it, expect } from 'vitest'

describe('Physics Special Relativity & Lorentz Transformation Tests', () => {
  it('calculates Lorentz factor gamma = 1 / sqrt(1 - v^2/c^2) correctly', () => {
    // When v = 0.6 c: gamma = 1 / sqrt(1 - 0.36) = 1 / 0.8 = 1.25
    const v1 = 0.6 // fraction of c
    const gamma1 = 1 / Math.sqrt(1 - v1 * v1)
    expect(gamma1).toBeCloseTo(1.25, 3)

    // When v = 0.8 c: gamma = 1 / sqrt(1 - 0.64) = 1 / 0.6 = 1.667
    const v2 = 0.8
    const gamma2 = 1 / Math.sqrt(1 - v2 * v2)
    expect(gamma2).toBeCloseTo(1.6667, 3)
  })

  it('determines time dilation and length contraction for relativistic particles', () => {
    // Muon lifetime at rest t0 = 2.2 microseconds
    // Traveling at v = 0.99 c: gamma = 1 / sqrt(1 - 0.99^2) ≈ 7.089
    const t0 = 2.2 // microseconds
    const v = 0.99
    const gamma = 1 / Math.sqrt(1 - v * v)
    const dilatedLifetime = gamma * t0 // ~ 15.6 microseconds

    expect(dilatedLifetime).toBeCloseTo(15.6, 1)

    // Length contraction: A 100-meter spaceship moving at v = 0.8 c (gamma = 1.25)
    // contracted length L = L0 / gamma = 100 / (1 / 0.6) = 60 meters
    const l0 = 100 // meters
    const vShip = 0.8
    const gammaShip = 1 / Math.sqrt(1 - vShip * vShip)
    const contractedLength = l0 / gammaShip
    expect(contractedLength).toBeCloseTo(60, 2)
  })

  it('verifies relativistic total energy E = gamma * m0 * c^2 and rest energy relationship', () => {
    // When v = 0.6 c, gamma = 1.25
    // Kinetic energy Ek = (gamma - 1) * m0 * c^2 = 0.25 * E0
    const v = 0.6
    const gamma = 1 / Math.sqrt(1 - v * v)
    const kineticRatio = gamma - 1
    expect(kineticRatio).toBeCloseTo(0.25, 3)
  })
})
