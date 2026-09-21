import { useI18n } from '../../../i18n/i18n'
import { catalogPrerequisiteRows } from '../data/calculusCatalog'

/**
 * Catalog-declared teaching prerequisites as a readable list.
 * Not a mastery lock, fluency claim, or invented dependency graph.
 */
export function CalculusPrerequisiteGraph() {
  const { t, locale } = useI18n()
  const rows = catalogPrerequisiteRows()
  const join = locale === 'en' ? ', ' : '、'

  return (
    <section className="calc-prereq-graph" aria-labelledby="calc-prereq-title">
      <h3 id="calc-prereq-title">{t('calculus.prereq.title')}</h3>
      <p className="section-subtext">{t('calculus.prereq.honesty')}</p>
      <ol>
        {rows.map((row) => {
          const names = row.prereqs.map((p) => p.name).join(join)
          return (
            <li key={row.id}>
              <strong>{row.name}</strong>
              <span className={row.prereqs.some((p) => !p.known) ? 'calc-prereq-unknown' : 'calc-prereq-edge'}>
                {row.prereqs.length === 0
                  ? t('calculus.prereq.none')
                  : t('calculus.prereq.from', { names })}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
