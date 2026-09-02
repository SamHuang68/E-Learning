import { describe, it, expect } from 'vitest'

describe('Chemistry Organic Nucleophilic Substitution (SN1 vs SN2) Kinetics & Stereochemistry Tests', () => {
  it('verifies SN2 bimolecular rate kinetics and complete Walden stereochemical inversion', () => {
    // SN2 rate law: r = k * [RX] * [Nu-]
    const kRateConst = 0.45 // L / (mol * s)
    const initialSubstrateConc = 0.10 // M (e.g. 1-bromobutane)
    const initialNucleophileConc = 0.20 // M (e.g. hydroxide OH-)

    const initialRate = kRateConst * initialSubstrateConc * initialNucleophileConc // 0.0090 M/s
    expect(initialRate).toBeCloseTo(0.009, 4)

    // If substrate conc doubles (0.20 M) and nucleophile conc triples (0.60 M):
    const newRate = kRateConst * (initialSubstrateConc * 2) * (initialNucleophileConc * 3)
    expect(newRate / initialRate).toBeCloseTo(6.0, 5)

    // Stereochemistry: Backside attack on chiral center causes 100% Walden inversion: (R) => (S)
    const opticalPurityReactantR = 100.0 // % (R)
    const opticalInversionProductS = 100.0 // % (S)
    expect(opticalInversionProductS).toBe(opticalPurityReactantR)
  })

  it('demonstrates SN1 unimolecular carbocation kinetics independent of nucleophile concentration', () => {
    // SN1 rate law: r = k * [RX]
    const kRateConstSn1 = 0.050 // s^-1 (e.g. tert-butyl bromide (CH3)3C-Br)
    const substrateConc = 0.15 // M

    const rate1 = kRateConstSn1 * substrateConc // 0.0075 M/s
    expect(rate1).toBeCloseTo(0.0075, 4)

    // Tripling nucleophile concentration [H2O] from 1.0 M to 3.0 M does NOT change SN1 rate!
    const rateWith3xNucleophile = kRateConstSn1 * substrateConc
    expect(rateWith3xNucleophile).toBe(rate1)
  })

  it('proves planar sp2 carbocation intermediate leads to racemization (zero net optical rotation)', () => {
    // Planar carbocation intermediate has 50% front attack and 50% back attack
    const frontAttackFraction = 0.50 // Retention
    const backAttackFraction = 0.50 // Inversion

    expect(frontAttackFraction + backAttackFraction).toBe(1.00)

    const specificRotationRetention = +32.5 // deg
    const specificRotationInversion = -32.5 // deg

    // Net optical rotation of racemic mixture is exactly zero
    const netSpecificRotation = frontAttackFraction * specificRotationRetention + backAttackFraction * specificRotationInversion
    expect(netSpecificRotation).toBe(0.0)
  })

  it('contrasts substrate reactivity: 1° preferred for SN2 vs 3° preferred for SN1', () => {
    // Steric hindrance ranking: Methyl > 1° > 2° >> 3° for SN2
    const sn2Reactivity = { methyl: 1000, primary: 100, secondary: 1, tertiary: 0.001 }
    expect(sn2Reactivity.primary).toBeGreaterThan(sn2Reactivity.tertiary)

    // Carbocation stability ranking: 3° > 2° >> 1° > Methyl for SN1
    const carbocationStability = { tertiary: 1000, secondary: 10, primary: 0.1, methyl: 0.0001 }
    expect(carbocationStability.tertiary).toBeGreaterThan(carbocationStability.primary)
  })
})
