import { useI18n } from '../i18n/i18n'
import type { TodaySuggestionReasonKey } from '../engine/todaySuggestion'

export type WhyThisNextKind = TodaySuggestionReasonKey | 'unit'

type Props = {
  kind: WhyThisNextKind
  dueCount?: number
}

export function WhyThisNext({ kind, dueCount = 0 }: Props) {
  const { t } = useI18n()
  const reason =
    kind === 'due'
      ? t('today.due', { count: dueCount })
      : kind === 'resume'
        ? t('today.resume')
        : kind === 'preferred'
          ? t('today.preferred')
          : kind === 'unit'
            ? t('today.whyUnit')
            : t('today.catalog')

  return (
    <p className="why-this-next" role="note">
      <span>
        {t('today.whyLabel')} {reason}
      </span>
      <span>{t('today.whyHonesty')}</span>
    </p>
  )
}
