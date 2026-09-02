import { describe, it, expect } from 'vitest'

describe('Physics Circuit & Ohm Law Tests', () => {
  it('calculates series equivalent resistance and voltage division correctly', () => {
    const voltage = 12 // V
    const r1 = 4 // Ω
    const r2 = 6 // Ω
    const req = r1 + r2 // 10 Ω
    const totalCurrent = voltage / req // 1.2 A

    const v1 = totalCurrent * r1 // 4.8 V
    const v2 = totalCurrent * r2 // 7.2 V

    expect(req).toBe(10)
    expect(totalCurrent).toBeCloseTo(1.2, 2)
    expect(v1 + v2).toBeCloseTo(voltage, 2)
  })

  it('calculates parallel equivalent resistance and current division correctly', () => {
    const voltage = 12 // V
    const r1 = 6 // Ω
    const r2 = 3 // Ω
    const req = (r1 * r2) / (r1 + r2) // 2 Ω
    const totalCurrent = voltage / req // 6 A

    const i1 = voltage / r1 // 2 A
    const i2 = voltage / r2 // 4 A

    expect(req).toBe(2)
    expect(totalCurrent).toBe(6)
    expect(i1 + i2).toBe(totalCurrent)
  })

  it('calculates electric power P = IV = I^2 R correctly', () => {
    const v = 12
    const r = 4
    const i = v / r // 3 A
    const pByVI = v * i // 36 W
    const pByI2R = i * i * r // 36 W

    expect(pByVI).toBe(36)
    expect(pByI2R).toBe(36)
  })
})
