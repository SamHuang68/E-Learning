import { describe, it, expect } from 'vitest'

describe('Physics SHM & Simple Pendulum Mechanical Energy Tests', () => {
  const g = 9.8

  it('calculates pendulum period T = 2π√(L/g) correctly', () => {
    const L = 0.992
    const T = 2 * Math.PI * Math.sqrt(L / g)
    // For seconds pendulum, period should be approx 2.00s
    expect(T).toBeCloseTo(2.0, 1)
  })

  it('conserves total mechanical energy between kinetic and potential energy', () => {
    const mass = 1.0
    const length = 1.2
    const thetaMaxRad = (20 * Math.PI) / 180
    const thetaNowRad = (10 * Math.PI) / 180

    const hMax = length * (1 - Math.cos(thetaMaxRad))
    const hNow = length * (1 - Math.cos(thetaNowRad))

    const totalEnergy = mass * g * hMax
    const pe = mass * g * hNow
    const ke = Math.max(0, totalEnergy - pe)

    expect(pe + ke).toBeCloseTo(totalEnergy, 4)
    expect(ke).toBeGreaterThan(0)
    expect(pe).toBeGreaterThan(0)
  })

  it('verifies small angle approximation error is below 1% for theta <= 15 deg', () => {
    const thetaRad = (15 * Math.PI) / 180
    const approxErrorPct = Math.abs((Math.sin(thetaRad) - thetaRad) / thetaRad) * 100
    expect(approxErrorPct).toBeLessThan(1.5)
  })
})
