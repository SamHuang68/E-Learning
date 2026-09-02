import { describe, it, expect } from 'vitest'

describe('Physics Standard Model, Quark Flavor & Beta Decay Tests', () => {
  it('verifies fractional electric charges and baryon numbers for the 6 quark flavors', () => {
    const quarks = {
      up: { charge: 2 / 3, baryonNum: 1 / 3 },
      down: { charge: -1 / 3, baryonNum: 1 / 3 },
      charm: { charge: 2 / 3, baryonNum: 1 / 3 },
      strange: { charge: -1 / 3, baryonNum: 1 / 3 },
      top: { charge: 2 / 3, baryonNum: 1 / 3 },
      bottom: { charge: -1 / 3, baryonNum: 1 / 3 },
    }

    // Proton is composed of uud
    const protonCharge = quarks.up.charge + quarks.up.charge + quarks.down.charge
    const protonBaryonNum = quarks.up.baryonNum + quarks.up.baryonNum + quarks.down.baryonNum
    expect(protonCharge).toBeCloseTo(1.0, 4)
    expect(protonBaryonNum).toBeCloseTo(1.0, 4)

    // Neutron is composed of udd
    const neutronCharge = quarks.up.charge + quarks.down.charge + quarks.down.charge
    const neutronBaryonNum = quarks.up.baryonNum + quarks.down.baryonNum + quarks.down.baryonNum
    expect(neutronCharge).toBeCloseTo(0.0, 4)
    expect(neutronBaryonNum).toBeCloseTo(1.0, 4)
  })

  it('determines meson quark-antiquark composition and integer electric charges', () => {
    // Antiquark charges are opposite to quark charges
    const antiDownCharge = 1 / 3 // charge of anti-d
    const upCharge = 2 / 3

    // Positive pion pi+ is composed of (u, anti-d)
    const piPlusCharge = upCharge + antiDownCharge // 2/3 + 1/3 = 1
    expect(piPlusCharge).toBeCloseTo(1.0, 4)

    // Mesons have zero net baryon number (1/3 + (-1/3) = 0)
    const mesonBaryonNum = 1 / 3 - 1 / 3
    expect(mesonBaryonNum).toBe(0)
  })

  it('validates conservation laws in beta-minus decay (d -> u + e- + anti-nu_e)', () => {
    // Initial state: 1 down quark
    const initialCharge = -1 / 3
    const initialBaryon = 1 / 3
    const initialLepton = 0

    // Final state: 1 up quark + electron + electron antineutrino
    const finalQuarkCharge = 2 / 3
    const electronCharge = -1
    const antiNeutrinoCharge = 0
    const finalTotalCharge = finalQuarkCharge + electronCharge + antiNeutrinoCharge

    // Charge conservation: -1/3 == 2/3 - 1 + 0 = -1/3
    expect(finalTotalCharge).toBeCloseTo(initialCharge, 4)

    // Baryon number conservation: 1/3 (d) == 1/3 (u) + 0 (e-) + 0 (anti-nu_e)
    const finalBaryon = 1 / 3
    expect(finalBaryon).toBe(initialBaryon)

    // Lepton number conservation: 0 == 0 (up) + 1 (e-) + (-1) (anti-nu_e)
    const electronLeptonNum = 1
    const antiNeutrinoLeptonNum = -1
    const finalLeptonNum = electronLeptonNum + antiNeutrinoLeptonNum
    expect(finalLeptonNum).toBe(initialLepton)
  })
})
