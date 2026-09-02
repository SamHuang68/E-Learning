import { describe, it, expect } from 'vitest'

describe('Physics Standing Waves, String Harmonics & Organ Pipe Resonance Tests', () => {
  it('calculates guitar string wave velocity and harmonic frequencies', () => {
    // String length L = 0.65 m
    // Tension T = 80.0 N
    // Linear mass density mu = 4.0e-4 kg/m (0.40 g/m)
    const length = 0.65 // m
    const tension = 80.0 // N
    const linearDensity = 4.0e-4 // kg/m

    // Wave speed v = sqrt(T / mu)
    const waveSpeed = Math.sqrt(tension / linearDensity) // ~ 447.21 m/s
    expect(waveSpeed).toBeCloseTo(447.21, 2)

    // Fundamental frequency f1 = v / (2 * L)
    const f1 = waveSpeed / (2 * length) // ~ 344.01 Hz
    expect(f1).toBeCloseTo(344.01, 2)

    // Harmonics fn = n * f1
    const f2 = 2 * f1 // 688.02 Hz
    const f3 = 3 * f1 // 1032.03 Hz
    expect(f2).toBeCloseTo(688.02, 2)
    expect(f3).toBeCloseTo(1032.03, 2)
  })

  it('demonstrates standing wave node positions at multiples of half wavelength', () => {
    // y(x, t) = 2 * A * sin(k * x) * cos(omega * t)
    // Nodes occur where sin(k * x) = 0 => x = m * (lambda / 2)
    const lambda = 1.30 // m (wavelength for n=1 on L=0.65 m string)
    const halfLambda = lambda / 2 // 0.65 m

    function getNodePosition(m: number): number {
      return m * halfLambda
    }

    expect(getNodePosition(0)).toBe(0) // Fixed end x = 0
    expect(getNodePosition(1)).toBe(0.65) // Fixed end x = L
    expect(getNodePosition(2)).toBe(1.30)
  })

  it('contrasts open-open pipe (all harmonics) with open-closed pipe (odd harmonics only)', () => {
    // Speed of sound in air v = 340.0 m/s
    // Tube length L = 0.85 m
    const speedOfSound = 340.0 // m/s
    const tubeLength = 0.85 // m

    // Open-open pipe: fn = n * v / (2 * L)
    const openF1 = speedOfSound / (2 * tubeLength) // 200.0 Hz
    const openF2 = 2 * openF1 // 400.0 Hz
    const openF3 = 3 * openF1 // 600.0 Hz

    expect(openF1).toBe(200.0)
    expect(openF2).toBe(400.0)
    expect(openF3).toBe(600.0)

    // Open-closed pipe: fm = m * v / (4 * L) for odd m = 1, 3, 5...
    const closedF1 = speedOfSound / (4 * tubeLength) // 100.0 Hz
    const closedF3 = 3 * closedF1 // 300.0 Hz
    const closedF5 = 5 * closedF1 // 500.0 Hz

    expect(closedF1).toBe(100.0)
    expect(closedF3).toBe(300.0)
    expect(closedF5).toBe(500.0)
    // Fundamental of closed pipe is half of open pipe
    expect(closedF1).toBe(openF1 / 2)
  })
})
