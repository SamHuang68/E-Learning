import { describe, it, expect } from 'vitest'

describe('Physics Buoyancy & Archimedes Principle Tests', () => {
  it('calculates submerged volume and buoyancy for a floating body (D_obj < D_liquid)', () => {
    const volume = 100 // cm^3
    const objectDensity = 0.8 // g/cm^3
    const liquidDensity = 1.0 // g/cm^3 (water)

    const weight = volume * objectDensity // 80 gw
    const submergedVol = weight / liquidDensity // 80 cm^3
    const buoyancy = submergedVol * liquidDensity // 80 gw

    expect(submergedVol).toBe(80)
    expect(buoyancy).toBe(weight) // Floating: B = W
  })

  it('calculates apparent weight and normal force for a sunken body (D_obj > D_liquid)', () => {
    const volume = 100 // cm^3
    const objectDensity = 2.7 // g/cm^3 (Aluminum)
    const liquidDensity = 1.0 // g/cm^3

    const weight = volume * objectDensity // 270 gw
    const submergedVol = volume // 100 cm^3 (fully submerged)
    const buoyancy = submergedVol * liquidDensity // 100 gw
    const normalForce = weight - buoyancy // 170 gw

    expect(submergedVol).toBe(100)
    expect(buoyancy).toBe(100)
    expect(normalForce).toBe(170)
  })

  it('verifies neutral buoyancy when object density equals liquid density', () => {
    const volume = 100
    const d = 1.0
    const weight = volume * d
    const buoyancy = volume * d

    expect(weight).toBe(buoyancy)
  })
})
