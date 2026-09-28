import { useState } from 'react'
import { useI18n } from '../../i18n/i18n'
import type { MessageKey } from '../../i18n/messages'
import {
  ASPECT_DRILLS,
  CAPITAL_DRILLS,
  CAPITAL_TABLE,
  CHUNK_DRILLS,
  COLLOCATION_ROWS,
  FUNCTION_DRILLS,
  FUNCTION_TABLE,
  IF_DRILLS,
  NONFINITE_DRILLS,
  NONFINITE_TABLE,
  NOTE_FOLDERS,
  PATTERN_DRILLS,
  PATTERN_TABLE,
  POS_TABLE,
  PREP_PAIRS,
  PREPOSITION_ROWS,
  PREP_DRILLS,
  PUNCT_DRILLS,
  PUNCTUATION_MARKS,
  SERIES_CROSSWALK,
  SEMANTICS_DRILLS,
  SEMANTICS_TABLE,
  SOUND_DRILLS,
  SOUND_TABLE,
  STUDY_STAGES,
  SUBJUNCTIVE_ROWS,
  SYNTHESIS_SERIES,
  TENSE_DRILLS,
  TENSE_ROWS,
  TRANSITION_DRILLS,
  TRANSITION_TABLE,
  type PrepDrill,
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

function ChoiceCheck({
  lang,
  items,
  titleKey,
  noteKey,
  stemId,
}: {
  lang: Lang
  items: PrepDrill[]
  titleKey: MessageKey
  noteKey: MessageKey
  stemId: string
}) {
  const { t } = useI18n()
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const item = items[index] ?? items[0]
  const matched = picked !== null && picked === item.answer
  const statusId = `${stemId}-status`

  return (
    <div className="practice-card">
      <h3>{t(titleKey)}</h3>
      <p className="section-subtext">{t(noteKey)}</p>
      <p id={stemId}>{pick(item.stem, lang)}</p>
      <div role="group" aria-labelledby={stemId}>
        {item.choices.map((choice) => {
          const wrong = picked === choice && choice !== item.answer
          return (
            <button
              key={choice}
              type="button"
              className={picked === choice ? 'pill-btn active' : 'pill-btn'}
              aria-pressed={picked === choice}
              aria-invalid={wrong ? true : undefined}
              aria-describedby={picked === choice ? statusId : undefined}
              onClick={() => setPicked(choice)}
            >
              {choice}
            </button>
          )
        })}
      </div>
      <p id={statusId} role="status" aria-live="polite">
        {picked === null ? '' : matched ? t('en.synthesis.drillOk') : t('en.synthesis.drillNo')}
        {picked !== null ? ` ${pick(item.why, lang)}` : ''}
      </p>
      <button
        type="button"
        className="pill-btn"
        onClick={() => {
          setIndex((current) => (current + 1) % items.length)
          setPicked(null)
        }}
      >
        {t('en.synthesis.drillNext')}
      </button>
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
          <ChoiceCheck
            lang={lang}
            items={PREP_DRILLS}
            titleKey="en.synthesis.prepDrill"
            noteKey="en.synthesis.prepDrillNote"
            stemId="prep-drill-stem"
          />
        </div>
        </>
      ) : null}

      {active.id === 'syntax' ? <TeachGrid table={PATTERN_TABLE} lang={lang} /> : null}
      {active.id === 'syntax' ? (
        <ChoiceCheck
          lang={lang}
          items={PATTERN_DRILLS}
          titleKey="en.synthesis.patternDrill"
          noteKey="en.synthesis.patternDrillNote"
          stemId="pattern-drill-stem"
        />
      ) : null}

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
          <ChoiceCheck
            lang={lang}
            items={TENSE_DRILLS}
            titleKey="en.synthesis.tenseDrill"
            noteKey="en.synthesis.tenseDrillNote"
            stemId="tense-drill-stem"
          />
          <ChoiceCheck
            lang={lang}
            items={IF_DRILLS}
            titleKey="en.synthesis.ifDrill"
            noteKey="en.synthesis.ifDrillNote"
            stemId="if-drill-stem"
          />
          <ChoiceCheck
            lang={lang}
            items={ASPECT_DRILLS}
            titleKey="en.synthesis.aspectDrill"
            noteKey="en.synthesis.aspectDrillNote"
            stemId="aspect-drill-stem"
          />
        </div>
      ) : null}
      {active.id === 'verbal' ? <TeachGrid table={NONFINITE_TABLE} lang={lang} /> : null}
      {active.id === 'verbal' ? (
        <ChoiceCheck
          lang={lang}
          items={NONFINITE_DRILLS}
          titleKey="en.synthesis.nonfiniteDrill"
          noteKey="en.synthesis.nonfiniteDrillNote"
          stemId="nonfinite-drill-stem"
        />
      ) : null}

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
          <ChoiceCheck
            lang={lang}
            items={CHUNK_DRILLS}
            titleKey="en.synthesis.chunkDrill"
            noteKey="en.synthesis.chunkDrillNote"
            stemId="chunk-drill-stem"
          />
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
      {active.id === 'mechanics' ? (
        <ChoiceCheck
          lang={lang}
          items={PUNCT_DRILLS}
          titleKey="en.synthesis.punctDrill"
          noteKey="en.synthesis.punctDrillNote"
          stemId="punct-drill-stem"
        />
      ) : null}
      {active.id === 'mechanics' ? <TeachGrid table={TRANSITION_TABLE} lang={lang} /> : null}
      {active.id === 'mechanics' ? (
        <ChoiceCheck
          lang={lang}
          items={TRANSITION_DRILLS}
          titleKey="en.synthesis.transitionDrill"
          noteKey="en.synthesis.transitionDrillNote"
          stemId="transition-drill-stem"
        />
      ) : null}
      {active.id === 'mechanics' ? <TeachGrid table={CAPITAL_TABLE} lang={lang} /> : null}
      {active.id === 'mechanics' ? (
        <ChoiceCheck
          lang={lang}
          items={CAPITAL_DRILLS}
          titleKey="en.synthesis.capitalDrill"
          noteKey="en.synthesis.capitalDrillNote"
          stemId="capital-drill-stem"
        />
      ) : null}
      {active.id === 'sound' ? <TeachGrid table={SOUND_TABLE} lang={lang} /> : null}
      {active.id === 'sound' ? (
        <ChoiceCheck
          lang={lang}
          items={SOUND_DRILLS}
          titleKey="en.synthesis.soundDrill"
          noteKey="en.synthesis.soundDrillNote"
          stemId="sound-drill-stem"
        />
      ) : null}
      {active.id === 'semantics' ? <TeachGrid table={SEMANTICS_TABLE} lang={lang} /> : null}
      {active.id === 'semantics' ? (
        <ChoiceCheck
          lang={lang}
          items={SEMANTICS_DRILLS}
          titleKey="en.synthesis.semanticsDrill"
          noteKey="en.synthesis.semanticsDrillNote"
          stemId="semantics-drill-stem"
        />
      ) : null}
      {active.id === 'function' ? <TeachGrid table={FUNCTION_TABLE} lang={lang} /> : null}
      {active.id === 'function' ? (
        <ChoiceCheck
          lang={lang}
          items={FUNCTION_DRILLS}
          titleKey="en.synthesis.functionDrill"
          noteKey="en.synthesis.functionDrillNote"
          stemId="function-drill-stem"
        />
      ) : null}

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
