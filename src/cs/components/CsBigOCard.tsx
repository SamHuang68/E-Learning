import { useI18n } from '../../i18n/i18n'
import { MathFormula } from '../../math/components/MathFormula'
import {
  CS_BIG_O_SHEET,
  CS_STRAND_IDS,
  csStrandMessageKey,
  getCsUnitById,
} from '../data/curriculum'

const BIG_O_GROUPS = CS_STRAND_IDS.map((strand) => ({
  strand,
  rows: CS_BIG_O_SHEET.filter((row) => getCsUnitById(row.unitId)?.strand === strand),
})).filter((group) => group.rows.length > 0)

export function CsBigOCard() {
  const { t } = useI18n()

  return (
    <section className="cs-bigo-card" aria-labelledby="cs-bigo-title">
      <div className="section-header-row">
        <h2 id="cs-bigo-title">{t('cs.bigo.title')}</h2>
      </div>
      <p className="section-subtext">{t('cs.bigo.honesty')}</p>
      {BIG_O_GROUPS.map((group) => (
        <div key={group.strand} className="cs-bigo-group">
          <h3>{t(csStrandMessageKey(group.strand))}</h3>
          {group.rows.map((row) => (
            <div key={row.id} className="cs-bigo-row">
              <span>{t(row.topicKey)}</span>
              <strong>
                <MathFormula math={`$${row.notation}$`} />
              </strong>
            </div>
          ))}
        </div>
      ))}
    </section>
  )
}
