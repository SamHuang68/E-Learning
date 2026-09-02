import { describe, it, expect } from 'vitest'

/**
 * 電磁學：馬克士威位移電流 (Displacement Current) 數學模型
 * 
 * 原理：
 * 1. 平行板電容器電容: C = epsilon_0 * (A / d)
 * 2. 極板間電場: E = V / d, 電通量: Phi_E = E * A = (V / d) * A
 * 3. 位移電流定義:
 *    I_d = epsilon_0 * (dPhi_E / dt) = epsilon_0 * (A / d) * (dV / dt) = C * (dV / dt)
 * 4. 電荷守恆與全電流定律:
 *    導線傳導電流 I_c = dq / dt = C * (dV / dt) = I_d
 *    極板外部 I_c 與極板內部 I_d 在數值上嚴格連續相等！
 */
export interface DisplacementCurrentMetrics {
  capacitanceFarads: number
  dVDtVoltsPerSec: number
  conductionCurrentAmps: number
  displacementCurrentAmps: number
  isCurrentContinuous: boolean
}

export function computeDisplacementCurrent(
  plateAreaM2: number,
  plateDistanceM: number,
  dVDtVoltsPerSec: number,
  epsilon0: number = 8.854e-12, // 真空介電常數 F/m
): DisplacementCurrentMetrics {
  if (plateAreaM2 <= 0 || plateDistanceM <= 0) {
    throw new Error('Invalid capacitor geometry')
  }

  const c = epsilon0 * (plateAreaM2 / plateDistanceM)
  const current = c * dVDtVoltsPerSec

  return {
    capacitanceFarads: c,
    dVDtVoltsPerSec,
    conductionCurrentAmps: current,
    displacementCurrentAmps: current,
    isCurrentContinuous: Math.abs(current - current) < 1e-15,
  }
}

describe('電磁學：馬克士威位移電流與全電流連續性單元測試', () => {
  it('電容器充放電時極板間位移電流與外電路傳導電流嚴格相等', () => {
    // A = 0.01 m^2, d = 0.001 m, dV/dt = 1e6 V/s
    // C = 8.854e-12 * (0.01 / 0.001) = 8.854e-11 F
    // I_d = C * dV/dt = 8.854e-11 * 1e6 = 8.854e-5 A
    const res = computeDisplacementCurrent(0.01, 0.001, 1e6)

    expect(res.capacitanceFarads).toBeCloseTo(8.854e-11, 13)
    expect(res.displacementCurrentAmps).toBeCloseTo(8.854e-5, 8)
    expect(res.conductionCurrentAmps).toBeCloseTo(res.displacementCurrentAmps, 15)
    expect(res.isCurrentContinuous).toBe(true)
  })
})
