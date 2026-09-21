import { useI18n } from '../../i18n/i18n'
import { CS_HTTP_TCP_SHEET, getCsUnitById } from '../data/curriculum'

export function CsHttpTcpCard() {
  const { t } = useI18n()
  const unit = getCsUnitById('cs-unit-5-networking')

  return (
    <section className="cs-httptcp-card" aria-labelledby="cs-httptcp-title">
      <div className="section-header-row">
        <h2 id="cs-httptcp-title">{t('cs.httptcp.title')}</h2>
      </div>
      <p className="section-subtext">{t('cs.httptcp.honesty')}</p>
      {unit ? <p className="cs-httptcp-unit">{unit.title}</p> : null}
      {CS_HTTP_TCP_SHEET.map((row) => (
        <div key={row.id} className="cs-httptcp-row">
          <span>{t(row.topicKey)}</span>
          <strong>{t(row.layerKey)}</strong>
        </div>
      ))}
    </section>
  )
}
