import { describe, it, expect } from 'vitest'

describe('Chemistry Metallic Crystal Packing & Unit Cell Density Tests', () => {
  it('verifies coordination numbers and atoms per unit cell for SC, BCC, and FCC', () => {
    const unitCells = {
      sc: { name: 'Simple Cubic (簡單立方)', z: 1, coord: 6, packingRatio: 0.524 },
      bcc: { name: 'Body-Centered Cubic (體心立方)', z: 2, coord: 8, packingRatio: 0.680 },
      fcc: { name: 'Face-Centered Cubic (面心立方/最密堆積)', z: 4, coord: 12, packingRatio: 0.740 },
    }

    // SC: Z = 8 * (1/8) = 1
    expect(unitCells.sc.z).toBe(1)
    expect(unitCells.sc.coord).toBe(6)

    // BCC: Z = 8 * (1/8) + 1 = 2
    expect(unitCells.bcc.z).toBe(2)
    expect(unitCells.bcc.coord).toBe(8)

    // FCC: Z = 8 * (1/8) + 6 * (1/2) = 4
    expect(unitCells.fcc.z).toBe(4)
    expect(unitCells.fcc.coord).toBe(12)
    expect(unitCells.fcc.packingRatio).toBeCloseTo(0.74, 2)
  })

  it('calculates atomic radius to lattice constant relationship for FCC and BCC', () => {
    // In FCC, spheres touch along face diagonal: 4r = sqrt(2) * a -> a = (4 / sqrt(2)) * r = 2 * sqrt(2) * r
    const rCopper = 1.28e-8 // cm (128 pm)
    const aCopper = 2 * Math.SQRT2 * rCopper // ~ 3.62e-8 cm = 0.362 nm
    expect(aCopper * 1e8).toBeCloseTo(3.62, 2)

    // In BCC, spheres touch along body diagonal: 4r = sqrt(3) * a -> a = (4 / sqrt(3)) * r
    const rIron = 1.24e-8 // cm
    const aIron = (4 / Math.sqrt(3)) * rIron // ~ 2.864e-8 cm
    expect(aIron * 1e8).toBeCloseTo(2.864, 2)
  })

  it('computes Copper (FCC) theoretical density via rho = (Z * M) / (N_A * a^3)', () => {
    // Copper M = 63.546 g/mol, FCC Z = 4, a = 3.615e-8 cm, NA = 6.022e23 mol^-1
    const z = 4
    const molarMass = 63.546 // g/mol
    const na = 6.02214e23
    const a = 3.615e-8 // cm

    const unitCellVolume = Math.pow(a, 3) // ~ 4.724e-23 cm^3
    const massPerUnitCell = (z * molarMass) / na // ~ 4.221e-22 g
    const density = massPerUnitCell / unitCellVolume // ~ 8.935 g/cm^3

    expect(density).toBeCloseTo(8.94, 1)
  })
})
