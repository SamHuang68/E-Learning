import { useState, type FormEvent } from 'react'
import { useAuth } from './AuthContext'
import { useI18n } from '../i18n/i18n'

type Props = {
  variant?: 'full' | 'compact'
}

export function AuthPanel({ variant = 'full' }: Props) {
  const { t } = useI18n()
  const { configured, backendKind, loading, user, syncStatus, signIn, signUp, signOut, deleteAccount } =
    useAuth()
  const isLocal = backendKind === 'local'
  const compact = variant === 'compact'
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  if (!configured) {
    if (compact) return null
    return (
      <section className="auth-panel" aria-label={t('auth.account')}>
        <p className="auth-sync local">{t('auth.localOnlyUnset')}</p>
      </section>
    )
  }

  if (loading) {
    if (compact) return null
    return (
      <section className="auth-panel" aria-label={t('auth.account')}>
        <p className="auth-sync">{t('auth.checking')}</p>
      </section>
    )
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMessage(null)
    const err =
      mode === 'signin'
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password)
    setBusy(false)
    if (err) {
      setMessage(err)
      return
    }
    if (mode === 'signup') {
      setMessage(t('auth.signupOk'))
    }
  }

  const syncLabel =
    syncStatus === 'synced'
      ? isLocal
        ? t('auth.syncedLocal')
        : t('auth.syncedCloud')
      : syncStatus === 'syncing'
        ? isLocal
          ? t('auth.syncingLocal')
          : t('auth.syncingCloud')
        : syncStatus === 'error'
          ? t('auth.syncError')
          : t('auth.localOnly')

  const form = (
    <>
      <div className="auth-mode">
        <button
          type="button"
          className={mode === 'signin' ? 'active' : undefined}
          onClick={() => {
            setMode('signin')
            setMessage(null)
          }}
        >
          {t('auth.signin')}
        </button>
        <button
          type="button"
          className={mode === 'signup' ? 'active' : undefined}
          onClick={() => {
            setMode('signup')
            setMessage(null)
          }}
        >
          {t('auth.signup')}
        </button>
      </div>
      {!compact ? (
        <p className="auth-hint">
          {isLocal ? t('auth.hintLocal') : t('auth.hintCloud')}
        </p>
      ) : null}
      <form className="auth-form" onSubmit={onSubmit}>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {isLocal && mode === 'signup' ? (
          <p className="auth-warning" role="note">
            {t('auth.localPasswordNote')}
          </p>
        ) : null}
        <label>
          {t('auth.password')}
          <input
            type="password"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="auth-btn" disabled={busy}>
          {busy ? t('auth.wait') : mode === 'signin' ? t('auth.signin') : t('auth.create')}
        </button>
      </form>
      {message ? <p className="auth-message">{message}</p> : null}
    </>
  )

  if (user) {
    async function removeLocalAccount() {
      if (!confirm(t('auth.deleteConfirm'))) return
      const error = await deleteAccount()
      if (error) setMessage(error)
    }

    return (
      <section className={`auth-panel signed-in${compact ? ' is-compact' : ''}`} aria-label={t('auth.account')}>
        <div className="auth-user-row">
          <div>
            {!compact ? <p className="eyebrow">{t('auth.account')}</p> : null}
            <p className="auth-email">{user.email}</p>
            <p className={`auth-sync ${syncStatus}`}>{syncLabel}</p>
          </div>
          <button type="button" className="auth-btn ghost" onClick={() => void signOut()}>
            {t('auth.signOut')}
          </button>
          {isLocal && !compact ? (
            <button type="button" className="auth-btn danger" onClick={() => void removeLocalAccount()}>
              {t('auth.deleteLocal')}
            </button>
          ) : null}
        </div>
      </section>
    )
  }

  if (compact) {
    return (
      <details className="auth-panel is-compact">
        <summary>{t('auth.compactSummary')}</summary>
        {form}
      </details>
    )
  }

  return (
    <section className="auth-panel" aria-label={t('auth.signinOrUp')}>
      {form}
      <p className={`auth-sync ${syncStatus}`}>{t('auth.localOnly')}</p>
    </section>
  )
}
