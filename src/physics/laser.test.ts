import { describe, it, expect } from 'vitest'

describe('Physics Laser Principles & Stimulated Emission Tests', () => {
  it('calculates photon energy and frequency for a Helium-Neon (He-Ne) 632.8 nm red laser', () => {
    // Wavelength lambda = 632.8 nm = 6.328e-7 m
    const lambda = 6.328e-7 // m
    const c = 2.99792e8 // m/s
    const h = 6.62607e-34 // J*s

    // Frequency nu = c / lambda
    const frequency = c / lambda // ~ 4.7375e14 Hz (473.8 THz)
    expect(frequency / 1e14).toBeCloseTo(4.738, 2)

    // Photon energy E = h * nu
    const energyJoules = h * frequency // ~ 3.139e-19 J
    const energyEv = energyJoules / 1.60218e-19 // ~ 1.959 eV (~ 1.96 eV)
    expect(energyEv).toBeCloseTo(1.96, 2)
  })

  it('determines longitudinal cavity modes and frequency spacing in optical resonant cavity', () => {
    // Optical cavity length L = 30 cm = 0.30 m
    const L = 0.30 // m
    const c = 2.99792e8 // m/s

    // Mode spacing Delta_nu = c / (2 * L)
    const deltaNu = c / (2 * L) // ~ 4.9965e8 Hz (~ 500 MHz)
    expect(deltaNu / 1e8).toBeCloseTo(5.0, 1)

    // Standing wave condition: L = m * (lambda / 2) -> m = 2 * L / lambda
    const lambda = 6.328e-7 // m
    const modeIndex = (2 * L) / lambda // ~ 948166.8 -> integer mode m ≈ 948167
    expect(Math.round(modeIndex)).toBe(948167)
  })

  it('validates population inversion condition and stimulated emission amplification', () => {
    // Under thermal equilibrium (Boltzmann distribution): N2 / N1 = exp(-delta_E / (k_B * T)) < 1
    // For laser amplification, population inversion requires N2 > N1
    const nGround = 1.0e18 // atoms in state 1
    const nExcitedThermal = nGround * Math.exp(-1.96 / (8.617e-5 * 300)) // ~ e^(-75) ≈ 0
    expect(nExcitedThermal).toBeLessThan(1)

    // After optical / electrical pumping achieving population inversion:
    const n2Inverted = 5.0e18
    const n1Inverted = 1.0e18
    const isAmplifying = n2Inverted > n1Inverted
    expect(isAmplifying).toBe(true)
  })
})
