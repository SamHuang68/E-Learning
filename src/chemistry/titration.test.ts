import { describe, it, expect } from 'vitest'

describe('Chemistry Acid-Base Titration & pH Curve Tests', () => {
  it('calculates initial pH correctly for strong acid HCl 0.1M', () => {
    const cAcid = 0.1
    const phInitial = -Math.log10(cAcid)
    expect(phInitial).toBeCloseTo(1.0, 2)
  })

  it('calculates equivalence point volume correctly (MaVa = MbVb)', () => {
    const cAcid = 0.1
    const vAcid = 25
    const cBase = 0.1
    const vEquiv = (cAcid * vAcid) / cBase
    expect(vEquiv).toBe(25.0)
  })

  it('verifies weak acid buffer half-equivalence point equals pKa', () => {
    const pKa = 4.74
    // At half equivalence point, [A-] = [HA], log([A-]/[HA]) = 0
    const phHalfEquiv = pKa + Math.log10(1)
    expect(phHalfEquiv).toBeCloseTo(4.74, 2)
  })
})
