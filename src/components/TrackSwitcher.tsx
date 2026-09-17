import type { LangId } from '../utils/storage'
import { LocaleToggle, useI18n } from '../i18n/i18n'
import type { MessageKey } from '../i18n/messages'

type Props = {
  current: LangId
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
}

const TRACKS: Array<{ id: LangId; labelKey: MessageKey }> = [
  { id: 'ja', labelKey: 'trackSelect.ja' },
  { id: 'en', labelKey: 'trackSelect.en' },
  { id: 'zh', labelKey: 'trackSelect.zh' },
  { id: 'math', labelKey: 'trackSelect.math' },
  { id: 'calculus', labelKey: 'trackSelect.calculus' },
  { id: 'physics', labelKey: 'trackSelect.physics' },
  { id: 'chemistry', labelKey: 'trackSelect.chemistry' },
  { id: 'cs', labelKey: 'trackSelect.cs' },
]

export function TrackSwitcher({ current, onBackHub, onSwitchLang }: Props) {
  const { t } = useI18n()
  return (
    <div className="sidebar-chrome">
      <div className="sidebar-chrome-row">
        <button type="button" className="hub-back" onClick={onBackHub}>
          {t('common.backHub')}
        </button>
        <LocaleToggle compact />
      </div>
      <label className="sidebar-track-select">
        <span className="sr-only">{t('common.switchTrack')}</span>
        <select
          aria-label={t('common.switchTrack')}
          value={current}
          onChange={(event) => onSwitchLang(event.target.value as LangId)}
        >
          {TRACKS.map((track) => (
            <option key={track.id} value={track.id}>{t(track.labelKey)}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
