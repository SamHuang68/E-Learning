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

export function DataControls() {
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
    setNote('已匯出進度（不含 API 金鑰與 presets）')
  }

  function onImportFile(file: File | undefined) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        const ok = importProgressBundle(parsed)
        if (!ok) {
          setNote('匯入失敗：檔案格式不正確')
          return
        }
        setNote('已匯入進度；若已登入將寫入雲端')
        window.dispatchEvent(new CustomEvent('e-learning:progress-hydrated'))
      } catch {
        setNote('匯入失敗：無法解析 JSON')
      }
    }
    reader.readAsText(file)
  }

  function clearLocal() {
    if (!confirm('確定清除全部本機學習進度？（不會刪除本機帳號、顯示／音效設定、Groq 金鑰與 presets）')) {
      return
    }
    clearLocalProgressCache()
    setNote('已清除六軌學習進度與學習事件摘要')
    window.dispatchEvent(new CustomEvent('e-learning:progress-hydrated'))
  }

  async function resetCloud() {
    const scope = isLocal ? '帳號' : '雲端'
    if (
      !confirm(
        `確定重設${scope}進度？將恢復預設進度並覆寫本機進度快取。`,
      )
    ) {
      return
    }
    const ok = await resetCloudProgress()
    setNote(ok ? `已重設${scope}進度` : `重設${scope}進度失敗`)
    if (ok) {
      window.dispatchEvent(new CustomEvent('e-learning:progress-hydrated'))
    }
  }

  return (
    <section className="data-controls" aria-label="資料控制">
      <p className="eyebrow">資料</p>
      <h2>匯出／匯入與重設</h2>
      <p className="data-controls-lede">
        匯出內容包含日語、五十音、多益、數學、物理、化學進度、學習事件摘要與軌道偏好；本機帳號、無障礙／音效設定、Groq 金鑰與課程設計器 presets 不會匯出。
      </p>
      <div className="data-controls-actions">
        <button type="button" className="auth-btn ghost" onClick={downloadExport}>
          匯出 JSON
        </button>
        <button
          type="button"
          className="auth-btn ghost"
          onClick={() => fileRef.current?.click()}
        >
          匯入 JSON
        </button>
        <button type="button" className="auth-btn ghost" onClick={clearLocal}>
          清除全部學習進度
        </button>
        {user ? (
          <button type="button" className="auth-btn danger" onClick={() => void resetCloud()}>
            {isLocal ? '重設帳號進度' : '重設雲端進度'}
          </button>
        ) : null}
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <p className="eyebrow">ANKI / CSV 匯出</p>
        <div className="data-controls-actions" style={{ marginTop: '0.4rem' }}>
          <button
            type="button"
            className="auth-btn ghost"
            onClick={exportToeicChunksToAnki}
          >
            ⚡ 匯出 TOEIC 商務語塊 (Anki CSV)
          </button>
          <button
            type="button"
            className="auth-btn ghost"
            onClick={exportJapaneseSignalsToAnki}
          >
            🎯 匯出日語動作訊號 (Anki CSV)
          </button>
          <button
            type="button"
            className="auth-btn ghost"
            onClick={exportMathSignalsToAnki}
          >
            📐 匯出數學破題訊號 (Anki CSV)
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
        重新整理事件統計
      </button>
    </section>
  )
}
