import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { getAllPhysicsUnits, PHYSICS_STRAND_NAMES } from '../physics/data/curriculum'
import { getAllChemistryUnits } from '../chemistry/data/curriculum'
import { stemVaultCopy } from './stemVaultCopy'
import { AI_CLOUD_SCENARIOS } from '../toeic/data/aiCloudDialogues'
import { toeicCertificates } from '../toeic/data/certificates'
import { localizeToeicCertificate } from './toeicCertificateCopy'

describe('有資料錯題庫英文介面', () => {
  it('所有學段、靜態介面與關聯教具都有英文，繁中來源保持一致', () => {
    const labels = [
      ...[...getAllPhysicsUnits(), ...getAllChemistryUnits()].map((unit) => unit.band),
      ...Object.values(PHYSICS_STRAND_NAMES),
    ]
    for (const path of [
      'src/physics/components/PhysicsErrorVault.tsx',
      'src/chemistry/components/ChemistryErrorVault.tsx',
      'src/math/components/MathErrorVault.tsx',
      'src/physics/components/PhysicsToday.tsx',
      'src/chemistry/components/ChemistryToday.tsx',
    ]) {
      const source = readFileSync(path, 'utf8')
      for (const match of source.matchAll(/stemVaultCopy\(locale, (['"])(.*?)\1\)/g)) labels.push(match[2])
      for (const match of source.matchAll(/name: '([^']+)'/g)) labels.push(match[1])
    }
    for (const label of labels) {
      expect(stemVaultCopy('en', label), label).not.toMatch(/[\u3400-\u9fff]/)
      expect(stemVaultCopy('zh-Hant', label)).toBe(label)
    }
    expect(() => stemVaultCopy('en', '未定義測試文字')).toThrow()
  })

  it('AI Cloud 教材全部具備英文情境及解析，不更動標準答案', () => {
    for (const cert of toeicCertificates) {
      const localized = localizeToeicCertificate(cert, 'en')
      expect(localized.units).toBe(cert.units)
      expect(localizeToeicCertificate(cert, 'zh-Hant')).toBe(cert)
      for (const text of [localized.audience, localized.mapTitle, localized.mapDesc]) {
        expect(text).not.toMatch(/[\u3400-\u9fff]/)
      }
    }
    for (const scenario of AI_CLOUD_SCENARIOS) {
      for (const text of [scenario.titleEn, scenario.accentLabelEn, scenario.aiCloudKeywordsTipsEn]) {
        expect(text).toBeTruthy()
        expect(text).not.toMatch(/[\u3400-\u9fff]/)
      }
      for (const q of scenario.questions) {
        expect(q.explanationEn).toBeTruthy()
        expect(q.explanationEn).not.toMatch(/[\u3400-\u9fff]/)
        expect(q.options[q.correctIndex]).toBeTruthy()
      }
    }
  })
})
