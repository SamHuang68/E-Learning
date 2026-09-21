import { useI18n } from '../i18n/i18n'

/** Teaching note only — not a pitch scorer, JLPT credential, or fluency claim. */
export function PitchAccentTip() {
  const { t } = useI18n()

  return (
    <aside className="kana-pitch-tip" role="note" aria-labelledby="kana-pitch-title">
      <strong id="kana-pitch-title">{t('ja.pitch.title')}</strong>
      <p>{t('ja.pitch.body')}</p>
      <p>{t('ja.pitch.example')}</p>
    </aside>
  )
}
