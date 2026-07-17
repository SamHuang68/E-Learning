import { useState, type ReactNode } from 'react'
import { canAccessUnit, unlockPro, type LearningTrack } from '../engine/entitlement'
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
  const [code, setCode] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [message, setMessage] = useState('')
  const locked = !unlocked && !canAccessUnit(meta, track, levelOrCert, unitId)

  function submit() {
    if (unlockPro(code)) {
      setUnlocked(true)
      setMessage('已解鎖 Pro demo。')
      onUnlocked?.()
      return
    }
    setMessage('解鎖碼不正確。')
  }

  if (!locked) return <>{children}</>

  return (
    <section className="practice-card pro-gate">
      <div className="flash-face">
        <p className="eyebrow">PRO</p>
        <strong>此單元屬於 Pro 練習</strong>
        <p>免費版可使用日語 N5/N4 Unit 1-2、五十音，以及 English Orange Unit 1-2、Phonics。</p>
      </div>
      <div className="flash-actions">
        <input
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="輸入 AOBA-PRO 或留空 demo"
          aria-label="Pro unlock code"
        />
        <button type="button" className="primary-btn inline" onClick={submit}>
          解鎖 Demo
        </button>
      </div>
      {message ? <p className="status-line">{message}</p> : null}
    </section>
  )
}
