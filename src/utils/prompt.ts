import {
  defaultConfig,
  levels,
  modes,
  themes,
  type BuilderConfig,
} from '../data/course'

export function buildLessonPrompt(config: BuilderConfig): string {
  const theme = themes.find((t) => t.id === config.theme)
  const level = levels.find((l) => l.id === config.level)
  const mode = modes.find((m) => m.id === config.mode)

  return `# 日語音訊／對話課程提示詞

## 課程主題
- 標題：${config.topic}
- 主題分類：${theme?.label ?? config.theme}（${theme?.labelEn ?? ''}）
- JLPT 程度：${level?.label ?? config.level}（${level?.desc ?? ''}）
- 學習模式：${mode?.label ?? config.mode} — ${mode?.desc ?? ''}

## 雙人主持設定
### Host A｜${config.hostA.name}
- 性別：${config.hostA.gender}
- 語氣：${config.hostA.tone}
- 人設：${config.hostA.persona}

### Host B｜${config.hostB.name}
- 性別：${config.hostB.gender}
- 語氣：${config.hostB.tone}
- 人設：${config.hostB.persona}

## 產出要求
請以雙人播客／對話形式產出一堂 8–12 分鐘的日語學習音訊腳本，並遵守：

1. **語言比例**
   - 主對話以自然日語為主；必要說明可用繁體中文夾註。
   - 依 JLPT ${level?.label ?? config.level} 控制詞彙與文法難度，避免超綱。

2. **結構節奏（依「${mode?.label ?? config.mode}」）**
   - 開場 30 秒：問候＋今天目標
   - 核心學習：依模式展開（單字卡／情境對話／文法精練／沉浸故事）
   - 中段互動：Host B 提問或犯錯，Host A 溫和訂正並給替代句
   - 收尾：今日 5 個關鍵句複習＋一句鼓勵

3. **必含內容**
   - 8–12 個核心單字／句型（標示讀音）
   - 至少 2 段可跟讀的短對話
   - 1 個文化小知識（簡短）
   - 1 道聽後理解小測驗（3 選 1）

4. **語氣**
   - 像真正的學習播客：有節奏、有情緒起伏、不照本宣科。
   - 不要用條列講義口吻朗讀；要有來有往。

5. **輸出格式**
   - 以「Host A / Host B」標示對白
   - 重要日文附上假名或羅馬拼音
   - 最後附上「可複製單字表」

請直接開始腳本，不要前言解釋你的做法。`
}

export function mergeConfig(
  base: BuilderConfig,
  patch: Partial<BuilderConfig>,
): BuilderConfig {
  return {
    ...base,
    ...patch,
    hostA: { ...base.hostA, ...patch.hostA },
    hostB: { ...base.hostB, ...patch.hostB },
  }
}

export function encodeShare(config: BuilderConfig): string {
  const json = JSON.stringify(config)
  return btoa(unescape(encodeURIComponent(json)))
}

export function decodeShare(hash: string): BuilderConfig | null {
  try {
    const raw = decodeURIComponent(escape(atob(hash)))
    const parsed = JSON.parse(raw) as BuilderConfig
    return mergeConfig(defaultConfig, parsed)
  } catch {
    return null
  }
}
