import { useEffect, useMemo, useRef, useState } from 'react'
import {
  defaultConfig,
  levels,
  modes,
  templates,
  themes,
  type BuilderConfig,
  type HostConfig,
} from '../data/course'
import { buildLessonPrompt, encodeShare, mergeConfig } from '../utils/prompt'
import {
  loadApiKey,
  loadPresets,
  saveApiKey,
  savePreset,
  type SavedPreset,
} from '../utils/storage'
import { HeroArt } from './HeroArt'

type Props = {
  initial?: Partial<BuilderConfig>
}

export function LessonBuilder({ initial }: Props) {
  const [config, setConfig] = useState<BuilderConfig>(() =>
    mergeConfig(defaultConfig, initial ?? {}),
  )
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [presets, setPresets] = useState<SavedPreset[]>(() => loadPresets())
  const [selectedPreset, setSelectedPreset] = useState('')
  const [apiKey, setApiKey] = useState(() => loadApiKey())
  const [status, setStatus] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initial) setConfig((c) => mergeConfig(c, initial))
  }, [initial])

  const themeLabel = useMemo(
    () => themes.find((t) => t.id === config.theme)?.label,
    [config.theme],
  )

  function update<K extends keyof BuilderConfig>(key: K, value: BuilderConfig[K]) {
    setConfig((c) => ({ ...c, [key]: value }))
  }

  function updateHost(which: 'hostA' | 'hostB', patch: Partial<HostConfig>) {
    setConfig((c) => ({ ...c, [which]: { ...c[which], ...patch } }))
  }

  async function handleGenerate() {
    setGenerating(true)
    setStatus('')
    const local = buildLessonPrompt(config)

    if (!apiKey.trim()) {
      setPrompt(local)
      setGenerating(false)
      setStatus('已用本地模板產生提示詞（未設定 API Key）')
      return
    }

    try {
      saveApiKey(apiKey.trim())
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
          messages: [
            {
              role: 'system',
              content:
                '你是日語課程設計師。根據使用者設定，輸出可直接貼到 NotebookLM / Claude / ChatGPT 的完整課程提示詞（繁體中文說明＋日語腳本要求）。',
            },
            { role: 'user', content: local },
          ],
        }),
      })

      if (!res.ok) throw new Error(`Groq API ${res.status}`)
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[]
      }
      const text = data.choices?.[0]?.message?.content?.trim()
      setPrompt(text || local)
      setStatus(text ? '已透過 Groq 產生提示詞' : 'API 無內容，改用本地模板')
    } catch {
      setPrompt(local)
      setStatus('API 呼叫失敗，已改用本地模板')
    } finally {
      setGenerating(false)
    }
  }

  function handleSavePreset() {
    const name = presetName.trim() || config.topic.slice(0, 24)
    const next = savePreset(name, config)
    setPresets(next)
    setPresetName(name)
    setSelectedPreset(name)
    setStatus(`已儲存設定「${name}」`)
  }

  function handleLoadPreset() {
    const found = presets.find((p) => p.name === selectedPreset)
    if (!found) return
    setConfig(found.config)
    setStatus(`已載入「${found.name}」`)
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aoba-${config.theme}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as BuilderConfig
        setConfig(mergeConfig(defaultConfig, parsed))
        setStatus('已匯入 JSON 設定')
      } catch {
        setStatus('匯入失敗：JSON 格式不正確')
      }
    }
    reader.readAsText(file)
  }

  async function handleShare() {
    const hash = encodeShare(config)
    const url = `${window.location.origin}${window.location.pathname}#builder=${hash}`
    try {
      await navigator.clipboard.writeText(url)
      setStatus('分享連結已複製')
    } catch {
      setStatus(url)
    }
  }

  async function handleCopy() {
    if (!prompt) return
    await navigator.clipboard.writeText(prompt)
    setStatus('提示詞已複製')
  }

  return (
    <section className="builder">
      <header className="builder-hero">
        <div>
          <p className="eyebrow">LESSON PROMPT BUILDER</p>
          <h1>填入設定，產生日語課程提示詞</h1>
          <p className="lede">
            參考 Melody 的單元學習節奏，設計主題、JLPT
            程度、學習模式與雙導師人格，產生給 NotebookLM、Claude 或 ChatGPT
            使用的日語音訊／對話課程提示詞。
          </p>
        </div>
        <HeroArt />
      </header>

      <div className="builder-grid">
        <div className="builder-steps">
          <section className="step">
            <div className="step-index">01</div>
            <div className="step-body">
              <p className="step-kicker">TOPIC · 分析主題</p>
              <h3>課程主題</h3>
              <label className="field">
                <span>標題</span>
                <input
                  value={config.topic}
                  onChange={(e) => update('topic', e.target.value)}
                  placeholder="例如：東京三日旅遊會話"
                />
              </label>
              <div className="pill-row" role="listbox" aria-label="主題分類">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="option"
                    aria-selected={config.theme === t.id}
                    className={config.theme === t.id ? 'active' : ''}
                    onClick={() => update('theme', t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="step">
            <div className="step-index">02</div>
            <div className="step-body">
              <p className="step-kicker">LEVEL · 目標程度</p>
              <h3>JLPT 程度</h3>
              <div className="segmented">
                {levels.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    className={config.level === l.id ? 'active' : ''}
                    onClick={() => update('level', l.id)}
                  >
                    <i>{l.icon}</i>
                    <strong>{l.label}</strong>
                    <small>{l.desc}</small>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="step">
            <div className="step-index">03</div>
            <div className="step-body">
              <p className="step-kicker">MODE · 學習節奏</p>
              <h3>學習模式</h3>
              <div className="mode-grid">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={config.mode === m.id ? 'active' : ''}
                    onClick={() => update('mode', m.id)}
                  >
                    <svg viewBox="0 0 64 36" aria-hidden="true">
                      {m.id === 'flashcards' && (
                        <path
                          d="M4 28 L16 10 L28 22 L40 8 L60 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                      )}
                      {m.id === 'conversation' && (
                        <path
                          d="M6 18 Q18 4 32 18 T58 18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                      )}
                      {m.id === 'grammar' && (
                        <path
                          d="M6 28 L6 8 L58 8 M6 18 H50"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                      )}
                      {m.id === 'immersion' && (
                        <path
                          d="M4 20 C12 4, 20 32, 28 12 S44 30, 52 10 60 22, 60 22"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                      )}
                    </svg>
                    <strong>{m.label}</strong>
                    <span>{m.labelEn}</span>
                    <small>{m.desc}</small>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="step">
            <div className="step-index">04</div>
            <div className="step-body">
              <p className="step-kicker">HOSTS · 導師設定</p>
              <h3>AI 導師人格</h3>
              <div className="hosts">
                {(['hostA', 'hostB'] as const).map((key, idx) => {
                  const host = config[key]
                  return (
                    <div key={key} className="host-card">
                      <h4>Host {idx === 0 ? 'A' : 'B'}</h4>
                      <label className="field">
                        <span>名字</span>
                        <input
                          value={host.name}
                          onChange={(e) => updateHost(key, { name: e.target.value })}
                        />
                      </label>
                      <label className="field">
                        <span>性別</span>
                        <select
                          value={host.gender}
                          onChange={(e) => updateHost(key, { gender: e.target.value })}
                        >
                          <option value="female">女性</option>
                          <option value="male">男性</option>
                          <option value="neutral">中性</option>
                        </select>
                      </label>
                      <label className="field">
                        <span>語氣／風格</span>
                        <input
                          value={host.tone}
                          onChange={(e) => updateHost(key, { tone: e.target.value })}
                        />
                      </label>
                      <label className="field">
                        <span>人設／專長</span>
                        <textarea
                          rows={3}
                          value={host.persona}
                          onChange={(e) =>
                            updateHost(key, { persona: e.target.value })
                          }
                        />
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </div>

        <aside className="builder-side">
          <section className="panel output-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">GENERATED PROMPT</p>
                <h3>產出提示詞</h3>
              </div>
              {prompt && (
                <button type="button" className="ghost" onClick={handleCopy}>
                  複製
                </button>
              )}
            </div>
            {prompt ? (
              <pre className="prompt-box">{prompt}</pre>
            ) : (
              <button
                type="button"
                className="generate-empty"
                onClick={handleGenerate}
                disabled={generating}
              >
                <span className="spark">✦</span>
                <strong>{generating ? '產生中…' : '產生課程提示詞'}</strong>
                <small>
                  目前主題：{themeLabel} · {config.level.toUpperCase()}
                </small>
              </button>
            )}
            {prompt && (
              <button
                type="button"
                className="primary-btn"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? '重新產生中…' : '重新產生'}
              </button>
            )}
          </section>

          <section className="panel">
            <p className="eyebrow">PRESETS</p>
            <h3>設定管理</h3>
            <div className="preset-row">
              <input
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="設定名稱"
              />
              <button type="button" onClick={handleSavePreset}>
                儲存
              </button>
            </div>
            <div className="preset-row">
              <select
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
              >
                <option value="">選擇已存設定</option>
                {presets.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
              <button type="button" onClick={handleLoadPreset}>
                載入
              </button>
            </div>
            <div className="action-row">
              <button type="button" onClick={handleExport}>
                匯出 JSON
              </button>
              <button type="button" onClick={() => fileRef.current?.click()}>
                匯入 JSON
              </button>
              <button type="button" onClick={handleShare}>
                分享連結
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImport(file)
                  e.target.value = ''
                }}
              />
            </div>
          </section>

          <section className="panel">
            <p className="eyebrow">AI SETTINGS · GROQ</p>
            <h3>API Key（選填）</h3>
            <label className="field">
              <span>GROQ API KEY</span>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="gsk_..."
                autoComplete="off"
              />
            </label>
            <p className="hint">留空則使用本地模板直接產生提示詞。</p>
          </section>

          <section className="panel templates-panel">
            <p className="eyebrow">GENERAL</p>
            <h3>快速模板</h3>
            <div className="template-list">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setConfig((c) => mergeConfig(c, t.config))
                    setStatus(`已套用模板「${t.title}」`)
                  }}
                >
                  <i>{t.icon}</i>
                  <div>
                    <strong>{t.title}</strong>
                    <span>{t.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {status && <p className="status-line">{status}</p>}
        </aside>
      </div>
    </section>
  )
}
