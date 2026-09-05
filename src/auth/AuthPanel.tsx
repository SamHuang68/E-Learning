import { useState, type FormEvent } from 'react'
import { useAuth } from './AuthContext'

type Props = {
  variant?: 'full' | 'compact'
}

export function AuthPanel({ variant = 'full' }: Props) {
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
      <section className="auth-panel" aria-label="帳號">
        <p className="auth-sync local">進度僅保存在本機（未設定雲端同步）</p>
      </section>
    )
  }

  if (loading) {
    if (compact) return null
    return (
      <section className="auth-panel" aria-label="帳號">
        <p className="auth-sync">檢查登入狀態…</p>
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
      setMessage('註冊成功。若專案需驗證信，請至信箱確認後再登入。')
    }
  }

  const syncLabel =
    syncStatus === 'synced'
      ? isLocal
        ? '本機已保存'
        : '已同步'
      : syncStatus === 'syncing'
        ? isLocal
          ? '保存中…'
          : '同步中…'
        : syncStatus === 'error'
          ? '保存失敗（仍可本機使用）'
          : '僅本機'

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
          登入
        </button>
        <button
          type="button"
          className={mode === 'signup' ? 'active' : undefined}
          onClick={() => {
            setMode('signup')
            setMessage(null)
          }}
        >
          註冊
        </button>
      </div>
      {!compact ? (
        <p className="auth-hint">
          {isLocal
            ? '未登入可本機試用；登入後進度會保存在此瀏覽器的本機帳號（不含 API 金鑰與課程設計器預設）。'
            : '未登入可本機試用；登入後進度會同步到雲端（不含 API 金鑰與課程設計器預設）。'}
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
            本機帳號只保存在此瀏覽器；請勿重複使用真實密碼。
          </p>
        ) : null}
        <label>
          密碼
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
          {busy ? '請稍候…' : mode === 'signin' ? '登入' : '建立帳號'}
        </button>
      </form>
      {message ? <p className="auth-message">{message}</p> : null}
    </>
  )

  if (user) {
    async function removeLocalAccount() {
      if (!confirm('確定刪除此瀏覽器中的本機帳號、密碼驗證資料與帳號進度？此動作無法復原。')) return
      const error = await deleteAccount()
      if (error) setMessage(error)
    }

    return (
      <section className={`auth-panel signed-in${compact ? ' is-compact' : ''}`} aria-label="帳號">
        <div className="auth-user-row">
          <div>
            {!compact ? <p className="eyebrow">帳號</p> : null}
            <p className="auth-email">{user.email}</p>
            <p className={`auth-sync ${syncStatus}`}>{syncLabel}</p>
          </div>
          <button type="button" className="auth-btn ghost" onClick={() => void signOut()}>
            登出
          </button>
          {isLocal && !compact ? (
            <button type="button" className="auth-btn danger" onClick={() => void removeLocalAccount()}>
              刪除本機帳號
            </button>
          ) : null}
        </div>
      </section>
    )
  }

  if (compact) {
    return (
      <details className="auth-panel is-compact">
        <summary>登入同步進度</summary>
        {form}
      </details>
    )
  }

  return (
    <section className="auth-panel" aria-label="登入或註冊">
      {form}
      <p className={`auth-sync ${syncStatus}`}>僅本機</p>
    </section>
  )
}
