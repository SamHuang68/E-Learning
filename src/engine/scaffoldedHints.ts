/**
 * 蘇格拉底式 4 級階梯提示引擎 (Scaffolded Hinting Engine)
 * 避免直接給予答案產生「能力錯覺」，依序提供：
 * Level 1: 觀念診斷 ➜ Level 2: 子問題拆解 ➜ Level 3: 類似結構示例 ➜ Level 4: 完整推導
 * 優先整合本地端 Ollama (Llama 3.3 / Mistral)，離線時無縫回退至啟發式階梯庫。
 */

export type HintLevel = 1 | 2 | 3 | 4

export type ScaffoldedHint = {
  level: HintLevel
  levelTitle: string
  badgeText: string
  content: string
  actionPrompt?: string
}

export type QuestionContext = {
  id: string
  track: 'math' | 'ja' | 'en'
  prompt: string
  topic: string
  choices?: string[]
  solutionSteps?: string[]
  explanation?: string
  keyFormulaOrSignal?: string
}

export type OllamaConfig = {
  endpoint: string // 預設 http://localhost:11434
  model: string // 預設 llama3.3 或 mistral (嚴格禁止中系模型)
  timeoutMs: number // 預設 4000ms
}

export const DEFAULT_OLLAMA_CONFIG: OllamaConfig = {
  endpoint: 'http://localhost:11434',
  model: 'llama3.3',
  timeoutMs: 4000,
}

/**
 * 產生 4 級靜態啟發式階梯提示（離線保底通道）
 */
export function getHeuristicScaffoldHints(ctx: QuestionContext): ScaffoldedHint[] {
  const isMath = ctx.track === 'math'
  const isJa = ctx.track === 'ja'

  // Level 1: 觀念診斷
  const l1Title = isMath ? '核心公式與破題訊號' : isJa ? '關鍵句型與動作訊號' : 'Business Context & Signal'
  const l1Content =
    ctx.keyFormulaOrSignal ||
    (isMath
      ? `本題聚焦於「${ctx.topic}」。請先觀察題目的已知條件與未知數關係，回想相關定理定義。`
      : isJa
        ? `本題關鍵在於辨識「${ctx.topic}」的情境動作訊號（如：事前準備、事後狀態或主被動關係）。`
        : `Focus on "${ctx.topic}". Identify the main verb tense, subject agreement, or business situation.`)

  // Level 2: 子問題拆解
  const l2Title = '第一步思考引導 (Sub-problem)'
  const l2Content =
    ctx.solutionSteps && ctx.solutionSteps.length > 0
      ? `第一步：${ctx.solutionSteps[0]}`
      : isMath
        ? '嘗試先將問題簡化：若有多餘常數或同類項，先進行合併或等量消去。'
        : isJa
          ? '先確認說話者（我）與對象（對方）的視角方向，排除方向相反的干擾選項。'
          : 'Eliminate options that have the wrong part of speech or clash with the time signal.'

  // Level 3: 類似結構示例
  const l3Title = '類似結構示例 (Worked Example)'
  const l3Content = isMath
    ? '類比思路：處理此類題型時，就像在天平兩端進行相同操作，保持兩側守恆。'
    : isJa
      ? '情境類比：例如「会議の前に資料を印刷しておきます」（～ておく：事前做好準備）。'
      : 'Parallel Example: "Due to the merger, the board announced a restructuring plan." (Notice cause-and-effect preposition).'

  // Level 4: 完整推導
  const l4Title = '完整推導詳解 (Full Derivation)'
  const l4Content =
    ctx.explanation ||
    (ctx.solutionSteps && ctx.solutionSteps.length > 1
      ? ctx.solutionSteps.join('\n')
      : '根據上述步驟依序推導，即可鎖定正確答案。請點擊詳解卡片查看完整解析。')

  return [
    {
      level: 1,
      levelTitle: l1Title,
      badgeText: '第 1 階 · 觀念診斷',
      content: l1Content,
      actionPrompt: '有了這個概念，你能看出第一步該怎麼做嗎？',
    },
    {
      level: 2,
      levelTitle: l2Title,
      badgeText: '第 2 階 · 拆解步驟',
      content: l2Content,
      actionPrompt: '順著第一步，嘗試計算或排除一個選項！',
    },
    {
      level: 3,
      levelTitle: l3Title,
      badgeText: '第 3 階 · 平行示例',
      content: l3Content,
      actionPrompt: '對比這個例子，回到原題試著得出答案！',
    },
    {
      level: 4,
      levelTitle: l4Title,
      badgeText: '第 4 階 · 完整解答',
      content: l4Content,
    },
  ]
}

/**
 * 透過本地端 Ollama 呼叫非中系開源模型（如 Llama 3.3 / Mistral）生成智慧蘇格拉底提示
 * 具備 Timeout 防護與自動降級機制
 */
export async function requestSocraticHintFromOllama(
  ctx: QuestionContext,
  targetLevel: HintLevel,
  config = DEFAULT_OLLAMA_CONFIG,
): Promise<string> {
  const systemPrompt = `你是一位專業的蘇格拉底式學習教練。你的任務是引導學生思考，絕對不能直接說出最終答案。
請依照指定的提示階段（Level ${targetLevel}）提供繁體中文引導：
- Level 1: 僅提供核心觀念與定義，指出思考方向。
- Level 2: 拆解出第一步子問題，引導學生踏出第一步。
- Level 3: 提供一個不同數字/單字的平行結構示例。
- Level 4: 逐步推導但要求學生完成最後一步確認。
請保持在 80 字以內，簡明有力、富含啟發性。`

  const userPrompt = `題目情境：[${ctx.track.toUpperCase()}] ${ctx.prompt}
主題：${ctx.topic}
請輸出 Level ${targetLevel} 的引導提示。`

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs)

    const response = await fetch(`${config.endpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.model,
        prompt: `${systemPrompt}\n\n${userPrompt}`,
        stream: false,
        options: { temperature: 0.3, num_predict: 120 },
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Ollama response status: ${response.status}`)
    }

    const data = (await response.json()) as { response?: string }
    if (data.response && data.response.trim().length > 0) {
      return data.response.trim()
    }
    throw new Error('Empty response from Ollama')
  } catch {
    // 降級回退到靜態啟發式階梯提示
    const fallbacks = getHeuristicScaffoldHints(ctx)
    return fallbacks[targetLevel - 1].content
  }
}
