import { describe, it, expect } from 'vitest'

describe('Physics Electromagnetic Induction & Transformer Tests', () => {
  it('calculates induced electromotive force via Faraday law E = -N * ΔΦ / Δt', () => {
    // Coil turns N = 200
    // Magnetic flux change ΔΦ = 0.05 Wb (0.10 Wb -> 0.05 Wb) in Δt = 0.02 s
    const N = 200
    const deltaPhi = -0.05 // Wb
    const deltaT = 0.02 // s

    // E = -N * (ΔΦ / Δt) = -200 * (-0.05 / 0.02) = +500 V
    const emf = -N * (deltaPhi / deltaT)
    expect(emf).toBe(500)
  })

  it('verifies ideal transformer voltage, current, and turns ratio relations', () => {
    // Primary voltage Vp = 110 V, Primary turns Np = 500
    // Secondary turns Ns = 2000 (step-up transformer, ratio = 4)
    const Vp = 110
    const Np = 500
    const Ns = 2000

    // Vs / Vp = Ns / Np
    const Vs = Vp * (Ns / Np)
    expect(Vs).toBe(440) // 4x step up

    // Ideal power conservation: Pp = Ps -> Vp * Ip = Vs * Is
    const loadResistance = 220 // ohms on secondary
    const Is = Vs / loadResistance // 440 / 220 = 2 A
    const Ip = (Vs * Is) / Vp // (440 * 2) / 110 = 8 A

    expect(Ip / Is).toBeCloseTo(Ns / Np, 5)
    expect(Vp * Ip).toBe(Vs * Is)
  })

  it('verifies high-voltage power transmission line power loss reduction P_loss = (P/V)^2 * R', () => {
    // Transmitted power P = 1.0 MW = 1.0e6 W, line resistance R = 5 ohms
    const P = 1.0e6
    const R = 5

    // Case 1: Low voltage transmission V1 = 10 kV = 10,000 V
    const I1 = P / 10000 // 100 A
    const loss1 = Math.pow(I1, 2) * R // 10,000 * 5 = 50,000 W = 50 kW

    // Case 2: High voltage transmission V2 = 100 kV = 100,000 V (10x voltage)
    const I2 = P / 100000 // 10 A (1/10 current)
    const loss2 = Math.pow(I2, 2) * R // 100 * 5 = 500 W = 0.5 kW (1/100 power loss)

    expect(loss1 / loss2).toBe(100) // Loss drops by 100x when voltage increases 10x!
  })
})
