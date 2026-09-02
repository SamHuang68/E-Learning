import { describe, it, expect } from 'vitest'

describe('Chemistry Chromatography & Retention Factor Rf Tests', () => {
  it('calculates Rf values accurately on thin-layer chromatography (TLC)', () => {
    // Solvent front traveled 10.0 cm
    const solventFrontCm = 10.0

    // Solute A (non-polar carotene) traveled 9.5 cm -> Rf = 9.5 / 10.0 = 0.95
    const distACm = 9.5
    const rfA = distACm / solventFrontCm
    expect(rfA).toBeCloseTo(0.95, 2)

    // Solute B (polar chlorophyll b) traveled 4.5 cm -> Rf = 4.5 / 10.0 = 0.45
    const distBCm = 4.5
    const rfB = distBCm / solventFrontCm
    expect(rfB).toBeCloseTo(0.45, 2)

    // Rf must always be bounded between 0 and 1
    expect(rfA).toBeGreaterThanOrEqual(0)
    expect(rfA).toBeLessThanOrEqual(1)
    expect(rfB).toBeGreaterThanOrEqual(0)
    expect(rfB).toBeLessThanOrEqual(1)
  })

  it('verifies relationship between solute polarity and Rf on polar silica gel TLC', () => {
    // Normal-phase silica gel TLC plate: stationary phase is polar SiO2
    // Non-polar mobile phase (petroleum ether / acetone 9:1)
    // Less polar solute interacts weakly with silica and moves further (higher Rf)
    // More polar solute forms hydrogen bonds with silica and elutes slower (lower Rf)
    const pigments = [
      { name: '胡蘿蔔素 (Carotene)', polarity: 'very low', distanceCm: 9.5, rf: 0.95 },
      { name: '葉綠素 a (Chlorophyll a)', polarity: 'moderate', distanceCm: 6.0, rf: 0.60 },
      { name: '葉綠素 b (Chlorophyll b)', polarity: 'polar (-CHO group)', distanceCm: 4.5, rf: 0.45 },
      { name: '葉黃素 (Xanthophyll)', polarity: 'very polar (-OH groups)', distanceCm: 3.5, rf: 0.35 },
    ]

    expect(pigments[0].rf).toBeGreaterThan(pigments[1].rf)
    expect(pigments[1].rf).toBeGreaterThan(pigments[2].rf)
    expect(pigments[2].rf).toBeGreaterThan(pigments[3].rf)
  })

  it('determines chromatographic resolution and retention time in HPLC / GC', () => {
    // Retention time tR for compound X is 5.2 min, dead time t0 is 1.0 min
    // Retention factor k = (tR - t0) / t0
    const tR = 5.2
    const t0 = 1.0
    const kPrime = (tR - t0) / t0 // 4.2
    expect(kPrime).toBeCloseTo(4.2, 1)
  })
})
