import { useRef, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { AnalyticsPanel } from './AnalyticsPanel'
import { resetCloudProgress } from '../utils/cloudProgress'
import {
  exportToeicChunksToAnki,
  exportJapaneseSignalsToAnki,
  exportMathSignalsToAnki,
} from '../utils/ankiExporter'
import {
  clearLocalProgressCache,
  exportProgressBundle,
  importProgressBundle,
  loadLearningMeta,
} from '../utils/storage'
import { useI18n } from '../i18n/i18n'

export function DataControls() {
  const { t } = useI18n()
  const { user, backendKind } = useAuth()
  const isLocal = backendKind === 'local'
  const fileRef = useRef<HTMLInputElement>(null)
  const [note, setNote] = useState<string | null>(null)
  const [metaTick, setMetaTick] = useState(0)
  const meta = loadLearningMeta()
  void metaTick

  function downloadExport() {
    const bundle = exportProgressBundle()
    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `e-learning-progress-${bundle.exportedAt.slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setNote(t('data.exported'))
  }

  function onImportFile(file: File | undefined) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        const ok = importProgressBundle(parsed)
        if (!ok) {
          setNote(t('data.importFailFormat'))
          return
        }
        setNote(t('data.imported'))
        window.dispatchEvent(new CustomEvent('e-learning:progress-hydrated'))
      } catch {
        setNote(t('data.importFailJson'))
      }
    }
    reader.readAsText(file)
  }

  function clearLocal() {
    if (!confirm(t('data.clearConfirm'))) {
      return
    }
    clearLocalProgressCache()
    setNote(t('data.cleared'))
    window.dispatchEvent(new CustomEvent('e-learning:progress-hydrated'))
  }

  async function resetCloud() {
    const scope = isLocal ? t('data.scopeAccount') : t('data.scopeCloud')
    if (!confirm(t('data.resetConfirm', { scope }))) {
      return
    }
    const ok = await resetCloudProgress()
    setNote(ok ? t('data.resetOk', { scope }) : t('data.resetFail', { scope }))
    if (ok) {
      window.dispatchEvent(new CustomEvent('e-learning:progress-hydrated'))
    }
  }

  return (
    <section className="data-controls" aria-label={t('data.aria')}>
      <p className="eyebrow">{t('data.eyebrow')}</p>
      <h2>{t('data.title')}</h2>
      <p className="data-controls-lede">
        {t('data.lede')}
      </p>
      <div className="data-controls-actions">
        <button type="button" className="auth-btn ghost" onClick={downloadExport}>
          {t('data.exportJson')}
        </button>
        <button
          type="button"
          className="auth-btn ghost"
          onClick={() => fileRef.current?.click()}
        >
          {t('data.importJson')}
        </button>
        <button type="button" className="auth-btn ghost" onClick={clearLocal}>
          {t('data.clear')}
        </button>
        {user ? (
          <button type="button" className="auth-btn danger" onClick={() => void resetCloud()}>
            {isLocal ? t('data.resetLocal') : t('data.resetCloud')}
          </button>
        ) : null}
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <p className="eyebrow">{t('data.anki')}</p>
        <div className="data-controls-actions" style={{ marginTop: '0.4rem' }}>
          <button
            type="button"
            className="auth-btn ghost"
            onClick={exportToeicChunksToAnki}
          >
            {t('data.ankiToeic')}
          </button>
          <button
            type="button"
            className="auth-btn ghost"
            onClick={exportJapaneseSignalsToAnki}
          >
            {t('data.ankiJa')}
          </button>
          <button
            type="button"
            className="auth-btn ghost"
            onClick={exportMathSignalsToAnki}
          >
            {t('data.ankiMath')}
          </button>
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => {
          onImportFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      {note ? <p className="auth-message">{note}</p> : null}
      <AnalyticsPanel meta={meta} />
      <button
        type="button"
        className="ghost"
        onClick={() => setMetaTick((n) => n + 1)}
      >
        {t('data.refresh')}
      </button>
    </section>
  )
}
