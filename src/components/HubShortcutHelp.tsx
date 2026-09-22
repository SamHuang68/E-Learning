import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/i18n'

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

const SHORTCUTS = [
  { keys: 'hub.shortcuts.keyHelp', action: 'hub.shortcuts.help' },
  { keys: 'hub.shortcuts.keyEsc', action: 'hub.shortcuts.escape' },
  { keys: 'hub.shortcuts.keySearch', action: 'hub.shortcuts.search' },
  { keys: 'hub.shortcuts.keyScratch', action: 'hub.shortcuts.scratch' },
  { keys: 'hub.shortcuts.keyTab', action: 'hub.shortcuts.tab' },
] as const

/** Hub-only shortcut help. Lists keys that already exist or this dialog wires. */
export function HubShortcutHelp() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setOpen(false), [])
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      openerRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : triggerRef.current
      if (!dialog.open) dialog.showModal()
      dialog.querySelector<HTMLElement>('button')?.focus()
      return
    }
    if (dialog.open) dialog.close()
    const opener = openerRef.current
    openerRef.current = null
    opener?.focus()
  }, [open])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return
      if (event.key === '?' || (event.key === '/' && event.shiftKey)) {
        event.preventDefault()
        setOpen((prev) => !prev)
        return
      }
      if (event.key === '/' && !event.shiftKey) {
        event.preventDefault()
        document.getElementById('hub-track-search')?.focus()
        return
      }
      if (event.key === 'Escape' && open) {
        event.preventDefault()
        close()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="hub-shortcut-trigger"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="hub-shortcut-dialog"
      >
        {t('hub.shortcuts.open')}
      </button>
      <dialog
        ref={dialogRef}
        id="hub-shortcut-dialog"
        className="hub-shortcut-dialog"
        aria-labelledby="hub-shortcut-title"
        onCancel={(event) => {
          event.preventDefault()
          close()
        }}
        onClose={close}
        onClick={(event) => {
          if (event.target === event.currentTarget) close()
        }}
      >
        <div className="hub-shortcut-header">
          <h2 id="hub-shortcut-title">{t('hub.shortcuts.title')}</h2>
          <button type="button" className="btn-close" onClick={close} aria-label={t('hub.shortcuts.close')}>
            {t('hub.shortcuts.close')}
          </button>
        </div>
        <p className="section-subtext">{t('hub.shortcuts.honesty')}</p>
        <table className="hub-shortcut-table">
          <caption>{t('hub.shortcuts.caption')}</caption>
          <thead>
            <tr>
              <th scope="col">{t('hub.shortcuts.colKey')}</th>
              <th scope="col">{t('hub.shortcuts.colAction')}</th>
            </tr>
          </thead>
          <tbody>
            {SHORTCUTS.map((row) => (
              <tr key={row.keys}>
                <th scope="row">
                  <kbd>{t(row.keys)}</kbd>
                </th>
                <td>{t(row.action)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </dialog>
    </>
  )
}
