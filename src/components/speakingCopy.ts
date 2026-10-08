import type { UiLocale } from '../i18n/locale'

export type SpeakingMessageCode = 'unsupported' | 'microphone-error' | null

export function formatSpeakingMessage(
  locale: UiLocale,
  code: SpeakingMessageCode,
): string {
  if (code === 'unsupported') {
    return locale === 'en'
      ? 'This browser does not support recording. You can still mark the shadowing prompt complete.'
      : '此瀏覽器不支援錄音；仍可標記跟讀完成。'
  }
  if (code === 'microphone-error') {
    return locale === 'en'
      ? 'The microphone could not be enabled. You can still mark the shadowing prompt complete.'
      : '無法啟用麥克風；仍可標記跟讀完成。'
  }
  return ''
}
