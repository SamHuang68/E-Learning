import { describe, it, expect } from 'vitest'

describe('Physics Blackbody Radiation, Stefan-Boltzmann & Wien Displacement Tests', () => {
  it('calculates solar surface radiant flux and total luminosity using Stefan-Boltzmann Law', () => {
    const sigma = 5.670374e-8 // W / (m^2 * K^4)
    const tSun = 5778 // K
    const rSun = 6.9634e8 // m

    // Emissive power j* = sigma * T^4
    const surfaceFlux = sigma * Math.pow(tSun, 4) // ~ 6.319e7 W/m^2
    expect(surfaceFlux / 1e7).toBeCloseTo(6.32, 2)

    // Total solar luminosity L = 4 * pi * R^2 * j*
    const solarSurfaceArea = 4 * Math.PI * Math.pow(rSun, 2) // ~ 6.09e18 m^2
    const totalLuminosity = solarSurfaceArea * surfaceFlux // ~ 3.851e26 W
    expect(totalLuminosity / 1e26).toBeCloseTo(3.85, 2)
  })

  it('determines peak emission wavelengths across astrophysical and human temperatures via Wien Law', () => {
    const wienB = 2.8977729e-3 // m * K

    // 1. Sun (5778 K) peak wavelength in visible spectrum
    const tSun = 5778
    const lambdaMaxSunNm = (wienB / tSun) * 1e9 // ~ 501.5 nm
    expect(lambdaMaxSunNm).toBeCloseTo(501.5, 1)

    // 2. Human skin temperature (33 °C = 306.15 K) in thermal infrared
    const tHuman = 33 + 273.15 // 306.15 K
    const lambdaMaxHumanMicrons = (wienB / tHuman) * 1e6 // ~ 9.465 um
    expect(lambdaMaxHumanMicrons).toBeCloseTo(9.47, 2)

    // 3. Cosmic Microwave Background Radiation (CMBR: 2.7255 K)
    const tCmbr = 2.7255 // K
    const lambdaMaxCmbrMm = (wienB / tCmbr) * 1e3 // ~ 1.063 mm
    expect(lambdaMaxCmbrMm).toBeCloseTo(1.06, 2)
  })

  it('verifies that radiant energy flux scales with the fourth power of absolute temperature (T^4)', () => {
    // If temperature doubles (e.g. from 1000 K to 2000 K), emitted power increases by 2^4 = 16 times
    const t1 = 1000 // K
    const t2 = 2000 // K

    const fluxRatio = Math.pow(t2 / t1, 4)
    expect(fluxRatio).toBe(16)
  })
})
