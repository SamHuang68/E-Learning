import { describe, it, expect } from 'vitest'

describe('Physics Photoelectric Effect & Quantum Physics Tests', () => {
  it('calculates photon energy E = hc / λ in electron-volts correctly', () => {
    // hc ≈ 1240 eV * nm
    // For violet light λ = 400 nm: E = 1240 / 400 = 3.10 eV
    const lambdaViolet = 400 // nm
    const eViolet = 1240 / lambdaViolet
    expect(eViolet).toBeCloseTo(3.10, 2)

    // For red light λ = 620 nm: E = 1240 / 620 = 2.00 eV
    const lambdaRed = 620 // nm
    const eRed = 1240 / lambdaRed
    expect(eRed).toBeCloseTo(2.00, 2)
  })

  it('determines maximum kinetic energy and stopping potential via Einstein equation', () => {
    // Work function W0 = 2.20 eV (e.g. Potassium / Cesium)
    // Incident photon energy E = 3.10 eV (violet light)
    const workFunction = 2.20 // eV
    const photonEnergy = 3.10 // eV

    // Ek_max = E - W0 = 3.10 - 2.20 = 0.90 eV
    const ekMax = photonEnergy - workFunction
    expect(ekMax).toBeCloseTo(0.90, 2)

    // Stopping potential Vs = Ek_max / e = 0.90 V
    const stoppingPotential = ekMax // in Volts
    expect(stoppingPotential).toBeCloseTo(0.90, 2)

    // If incident photon energy < work function (e.g. red light 2.0 eV < 2.2 eV), no photoelectrons emitted
    const photonEnergyRed = 2.00
    const emitsPhotoelectrons = photonEnergyRed >= workFunction
    expect(emitsPhotoelectrons).toBe(false)
  })

  it('calculates de Broglie matter wavelength λ = h / p correctly', () => {
    // h = 6.626e-34 J*s, electron mass m = 9.109e-31 kg
    // Electron accelerated through potential V = 100 V -> Ek = 100 eV = 1.602e-17 J
    const h = 6.626e-34
    const m = 9.109e-31
    const ek = 100 * 1.602e-19 // 1.602e-17 J

    const p = Math.sqrt(2 * m * ek) // momentum
    const lambda = h / p // ~ 1.23e-10 m = 0.123 nm (in X-ray / atomic spacing scale)

    expect(lambda * 1e9).toBeCloseTo(0.123, 2)
  })
})
