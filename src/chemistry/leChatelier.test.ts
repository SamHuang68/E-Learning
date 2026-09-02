import { describe, it, expect } from 'vitest'

describe('Chemistry Chemical Equilibrium & Le Chatelier Principle Tests', () => {
  it('calculates equilibrium constant Kc for N2 + 3H2 <=> 2NH3 correctly', () => {
    // [N2] = 0.5 M, [H2] = 1.0 M, [NH3] = 2.0 M
    const concN2 = 0.5
    const concH2 = 1.0
    const concNH3 = 2.0

    // Kc = [NH3]^2 / ([N2] * [H2]^3)
    const kc = Math.pow(concNH3, 2) / (concN2 * Math.pow(concH2, 3))
    // 4 / (0.5 * 1) = 8
    expect(kc).toBe(8)
  })

  it('determines shift direction using reaction quotient Q vs Kc', () => {
    const kc = 8.0

    // Case 1: Extra NH3 added -> [NH3] = 4.0 M -> Q = 16 / 0.5 = 32 > Kc
    const q1 = 32.0
    const shiftDirection1 = q1 > kc ? 'left' : 'right'
    expect(shiftDirection1).toBe('left') // shifts left to consume excess product

    // Case 2: Extra N2 added -> [N2] = 2.0 M -> Q = 4 / (2.0 * 1) = 2.0 < Kc
    const q2 = 2.0
    const shiftDirection2 = q2 < kc ? 'right' : 'left'
    expect(shiftDirection2).toBe('right') // shifts right to consume excess reactant
  })

  it('verifies temperature effect on exothermic reaction (ΔH < 0)', () => {
    // N2 + 3H2 <=> 2NH3 + 92 kJ (exothermic)
    // Raising temperature adds heat -> shifts left (favors endothermic reverse)
    // Lowering temperature removes heat -> shifts right (favors forward synthesis)
    const isExothermic = true
    const tempChange = 'decrease'
    const shift = isExothermic && tempChange === 'decrease' ? 'forward_right' : 'reverse_left'

    expect(shift).toBe('forward_right')
  })
})
