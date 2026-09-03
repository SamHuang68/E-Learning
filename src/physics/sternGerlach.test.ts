import { describe, it, expect } from 'vitest'

/**
 * 近代物理與量子力學：斯特恩-革拉赫實驗 (Stern-Gerlach Experiment) 空間量子化模型
 * 
 * 核心原理：
 * 1. 處於基態的銀原子 (47 號元素，最外層單個 5s 電子，軌道角動量 L=0，總角動量純由電子自旋 S 決定)
 * 2. 通過沿 z 軸方向強烈不均勻的磁場 (dB_z / dz != 0):
 *    偏折力: F_z = mu_z * (dB_z / dz) = - g_s * mu_B * m_s * (dB_z / dz)
 * 3. 量子預測與分立分裂：
 *    電子自旋量子數 s = 1/2，其 z 軸投影磁量子數僅有兩種離散取值:
 *    m_s = +1/2 (自旋向上) 與 m_s = -1/2 (自旋向下)
 * 4. 運動學偏折位移:
 *    Delta z = (1/2) * a_z * t^2 = (1/2) * (F_z / M) * (L_field / v_x)^2
 *    在感光屏上精確分裂為上下對稱的「兩條分立斑點」，徹底否定了經典連續取向理論！
 */
export interface SternGerlachMetrics {
  magneticFieldGradientTeslaPerM: number
  spinValues: number[]
  forcesNewtons: number[]
  beamDeflectionsM: number[]
  isDiscreteSplitting: boolean
  beamSplitDistanceM: number
}

export function computeSternGerlachDeflection(
  gradientTeslaPerM: number,
  fieldLengthM: number,
  atomicVelocityMPerS: number,
  atomMassKg: number = 1.79e-25, // 銀原子質量 107.87 u ≈ 1.79e-25 kg
  bohrMagneton: number = 9.274e-24, // 玻爾磁元 J/T
  gFactor: number = 2.0023, // 電子朗德 g 因子
): SternGerlachMetrics {
  if (fieldLengthM <= 0 || atomicVelocityMPerS <= 0) {
    throw new Error('Invalid kinematics parameters')
  }

  const t = fieldLengthM / atomicVelocityMPerS
  const spinStates = [+0.5, -0.5] // ms = +1/2, -1/2

  const forces = spinStates.map((ms) => -gFactor * bohrMagneton * ms * gradientTeslaPerM)
  const deflections = forces.map((fz) => 0.5 * (fz / atomMassKg) * (t * t))

  const splitDistance = Math.abs(deflections[0] - deflections[1])

  return {
    magneticFieldGradientTeslaPerM: gradientTeslaPerM,
    spinValues: spinStates,
    forcesNewtons: forces,
    beamDeflectionsM: deflections,
    isDiscreteSplitting: true,
    beamSplitDistanceM: Number(splitDistance.toFixed(6)),
  }
}

describe('量子力學基礎：斯特恩-革拉赫自旋空間量子化單元測試', () => {
  it('銀原子束在不均勻磁場中精確對稱劈裂為兩束分立軌跡', () => {
    // 典型實驗參數：dB/dz = 1000 T/m, L = 0.05 m (5 cm), vx = 500 m/s
    const res = computeSternGerlachDeflection(1000, 0.05, 500)

    expect(res.isDiscreteSplitting).toBe(true)
    expect(res.forcesNewtons[0]).toBeLessThan(0) // 自旋向上受向下力 (或反之取決於座標系定義)
    expect(res.forcesNewtons[1]).toBeGreaterThan(0)
    expect(Math.abs(res.forcesNewtons[0] + res.forcesNewtons[1])).toBeLessThan(1e-25) // 嚴格對稱
    expect(res.beamSplitDistanceM).toBeGreaterThan(0)
    expect(res.spinValues).toEqual([0.5, -0.5])
  })
})
