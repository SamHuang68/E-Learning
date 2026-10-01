import type { UiLocale } from './locale'

const EN: Record<string, string> = {
  "尚無事件紀錄。": "No events recorded yet.",
  "關閉": "Close",
  "學習事件統計": "Learning event statistics",
  "事件統計": "Event statistics",
  "目前階層導覽": "Current learning path"
}

export function teachingCopy(locale: UiLocale, text: string): string {
  if (locale !== 'en') return text
  const translated = EN[text]
  if (translated === undefined) throw new Error('缺少共用介面英文翻譯：' + text)
  return translated
}
