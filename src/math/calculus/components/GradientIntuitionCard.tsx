import { useI18n } from '../../../i18n/i18n'
import { MathFormula } from '../../components/MathFormula'
import { GRADIENT_INTUITION_SHEET } from '../data/gradientIntuition'

export function GradientIntuitionCard() {
  const { t } = useI18n()

  return (
    <section className="calc-grad-card" aria-labelledby="calc-grad-title">
      <div className="section-header-row">
        <h2 id="calc-grad-title">{t('calculus.grad.title')}</h2>
      </div>
      <p className="section-subtext">{t('calculus.grad.honesty')}</p>
      <div className="calc-grad-body">
        <svg className="calc-grad-svg" viewBox="0 0 120 80" aria-hidden="true">
          <ellipse cx="50" cy="44" rx="42" ry="26" />
          <ellipse cx="50" cy="44" rx="28" ry="17" />
          <ellipse cx="50" cy="44" rx="14" ry="8" />
          <line x1="50" y1="44" x2="98" y2="16" />
          <polygon points="98,16 86,20 90,28" />
        </svg>
        <div className="calc-grad-rows">
          {GRADIENT_INTUITION_SHEET.map((row) => (
            <div key={row.id} className="calc-grad-row">
              <span>{t(row.topicKey)}</span>
              <strong>
                <MathFormula math={`$${row.notation}$`} />
              </strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
