import type { UiLocale } from './locale'

export const TOEIC_BUILDER_EN: Record<string, string> = {
  '依證書級距產生日課提示詞': 'Build a daily lesson prompt by certificate band',
  '選擇橘／綠／藍／金證書與商務主題，產生可給 ChatGPT / Claude / NotebookLM 使用的多益訓練腳本提示詞。': 'Choose an orange, green, blue, or gold certificate band and a business topic to create a TOEIC lesson-script prompt for ChatGPT / Claude / NotebookLM.',
  '多益證書級距': 'TOEIC certificate bands',
  '主題': 'Topic',
  '雙人主持': 'Two hosts',
  '產出提示詞': 'Generated prompt',
  '已產生本地提示詞': 'Local prompt generated',
  '已更新並複製': 'Updated and copied',
  '基礎自我介紹': 'Basic introductions',
  '字母＋短句聽辨': 'Alphabet and short listening tasks',
  '綠色郵件': 'Green-level email',
  '預約與禮貌請求': 'Appointments and polite requests',
  '藍色會議': 'Blue-level meetings',
  '例行業務與客戶對話': 'Routine business and client conversations',
  '金色談判': 'Gold-level negotiation',
  '主持會議與協商': 'Chairing meetings and negotiating',
}

export function toeicBuilderCopy(locale: UiLocale, source: string): string {
  if (locale !== 'en') return source
  if (!Object.hasOwn(TOEIC_BUILDER_EN, source)) throw new Error('缺少 TOEIC 課程工具英文翻譯：' + source)
  const translated = TOEIC_BUILDER_EN[source]
  if (!translated.trim() || /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/.test(translated)) {
    throw new Error('TOEIC 課程工具英文翻譯無效：' + source)
  }
  return translated
}
