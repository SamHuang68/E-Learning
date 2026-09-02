import { describe, it, expect } from 'vitest'

describe('Physics Wave Optics & Interference Tests', () => {
  it('calculates Young double slit interference fringe spacing Δy = λL / d correctly', () => {
    // λ = 600 nm = 6.0e-7 m (red laser)
    // L = 2.0 m (screen distance)
    // d = 0.2 mm = 2.0e-4 m (slit spacing)
    const lambda = 6.0e-7
    const L = 2.0
    const d = 2.0e-4

    // Δy = λ * L / d = (6.0e-7 * 2.0) / 2.0e-4 = 6.0e-3 m = 6.0 mm
    const deltaY = (lambda * L) / d
    expect(deltaY).toBeCloseTo(0.006, 5)
  })

  it('determines constructive and destructive interference conditions', () => {
    // Constructive: path difference δ = d sinθ = m * λ (m = 0, 1, 2...)
    // Destructive: path difference δ = (m + 0.5) * λ
    const lambda = 500e-9 // 500 nm

    const pathDiffCentral = 0 // m = 0
    const pathDiffBright1 = 1 * lambda // 500 nm
    const pathDiffDark1 = 0.5 * lambda // 250 nm

    expect(pathDiffCentral % lambda).toBe(0)
    expect(pathDiffBright1 % lambda).toBe(0)
    expect(pathDiffDark1 / lambda).toBe(0.5)
  })

  it('calculates single slit diffraction central maximum width W = 2λL / a', () => {
    // a = 0.1 mm = 1.0e-4 m (slit width)
    // λ = 500 nm = 5.0e-7 m
    // L = 1.5 m
    const a = 1.0e-4
    const lambda = 5.0e-7
    const L = 1.5

    // Central bright band width is twice the normal dark fringe spacing: W = 2 * (λL / a)
    const centralWidth = (2 * lambda * L) / a // 2 * (7.5e-7) / 1e-4 = 0.015 m = 15 mm
    expect(centralWidth).toBeCloseTo(0.015, 5)
  })
})
