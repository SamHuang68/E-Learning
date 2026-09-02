import { describe, it, expect } from 'vitest'

describe('Chemistry Carboxylic Acid Derivatives Reactivity & Nucleophilic Acyl Substitution Tests', () => {
  it('verifies the hierarchical reactivity ranking of carboxylic acid derivatives', () => {
    // Reactivity sequence towards nucleophilic acyl substitution (NAS):
    // Acyl Chloride (1) > Acid Anhydride (2) > Ester (3) > Amide (4) > Carboxylate anion (5)
    const reactivityRank = {
      acylChloride: 1, // Most reactive
      acidAnhydride: 2,
      ester: 3,
      amide: 4,
      carboxylateAnion: 5, // Least reactive
    }

    expect(reactivityRank.acylChloride).toBeLessThan(reactivityRank.acidAnhydride)
    expect(reactivityRank.acidAnhydride).toBeLessThan(reactivityRank.ester)
    expect(reactivityRank.ester).toBeLessThan(reactivityRank.amide)
    expect(reactivityRank.amide).toBeLessThan(reactivityRank.carboxylateAnion)
  })

  it('correlates leaving group ability with conjugate acid pKa (weaker base = better leaving group)', () => {
    // Conjugate acid pKa values:
    // Cl- (HCl pKa ~ -7) => superb leaving group
    // RCOO- (RCOOH pKa ~ 4.76) => good leaving group
    // RO- (ROH pKa ~ 16) => poor leaving group
    // NH2- (NH3 pKa ~ 38) => exceedingly poor leaving group
    const pKa_HCl = -7.0
    const pKa_AceticAcid = 4.76
    const pKa_Ethanol = 15.9
    const pKa_Ammonia = 38.0

    expect(pKa_HCl).toBeLessThan(pKa_AceticAcid)
    expect(pKa_AceticAcid).toBeLessThan(pKa_Ethanol)
    expect(pKa_Ethanol).toBeLessThan(pKa_Ammonia)

    // Acyl chloride has the best leaving group because conjugate acid has the lowest pKa
    const bestLeavingGroup = pKa_HCl < pKa_AceticAcid && pKa_HCl < pKa_Ethanol
    expect(bestLeavingGroup).toBe(true)
  })

  it('demonstrates downhill spontaneous conversions from acyl chloride to all downstream derivatives', () => {
    // Acetyl chloride (CH3COCl) conversions without external coupling reagents:
    // + H2O => Acetic acid (Hydrolysis)
    // + Ethanol => Ethyl acetate (Alcoholysis to Ester)
    // + Ammonia => Acetamide (Aminolysis to Amide)
    const canConvertAcylChlorideToAcid = true
    const canConvertAcylChlorideToEster = true
    const canConvertAcylChlorideToAmide = true

    // Direct reverse: Acetamide + NaCl cannot yield Acetyl chloride (thermodynamically forbidden uphill reaction)
    const canConvertAmideToAcylChlorideSpontaneously = false

    expect(canConvertAcylChlorideToAcid).toBe(true)
    expect(canConvertAcylChlorideToEster).toBe(true)
    expect(canConvertAcylChlorideToAmide).toBe(true)
    expect(canConvertAmideToAcylChlorideSpontaneously).toBe(false)
  })

  it('models tetrahedral intermediate hybridization change during addition-elimination', () => {
    // Carbonyl carbon starting geometry: sp2 planar
    // Nucleophilic addition: sp3 tetrahedral intermediate
    // Leaving group expulsion: sp2 planar carbonyl restored
    const initialHybridization = 'sp2'
    const intermediateHybridization = 'sp3'
    const finalHybridization = 'sp2'

    expect(initialHybridization).toBe('sp2')
    expect(intermediateHybridization).toBe('sp3')
    expect(finalHybridization).toBe('sp2')
  })
})
