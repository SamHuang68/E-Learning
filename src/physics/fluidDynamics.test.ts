import { describe, it, expect } from 'vitest'

describe('Physics Fluid Dynamics, Bernoulli Equation & Torricelli Law Tests', () => {
  it('calculates velocity increase from continuity equation A1 * v1 = A2 * v2 in constricted pipe', () => {
    // Water flows through pipe: d1 = 10.0 cm, d2 = 5.0 cm
    const d1 = 0.10 // m
    const d2 = 0.05 // m
    const v1 = 1.0 // m/s

    const area1 = (Math.PI * Math.pow(d1, 2)) / 4 // ~ 0.007854 m^2
    const area2 = (Math.PI * Math.pow(d2, 2)) / 4 // ~ 0.001963 m^2

    // v2 = v1 * (area1 / area2) = v1 * (d1 / d2)^2
    const v2 = v1 * (area1 / area2)
    expect(v2).toBeCloseTo(4.0, 3)

    // Flow rate Q = A * v (constant)
    const q1 = area1 * v1
    const q2 = area2 * v2
    expect(q1).toBeCloseTo(q2, 6)
  })

  it('determines Venturi pressure drop Delta P via Bernoulli Equation for horizontal flow', () => {
    const rhoWater = 1000 // kg/m^3
    const v1 = 1.0 // m/s
    const v2 = 4.0 // m/s

    // P1 + 0.5 * rho * v1^2 = P2 + 0.5 * rho * v2^2
    // Delta P = P1 - P2 = 0.5 * rho * (v2^2 - v1^2)
    const deltaPressurePascals = 0.5 * rhoWater * (Math.pow(v2, 2) - Math.pow(v1, 2)) // 0.5 * 1000 * 15 = 7500 Pa
    expect(deltaPressurePascals).toBe(7500)

    // Pressure drop in kPa
    const deltaPKpa = deltaPressurePascals / 1000
    expect(deltaPKpa).toBe(7.5)
  })

  it('computes efflux speed from an open tank orifice via Torricelli Law v = sqrt(2 * g * h)', () => {
    // Tank water level h = 5.0 m above orifice
    const g = 9.80 // m/s^2
    const h = 5.0 // m

    // Efflux velocity v = sqrt(2 * g * h)
    const effluxSpeed = Math.sqrt(2 * g * h) // sqrt(98) ≈ 9.8995 m/s
    expect(effluxSpeed).toBeCloseTo(9.90, 2)

    // Ideal volumetric discharge from a 2.0 cm diameter hole
    const holeRadius = 0.01 // m
    const holeArea = Math.PI * Math.pow(holeRadius, 2) // ~ 3.14e-4 m^2
    const flowRateM3PerSec = holeArea * effluxSpeed // ~ 0.00311 m^3/s (~ 3.11 L/s)
    expect(flowRateM3PerSec * 1000).toBeCloseTo(3.11, 2)
  })
})
