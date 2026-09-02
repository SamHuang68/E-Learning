import { describe, it, expect } from 'vitest'

describe('Physics Polarization, Malus Law, Three-Polarizer Paradox & Brewster Angle Tests', () => {
  it('calculates transmission of unpolarized light through a single linear polarizer', () => {
    // Unpolarized light intensity I0
    const I0 = 100.0 // W/m^2

    // Average of cos^2(theta) over 0 to 2*pi is exactly 0.5
    const I1 = 0.5 * I0
    expect(I1).toBe(50.0)
  })

  it('demonstrates Malus Law and complete extinction with crossed polarizers at 90 degrees', () => {
    const I1 = 50.0 // after first polarizer

    // Malus Law: I = I1 * cos^2(theta)
    const theta60Rad = (60 * Math.PI) / 180
    const I_60deg = I1 * Math.pow(Math.cos(theta60Rad), 2) // 50 * 0.25 = 12.5 W/m^2
    expect(I_60deg).toBeCloseTo(12.5, 2)

    // Crossed polarizers at 90 degrees => zero intensity
    const theta90Rad = (90 * Math.PI) / 180
    const I_90deg = I1 * Math.pow(Math.cos(theta90Rad), 2) // 0.0
    expect(I_90deg).toBeCloseTo(0.0, 5)
  })

  it('verifies the three-polarizer paradox where inserting a 45-degree polarizer restores light transmission', () => {
    const I0 = 100.0
    const I1 = 0.5 * I0 // 50.0 W/m^2 at 0 degrees

    // Insert 2nd polarizer at 45 degrees:
    const theta45Rad = (45 * Math.PI) / 180
    const I2 = I1 * Math.pow(Math.cos(theta45Rad), 2) // 50 * 0.5 = 25.0 W/m^2
    expect(I2).toBeCloseTo(25.0, 2)

    // 3rd polarizer at 90 degrees (relative angle to 2nd is 90 - 45 = 45 degrees):
    const I3 = I2 * Math.pow(Math.cos(theta45Rad), 2) // 25 * 0.5 = 12.5 W/m^2
    expect(I3).toBeCloseTo(12.5, 2)
    expect(I3 / I0).toBeCloseTo(0.125, 3) // Exactly 12.5% of incident unpolarized light transmitted!
  })

  it('computes Brewsters polarization angle for glass and verifies orthogonal reflected & refracted rays', () => {
    const n1 = 1.0 // Air
    const n2 = 1.52 // Crown glass

    // tan(thetaB) = n2 / n1
    const thetaBRad = Math.atan(n2 / n1)
    const thetaBDeg = (thetaBRad * 180) / Math.PI // ~ 56.66 degrees
    expect(thetaBDeg).toBeCloseTo(56.66, 2)

    // Refraction angle theta_r = 90 - thetaB
    const thetaRRad = Math.PI / 2 - thetaBRad
    const thetaRDeg = (thetaRRad * 180) / Math.PI // ~ 33.34 degrees
    expect(thetaRDeg).toBeCloseTo(33.34, 2)
    expect(thetaBDeg + thetaRDeg).toBeCloseTo(90.0, 5)
  })
})
