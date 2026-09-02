import { describe, it, expect } from 'vitest'

/**
 * 數值量化 (Numerical Quantization) 核心數學模型
 * 
 * 將高精度浮點數 (FP32 / FP16) 映射至低位元整數 (INT8 / INT4):
 * r = S * (q - Z)
 * q = clamp(round(r / S) + Z, q_min, q_max)
 * 
 * - S: Scale Factor (縮放因子, 浮點數)
 * - Z: Zero Point (零點偏移, 整數)
 */
export interface QuantizationParams {
  scale: number
  zeroPoint: number
  qMin: number
  qMax: number
}

export function computeQuantizationParams(
  rMin: number,
  rMax: number,
  bits: number = 8,
  symmetric: boolean = true,
): QuantizationParams {
  if (symmetric) {
    const maxVal = Math.max(Math.abs(rMin), Math.abs(rMax))
    const qMax = Math.pow(2, bits - 1) - 1
    const qMin = -Math.pow(2, bits - 1)
    const scale = maxVal / qMax
    const zeroPoint = 0
    return { scale, zeroPoint, qMin, qMax }
  } else {
    const qMin = 0
    const qMax = Math.pow(2, bits) - 1
    const scale = (rMax - rMin) / (qMax - qMin)
    const zeroPoint = Math.round(-rMin / scale) || 0
    return { scale, zeroPoint, qMin, qMax }
  }
}

export function quantizeValue(r: number, params: QuantizationParams): number {
  const scaled = Math.round(r / params.scale) + params.zeroPoint
  return Math.max(params.qMin, Math.min(params.qMax, scaled))
}

export function dequantizeValue(q: number, params: QuantizationParams): number {
  return params.scale * (q - params.zeroPoint)
}

/**
 * 評估大語言模型權重量化顯存節省與吞吐加速比
 */
export function estimateModelVramFootprint(
  paramCountBillions: number, // 例如 70 代表 70B
  precision: 'FP32' | 'FP16' | 'INT8' | 'INT4',
): { weightVramGB: number; vramReductionPercent: number } {
  const bytesPerParam =
    precision === 'FP32' ? 4 : precision === 'FP16' ? 2 : precision === 'INT8' ? 1 : 0.5

  const baselineBytes = paramCountBillions * 2 // 以 FP16 為基準 (2 bytes)
  const actualBytes = paramCountBillions * bytesPerParam

  const weightVramGB = Number(actualBytes.toFixed(1))
  const vramReductionPercent = Number((((baselineBytes - actualBytes) / baselineBytes) * 100).toFixed(1))

  return {
    weightVramGB,
    vramReductionPercent,
  }
}

describe('大語言模型權重量化 (Quantization) 單元測試', () => {
  it('INT8 對稱量化與反量化數值重建誤差控制在極小範圍', () => {
    // 浮點數範圍 [-3.2, 3.2]，8 位元對稱量化 (qMin=-128, qMax=127)
    const params = computeQuantizationParams(-3.2, 3.2, 8, true)
    expect(params.zeroPoint).toBe(0)
    expect(params.qMax).toBe(127)
    expect(params.scale).toBeCloseTo(3.2 / 127, 4)

    // 測試輸入 r = 1.6
    const q = quantizeValue(1.6, params)
    expect(q).toBe(Math.round(1.6 / params.scale))

    // 反量化
    const rHat = dequantizeValue(q, params)
    expect(Math.abs(rHat - 1.6)).toBeLessThan(0.03) // 誤差小於 0.03
  })

  it('INT4 非對稱量化有效限制於 [0, 15] 區間且支援零點偏移', () => {
    // 浮點數範圍 [0.0, 6.0]，4 位元非對稱量化
    const params = computeQuantizationParams(0.0, 6.0, 4, false)
    expect(params.qMin).toBe(0)
    expect(params.qMax).toBe(15)
    expect(params.zeroPoint).toBe(0)

    const q = quantizeValue(3.0, params)
    expect(q).toBeGreaterThanOrEqual(7)
    expect(q).toBeLessThanOrEqual(8)

    // 極值截斷
    const qOverflow = quantizeValue(10.0, params)
    expect(qOverflow).toBe(15)
  })

  it('70B 大語言模型經 INT4 量化後顯存佔用由 140GB 驟降至 35GB (縮減 75%)', () => {
    const fp16 = estimateModelVramFootprint(70, 'FP16')
    expect(fp16.weightVramGB).toBe(140.0)
    expect(fp16.vramReductionPercent).toBe(0.0)

    const int4 = estimateModelVramFootprint(70, 'INT4')
    expect(int4.weightVramGB).toBe(35.0)
    expect(int4.vramReductionPercent).toBe(75.0) // 精確減少 75% 顯存開銷
  })
})
