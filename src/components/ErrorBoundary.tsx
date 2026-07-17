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
      return (
        <div className="error-boundary" role="alert">
          <p className="eyebrow">發生錯誤</p>
          <h1>模組載入或執行失敗</h1>
          <p className="lede">
            {this.props.label
              ? `「${this.props.label}」暫時無法顯示。`
              : '畫面暫時無法顯示。'}
            可重新整理，或回到 Hub 再試一次。
          </p>
          <p className="error-boundary-detail">{this.state.error.message}</p>
          <div className="error-boundary-actions">
            <button
              type="button"
              className="auth-btn"
              onClick={() => this.setState({ error: null })}
            >
              重試
            </button>
            <a className="auth-btn ghost" href="#hub">
              回 Hub
            </a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
