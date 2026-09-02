import { describe, it, expect } from 'vitest'

describe('Physics Superconductivity, Meissner Effect & Flux Quantum Tests', () => {
  it('calculates temperature-dependent critical magnetic field Bc(T) = Bc(0) * [1 - (T/Tc)^2]', () => {
    // For lead (Pb): critical temperature Tc = 7.19 K, Bc(0) = 0.080 Tesla (800 Gauss)
    const tcPb = 7.19 // K
    const bc0 = 0.080 // T

    // At boiling point of liquid Helium (T = 4.2 K)
    const tHe = 4.2 // K
    const bcAt4K = bc0 * (1 - Math.pow(tHe / tcPb, 2)) // ~ 0.0527 T
    expect(bcAt4K).toBeCloseTo(0.0527, 3)

    // At T >= Tc, critical field drops to 0 (normal resistive state restored)
    const bcAtTc = bc0 * (1 - Math.pow(tcPb / tcPb, 2))
    expect(bcAtTc).toBe(0)
  })

  it('determines magnetic flux quantum Phi_0 = h / (2e) for superconducting Cooper pairs', () => {
    // h = 6.62607e-34 J*s, electron charge e = 1.60218e-19 C
    const h = 6.62607e-34
    const e = 1.60218e-19

    // Magnetic flux quantum Phi_0 = h / (2 * e)
    const phi0 = h / (2 * e) // ~ 2.0678e-15 Wb (Tesla * m^2)
    expect(phi0 * 1e15).toBeCloseTo(2.068, 3)

    // In a superconducting ring of area A = 1.0 mm^2 = 1.0e-6 m^2, total magnetic flux is quantized in n * Phi_0
    const ringArea = 1.0e-6 // m^2
    const minMagneticFieldPerQuantum = phi0 / ringArea // ~ 2.068e-9 T (2.07 nT, detectable by SQUID)
    expect(minMagneticFieldPerQuantum * 1e9).toBeCloseTo(2.068, 3)
  })

  it('verifies AC Josephson effect microwave frequency f = 2 * e * V / h', () => {
    // Voltage bias V = 1.0 microvolt (1.0e-6 V) across a Josephson junction
    const h = 6.62607015e-34
    const e = 1.602176634e-19
    const voltage = 1.0e-6 // V

    // Frequency f = (2 * e * V) / h
    const freq = (2 * e * voltage) / h // ~ 4.83598e8 Hz (~ 483.6 MHz)
    expect(freq / 1e6).toBeCloseTo(483.6, 1)

    // Used worldwide as primary quantum voltage standard: 2e/h ≈ 483597.85 GHz / V
    const josephsonConstant = (2 * e) / h // ~ 4.835978e14 Hz/V
    expect(josephsonConstant / 1e9).toBeCloseTo(483597.85, 1)
  })
})
