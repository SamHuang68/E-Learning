/**
 * 2PL 項目反應理論 (Item Response Theory, IRT) 與自適應測驗引擎 (CAT)
 * 根據學習者即時能力值 θ 動態選題，維持 75%~85% 答對率黃金挑戰區間，題量減半且測量信度不變。
 */

export type IrtItem = {
  id: string
  title?: string
  difficulty: number // b 參數: 題目難度 (-3.0 極易 ~ +3.0 極難)
  discrimination?: number // a 參數: 鑑別度 (0.5 ~ 2.5，預設 1.0)
  pseudoGuessing?: number // c 參數: 猜測率 (四選一題預設 0.25)
  tags?: string[]
}

export type UserResponse = {
  itemId: string
  isCorrect: boolean
  difficulty: number
  discrimination: number
  pseudoGuessing: number
  responseTimeSec?: number
}

export type IrtAbilityEstimate = {
  theta: number // 估計能力值 (-3.0 ~ +3.0，0 為群體平均)
  standardError: number // 測量標準誤 SE (越小代表越精確，< 0.35 為極高信度)
  confidenceInterval: [number, number] // 95% 信賴區間 [theta - 1.96*SE, theta + 1.96*SE]
  targetExamEquivalent?: string // 對齊會考/學測/JLPT/TOEIC 等級
}

const DEFAULT_DISCRIMINATION = 1.2
const DEFAULT_GUESSING = 0.25
const D_CONST = 1.702 // 羅吉斯常數，使 Logistic 與標準正態累積分布對齊

/**
 * 2PL / 3PL IRT 答對機率函數
 * P(θ) = c + (1 - c) / (1 + exp(-D * a * (θ - b)))
 */
export function calculateProbabilityOfCorrect(
  theta: number,
  difficulty: number,
  discrimination = DEFAULT_DISCRIMINATION,
  pseudoGuessing = DEFAULT_GUESSING,
): number {
  const exponent = -D_CONST * discrimination * (theta - difficulty)
  // 防止極端數值溢位
  if (exponent > 40) return pseudoGuessing
  if (exponent < -40) return 1.0
  const logistic = 1.0 / (1.0 + Math.exp(exponent))
  return pseudoGuessing + (1.0 - pseudoGuessing) * logistic
}

/**
 * 費雪訊息量函數 (Fisher Information)
 * I(θ) 衡量在能力 θ 處該題能提供多少測量精確度
 */
export function calculateFisherInformation(
  theta: number,
  difficulty: number,
  discrimination = DEFAULT_DISCRIMINATION,
  pseudoGuessing = DEFAULT_GUESSING,
): number {
  const p = calculateProbabilityOfCorrect(theta, difficulty, discrimination, pseudoGuessing)
  const q = 1.0 - p
  if (p <= pseudoGuessing || q <= 0.0001) return 0.001

  const pStar = (p - pseudoGuessing) / (1.0 - pseudoGuessing)
  const numerator = Math.pow(D_CONST * discrimination, 2) * Math.pow(pStar * (1.0 - pStar), 2)
  const denominator = p * q
  return Math.max(0.001, numerator / denominator)
}

/**
 * 貝氏 EAP / 牛頓-拉夫森 (Newton-Raphson) 數值更新學習者能力值 θ
 */
