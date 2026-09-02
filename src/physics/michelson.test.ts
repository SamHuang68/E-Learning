import { describe, it, expect } from 'vitest'

/**
 * 邁克生干涉儀 (Michelson Interferometer) 物理數學模型
 * 
 * 1. 動鏡位移與條紋移動數關係：
 *    動鏡每移動一段距離 Δd，該光臂來回光程增加 2Δd。
 *    因此每移動半個光波長 (λ / 2)，光程差變化一個整波長 λ，中央視野移動一條明暗條紋。
 *    Δd = m * (λ / 2)  =>  λ = (2 * Δd) / m
 * 
 * 2. 氣體折射率測定：
 *    樣品管長度 t，抽真空後再充入氣體 (折射率 n)，光程增加 2 * (n - 1) * t。
 *    2 * (n - 1) * t = m * λ  =>  n = 1 + (m * λ) / (2 * t)
 */
export function calculateWavelengthFromMichelson(
  mirrorDisplacementMeters: number, // Δd
  fringeCount: number, // m
): number {
  return (2 * mirrorDisplacementMeters) / fringeCount
}

export function calculateGasRefractiveIndex(
  cellLengthMeters: number, // t
  fringeCount: number, // m
  wavelengthMeters: number, // λ
): number {
  const n = 1 + (fringeCount * wavelengthMeters) / (2 * cellLengthMeters)
  return Number(n.toFixed(6))
}

describe('近代光學：邁克生干涉儀 (Michelson Interferometer) 單元測試', () => {
  it('氦氖雷射動鏡位移 0.1582 mm 產生 500 條條紋移動推算波長為 632.8 nm', () => {
    // Δd = 0.1582 mm = 1.582e-4 m, m = 500
    const lambda = calculateWavelengthFromMichelson(1.582e-4, 500)
    // 預期波長 λ = 632.8 nm = 6.328e-7 m
    expect(lambda * 1e9).toBeCloseTo(632.8, 1)
  })

  it('樣品管長 10.0 cm 充入空氣產生 93 條 632.8nm 條紋測定空氣折射率為 1.000294', () => {
    // t = 0.10 m, m = 93, λ = 632.8e-9 m
    const nAir = calculateGasRefractiveIndex(0.10, 93, 632.8e-9)
    // 2 * (n - 1) * 0.10 = 93 * 632.8e-9 => n - 1 ≈ 2.942e-4 => n ≈ 1.000294
    expect(nAir).toBeCloseTo(1.000294, 5)
  })
})
