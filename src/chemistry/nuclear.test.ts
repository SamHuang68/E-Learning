import { describe, it, expect } from 'vitest'

describe('Chemistry Nuclear Chemistry & Radiometric Dating Tests', () => {
  it('balances nuclear reaction mass numbers and atomic numbers (Alpha & Beta decay)', () => {
    // Alpha decay: 238_92 U -> 234_90 Th + 4_2 He
    const uMass = 238
    const uCharge = 92
    const thMass = 234
    const thCharge = 90
    const alphaMass = 4
    const alphaCharge = 2

    expect(uMass).toBe(thMass + alphaMass)
    expect(uCharge).toBe(thCharge + alphaCharge)

    // Beta-minus decay: 14_6 C -> 14_7 N + 0_-1 e
    const cMass = 14
    const cCharge = 6
    const nMass = 14
    const nCharge = 7
    const betaCharge = -1

    expect(cMass).toBe(nMass)
    expect(cCharge).toBe(nCharge + betaCharge)
  })

  it('calculates Carbon-14 radioactive dating age accurately', () => {
    // C-14 half-life t_1/2 = 5730 years
    // An ancient wooden artifact has 25% of the original C-14 remaining -> 2 half-lives
    const tHalf = 5730 // years
    const remainingFraction = 0.25 // 1/4 = (1/2)^2

    const elapsedHalfLives = Math.log(1 / remainingFraction) / Math.LN2 // 2.0
    const sampleAge = elapsedHalfLives * tHalf // 11,460 years

    expect(elapsedHalfLives).toBeCloseTo(2.0, 5)
    expect(sampleAge).toBe(11460)
  })

  it('calculates nuclear mass defect and binding energy via E = mc^2', () => {
    // Mass defect of 1 atomic mass unit (1 u ≈ 1.6605e-27 kg)
    // 1 u converts to approximately 931.5 MeV
    const c = 2.99792e8 // m/s
    const uInKg = 1.66054e-27 // kg
    const joulesPerMev = 1.60218e-13 // J / MeV

    const energyJoules = uInKg * c * c // ~ 1.492e-10 J
    const energyMev = energyJoules / joulesPerMev // ~ 931.5 MeV

    expect(energyMev).toBeCloseTo(931.5, 0)
  })
})
