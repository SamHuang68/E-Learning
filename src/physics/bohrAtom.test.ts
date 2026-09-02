import { describe, it, expect } from 'vitest'

describe('Physics Bohr Hydrogen Atom Model & Spectral Series Tests', () => {
  it('calculates hydrogen energy levels En = -13.6 / n^2 eV correctly', () => {
    // Ground state n = 1: E1 = -13.60 eV
    // First excited state n = 2: E2 = -13.60 / 4 = -3.40 eV
    // Second excited state n = 3: E3 = -13.60 / 9 = -1.51 eV
    // n = 4: E4 = -13.60 / 16 = -0.85 eV
    const e1 = -13.6
    const e2 = -13.6 / Math.pow(2, 2)
    const e3 = -13.6 / Math.pow(3, 2)
    const e4 = -13.6 / Math.pow(4, 2)

    expect(e1).toBe(-13.6)
    expect(e2).toBeCloseTo(-3.4, 2)
    expect(e3).toBeCloseTo(-1.511, 2)
    expect(e4).toBeCloseTo(-0.85, 2)

    // Ionization energy from ground state is 13.6 eV
    const ionizationEnergy = 0 - e1
    expect(ionizationEnergy).toBe(13.6)
  })

  it('calculates Balmer series H-alpha (n=3 -> 2) red line wavelength via Rydberg formula', () => {
    // 1 / λ = R_H * (1/2^2 - 1/n^2)
    // R_H ≈ 1.097e7 m^-1
    const rH = 1.097373e7 // m^-1
    const nInitial = 3
    const nFinal = 2

    const invLambda = rH * (1 / (nFinal * nFinal) - 1 / (nInitial * nInitial))
    const lambdaAlpha = 1 / invLambda // in meters

    // H-alpha red light is ~ 656.3 nm
    const lambdaAlphaNm = lambdaAlpha * 1e9
    expect(lambdaAlphaNm).toBeCloseTo(656.3, 0)
  })

  it('calculates Balmer series H-beta (n=4 -> 2) blue-green line wavelength', () => {
    const rH = 1.097373e7
    const nInitial = 4
    const nFinal = 2

    const invLambda = rH * (1 / (nFinal * nFinal) - 1 / (nInitial * nInitial))
    const lambdaBeta = 1 / invLambda

    // H-beta blue-green light is ~ 486.1 nm
    const lambdaBetaNm = lambdaBeta * 1e9
    expect(lambdaBetaNm).toBeCloseTo(486.1, 0)
  })
})
