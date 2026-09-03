import { describe, it, expect } from 'vitest'

/**
 * 近代物理與狹義相對論：康普頓散射 (Compton Scattering) 與四維動量守恆模型
 * 
 * 核心原理：
 * 1. 入射光子 (能量 E = h*nu = hc/lambda) 與靜止電子 (靜止質量 m_e) 碰撞
 * 2. 能量動量守恆 (四維動量守恆):
 *    Delta lambda = lambda' - lambda = (h / (m_e * c)) * (1 - cos(theta))
 *    - lambda_C = h / (m_e * c) ≈ 2.42631e-12 m (康普頓波長)
 * 3. 極限散射角特徵：
 *    - 正向向前散射 (theta = 0 rad): Delta lambda = 0
 *    - 側向散射 (theta = pi/2 rad, 90 度): Delta lambda = lambda_C
 *    - 完全背向散射 (theta = pi rad, 180 度): Delta lambda = 2 * lambda_C (波長增長最大)
 * 4. 反衝電子動能 (Recoil Electron Kinetic Energy):
 *    K_e = E_photon - E_scattered = hc * (1/lambda - 1/lambda')
 */
export interface ComptonScatteringMetrics {
  incidentWavelengthM: number
  scatteringAngleRad: number
  comptonWavelengthM: number
  wavelengthShiftM: number
  scatteredWavelengthM: number
  recoilElectronKineticEnergyJ: number
  recoilElectronKineticEnergyKeV: number
}

export function evaluateComptonScattering(
  incidentWavelengthM: number,
  scatteringAngleRad: number,
  planckConstant: number = 6.626e-34, // J*s
  electronMassKg: number = 9.109e-31, // kg
  speedOfLightMPerS: number = 2.998e8, // m/s
): ComptonScatteringMetrics {
  if (incidentWavelengthM <= 0) {
    throw new Error('Incident wavelength must be positive')
  }

  const lambdaC = planckConstant / (electronMassKg * speedOfLightMPerS) // ~ 2.426e-12 m
  const deltaLambda = lambdaC * (1 - Math.cos(scatteringAngleRad))
  const scatteredLambda = incidentWavelengthM + deltaLambda

  const hc = planckConstant * speedOfLightMPerS
  const initialEnergy = hc / incidentWavelengthM
  const finalEnergy = hc / scatteredLambda
  const kineticEnergyJ = initialEnergy - finalEnergy
  const kineticEnergyKeV = kineticEnergyJ / 1.602e-16 // 1 keV = 1.602e-16 J

  return {
    incidentWavelengthM,
    scatteringAngleRad,
    comptonWavelengthM: lambdaC,
    wavelengthShiftM: deltaLambda,
    scatteredWavelengthM: scatteredLambda,
    recoilElectronKineticEnergyJ: kineticEnergyJ,
    recoilElectronKineticEnergyKeV: Number(kineticEnergyKeV.toFixed(3)),
  }
}

describe('近代物理：康普頓散射波長偏移與電子反衝動能單元測試', () => {
  it('在 90 度與 180 度背向散射時精確符合康普頓波長倍數關係', () => {
    const lambda0 = 0.02e-9 // 0.02 nm = 20 pm X-ray
    const res90 = evaluateComptonScattering(lambda0, Math.PI / 2)
    const res180 = evaluateComptonScattering(lambda0, Math.PI)

    // 90度時 Delta lambda = lambda_C ≈ 2.426 pm
    expect(res90.wavelengthShiftM).toBeCloseTo(res90.comptonWavelengthM, 14)

    // 180度時 Delta lambda = 2 * lambda_C ≈ 4.852 pm
    expect(res180.wavelengthShiftM).toBeCloseTo(2 * res180.comptonWavelengthM, 14)

    // 180度背向散射傳遞給電子的反衝動能達到最高
    expect(res180.recoilElectronKineticEnergyKeV).toBeGreaterThan(res90.recoilElectronKineticEnergyKeV)
  })
})
