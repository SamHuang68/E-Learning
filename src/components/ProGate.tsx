import { useState, type ReactNode } from 'react'
import { canAccessUnit, unlockPro, type LearningTrack } from '../engine/entitlement'
import { useI18n } from '../i18n/i18n'
import type { LearningMeta } from '../utils/storage'

type Props = {
  meta: LearningMeta
  track: LearningTrack
  levelOrCert: string
  unitId?: number | string
  children: ReactNode
  onUnlocked?: () => void
}

export function ProGate({
  meta,
  track,
  levelOrCert,
  unitId,
  children,
  onUnlocked,
}: Props) {
  const { t } = useI18n()
  const [code, setCode] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [message, setMessage] = useState('')
  const locked = !unlocked && !canAccessUnit(meta, track, levelOrCert, unitId)

  function submit() {
    if (unlockPro(code)) {
      setUnlocked(true)
      setMessage(t('pro.ok'))
      onUnlocked?.()
      return
    }
    setMessage(t('pro.bad'))
  }

  if (!locked) return <>{children}</>

  return (
    <section className="practice-card pro-gate">
      <div className="flash-face">
        <p className="eyebrow">{t('pro.eyebrow')}</p>
        <strong>{t('pro.title')}</strong>
        <p>{t('pro.body')}</p>
      </div>
      <div className="flash-actions">
        <input
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder={t('pro.placeholder')}
          aria-label={t('pro.aria')}
        />
        <button type="button" className="primary-btn inline" onClick={submit}>
          {t('pro.unlock')}
        </button>
      </div>
      {message ? <p className="status-line">{message}</p> : null}
    </section>
  )
}
