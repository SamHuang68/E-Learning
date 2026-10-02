import { useCallback, useEffect, useId, useRef } from 'react'
import { useCalculusCopy } from '../../../i18n/calculusCopy'
import type { CalculusBadge } from '../data/calculusBadges'

type Props = {
  badges: CalculusBadge[]
  onDismiss: () => void
}

/** Keep mounted so native modal focus restoration works in either calculus entry point. */
export function CalculusBadgeDialog({ badges, onDismiss }: Props) {
  const c = useCalculusCopy()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  const dismiss = useCallback(() => {
    const dialog = dialogRef.current
    if (dialog?.open) {
      dialog.close()
      // The answer that opened the modal is now disabled. Return to its usable selector.
      if (document.activeElement === document.body || dialog.contains(document.activeElement)) {
        dialog.closest('.calculus-shell, .calculus-studio-container')
          ?.querySelector<HTMLButtonElement>('.btn-tier-pill.active')?.focus()
      }
    }
    onDismiss()
  }, [onDismiss])

  useEffect(() => {
    const dialog = dialogRef.current
    if (badges.length > 0 && dialog && !dialog.open) dialog.showModal()
    else if (badges.length === 0 && dialog?.open) dialog.close()
  }, [badges.length])

  return (
    <dialog
      ref={dialogRef}
      className="calculus-badge-modal-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); dismiss() }}
      onClose={onDismiss}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (event.clientX < bounds.left || event.clientX > bounds.right
          || event.clientY < bounds.top || event.clientY > bounds.bottom) dismiss()
      }}
    >
      {badges.length > 0 && (
        <div className="calculus-badge-modal-card">
          <div className="badge-unlock-animation" aria-hidden="true">🏆</div>
          <h3 id={titleId}>{c('恭喜解鎖微積分微認證！')}</h3>
          {badges.map((badge) => (
            <div key={badge.id} className="unlocked-badge-detail">
              <span className="badge-icon-lg" aria-hidden="true">{badge.icon}</span>
              <div>
                <strong>{c(badge.title)}</strong>
                <p>{c(badge.description)}</p>
              </div>
            </div>
          ))}
          <p>{c('勳章依本機正確作答紀錄保留；每答對一題獲得 15 XP，勳章不另加 XP。')}</p>
          <button type="button" className="btn-close-modal" onClick={dismiss} autoFocus>
            {c('太棒了，繼續挑戰！')}
          </button>
        </div>
      )}
    </dialog>
  )
}
