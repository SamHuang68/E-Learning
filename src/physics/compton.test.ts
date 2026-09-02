import { describe, it, expect } from 'vitest'

describe('Physics Compton Scattering & Bragg X-ray Diffraction Tests', () => {
  it('calculates Compton wavelength shift for various scattering angles', () => {
    // Compton wavelength lambda_c = h / (m_e * c) ≈ 2.426 pm = 0.002426 nm
    const lambdaC = 2.426 // pm (picometers)

    // At scattering angle theta = 90 degrees: 1 - cos(90) = 1.0 -> delta_lambda = lambda_c
    const theta90 = 90 * (Math.PI / 180)
    const deltaLambda90 = lambdaC * (1 - Math.cos(theta90))
    expect(deltaLambda90).toBeCloseTo(2.426, 3)

    // At backscattering theta = 180 degrees: 1 - cos(180) = 2.0 -> delta_lambda = 2 * lambda_c
    const theta180 = 180 * (Math.PI / 180)
    const deltaLambda180 = lambdaC * (1 - Math.cos(theta180))
    expect(deltaLambda180).toBeCloseTo(4.852, 3)

    // At forward scattering theta = 0 degrees: delta_lambda = 0
    const deltaLambda0 = lambdaC * (1 - Math.cos(0))
    expect(deltaLambda0).toBe(0)
  })

  it('determines crystal lattice spacing using Bragg diffraction law 2d sin(theta) = n lambda', () => {
    // X-ray wavelength lambda = 0.154 nm (Copper K-alpha)
    // First-order reflection n = 1 at glancing angle theta = 14.8 degrees
    const lambda = 0.154 // nm
    const n = 1
    const thetaDeg = 14.8
    const thetaRad = thetaDeg * (Math.PI / 180)

    // d = (n * lambda) / (2 * sin(theta))
    const d = (n * lambda) / (2 * Math.sin(thetaRad)) // ~ 0.301 nm (3.01 Angstroms)
    expect(d).toBeCloseTo(0.301, 2)
  })

  it('verifies photon momentum p = h / lambda = E / c', () => {
    // X-ray photon with energy E = 10 keV = 1.602e-15 J
    // c = 3.0e8 m/s -> p = E / c ≈ 5.34e-24 kg*m/s
    const eJoules = 10000 * 1.602e-19
    const c = 3.0e8
    const p = eJoules / c
    expect(p * 1e24).toBeCloseTo(5.34, 2)
  })
})
