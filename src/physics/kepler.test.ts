import { describe, it, expect } from 'vitest'

describe('Physics Kepler Planetary Laws & Orbital Mechanics Tests', () => {
  it('calculates orbital semimajor axis a and eccentricity e from perihelion and aphelion', () => {
    // Earth orbital parameters
    const rPerihelion = 147.09e6 // km
    const rAphelion = 152.10e6 // km

    // Semimajor axis a = (rp + ra) / 2
    const semimajorAxis = (rPerihelion + rAphelion) / 2 // ~ 149.595e6 km (1.00 AU)
    expect(semimajorAxis / 1e6).toBeCloseTo(149.6, 1)

    // Orbital eccentricity e = (ra - rp) / (ra + rp)
    const eccentricity = (rAphelion - rPerihelion) / (rAphelion + rPerihelion) // ~ 0.016745
    expect(eccentricity).toBeCloseTo(0.0167, 4)
  })

  it('validates equal areal velocity and angular momentum conservation (rp * vp = ra * va)', () => {
    const rPerihelion = 147.09e6 // km
    const rAphelion = 152.10e6 // km
    const vPerihelion = 30.29 // km/s

    // By Kepler second law / angular momentum conservation:
    // L = m * rp * vp = m * ra * va  =>  va = vp * (rp / ra)
    const vAphelion = vPerihelion * (rPerihelion / rAphelion) // ~ 29.29 km/s
    expect(vAphelion).toBeCloseTo(29.29, 2)

    // Specific angular momentum h = r * v
    const specificAngularMomentumPerihelion = rPerihelion * vPerihelion
    const specificAngularMomentumAphelion = rAphelion * vAphelion
    expect(specificAngularMomentumPerihelion).toBeCloseTo(specificAngularMomentumAphelion, 0)
  })

  it('computes planetary orbital periods via Kepler Third Law T^2 = a^3', () => {
    // Earth reference: T = 1.000 yr, a = 1.000 AU

    // Mars: a = 1.524 AU
    const aMars = 1.524
    const tMars = Math.sqrt(Math.pow(aMars, 3)) // ~ 1.881 years
    expect(tMars).toBeCloseTo(1.88, 2)

    // Jupiter: a = 5.204 AU
    const aJupiter = 5.204
    const tJupiter = Math.sqrt(Math.pow(aJupiter, 3)) // ~ 11.87 years
    expect(tJupiter).toBeCloseTo(11.87, 2)

    // Halley Comet: T = 75.3 years => a = T^(2/3) ~ 17.8 AU
    const tHalley = 75.3
    const aHalley = Math.pow(tHalley, 2 / 3) // ~ 17.8 AU
    expect(aHalley).toBeCloseTo(17.8, 1)
  })
})
