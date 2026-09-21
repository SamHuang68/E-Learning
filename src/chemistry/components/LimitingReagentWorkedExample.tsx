import { useId } from 'react'
import { useI18n } from '../../i18n/i18n'

/** Structured limiting-reagent worked example. Teaching only, not an exam-pass claim. */
export function LimitingReagentWorkedExample() {
  const { t } = useI18n()
  const titleId = `${useId()}-title`

  return (
    <section className="limiting-reagent-example" aria-labelledby={titleId}>
      <h3 id={titleId} className="limiting-reagent-title">
        {t('chemistry.limiting.title')}
      </h3>
      <p className="limiting-reagent-given">{t('chemistry.limiting.given')}</p>
      <table className="limiting-reagent-table">
        <caption>{t('chemistry.limiting.caption')}</caption>
        <thead>
          <tr>
            <th scope="col">{t('chemistry.limiting.col.reagent')}</th>
            <th scope="col">{t('chemistry.limiting.col.n')}</th>
            <th scope="col">{t('chemistry.limiting.col.coeff')}</th>
            <th scope="col">{t('chemistry.limiting.col.ratio')}</th>
            <th scope="col">{t('chemistry.limiting.col.role')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">H2</th>
            <td>4 mol</td>
            <td>2</td>
            <td>4/2 = 2</td>
            <td>{t('chemistry.limiting.limiting')}</td>
          </tr>
          <tr>
            <th scope="row">O2</th>
            <td>3 mol</td>
            <td>1</td>
            <td>3/1 = 3</td>
            <td>{t('chemistry.limiting.excess')}</td>
          </tr>
        </tbody>
      </table>
      <ol className="limiting-reagent-steps">
        <li>{t('chemistry.limiting.step1')}</li>
        <li>{t('chemistry.limiting.step2')}</li>
        <li>{t('chemistry.limiting.step3')}</li>
      </ol>
      <p className="limiting-reagent-honesty">{t('chemistry.limiting.honesty')}</p>
    </section>
  )
}
