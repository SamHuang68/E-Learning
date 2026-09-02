import { describe, it, expect } from 'vitest'

describe('Chemistry Coordination Crystal Field Splitting & Color Theory Tests', () => {
  it('verifies octahedral crystal field splitting d-orbital barycenter conservation', () => {
    // In octahedral crystal field:
    // t2g (dxy, dyz, dxz) orbitals are stabilized by -0.4 * Delta_o
    // eg (dz^2, dx^2 - y^2) orbitals are destabilized by +0.6 * Delta_o
    const t2gShift = -0.4
    const egShift = 0.6
    const numT2g = 3
    const numEg = 2

    // Total barycenter shift must equal 0
    const barycenter = numT2g * t2gShift + numEg * egShift
    expect(barycenter).toBeCloseTo(0.0, 6)
  })

  it('calculates CFSE and magnetic spin state for high-spin vs low-spin d6 complexes', () => {
    // d6 High-spin [Fe(H2O)6]2+ (weak field ligand H2O):
    // Electron distribution: t2g^4 eg^2
    // CFSE = 4 * (-0.4) + 2 * (+0.6) = -1.6 + 1.2 = -0.4 Delta_o
    const highSpinCfse = 4 * -0.4 + 2 * 0.6 // -0.4 Delta_o
    expect(highSpinCfse).toBeCloseTo(-0.4, 2)
    // 4 unpaired electrons -> paramagnetic

    // d6 Low-spin [Fe(CN)6]4- (strong field ligand CN-):
    // Electron distribution: t2g^6 eg^0
    // CFSE = 6 * (-0.4) = -2.4 Delta_o
    const lowSpinCfse = 6 * -0.4 // -2.4 Delta_o
    expect(lowSpinCfse).toBeCloseTo(-2.4, 2)
    // 0 unpaired electrons -> diamagnetic
  })

  it('determines crystal field splitting energy Delta_o from [Ti(H2O)6]3+ visible absorption (500 nm)', () => {
    // [Ti(H2O)6]3+ is a d1 complex.
    // Absorbs complementary yellow-green light at lambda = 500 nm, transmitting purple color.
    const h = 6.62607e-34 // J*s
    const c = 2.99792e8 // m/s
    const avogadro = 6.02214e23 // mol^-1
    const wavelengthMeters = 500e-9 // 500 nm

    // Photon energy E = Delta_o = h * c / lambda
    const deltaOJoules = (h * c) / wavelengthMeters // ~ 3.973e-19 J / ion
    expect(deltaOJoules * 1e19).toBeCloseTo(3.97, 2)

    // Molar splitting energy in kJ/mol
    const deltaOKjPerMol = (deltaOJoules * avogadro) / 1000 // ~ 239.25 kJ/mol
    expect(deltaOKjPerMol).toBeCloseTo(239.25, 1)
    expect(deltaOKjPerMol).toBeGreaterThan(200)
    expect(deltaOKjPerMol).toBeLessThan(260)
  })
})
