import { Component, type ErrorInfo, type ReactNode } from 'react'
import { loadUiLocale, UI_LOCALE_EVENT, type UiLocale } from '../i18n/locale'
import { LocaleToggle } from '../i18n/i18n'
import { translate } from '../i18n/messages'
import { sanitizeClientError } from '../utils/sanitizeClientError'

type Props = {
  children: ReactNode
  label?: string
}

type State = {
  error: Error | null
  locale: UiLocale
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, locale: loadUiLocale() }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(this.props.label ?? 'ErrorBoundary', error, info.componentStack)
  }

  componentDidMount() {
    window.addEventListener(UI_LOCALE_EVENT, this.onLocale)
  }

  componentWillUnmount() {
    window.removeEventListener(UI_LOCALE_EVENT, this.onLocale)
  }

  onLocale = () => {
    this.setState({ locale: loadUiLocale() })
  }

  render() {
    if (this.state.error) {
      const t = (key: Parameters<typeof translate>[1], vars?: Record<string, string | number>) =>
        translate(this.state.locale, key, vars)
      const isChunkError =
        this.state.error.message.includes('dynamically imported module') ||
        this.state.error.message.includes('Failed to fetch') ||
        this.state.error.message.includes('Loading chunk')

      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary-toolbar">
            <p className="eyebrow">{t('error.eyebrow')}</p>
            <LocaleToggle compact />
          </div>
          <h1>{isChunkError ? t('error.chunkTitle') : t('error.failTitle')}</h1>
          <p className="lede">
            {isChunkError
              ? t('error.chunkBody')
              : this.props.label
                ? t('error.moduleBody', { label: this.props.label })
                : t('error.genericBody')}
          </p>
          <p className="error-boundary-detail">
            {sanitizeClientError(this.state.error.message, t('error.safeDetail'))}
          </p>
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
              {isChunkError ? t('error.reload') : t('common.retry')}
            </button>
            <a className="auth-btn ghost" href="#hub" onClick={() => this.setState({ error: null })}>
              {t('error.backHub')}
            </a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
