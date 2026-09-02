import { describe, it, expect } from 'vitest'

describe('Physics Mass Defect, Nuclear Binding Energy & Fission Tests', () => {
  it('calculates mass defect and binding energy per nucleon for Helium-4 alpha particle', () => {
    // Atomic mass constants in atomic mass units (u)
    const massProton = 1.007276 // u
    const massNeutron = 1.008665 // u
    const massAlpha = 4.001506 // u (measured mass of He-4 nucleus)
    const energyPerU = 931.494 // MeV / u

    // Helium-4 consists of 2 protons and 2 neutrons
    const totalConstituentMass = 2 * massProton + 2 * massNeutron // 4.031882 u
    expect(totalConstituentMass).toBeCloseTo(4.031882, 6)

    // Mass defect Delta m = totalConstituentMass - measuredNucleusMass
    const massDefect = totalConstituentMass - massAlpha // 0.030376 u
    expect(massDefect).toBeCloseTo(0.030376, 5)

    // Total nuclear binding energy B = Delta m * c^2
    const totalBindingEnergy = massDefect * energyPerU // ~ 28.295 MeV
    expect(totalBindingEnergy).toBeCloseTo(28.3, 1)

    // Binding energy per nucleon B / A (A = 4)
    const bindingEnergyPerNucleon = totalBindingEnergy / 4 // ~ 7.074 MeV / nucleon
    expect(bindingEnergyPerNucleon).toBeCloseTo(7.07, 2)
  })

  it('validates nuclear stability curve maximum near Iron-56 (Fe-56)', () => {
    // Iron-56 has one of the highest binding energies per nucleon in the universe (~ 8.79 MeV/nucleon)
    const iron56BindingPerNucleon = 8.79 // MeV/nucleon
    const helium4BindingPerNucleon = 7.07 // MeV/nucleon
    const uranium235BindingPerNucleon = 7.59 // MeV/nucleon

    // Fe-56 is more tightly bound than both lighter nuclei (He-4) and heavy actinide nuclei (U-235)
    expect(iron56BindingPerNucleon).toBeGreaterThan(helium4BindingPerNucleon)
    expect(iron56BindingPerNucleon).toBeGreaterThan(uranium235BindingPerNucleon)
  })

  it('computes thermal neutron induced Uranium-235 fission energy release (~ 200 MeV)', () => {
    // Fission reaction: U-235 (235.0439 u) + n (1.008665 u) -> Ba-141 (140.9144 u) + Kr-92 (91.9261 u) + 3 n + Q
    const massU235 = 235.0439
    const massNeutron = 1.008665
    const massBa141 = 140.9144
    const massKr92 = 91.9261
    const energyPerU = 931.494 // MeV / u

    const initialMass = massU235 + massNeutron // 236.052565 u
    const finalMass = massBa141 + massKr92 + 3 * massNeutron // 235.866495 u
    const massDeficitFission = initialMass - finalMass // ~ 0.18607 u

    const energyReleaseMev = massDeficitFission * energyPerU // ~ 173.3 MeV prompt + neutrino/gamma ~ 200 MeV total
    expect(energyReleaseMev).toBeCloseTo(173.3, 1)
    expect(energyReleaseMev).toBeGreaterThan(160.0)
    expect(energyReleaseMev).toBeLessThan(215.0)
  })
})
