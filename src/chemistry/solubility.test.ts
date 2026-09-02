import { describe, it, expect } from 'vitest'

describe('Chemistry Solubility Curves & Precipitate Tests', () => {
  it('calculates KNO3 solubility increasing dramatically with temperature', () => {
    const evalKno3 = (t: number) => 13.3 + 0.6 * t + 0.015 * t * t
    const sol20 = evalKno3(20)
    const sol60 = evalKno3(60)

    expect(sol20).toBeCloseTo(31.3, 1)
    expect(sol60).toBeCloseTo(103.3, 1)
    expect(sol60).toBeGreaterThan(sol20 * 3)
  })

  it('determines crystal precipitation when cooling a saturated solution', () => {
    const evalKno3 = (t: number) => 13.3 + 0.6 * t + 0.015 * t * t
    const waterG = 100
    const soluteAdded = 100 // 100g in 100g water

    // At 60°C, max dissolved = 103.3g (fully dissolved, unsaturated)
    const dissolved60 = Math.min(soluteAdded, evalKno3(60) * (waterG / 100))
    expect(dissolved60).toBe(100)

    // At 20°C, max dissolved = 31.3g -> precipitate = 100 - 31.3 = 68.7g
    const dissolved20 = Math.min(soluteAdded, evalKno3(20) * (waterG / 100))
    const precipitate20 = soluteAdded - dissolved20
    expect(precipitate20).toBeCloseTo(68.7, 1)
  })

  it('verifies retrograde solubility behavior for Cerium Sulfate Ce2(SO4)3', () => {
    const evalCe2so4 = (t: number) => Math.max(1.5, 20.0 - 0.18 * t)
    const sol20 = evalCe2so4(20)
    const sol80 = evalCe2so4(80)

    // Retrograde: solubility decreases as temperature rises
    expect(sol80).toBeLessThan(sol20)
  })
})
