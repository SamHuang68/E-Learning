import { useI18n } from '../../i18n/i18n'
import { physicsFormulaSheetSections } from '../data/curriculum'
import { MathFormula } from '../../math/components/MathFormula'
import { WaveInterferenceDiagram } from './WaveInterferenceDiagram'

type Props = {
  onBack: () => void
}

/**
 * Catalog physics formula sheet. Offline via PhysicsApp chunk + precached KaTeX fonts.
 * Not an official exam sheet.
 */
export function PhysicsFormulaSheet({ onBack }: Props) {
  const { t, locale } = useI18n()
  const sections = physicsFormulaSheetSections()

  return (
    <div className="physics-formula-sheet">
      <div className="section-title-row">
        <h2>{t('physics.formulas.title')}</h2>
        <button type="button" className="btn-back" onClick={onBack}>
          {t('physics.backToday')}
        </button>
      </div>
      <p className="section-subtext">{t('physics.formulas.honesty')}</p>
      <WaveInterferenceDiagram />
      {sections.map((section) => (
        <section key={section.gradeId} className="unit-map-section" aria-labelledby={`phys-sheet-${section.gradeId}`}>
          <h3 id={`phys-sheet-${section.gradeId}`}>
            {locale === 'en' ? section.nameEn : section.name}
          </h3>
          {section.units.map((unit) => (
            <div key={`${section.gradeId}-${unit.id}`} className="physics-formula-unit">
              <h4>{t('chrome.unitNColon', { n: unit.id, title: unit.title })}</h4>
              <div className="concept-cards-grid">
                {unit.concepts.map((concept, idx) => (
                  <div key={idx} className="concept-item-card">
                    <span className="concept-idx">{t('physics.formulas.item', { n: idx + 1 })}</span>
                    <div className="concept-text">
                      <MathFormula math={concept} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}
