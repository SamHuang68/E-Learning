import { describe, it, expect } from 'vitest'

describe('Physics Acoustic & Electromagnetic Doppler Effect Tests', () => {
  it('calculates acoustic Doppler frequency shift for moving ambulance siren', () => {
    // Speed of sound in air v = 340.0 m/s
    // Source frequency f = 800.0 Hz
    // Source speed vs = 34.0 m/s towards stationary observer (vo = 0)
    const speedOfSound = 340.0 // m/s
    const sirenFrequency = 800.0 // Hz
    const ambulanceSpeed = 34.0 // m/s

    // Approaching source: f_approach = f * v / (v - vs)
    const fApproach = sirenFrequency * (speedOfSound / (speedOfSound - ambulanceSpeed))
    expect(fApproach).toBeCloseTo(888.89, 2)

    // Receding source: f_recede = f * v / (v + vs)
    const fRecede = sirenFrequency * (speedOfSound / (speedOfSound + ambulanceSpeed))
    expect(fRecede).toBeCloseTo(727.27, 2)

    // Verify compressed wavelength in front vs stretched wavelength behind
    const lambdaApproach = (speedOfSound - ambulanceSpeed) / sirenFrequency // 0.3825 m
    const lambdaRecede = (speedOfSound + ambulanceSpeed) / sirenFrequency // 0.4675 m
    expect(lambdaApproach).toBe(0.3825)
    expect(lambdaRecede).toBe(0.4675)
  })

  it('determines astronomical redshift and shifted H-alpha line for distant galaxy', () => {
    // Speed of light c = 3.0e8 m/s
    // Galaxy recession speed v = 1.5e7 m/s (15,000 km/s)
    const c = 3.0e8 // m/s
    const recessionSpeed = 1.5e7 // m/s

    // Redshift parameter z = v / c
    const z = recessionSpeed / c
    expect(z).toBe(0.05)

    // Rest wavelength of H-alpha line lambda0 = 656.3 nm
    const lambda0 = 656.3 // nm
    const lambdaObserved = lambda0 * (1 + z)
    expect(lambdaObserved).toBeCloseTo(689.115, 3)
  })

  it('computes medical Doppler ultrasound blood flow velocity frequency shift', () => {
    // Transducer frequency f0 = 5.0 MHz (5.0e6 Hz)
    // Speed of ultrasound in soft tissue c = 1540 m/s
    // Blood flow velocity v = 0.35 m/s
    // Beam angle theta = 60 degrees (cos 60° = 0.5)
    const f0 = 5.0e6 // Hz
    const speedInTissue = 1540 // m/s
    const bloodVelocity = 0.35 // m/s
    const cosTheta = Math.cos((60 * Math.PI) / 180) // 0.5

    // Doppler shift Delta f = 2 * f0 * v * cos(theta) / c
    const deltaF = (2 * f0 * bloodVelocity * cosTheta) / speedInTissue
    expect(deltaF).toBeCloseTo(1136.36, 2)
  })
})
