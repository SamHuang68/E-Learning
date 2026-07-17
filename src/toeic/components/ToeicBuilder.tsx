import { useMemo, useState } from 'react'
import {
  defaultToeicConfig,
  toeicCertificates,
  toeicTemplates,
  toeicThemes,
  type ToeicBuilderConfig,
} from '../data/certificates'
import { loadToeicPresets, saveToeicPreset } from '../../utils/storage'

function buildPrompt(config: ToeicBuilderConfig) {
  const cert = toeicCertificates.find((c) => c.id === config.certificateId)
  const theme = toeicThemes.find((t) => t.id === config.theme)
  return `# TOEIC Lesson Prompt

## Target certificate
- ${cert?.name} (${cert?.scoreMin}–${cert?.scoreMax})
- Audience: ${cert?.audience}

## Topic
- ${config.topic}
- Theme: ${theme?.label} / ${theme?.labelEn}
- Mode: ${config.mode}

## Hosts
### ${config.hostA.name}
${config.hostA.tone} — ${config.hostA.persona}

### ${config.hostB.name}
${config.hostB.tone} — ${config.hostB.persona}

## Output requirements
Create an 8–12 minute business-English audio lesson script for TOEIC preparation:
1. Warm-up (30s)
2. Core vocabulary (8–12 items) with example sentences
3. Dialogue aligned to the certificate band
4. One mini quiz (3 options)
5. Closing recap of 5 key phrases

Keep difficulty inside the ${cert?.scoreMin}–${cert?.scoreMax} band. Start the script now.`
}

export function ToeicBuilder() {
  const [config, setConfig] = useState<ToeicBuilderConfig>(defaultToeicConfig)
  const [prompt, setPrompt] = useState('')
  const [presetName, setPresetName] = useState('')
  const [presets, setPresets] = useState(() => loadToeicPresets())
  const [status, setStatus] = useState('')

  const cert = useMemo(
    () => toeicCertificates.find((c) => c.id === config.certificateId),
    [config.certificateId],
  )

  return (
    <section className="builder">
      <header className="builder-hero">
        <div>
          <p className="eyebrow">TOEIC PROMPT BUILDER</p>
          <h1>依證書級距產生日課提示詞</h1>
          <p className="lede">
            選擇橘／綠／藍／金證書與商務主題，產生可給 ChatGPT / Claude /
            NotebookLM 使用的多益訓練腳本提示詞。
          </p>
        </div>
      </header>

      <div className="builder-grid">
        <div className="builder-steps">
          <section className="step">
            <div className="step-index">01</div>
            <div className="step-body">
              <p className="step-kicker">CERTIFICATE</p>
              <h3>多益證書級距</h3>
              <div className="cert-pick">
                {toeicCertificates.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={config.certificateId === c.id ? 'active' : ''}
                    style={{
                      borderColor:
                        config.certificateId === c.id ? c.color : undefined,
                      background:
                        config.certificateId === c.id ? c.colorSoft : undefined,
                    }}
                    onClick={() =>
                      setConfig((x) => ({ ...x, certificateId: c.id }))
                    }
                  >
                    <strong>{c.nameEn}</strong>
                    <span>
                      {c.scoreMin}–{c.scoreMax}
                    </span>
                    <small>{c.name}</small>
                  </button>
                ))}
              </div>
              <p className="hint">{cert?.audience}</p>
            </div>
          </section>

          <section className="step">
            <div className="step-index">02</div>
            <div className="step-body">
              <p className="step-kicker">TOPIC</p>
              <h3>主題</h3>
              <label className="field">
                <span>Title</span>
                <input
                  value={config.topic}
                  onChange={(e) =>
                    setConfig((x) => ({ ...x, topic: e.target.value }))
                  }
                />
              </label>
              <div className="pill-row">
                {toeicThemes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={config.theme === t.id ? 'active' : ''}
                    onClick={() => setConfig((x) => ({ ...x, theme: t.id }))}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="step">
            <div className="step-index">03</div>
            <div className="step-body">
              <p className="step-kicker">HOSTS</p>
              <h3>雙人主持</h3>
              <div className="hosts">
                {(['hostA', 'hostB'] as const).map((key, idx) => (
                  <div key={key} className="host-card">
                    <h4>Host {idx === 0 ? 'A' : 'B'}</h4>
                    <label className="field">
                      <span>Name</span>
                      <input
                        value={config[key].name}
                        onChange={(e) =>
                          setConfig((x) => ({
                            ...x,
                            [key]: { ...x[key], name: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Tone</span>
                      <input
                        value={config[key].tone}
                        onChange={(e) =>
                          setConfig((x) => ({
                            ...x,
                            [key]: { ...x[key], tone: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Persona</span>
                      <textarea
                        rows={3}
                        value={config[key].persona}
                        onChange={(e) =>
                          setConfig((x) => ({
                            ...x,
                            [key]: { ...x[key], persona: e.target.value },
                          }))
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <aside className="builder-side">
          <section className="panel output-panel">
            <p className="eyebrow">GENERATED PROMPT</p>
            <h3>產出提示詞</h3>
            {prompt ? (
              <pre className="prompt-box">{prompt}</pre>
            ) : (
              <button
                type="button"
                className="generate-empty"
                onClick={() => {
                  setPrompt(buildPrompt(config))
                  setStatus('已產生本地提示詞')
                }}
              >
                <span className="spark">✦</span>
                <strong>Generate TOEIC prompt</strong>
                <small>
                  {cert?.nameEn} · {cert?.scoreMin}–{cert?.scoreMax}
                </small>
              </button>
            )}
            {prompt && (
              <button
                type="button"
                className="primary-btn"
                onClick={() => {
                  setPrompt(buildPrompt(config))
                  void navigator.clipboard.writeText(buildPrompt(config))
                  setStatus('已更新並複製')
                }}
              >
                Regenerate & copy
              </button>
            )}
          </section>

          <section className="panel">
            <p className="eyebrow">PRESETS</p>
            <div className="preset-row">
              <input
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Preset name"
              />
              <button
                type="button"
                onClick={() => {
                  const name = presetName.trim() || config.topic.slice(0, 20)
                  setPresets(saveToeicPreset(name, config))
                  setStatus(`Saved ${name}`)
                }}
              >
                Save
              </button>
            </div>
            <div className="template-list">
              {toeicTemplates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setConfig((c) => ({ ...c, ...t.config }))
                    setStatus(`Applied ${t.title}`)
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
            {presets.length > 0 && (
              <p className="hint" style={{ marginTop: '0.6rem' }}>
                Saved: {presets.map((p) => p.name).join(' · ')}
              </p>
            )}
          </section>
          {status && <p className="status-line">{status}</p>}
        </aside>
      </div>
    </section>
  )
}