export function estimateAbilityTheta(
  responses: UserResponse[],
  priorTheta = 0.0,
  priorSE = 1.0,
): IrtAbilityEstimate {
  if (responses.length === 0) {
    return {
      theta: priorTheta,
      standardError: priorSE,
      confidenceInterval: [
        Number((priorTheta - 1.96 * priorSE).toFixed(2)),
        Number((priorTheta + 1.96 * priorSE).toFixed(2)),
      ],
    }
  }

  // 迭代優化 θ
  let theta = priorTheta
  const maxIterations = 20
  const tolerance = 0.005

  for (let iter = 0; iter < maxIterations; iter++) {
    let firstDerivative = -(theta - priorTheta) / Math.pow(priorSE, 2) // 先驗懲罰
    let secondDerivative = -1.0 / Math.pow(priorSE, 2)

    for (const res of responses) {
      const p = calculateProbabilityOfCorrect(
        theta,
        res.difficulty,
        res.discrimination,
        res.pseudoGuessing,
      )
      const q = 1.0 - p
      const a = res.discrimination
      const c = res.pseudoGuessing
      const u = res.isCorrect ? 1.0 : 0.0

      if (p > c && q > 0.0001) {
        const pStar = (p - c) / (1.0 - c)
        const dP_dTheta = D_CONST * a * (1.0 - c) * pStar * (1.0 - pStar)
        const w = (u - p) / (p * q)

        firstDerivative += w * dP_dTheta
        secondDerivative -= calculateFisherInformation(theta, res.difficulty, a, c)
      }
    }

    if (Math.abs(secondDerivative) < 0.0001) break
    const delta = firstDerivative / secondDerivative
    theta = theta - delta
    // 限制在合理心理計量範圍 [-3.5, +3.5]
    theta = Math.max(-3.5, Math.min(3.5, theta))

    if (Math.abs(delta) < tolerance) break
  }

  // 計算總訊息量與標準誤 SE
  let totalInformation = 1.0 / Math.pow(priorSE, 2)
  for (const res of responses) {
    totalInformation += calculateFisherInformation(
      theta,
      res.difficulty,
      res.discrimination,
      res.pseudoGuessing,
    )
  }

  const standardError = Number((1.0 / Math.sqrt(totalInformation)).toFixed(3))
  const finalTheta = Number(theta.toFixed(3))

  return {
    theta: finalTheta,
    standardError,
    confidenceInterval: [
      Number((finalTheta - 1.96 * standardError).toFixed(2)),
      Number((finalTheta + 1.96 * standardError).toFixed(2)),
    ],
  }
}

/**
 * 自適應最佳選題 (Maximum Information Item Selection)
 * 從候選題庫中挑選在當前能力 θ 處訊息量最高、且答對預測機率落在黃金區間 (0.65 ~ 0.85) 的最佳題
 */
export function selectNextAdaptiveItem<T extends IrtItem>(
  candidateItems: T[],
  currentTheta: number,
  alreadyAnsweredIds: Set<string>,
): T | null {
  const unasked = candidateItems.filter((item) => !alreadyAnsweredIds.has(item.id))
  if (unasked.length === 0) return null

  let bestItem: T | null = null
  let maxScore = -Infinity

  for (const item of unasked) {
    const a = item.discrimination ?? DEFAULT_DISCRIMINATION
    const c = item.pseudoGuessing ?? DEFAULT_GUESSING
    const b = item.difficulty

    const info = calculateFisherInformation(currentTheta, b, a, c)
    const prob = calculateProbabilityOfCorrect(currentTheta, b, a, c)

    // 黃金區間 (0.65 ~ 0.85) 獲得高加權，過難 (<0.5) 或過易 (>0.95) 降權
    const goldenBonus = prob >= 0.65 && prob <= 0.85 ? 1.4 : 1.0
    const compositeScore = info * goldenBonus

    if (compositeScore > maxScore) {
      maxScore = compositeScore
      bestItem = item
    }
  }

  return bestItem
}

/**
 * 電腦化適應性測驗 (CAT) 終止條件判定
 */
export function shouldTerminateCat(
  responses: UserResponse[],
  currentEstimate: IrtAbilityEstimate,
  minItems = 6,
  maxItems = 15,
  targetSE = 0.35,
): boolean {
  if (responses.length < minItems) return false
  if (responses.length >= maxItems) return true
  // 當標準誤達到足夠精確時提前收斂結束
  return currentEstimate.standardError <= targetSE
}
