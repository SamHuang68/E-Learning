import { useState } from 'react'
import { useI18n } from '../../i18n/i18n'
import {
  CAPITAL_TABLE,
  COLLOCATION_ROWS,
  FUNCTION_TABLE,
  NONFINITE_TABLE,
  NOTE_FOLDERS,
  PATTERN_TABLE,
  POS_TABLE,
  PREP_PAIRS,
  PREPOSITION_ROWS,
  PUNCTUATION_MARKS,
  SERIES_CROSSWALK,
  SEMANTICS_TABLE,
  SOUND_TABLE,
  STUDY_STAGES,
  SUBJUNCTIVE_ROWS,
  SYNTHESIS_SERIES,
  TENSE_ROWS,
  TRANSITION_TABLE,
  type SeriesPoint,
  type TeachTable,
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

function TeachGrid({ table, lang }: { table: TeachTable; lang: Lang }) {
  return (
    <div className="table-responsive">
      <table className="decision-table">
        <caption>{pick(table.caption, lang)}</caption>
        <thead>
          <tr>
            {table.columns.map((col) => (
              <th key={col.en} scope="col">{pick(col, lang)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.id}>
              <th scope="row">{pick(row.cells[0], lang)}</th>
              <td>{pick(row.cells[1], lang)}</td>
              <td>{pick(row.cells[2], lang)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
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

      {active.id === 'pos' ? (
        <>
          <TeachGrid table={POS_TABLE} lang={lang} />
          <div className="table-responsive">
          <table className="decision-table">
            <caption>{t('en.synthesis.prepCaption')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('en.synthesis.colRelation')}</th>
                <th scope="col">at</th>
                <th scope="col">on</th>
                <th scope="col">in</th>
                <th scope="col">{t('en.synthesis.colNote')}</th>
              </tr>
            </thead>
            <tbody>
              {PREPOSITION_ROWS.map((row) => (
                <tr key={row.relation.en}>
                  <th scope="row">{pick(row.relation, lang)}</th>
                  <td>{row.at}</td>
                  <td>{row.on}</td>
                  <td>{row.in}</td>
                  <td>{pick(row.note, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>{t('en.synthesis.prepPairs')}</h3>
          <ul>
            {PREP_PAIRS.map((row) => (
              <li key={row.en}>{pick(row, lang)}</li>
            ))}
          </ul>
        </div>
        </>
      ) : null}

      {active.id === 'syntax' ? <TeachGrid table={PATTERN_TABLE} lang={lang} /> : null}

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
      {active.id === 'verbal' ? <TeachGrid table={NONFINITE_TABLE} lang={lang} /> : null}

      {active.id === 'lexicon' ? (
        <div className="table-responsive">
          <table className="decision-table">
            <caption>{t('en.synthesis.chunkCaption')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('en.synthesis.colChunk')}</th>
                <th scope="col">{t('en.synthesis.colUse')}</th>
                <th scope="col">{t('en.synthesis.colAvoid')}</th>
              </tr>
            </thead>
            <tbody>
              {COLLOCATION_ROWS.map((row) => (
                <tr key={row.chunk}>
                  <th scope="row">{row.chunk}</th>
                  <td>{pick(row.use, lang)}</td>
                  <td>{pick(row.avoid, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {active.id === 'mechanics' ? (
        <div className="table-responsive">
          <table className="decision-table">
            <caption>{t('en.synthesis.punctCaption')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('en.synthesis.colMark')}</th>
                <th scope="col">{t('en.synthesis.colJob')}</th>
                <th scope="col">{t('en.synthesis.colPitfall')}</th>
              </tr>
            </thead>
            <tbody>
              {PUNCTUATION_MARKS.map((row) => (
                <tr key={row.mark}>
                  <th scope="row">{row.mark}</th>
                  <td>{pick(row.job, lang)}</td>
                  <td>{pick(row.pitfall, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {active.id === 'mechanics' ? <TeachGrid table={TRANSITION_TABLE} lang={lang} /> : null}
      {active.id === 'mechanics' ? <TeachGrid table={CAPITAL_TABLE} lang={lang} /> : null}
      {active.id === 'sound' ? <TeachGrid table={SOUND_TABLE} lang={lang} /> : null}
      {active.id === 'semantics' ? <TeachGrid table={SEMANTICS_TABLE} lang={lang} /> : null}
      {active.id === 'function' ? <TeachGrid table={FUNCTION_TABLE} lang={lang} /> : null}

      <section aria-labelledby="toeic-synthesis-map">
        <h3 id="toeic-synthesis-map">{t('en.synthesis.mapTitle')}</h3>
        <ul>
          {SERIES_CROSSWALK.map((row) => (
            <li key={row.en}>{pick(row, lang)}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="toeic-synthesis-stages">
        <h3 id="toeic-synthesis-stages">{t('en.synthesis.stageTitle')}</h3>
        <ol>
          {STUDY_STAGES.map((row) => (
            <li key={row.en}>{pick(row, lang)}</li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="toeic-synthesis-notes">
        <h3 id="toeic-synthesis-notes">{t('en.synthesis.noteTitle')}</h3>
        <ul>
          {NOTE_FOLDERS.map((row) => (
            <li key={row.en}>{pick(row, lang)}</li>
          ))}
        </ul>
      </section>
    </section>
  )
}
