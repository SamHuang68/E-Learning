import { describe, it, expect } from 'vitest'

describe('Chemistry Chemical Kinetics & Arrhenius Equation Tests', () => {
  it('determines reaction order and rate law r = k[A]^m [B]^n correctly', () => {
    // Experiment 1: [A]=0.1, [B]=0.1 -> r = 2.0e-3
    // Experiment 2: [A]=0.2, [B]=0.1 -> r = 4.0e-3 (doubling [A] doubles rate -> m = 1)
    // Experiment 3: [A]=0.1, [B]=0.2 -> r = 8.0e-3 (doubling [B] quadruples rate -> n = 2)
    const m = 1
    const n = 2
    const totalOrder = m + n // 3 (third order overall)

    const r1 = 2.0e-3
    const a1 = 0.1
    const b1 = 0.1
    // k = r / ([A]^1 * [B]^2) = 2.0e-3 / (0.1 * 0.01) = 2.0
    const k = r1 / (Math.pow(a1, m) * Math.pow(b1, n))

    expect(totalOrder).toBe(3)
    expect(k).toBeCloseTo(2.0, 3)
  })

  it('calculates first-order reaction half-life t_1/2 = ln(2) / k correctly', () => {
    const k = 0.0693 // s^-1
    const tHalf = Math.LN2 / k // ~ 10 seconds

    expect(tHalf).toBeCloseTo(10.0, 1)

    // After 3 half-lives (30s), remaining fraction is (1/2)^3 = 12.5%
    const remainingFraction = Math.pow(0.5, 3)
    expect(remainingFraction).toBe(0.125)
  })

  it('calculates temperature dependence of rate constant via Arrhenius equation', () => {
    // ln(k2/k1) = -(Ea / R) * (1/T2 - 1/T1)
    const R = 8.314 // J/(mol*K)
    const Ea = 50000 // 50 kJ/mol = 50,000 J/mol
    const T1 = 298 // 25°C in K
    const T2 = 308 // 35°C in K (+10°C)

    const exponent = -(Ea / R) * (1 / T2 - 1 / T1)
    const kRatio = Math.exp(exponent)

    // For Ea ~ 50 kJ/mol around room temp, rate roughly doubles (~1.9x) every 10°C rise
    expect(kRatio).toBeGreaterThan(1.8)
    expect(kRatio).toBeLessThan(2.1)
  })
})
