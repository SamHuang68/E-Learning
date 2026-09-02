import { describe, it, expect } from 'vitest'

describe('Physics Momentum Conservation & Collision Tests', () => {
  it('calculates 1D elastic collision velocities correctly (e = 1)', () => {
    // m1 = 2 kg, v1 = 6 m/s; m2 = 1 kg, v2 = 0 m/s
    const m1 = 2
    const v1 = 6
    const m2 = 1
    const v2 = 0

    // Elastic collision formulas:
    // v1' = ((m1 - m2)v1 + 2m2 v2) / (m1 + m2)
    // v2' = (2m1 v1 + (m2 - m1)v2) / (m1 + m2)
    const v1Prime = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2) // (1*6 + 0) / 3 = 2 m/s
    const v2Prime = (2 * m1 * v1 + (m2 - m1) * v2) / (m1 + m2) // (4*6 + 0) / 3 = 8 m/s

    expect(v1Prime).toBe(2)
    expect(v2Prime).toBe(8)

    // Verify momentum conservation: P_before = P_after
    const pBefore = m1 * v1 + m2 * v2 // 12
    const pAfter = m1 * v1Prime + m2 * v2Prime // 2*2 + 1*8 = 12
    expect(pAfter).toBe(pBefore)

    // Verify kinetic energy conservation: Ek_before = Ek_after
    const ekBefore = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2 // 0.5*2*36 = 36 J
    const ekAfter = 0.5 * m1 * v1Prime * v1Prime + 0.5 * m2 * v2Prime * v2Prime // 0.5*2*4 + 0.5*1*64 = 4 + 32 = 36 J
    expect(ekAfter).toBe(ekBefore)
  })

  it('calculates completely inelastic collision where bodies stick together (e = 0)', () => {
    const m1 = 3 // kg
    const v1 = 4 // m/s
    const m2 = 1 // kg
    const v2 = 0 // m/s

    // Perfectly inelastic: v' = (m1 v1 + m2 v2) / (m1 + m2)
    const vPrime = (m1 * v1 + m2 * v2) / (m1 + m2) // 12 / 4 = 3 m/s
    expect(vPrime).toBe(3)

    // Kinetic energy loss
    const ekBefore = 0.5 * m1 * v1 * v1 // 0.5 * 3 * 16 = 24 J
    const ekAfter = 0.5 * (m1 + m2) * vPrime * vPrime // 0.5 * 4 * 9 = 18 J
    const ekLost = ekBefore - ekAfter // 6 J lost as heat/deformation
    expect(ekLost).toBe(6)
  })

  it('verifies restitution coefficient e = -(v1\' - v2\') / (v1 - v2)', () => {
    const v1 = 6
    const v2 = 0
    const v1Prime = 2
    const v2Prime = 8

    const e = -(v1Prime - v2Prime) / (v1 - v2) // -(2 - 8) / (6 - 0) = 6 / 6 = 1
    expect(e).toBe(1)
  })
})
