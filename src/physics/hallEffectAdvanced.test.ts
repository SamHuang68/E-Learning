import { describe, it, expect } from 'vitest'

/**
 * 霍爾效應 (Hall Effect) 微觀載子物理模型
 * 
 * 參數：
 * - I: 導電電流 (A)
 * - B: 外加磁場強度 (T)
 * - d: 樣品厚度 (平行於磁場方向, m)
 * - w: 樣品寬度 (垂直於電流與磁場方向, m)
 * - n: 載子濃度 (1/m^3)
 * - q: 載子電荷量 (電子為 -1.602e-19 C, 電洞為 +1.602e-19 C)
 * 
 * 核心公式：
 * 霍爾電壓 V_H = (I * B) / (n * q * d)
 * 霍爾係數 R_H = 1 / (n * q) = (V_H * d) / (I * B)
 * 載子漂移速度 v_d = I / (n * q * w * d)
 */
export interface HallEffectResult {
  hallVoltageVolts: number
  hallCoefficientM3PerC: number
  carrierDriftVelocityMPerS: number
  semiconductorType: 'n-type' | 'p-type'
}

export function computeHallEffect(
  currentAmps: number,
  magneticFieldTesla: number,
  thicknessMeters: number,
  widthMeters: number,
  carrierDensityPerM3: number,
  isElectronCarrier: boolean = true,
): HallEffectResult {
  const e = 1.602e-19
  const q = isElectronCarrier ? -e : e
  const hallVoltageVolts = (currentAmps * magneticFieldTesla) / (carrierDensityPerM3 * q * thicknessMeters)
  const hallCoefficientM3PerC = 1 / (carrierDensityPerM3 * q)
  const carrierDriftVelocityMPerS = currentAmps / (carrierDensityPerM3 * Math.abs(q) * widthMeters * thicknessMeters)

  return {
    hallVoltageVolts,
    hallCoefficientM3PerC,
    carrierDriftVelocityMPerS,
    semiconductorType: isElectronCarrier ? 'n-type' : 'p-type',
  }
}

describe('固態物理：霍爾效應 (Hall Effect) 與微觀載子傳輸單元測試', () => {
  it('銅導線載子濃度 8.5e28 下霍爾電壓為微伏特級 (微弱但可測)', () => {
    // I = 10 A, B = 1.2 T, d = 0.5 mm = 5e-4 m, w = 1.0 cm = 0.01 m, n = 8.5e28 m^-3
    const res = computeHallEffect(10.0, 1.2, 5e-4, 0.01, 8.5e28, true)

    // V_H 應為負值 (電子為載子)，量級約為 -1.76e-6 V (-1.76 μV)
    expect(res.hallVoltageVolts * 1e6).toBeCloseTo(-1.76, 1)
    expect(res.semiconductorType).toBe('n-type')

    // 漂移速度極慢，約為 0.147 mm/s (1.47e-4 m/s)
    expect(res.carrierDriftVelocityMPerS * 1e3).toBeCloseTo(0.147, 2)
  })

  it('P型半導體電洞導電產生正霍爾電壓直接辨識載子極性', () => {
    // 摻雜矽片：n = 1.0e22 m^-3 (電洞), I = 1.0 mA = 1e-3 A, B = 0.5 T, d = 100 μm = 1e-4 m
    const res = computeHallEffect(1e-3, 0.5, 1e-4, 1e-3, 1.0e22, false)

    // 由於電洞帶正電，V_H 必為正值
    expect(res.hallVoltageVolts).toBeGreaterThan(0)
    expect(res.semiconductorType).toBe('p-type')
    // V_H = (1e-3 * 0.5) / (1e22 * 1.602e-19 * 1e-4) = 0.5e-3 / 1.602e-1 ≈ 3.12 mV
    expect(res.hallVoltageVolts * 1e3).toBeCloseTo(3.12, 1)
  })
})
