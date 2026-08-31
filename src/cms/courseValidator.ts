/**
 * 標準化課程包結構與自動驗證校驗引擎 (Course Pack Validator)
 * 借鏡 LibreLingo，提供開放式題庫資料結構規範與自動化語法、唯一性與答案完整性檢驗。
 */

export type CoursePackQuestion = {
  id: string
  prompt: string
  choices: string[]
  answer: string
  explanation?: string
  topic?: string
  tags?: string[]
  difficulty?: number // -3.0 ~ +3.0
  keyFormulaOrSignal?: string
}

export type CoursePackUnit = {
  id: string
  title: string
  description?: string
  suggestedLabId?: string
  questions: CoursePackQuestion[]
}

export type CoursePack = {
  schemaVersion: '1.0' | '2.0'
  track: 'math' | 'ja' | 'en'
  title: string
  description: string
  author?: string
  language: string
  units: CoursePackUnit[]
}

export type ValidationResult = {
  isValid: boolean
  errors: string[]
  warnings: string[]
  stats: {
    unitCount: number
    totalQuestions: number
    uniqueTopics: number
  }
}

/**
 * 檢查 LaTeX 語法是否有未閉合符號（如未成對的 $ 或未對齊的括號）
 */
function checkLatexSyntax(str: string): string[] {
  const issues: string[] = []
  const dollarCount = (str.match(/(?<!\\)\$/g) || []).length
  if (dollarCount % 2 !== 0) {
    issues.push(`未閉合的 KaTeX $ 符號 (出現 ${dollarCount} 個 $)`)
  }

  let braceDepth = 0
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '{' && (i === 0 || str[i - 1] !== '\\')) braceDepth++
    if (str[i] === '}' && (i === 0 || str[i - 1] !== '\\')) braceDepth--
    if (braceDepth < 0) {
      issues.push('出現未配對的多餘右括號 }')
      break
    }
  }
  if (braceDepth > 0) {
    issues.push(`有 ${braceDepth} 個未閉合的左括號 {`)
  }

  return issues
}

/**
 * 深度驗證課程包 (Course Pack Validator)
 */
export function validateCoursePack(raw: unknown): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!raw || typeof raw !== 'object') {
    return {
      isValid: false,
      errors: ['課程包必須為非空的 JSON 物件'],
      warnings: [],
      stats: { unitCount: 0, totalQuestions: 0, uniqueTopics: 0 },
    }
  }

  const pack = raw as Partial<CoursePack>

  // 1. 頂層元資料檢驗
  if (!pack.title || typeof pack.title !== 'string') {
    errors.push('缺少課程包名稱 (title)');
  }
  if (!pack.track || !['math', 'ja', 'en'].includes(pack.track)) {
    errors.push('學習軌道 (track) 必須為 "math"、"ja" 或 "en"');
  }
  if (!Array.isArray(pack.units) || pack.units.length === 0) {
    errors.push('課程包必須包含至少 1 個單元 (units 陣列)');
  }

  const seenQuestionIds = new Set<string>()
  const topicsSet = new Set<string>()
  let totalQuestions = 0

  // 2. 各單元與題庫檢驗
  if (Array.isArray(pack.units)) {
    pack.units.forEach((unit, uIdx) => {
      const unitPrefix = `[單元 ${uIdx + 1}: ${unit.title || '未命名'}]`

      if (!unit.id) errors.push(`${unitPrefix} 缺少單元唯一識別碼 (id)`)
      if (!unit.title) errors.push(`${unitPrefix} 缺少單元標題 (title)`)

      if (!Array.isArray(unit.questions) || unit.questions.length === 0) {
        warnings.push(`${unitPrefix} 單元內沒有任何題目`)
        return
      }

      unit.questions.forEach((q, qIdx) => {
        totalQuestions++
        const qPrefix = `${unitPrefix} [題目 ${qIdx + 1} (${q.id || '無ID'})]`

        if (!q.id) {
          errors.push(`${qPrefix} 缺少題目 ID`)
        } else if (seenQuestionIds.has(q.id)) {
          errors.push(`${qPrefix} 題目 ID 重複: "${q.id}"`)
        } else {
          seenQuestionIds.add(q.id)
        }

        if (!q.prompt || q.prompt.trim().length === 0) {
          errors.push(`${qPrefix} 題目題幹 (prompt) 不可為空`)
        } else {
          // 檢查題幹 LaTeX
          const latexIssues = checkLatexSyntax(q.prompt)
          latexIssues.forEach((issue) => {
            errors.push(`${qPrefix} 題幹 LaTeX 錯誤: ${issue}`)
          })
        }

        if (!Array.isArray(q.choices) || q.choices.length < 2) {
          errors.push(`${qPrefix} 題目選項 (choices) 至少需有 2 個選項`)
        } else {
          // 檢查答案是否在選項內
          if (!q.answer) {
            errors.push(`${qPrefix} 缺少標準答案 (answer)`)
          } else if (!q.choices.includes(q.answer)) {
            errors.push(`${qPrefix} 標準答案 "${q.answer}" 不存在於 choices 選項列表中`)
          }

          // 檢查選項重複性
          const uniqueChoices = new Set(q.choices)
          if (uniqueChoices.size !== q.choices.length) {
            warnings.push(`${qPrefix} choices 選項清單中存在重複文字`)
          }
        }

        if (q.topic) topicsSet.add(q.topic)
      })
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats: {
      unitCount: Array.isArray(pack.units) ? pack.units.length : 0,
      totalQuestions,
      uniqueTopics: topicsSet.size,
    },
  }
}
