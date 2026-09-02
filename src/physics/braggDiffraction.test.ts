import { describe, it, expect } from 'vitest'

/**
 * 固態物理：布拉格 X 光繞射定律 (Bragg's Law) 物理模型
 * 
 * 1. 立方晶系晶面間距：
 *    d_{hkl} = a / sqrt(h^2 + k^2 + l^2)
 * 
 * 2. 布拉格繞射條件：
 *    2 * d * sin(theta) = n * lambda  =>  sin(theta) = (n * lambda) / (2 * d)
 *    theta = arcsin((n * lambda) / (2 * d))
 */
export function calculateInterplanarSpacing(
  latticeConstantNm: number, // a
  h: number,
  k: number,
  l: number,
): number {
  return latticeConstantNm / Math.sqrt(h * h + k * k + l * l)
}

export function calculateBraggAngleDegrees(
  interplanarSpacingNm: number, // d
  wavelengthNm: number, // lambda
  order: number = 1, // n
): number {
  const sinTheta = (order * wavelengthNm) / (2 * interplanarSpacingNm)
  if (sinTheta > 1) throw new Error('No diffraction possible for this wavelength and spacing')
  const thetaRad = Math.asin(sinTheta)
  return Number(((thetaRad * 180) / Math.PI).toFixed(2))
}

describe('固態物理：布拉格 X 光繞射定律 (Bragg Diffraction) 單元測試', () => {
  it('氯化鈉 NaCl 晶格常數 a=0.564nm 之 (200) 晶面間距精算', () => {
    // a = 0.564 nm, (200) 晶面 => d = 0.564 / sqrt(4 + 0 + 0) = 0.564 / 2 = 0.282 nm
    const d200 = calculateInterplanarSpacing(0.564, 2, 0, 0)
    expect(d200).toBeCloseTo(0.282, 3)
  })

  it('銅 Ka 射線 (0.1542nm) 在 NaCl (200) 晶面之一階布拉格角為 15.86 度', () => {
    const d200 = 0.282 // nm
    const lambda = 0.1542 // nm
    // sin(theta) = 0.1542 / (2 * 0.282) = 0.1542 / 0.564 ≈ 0.2734 => theta ≈ 15.87°
    const theta = calculateBraggAngleDegrees(d200, lambda, 1)
    expect(theta).toBeCloseTo(15.87, 1)
  })
})
