import { describe, it, expect } from 'vitest'

describe('Physics Heisenberg Uncertainty Principle Tests', () => {
  it('calculates minimum momentum uncertainty delta_p from position confinement delta_x', () => {
    // h_bar = h / (2 * pi) ≈ 1.05457e-34 J*s
    // delta_x * delta_p >= h_bar / 2
    const hBar = 1.05457e-34
    const minProduct = hBar / 2 // 5.2728e-35 J*s

    // For an electron confined inside an atom of diameter 0.1 nm = 1e-10 m
    const deltaX = 1e-10 // m
    const minDeltaP = minProduct / deltaX // ~ 5.27e-25 kg*m/s

    expect(minDeltaP * 1e25).toBeCloseTo(5.27, 2)

    // Electron mass m_e ≈ 9.109e-31 kg -> velocity uncertainty delta_v = delta_p / m_e
    const me = 9.109e-31
    const deltaV = minDeltaP / me // ~ 5.79e5 m/s (~ 579 km/s, comparable to atomic orbital speeds)
    expect(deltaV / 1e5).toBeCloseTo(5.79, 1)
  })

  it('verifies energy-time uncertainty delta_E * delta_t >= h_bar / 2 for unstable excited states', () => {
    // An excited atomic state with lifetime tau = delta_t = 1.0e-8 s (10 nanoseconds)
    const hBar = 1.05457e-34
    const deltaT = 1.0e-8 // s
    const minDeltaE = (hBar / 2) / deltaT // ~ 5.27e-27 J

    // Converted to electron-volts (1 eV = 1.602e-19 J)
    const minDeltaEEv = minDeltaE / 1.602e-19 // ~ 3.29e-8 eV (natural spectral line width)
    expect(minDeltaEEv * 1e8).toBeCloseTo(3.29, 2)
  })

  it('contrasts microscopic quantum uncertainty with negligible macroscopic uncertainty', () => {
    // A macroscopic 0.1 kg baseball localized within delta_x = 1.0 micrometer (1e-6 m)
    const hBar = 1.05457e-34
    const mBall = 0.1 // kg
    const deltaXBall = 1e-6 // m

    const deltaPBall = (hBar / 2) / deltaXBall // ~ 5.27e-29 kg*m/s
    const deltaVBall = deltaPBall / mBall // ~ 5.27e-28 m/s (completely undetectable in classical realm)

    expect(deltaVBall).toBeLessThan(1e-20)
  })
})
