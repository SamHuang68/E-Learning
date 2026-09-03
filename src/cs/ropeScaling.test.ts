import { describe, it, expect } from 'vitest'

/**
 * 前沿大模型位置編碼：RoPE 旋轉位置嵌入與 NTK-Aware 外推縮放模型
 * 
 * 核心原理：
 * 1. 旋轉位置嵌入 (Rotary Position Embedding, Su et al. 2021):
 *    - 將 d 維 Query 與 Key 劃分為 d/2 個二維複平面子空間:
 *    - theta_i = base^(-2i / d), 通常 base = 10000
 *    - <R_m * q, R_n * k> = Re[q_comp * conj(k_comp) * exp(j * (m - n) * theta_i)]
 *    - 嚴格證明內積僅依賴相對距離 (m - n)!
 * 2. NTK-Aware 外推縮放 (Neural Tangent Kernel Interpolation):
 *    - 當上下文長度從 L 擴展至 alpha * L 時，若直接進行線性位置內插 (Linear Position Interpolation):
 *      高頻維度丟失相鄰 token 局部高解析度，導致模型在短距離文法推理困惑度 (PPL) 劇增。
 *    - NTK-Aware 縮放將頻率基數動態放大:
 *      base_new = base * alpha^(d / (d - 2))
 *    - 使高頻分量幾近不縮放 (保護相鄰位置精度)，低頻分量充分縮放 (容納遠距上下文)。
 */
export interface RoPEVector2D {
  real: number
  imag: number
}

export function applyRoPE2D(
  vec: RoPEVector2D,
  pos: number,
  theta: number,
): RoPEVector2D {
  const angle = pos * theta
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return {
    real: vec.real * cos - vec.imag * sin,
    imag: vec.real * sin + vec.imag * cos,
  }
}

export function computeNTKBase(
  originalBase: number = 10000,
  contextScaleFactorAlpha: number = 4, // 擴展 4 倍上下文 (如 4k -> 16k)
  dim: number = 128, // 單頭維度
): number {
  const exponent = dim / (dim - 2)
  return originalBase * Math.pow(contextScaleFactorAlpha, exponent)
}

describe('前沿 AI 模型：RoPE 相對位置不變性與 NTK-Aware 頻率縮放單元測試', () => {
  it('RoPE 內積嚴格由相對位置 (m - n) 決定，與絕對位置無關', () => {
    const q: RoPEVector2D = { real: 0.8, imag: 0.6 }
    const k: RoPEVector2D = { real: 0.5, imag: -0.5 }
    const theta = 0.05

    // 情況 1: m = 10, n = 6 (相對距離 = 4)
    const q1 = applyRoPE2D(q, 10, theta)
    const k1 = applyRoPE2D(k, 6, theta)
    const dot1 = q1.real * k1.real + q1.imag * k1.imag

    // 情況 2: m = 104, n = 100 (相對距離依然 = 4)
    const q2 = applyRoPE2D(q, 104, theta)
    const k2 = applyRoPE2D(k, 100, theta)
    const dot2 = q2.real * k2.real + q2.imag * k2.imag

    // 兩者內積數值完全相同
    expect(dot1).toBeCloseTo(dot2, 12)
  })

  it('NTK-Aware 外推在擴展 4 倍上下文時合理提升 Base 頻率以保護高頻特徵', () => {
    const originalBase = 10000
    const scaledBase = computeNTKBase(originalBase, 4, 128)

    // base 應從 10000 平滑放大至約 40890 左右，而非簡單的線性截斷
    expect(scaledBase).toBeGreaterThan(originalBase * 4)
    expect(scaledBase).toBeCloseTo(40890, 0)
  })
})
