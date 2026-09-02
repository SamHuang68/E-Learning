import { describe, it, expect } from 'vitest'

describe('Chemistry Aldehyde/Ketone Alpha-Hydrogen Acidity & Aldol Condensation Tests', () => {
  it('explains the 10^30 acidity surge of carbonyl alpha-H via enolate resonance stabilization', () => {
    // Ethane (alkane) pKa ~ 50 vs Acetaldehyde alpha-H pKa ~ 19.3
    const pKa_Ethane = 50.0
    const pKa_Acetaldehyde_AlphaH = 19.3

    const pKaDifference = pKa_Ethane - pKa_Acetaldehyde_AlphaH // ~ 30.7 units (10^30.7 fold acidity increase)
    expect(pKaDifference).toBeGreaterThan(30)

    // Enolate anion delocalizes negative charge between carbon and highly electronegative oxygen:
    // [ CH2=CH-O-  <--->  -CH2-CH=O ] (2 resonance forms)
    const enolateResonanceStructuresCount = 2
    expect(enolateResonanceStructuresCount).toBe(2)
  })

  it('calculates bond enthalpy advantage explaining why keto tautomer predominates over enol', () => {
    // Approximate typical bond dissociation energies:
    // C=O bond energy ~ 745 kJ/mol
    // C=C bond energy ~ 610 kJ/mol
    const bondEnergy_CO_double = 745 // kJ/mol
    const bondEnergy_CC_double = 610 // kJ/mol

    const deltaEnthalpyAdvantage = bondEnergy_CO_double - bondEnergy_CC_double // 135 kJ/mol favor keto
    expect(deltaEnthalpyAdvantage).toBeGreaterThan(100)
    expect(bondEnergy_CO_double).toBeGreaterThan(bondEnergy_CC_double)
  })

  it('traces two-step aldol addition followed by E1cB dehydration to conjugated enone/enal', () => {
    // Self-condensation of acetaldehyde:
    // Step 1: Base deprotonates alpha-H => enolate
    // Step 2: Enolate attacks second acetaldehyde => 3-hydroxybutanal (aldol addition product)
    const additionProduct = '3-hydroxybutanal'
    const additionProductFunctionalGroups = ['aldehyde', 'beta-hydroxyl']

    expect(additionProduct).toBe('3-hydroxybutanal')
    expect(additionProductFunctionalGroups).toContain('beta-hydroxyl')

    // Step 3: Heating with dilute base causes E1cB elimination of H2O
    // Yields 2-butenal (crotonaldehyde), an alpha,beta-unsaturated conjugated enal
    const condensationProduct = '2-butenal'
    const isConjugated = true

    expect(condensationProduct).toBe('2-butenal')
    expect(isConjugated).toBe(true)
  })

  it('predicts clean cross-aldol condensation using an aldehyde with zero alpha-hydrogens', () => {
    // Benzaldehyde (C6H5CHO) has 0 alpha-hydrogens (cannot form enolate, only electrophilic acceptor)
    // Acetone (CH3COCH3) has 6 alpha-hydrogens (forms enolate)
    const benzaldehydeAlphaHydrogens = 0
    const acetoneAlphaHydrogens = 6

    expect(benzaldehydeAlphaHydrogens).toBe(0)
    expect(acetoneAlphaHydrogens).toBe(6)

    // Reaction yields exclusively 4-phenyl-3-buten-2-one (benzylideneacetone) upon dehydration
    const crossAldolProduct = '4-phenyl-3-buten-2-one'
    expect(crossAldolProduct).toBe('4-phenyl-3-buten-2-one')
  })
})
