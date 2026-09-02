import { describe, it, expect } from 'vitest'

describe('Physics Gravitation & Kepler Laws Tests', () => {
  it('calculates orbital speed v = sqrt(GM / r) and escape speed v_esc = sqrt(2GM / r) correctly', () => {
    // Earth: M ≈ 5.972e24 kg, R ≈ 6.371e6 m
    // G = 6.6743e-11 N*m^2/kg^2
    const G = 6.6743e-11
    const M = 5.972e24
    const R = 6.371e6

    // Near Earth orbital speed: v = sqrt(GM/R) ≈ 7910 m/s ≈ 7.91 km/s (First cosmic velocity)
    const vOrbit = Math.sqrt((G * M) / R)
    expect(vOrbit).toBeCloseTo(7910, -2)

    // Escape speed: v_esc = sqrt(2) * v_orbit ≈ 11.18 km/s (Second cosmic velocity)
    const vEscape = Math.sqrt((2 * G * M) / R)
    expect(vEscape / vOrbit).toBeCloseTo(Math.SQRT2, 4)
    expect(vEscape).toBeCloseTo(11186, -2)
  })

  it('verifies Kepler Third Law T^2 / a^3 = 4π^2 / (GM) invariance for satellites', () => {
    const G = 6.6743e-11
    const M = 5.972e24
    const kTheoretical = (4 * Math.PI * Math.PI) / (G * M)

    // Satellite 1 at r1 = 7.0e6 m
    const r1 = 7.0e6
    const t1 = 2 * Math.PI * Math.sqrt(Math.pow(r1, 3) / (G * M))
    const ratio1 = Math.pow(t1, 2) / Math.pow(r1, 3)

    // Satellite 2 at r2 = 42.164e6 m (Geostationary orbit radius)
    const r2 = 42.164e6
    const t2 = 2 * Math.PI * Math.sqrt(Math.pow(r2, 3) / (G * M))
    const ratio2 = Math.pow(t2, 2) / Math.pow(r2, 3)

    expect(ratio1).toBeCloseTo(kTheoretical, 15)
    expect(ratio2).toBeCloseTo(kTheoretical, 15)
    // T2 should be approximately 86164 seconds (1 sidereal day ≈ 24h)
    expect(t2 / 3600).toBeCloseTo(24.0, 0)
  })
})
