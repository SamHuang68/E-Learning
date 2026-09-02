import { describe, it, expect } from 'vitest'

describe('Chemistry Polymer Synthesis & Plastics Recycling Tests', () => {
  it('differentiates addition polymerization from condensation polymerization', () => {
    const additionPolymers = [
      { name: '聚乙烯 (PE)', monomer: '乙烯 (CH2=CH2)', byproduct: 'none' },
      { name: '聚丙烯 (PP)', monomer: '丙烯 (CH2=CH-CH3)', byproduct: 'none' },
      { name: '聚氯乙烯 (PVC)', monomer: '氯乙烯 (CH2=CH-Cl)', byproduct: 'none' },
      { name: '鐵氟龍 / 聚四氟乙烯 (PTFE)', monomer: '四氟乙烯 (CF2=CF2)', byproduct: 'none' },
    ]

    const condensationPolymers = [
      {
        name: '耐綸-66 (Nylon-6,6)',
        monomers: ['己二酸 (Adipic acid)', '己二胺 (Hexamethylenediamine)'],
        linkage: '醯胺鍵 (Amide / Peptide bond)',
        byproduct: 'H2O',
      },
      {
        name: '聚對苯二甲酸乙二酯 (PET / 寶特瓶)',
        monomers: ['對苯二甲酸 (Terephthalic acid)', '乙二醇 (Ethylene glycol)'],
        linkage: '酯鍵 (Ester bond)',
        byproduct: 'H2O',
      },
    ]

    expect(additionPolymers.length).toBe(4)
    additionPolymers.forEach((p) => expect(p.byproduct).toBe('none'))

    expect(condensationPolymers.length).toBe(2)
    condensationPolymers.forEach((p) => expect(p.byproduct).toBe('H2O'))
  })

  it('classifies plastics recycling resin identification codes (1 to 7)', () => {
    const spiCodes: Record<number, { code: string; fullZh: string; safeMicrowave: boolean }> = {
      1: { code: 'PET / PETE', fullZh: '聚對苯二甲酸乙二酯 (寶特瓶)', safeMicrowave: false },
      2: { code: 'HDPE', fullZh: '高密度聚乙烯 (牛奶瓶/清潔劑瓶)', safeMicrowave: false },
      3: { code: 'PVC', fullZh: '聚氯乙烯 (水管/保鮮膜)', safeMicrowave: false },
      4: { code: 'LDPE', fullZh: '低密度聚乙烯 (塑膠袋)', safeMicrowave: false },
      5: { code: 'PP', fullZh: '聚丙烯 (耐熱保鮮盒/微波餐盒)', safeMicrowave: true },
      6: { code: 'PS', fullZh: '聚苯乙烯 (養樂多瓶/保麗龍)', safeMicrowave: false },
      7: { code: 'OTHER', fullZh: '其他類 (PC/美耐皿/PLA)', safeMicrowave: false },
    }

    expect(Object.keys(spiCodes).length).toBe(7)
    // Code 5 (PP) is heat-resistant up to 120-140°C and safe for microwave food containers
    expect(spiCodes[5].safeMicrowave).toBe(true)
    expect(spiCodes[1].safeMicrowave).toBe(false)
  })

  it('distinguishes thermoplastic from thermosetting network polymers', () => {
    // Thermoplastic: linear or branched, melts upon heating, recyclable (e.g. PE, PP, PET)
    // Thermosetting: covalent cross-linked 3D network, decomposes/chars upon heating rather than melting (e.g. Bakelite 酚醛樹脂)
    const thermoplasticCanMelt = true
    const thermosettingCharsOnHeat = true

    expect(thermoplasticCanMelt).toBe(true)
    expect(thermosettingCharsOnHeat).toBe(true)
  })
})
