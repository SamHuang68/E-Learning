import { useState } from 'react'
import { useI18n } from '../../i18n/i18n'
import {
  PUNCTUATION_PITFALLS,
  SERIES_CROSSWALK,
  SUBJUNCTIVE_ROWS,
  SYNTHESIS_SERIES,
  TENSE_ROWS,
  type SeriesPoint,
} from '../data/synthesisSeries'

type Props = {
  instructionLang?: 'zh' | 'ja'
}

type Lang = 'zh' | 'en' | 'ja'

function pick(point: SeriesPoint, lang: Lang) {
  if (lang === 'ja') return point.ja
  if (lang === 'en') return point.en
  return point.zh
}

export function ToeicSynthesisSeries({ instructionLang = 'zh' }: Props) {
  const { t, locale } = useI18n()
  const lang: Lang = instructionLang === 'ja' ? 'ja' : locale === 'en' ? 'en' : 'zh'
  const [activeId, setActiveId] = useState(SYNTHESIS_SERIES[0].id)
  const active = SYNTHESIS_SERIES.find((item) => item.id === activeId) ?? SYNTHESIS_SERIES[0]
  const lead = lang === 'ja' ? active.jaLead : lang === 'en' ? active.enLead : active.zhLead
  const title = lang === 'ja' ? active.ja : lang === 'en' ? active.en : active.zh

  return (
    <section className="study-section toeic-synthesis" aria-labelledby="toeic-synthesis-title">
      <p className="eyebrow">{t('en.synthesis.kicker')}</p>
      <h2 id="toeic-synthesis-title">{t('en.nav.synthesis')}</h2>
      <p className="lede">{t('en.synthesis.lede')}</p>
      <p className="section-subtext" role="note">{t('en.synthesis.honesty')}</p>

      <div className="hub-search-empty-links" role="tablist" aria-label={t('en.nav.synthesis')}>
        {SYNTHESIS_SERIES.map((item) => {
          const label = lang === 'ja' ? item.ja : lang === 'en' ? item.en : item.zh
          const selected = item.id === active.id
          return (
            <button
              key={item.id}
              type="button"
              className={selected ? 'pill-btn active' : 'pill-btn'}
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveId(item.id)}
            >
              {item.n}. {label}
            </button>
          )
        })}
      </div>

      <article className="practice-card" aria-labelledby="toeic-synthesis-active">
        <h3 id="toeic-synthesis-active">{active.n}. {title}</h3>
        <p>{lead}</p>
        <ul>
          {active.points.map((point) => (
            <li key={pick(point, 'en')}>{pick(point, lang)}</li>
          ))}
        </ul>
      </article>

      {active.id === 'verbal' ? (
        <div className="table-responsive">
          <table className="decision-table">
            <caption>{t('en.synthesis.tenseCaption')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('en.synthesis.colTime')}</th>
                <th scope="col">{t('en.synthesis.colSimple')}</th>
                <th scope="col">{t('en.synthesis.colProg')}</th>
                <th scope="col">{t('en.synthesis.colPerf')}</th>
                <th scope="col">{t('en.synthesis.colPerfProg')}</th>
              </tr>
            </thead>
            <tbody>
              {TENSE_ROWS.map((row) => (
                <tr key={row.time.en}>
                  <th scope="row">{pick(row.time, lang)}</th>
                  {row.cells.map((cell) => (
                    <td key={cell}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <ul>
            {SUBJUNCTIVE_ROWS.map((row) => (
              <li key={row.en}>{pick(row, lang)}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {active.id === 'mechanics' ? (
        <ul>
          {PUNCTUATION_PITFALLS.map((row) => (
            <li key={row.en}>{pick(row, lang)}</li>
          ))}
        </ul>
      ) : null}

      <section aria-labelledby="toeic-synthesis-map">
        <h3 id="toeic-synthesis-map">{t('en.synthesis.mapTitle')}</h3>
        <ul>
          {SERIES_CROSSWALK.map((row) => (
            <li key={row.en}>{pick(row, lang)}</li>
          ))}
        </ul>
      </section>
    </section>
  )
}
