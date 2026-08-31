import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  label?: string
}

type State = {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(this.props.label ?? 'ErrorBoundary', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      const isChunkError =
        this.state.error.message.includes('dynamically imported module') ||
        this.state.error.message.includes('Failed to fetch') ||
        this.state.error.message.includes('Loading chunk')

      return (
        <div className="error-boundary" role="alert">
          <p className="eyebrow">發生錯誤</p>
          <h1>{isChunkError ? '系統已更新至新版本' : '模組載入或執行失敗'}</h1>
          <p className="lede">
            {isChunkError
              ? '網站剛發布了最新更新，瀏覽器需重新整理以載入最新學習資源。'
              : this.props.label
                ? `「${this.props.label}」暫時無法顯示。`
                : '畫面暫時無法顯示。'}
          </p>
          <p className="error-boundary-detail">{this.state.error.message}</p>
          <div className="error-boundary-actions">
            <button
              type="button"
              className="auth-btn"
              onClick={() => {
                if (isChunkError) {
                  window.location.reload()
                } else {
                  this.setState({ error: null })
                }
              }}
            >
              {isChunkError ? '🔄 立即載入最新版' : '重試'}
            </button>
            <a className="auth-btn ghost" href="#hub" onClick={() => this.setState({ error: null })}>
              回 Hub
            </a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
