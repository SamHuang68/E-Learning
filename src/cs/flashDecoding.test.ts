import { describe, it, expect } from 'vitest'

/**
 * 現代大模型長文本推論加速：FlashDecoding 演算法
 * 
 * 核心機制：沿 Key/Value 序列維度分塊 (Split KV Cache across SMs)
 * 各塊獨立計算局部 (m_b, l_b, o_b)，最後跨塊進行 Log-Sum-Exp 歸約融合
 */
export interface FlashDecodingBlockResult {
  blockIndex: number
  localMax: number // m_b
  localSumExp: number // l_b
  localOutput: number[] // o_b
}

export function computeFlashDecodingBlock(
  q: number[], // (d)
  keysBlock: number[][], // (C x d)
  valuesBlock: number[][], // (C x d)
  blockIndex: number,
): FlashDecodingBlockResult {
  const d = q.length
  const scale = Math.sqrt(d)

  // 1. 計算該塊的 logits
  const logits = keysBlock.map((k) => {
    let dot = 0
    for (let i = 0; i < d; i++) dot += q[i] * k[i]
    return dot / scale
  })

  // 2. 局部最大值 m_b
  const localMax = Math.max(...logits)

  // 3. 局部 sum of exp
  const expVals = logits.map((val) => Math.exp(val - localMax))
  const localSumExp = expVals.reduce((a, b) => a + b, 0)

  // 4. 局部加權和 o_b
  const localOutput = new Array(d).fill(0)
  for (let j = 0; j < valuesBlock.length; j++) {
    const weight = expVals[j]
    for (let i = 0; i < d; i++) {
      localOutput[i] += weight * valuesBlock[j][i]
    }
  }

  return { blockIndex, localMax, localSumExp, localOutput }
}

/**
 * 跨塊 Log-Sum-Exp 歸約融合 (Cross-Block Reduction)
 */
export function reduceFlashDecodingBlocks(
  blocks: FlashDecodingBlockResult[],
): number[] {
  const d = blocks[0].localOutput.length

  // 全域最大值
  const globalMax = Math.max(...blocks.map((b) => b.localMax))

  // 重新縮放後的總分母
  let globalSumExp = 0
  for (const b of blocks) {
    const rescale = Math.exp(b.localMax - globalMax)
    globalSumExp += b.localSumExp * rescale
  }

  // 融合輸出
  const finalOutput = new Array(d).fill(0)
  for (const b of blocks) {
    const rescale = Math.exp(b.localMax - globalMax)
    for (let i = 0; i < d; i++) {
      finalOutput[i] += b.localOutput[i] * rescale
    }
  }

  return finalOutput.map((v) => Number((v / globalSumExp).toFixed(4)))
}

describe('前沿 AI：FlashDecoding (KV 分塊並行與 Log-Sum-Exp 歸約) 單元測試', () => {
  it('分塊並行融合結果與標準單體 Softmax 注意力計算嚴格一致 (零誤差)', () => {
    const q = [1.0, 0.5] // d = 2
    // 總長度為 4 的序列，分為 2 個塊 (每塊長度 2)
    const block0K = [
      [1.0, 0.0],
      [0.0, 1.0],
    ]
    const block0V = [
      [10.0, 20.0],
      [30.0, 40.0],
    ]

    const block1K = [
      [1.5, 0.5],
      [-0.5, 1.0],
    ]
    const block1V = [
      [50.0, 60.0],
      [70.0, 80.0],
    ]

    // 1. FlashDecoding 分塊並行運算
    const b0 = computeFlashDecodingBlock(q, block0K, block0V, 0)
    const b1 = computeFlashDecodingBlock(q, block1K, block1V, 1)
    const flashOutput = reduceFlashDecodingBlocks([b0, b1])

    // 2. 標準全域 Attention 計算
    const allK = [...block0K, ...block1K]
    const allV = [...block0V, ...block1V]
    const scale = Math.sqrt(2)
    const allLogits = allK.map((k) => (q[0] * k[0] + q[1] * k[1]) / scale)
    const maxL = Math.max(...allLogits)
    const exps = allLogits.map((l) => Math.exp(l - maxL))
    const sumE = exps.reduce((a, b) => a + b, 0)
    const trueWeights = exps.map((e) => e / sumE)

    const standardOutput = [
      Number((trueWeights.reduce((acc, w, idx) => acc + w * allV[idx][0], 0)).toFixed(4)),
      Number((trueWeights.reduce((acc, w, idx) => acc + w * allV[idx][1], 0)).toFixed(4)),
    ]

    expect(flashOutput).toEqual(standardOutput)
  })
})
