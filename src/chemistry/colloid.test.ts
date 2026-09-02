import { describe, it, expect } from 'vitest'

describe('Chemistry Colloids, Tyndall Effect & Coagulation Tests', () => {
  it('classifies dispersion systems based on dispersed particle diameters', () => {
    const systems = [
      { name: '食鹽水 (True solution)', diameterNm: 0.3, type: 'solution', tyndall: false, passesDialysis: true },
      { name: '金奈米溶膠 / 豆漿 (Colloid)', diameterNm: 50, type: 'colloid', tyndall: true, passesDialysis: false },
      { name: '泥水懸浮液 (Suspension)', diameterNm: 5000, type: 'suspension', tyndall: true, settlesGravity: true },
    ]

    // True solutions have diameter < 1 nm
    expect(systems[0].diameterNm).toBeLessThan(1)
    expect(systems[0].tyndall).toBe(false)
    expect(systems[0].passesDialysis).toBe(true)

    // Colloids have diameter 1 nm to 1000 nm
    expect(systems[1].diameterNm).toBeGreaterThanOrEqual(1)
    expect(systems[1].diameterNm).toBeLessThanOrEqual(1000)
    expect(systems[1].tyndall).toBe(true)
    expect(systems[1].passesDialysis).toBe(false)

    // Suspensions have diameter > 1000 nm
    expect(systems[2].diameterNm).toBeGreaterThan(1000)
    expect(systems[2].settlesGravity).toBe(true)
  })

  it('validates Tyndall effect wavelength scattering dependence (I proportional to 1 / lambda^4)', () => {
    // Rayleigh scattering intensity ratio between blue light (450 nm) and red light (650 nm)
    const lambdaBlue = 450 // nm
    const lambdaRed = 650 // nm
    const ratio = Math.pow(lambdaRed / lambdaBlue, 4) // (650/450)^4 ≈ 4.36
    expect(ratio).toBeCloseTo(4.36, 1)
    // Blue light is scattered over 4 times more intensely than red light, explaining bluish colloidal path
    expect(ratio).toBeGreaterThan(4)
  })

  it('verifies Schulze-Hardy rule for colloidal coagulation by multivalent counter-ions', () => {
    // For a negatively charged As2S3 or Fe(OH)3 sol, coagulating power increases exponentially with ion valence z
    // Coagulating concentrations (mmol/L) roughly follow:
    // Monovalent (NaCl): ~ 50 mmol/L -> relative coagulating power = 1
    // Divalent (MgCl2): ~ 1.5 mmol/L -> relative coagulating power ≈ 33
    // Trivalent (AlCl3): ~ 0.05 mmol/L -> relative coagulating power ≈ 1000
    const coagulatingPower = {
      naPlus: 1,
      mg2Plus: 50 / 1.5, // ~ 33.3
      al3Plus: 50 / 0.05, // ~ 1000
    }

    expect(coagulatingPower.al3Plus).toBeGreaterThan(coagulatingPower.mg2Plus * 10)
    expect(coagulatingPower.mg2Plus).toBeGreaterThan(coagulatingPower.naPlus * 10)
  })
})
