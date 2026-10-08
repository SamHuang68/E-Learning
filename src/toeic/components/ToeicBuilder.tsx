import { useMemo, useState } from 'react'
import {
  defaultToeicConfig,
  toeicCertificates,
  toeicTemplates,
  toeicThemes,
  type ToeicBuilderConfig,
} from '../data/certificates'
import { loadToeicPresets, saveToeicPreset } from '../../utils/storage'
import { useI18n } from '../../i18n/i18n'
import { buildPrompt } from '../buildPrompt'
import { localizeToeicCertificate } from '../../i18n/toeicCertificateCopy'
import { toeicBuilderCopy } from '../../i18n/toeicBuilderCopy'
import type { UiLocale } from '../../i18n/locale'

type ToeicBuilderStatus =
  | { code: 'prompt-generated' }
  | { code: 'prompt-updated-and-copied' }
  | { code: 'preset-saved'; presetName: string }
  | { code: 'template-applied'; templateId: string }
  | null

function formatToeicBuilderStatus(status: ToeicBuilderStatus, locale: UiLocale): string {
  if (!status) return ''
  switch (status.code) {
    case 'prompt-generated':
      return toeicBuilderCopy(locale, '已產生本地提示詞')
    case 'prompt-updated-and-copied':
      return toeicBuilderCopy(locale, '已更新並複製')
    case 'preset-saved':
      return `Saved ${status.presetName}`
    case 'template-applied': {
      const template = toeicTemplates.find((item) => item.id === status.templateId)
      if (!template) return ''
      return `${locale === 'en' ? 'Applied' : '已套用'} ${locale === 'en' ? template.titleEn : template.title}`
    }
  }
}

export function ToeicBuilder() {
  const { locale } = useI18n()
  const copy = (source: string) => toeicBuilderCopy(locale, source)
  const [config, setConfig] = useState<ToeicBuilderConfig>(defaultToeicConfig)
  const [prompt, setPrompt] = useState('')
  const [presetName, setPresetName] = useState('')
  const [presets, setPresets] = useState(() => loadToeicPresets())
  const [status, setStatus] = useState<ToeicBuilderStatus>(null)
  const statusMessage = formatToeicBuilderStatus(status, locale)

  const cert = useMemo(
    () => {
      const source = toeicCertificates.find((c) => c.id === config.certificateId)
      return source ? localizeToeicCertificate(source, locale) : undefined
    },
    [config.certificateId, locale],
  )

  return (
    <section className="builder">
      <header className="builder-hero">
        <div>
          <p className="eyebrow">TOEIC PROMPT BUILDER</p>
          <h1>{copy('依證書級距產生日課提示詞')}</h1>
          <p className="lede">
            {copy('選擇橘／綠／藍／金證書與商務主題，產生可給 ChatGPT / Claude / NotebookLM 使用的多益訓練腳本提示詞。')}
          </p>
        </div>
      </header>

      <div className="builder-grid">
        <div className="builder-steps">
          <section className="step">
            <div className="step-index">01</div>
            <div className="step-body">
              <p className="step-kicker">CERTIFICATE</p>
              <h3>{copy('多益證書級距')}</h3>
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
                    <small>{locale === 'en' ? c.nameEn : c.name}</small>
                  </button>
                ))}
              </div>
              <p className="hint">{cert ? localizeToeicCertificate(cert, locale).audience : ''}</p>
            </div>
          </section>

          <section className="step">
            <div className="step-index">02</div>
            <div className="step-body">
              <p className="step-kicker">TOPIC</p>
              <h3>{copy('主題')}</h3>
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
                    {locale === 'en' ? t.labelEn : t.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="step">
            <div className="step-index">03</div>
            <div className="step-body">
              <p className="step-kicker">HOSTS</p>
              <h3>{copy('雙人主持')}</h3>
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
            <h3>{copy('產出提示詞')}</h3>
            {prompt ? (
              <pre className="prompt-box">{prompt}</pre>
            ) : (
              <button
                type="button"
                className="generate-empty"
                onClick={() => {
                  setPrompt(buildPrompt(config, locale))
                  setStatus({ code: 'prompt-generated' })
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
                  setPrompt(buildPrompt(config, locale))
                  void navigator.clipboard.writeText(buildPrompt(config, locale))
                  setStatus({ code: 'prompt-updated-and-copied' })
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
                  setStatus({ code: 'preset-saved', presetName: name })
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
                    setStatus({ code: 'template-applied', templateId: t.id })
                  }}
                >
                  <i>{t.icon}</i>
                  <div>
                    <strong>{locale === 'en' ? t.titleEn : t.title}</strong>
                    <span>{locale === 'en' ? t.descEn : t.desc}</span>
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
          {statusMessage && <p className="status-line">{statusMessage}</p>}
        </aside>
      </div>
    </section>
  )
}
