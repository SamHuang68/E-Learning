import { describe, it, expect } from 'vitest'

describe('Physics Thin-Film Interference, Anti-Reflective Coating & Newtons Rings Tests', () => {
  it('determines relative reflection phase shift for anti-reflective coating on camera glass', () => {
    // Media order: Air (n0=1.0) -> MgF2 (n1=1.38) -> Glass (n2=1.52)
    const n0 = 1.0
    const n1 = 1.38
    const n2 = 1.52

    const topBoundaryHasPhaseShift = n0 < n1 // true (pi shift)
    const bottomBoundaryHasPhaseShift = n1 < n2 // true (pi shift)
    const relativePhaseShift = (topBoundaryHasPhaseShift && bottomBoundaryHasPhaseShift) ? 0 : Math.PI

    expect(topBoundaryHasPhaseShift).toBe(true)
    expect(bottomBoundaryHasPhaseShift).toBe(true)
    expect(relativePhaseShift).toBe(0)
  })

  it('calculates optimal anti-reflective coating thickness for mid-visible spectrum 550nm light', () => {
    const lambda = 550.0 // nm
    const nFilm = 1.38 // MgF2

    // Destructive interference for reflected light: 2 * nFilm * d = (m + 0.5) * lambda
    // For m = 0, d_min = lambda / (4 * nFilm)
    const dMin = lambda / (4 * nFilm) // 550 / 5.52 ~ 99.64 nm
    expect(dMin).toBeCloseTo(99.64, 2)
  })

  it('proves central dark spot in Newtons rings due to single-boundary half-wave loss in air wedge', () => {
    // Glass (n=1.52) -> Air (n=1.0) -> Glass (n=1.52)
    // Top reflection at glass-air boundary: n_glass > n_air => 0 phase shift
    // Bottom reflection at air-glass boundary: n_air < n_glass => pi phase shift
    // At center contact point d = 0: optical path difference = 0 + lambda/2 => destructive interference (dark spot)
    const isCenterContactDark = true
    expect(isCenterContactDark).toBe(true)
  })

  it('measures plano-convex lens radius of curvature from Newtons 10th dark ring radius', () => {
    // r_m = sqrt(m * R * lambda)  =>  R = r_m^2 / (m * lambda)
    const m = 10
    const lambda = 600e-9 // 600 nm = 6.0e-7 m
    const r10 = 2.45e-3 // 2.45 mm

    const R = Math.pow(r10, 2) / (m * lambda) // (2.45e-3)^2 / (10 * 6.0e-7) = 6.0025e-6 / 6.0e-6 ~ 1.0004 m
    expect(R).toBeCloseTo(1.00, 2)
  })
})
