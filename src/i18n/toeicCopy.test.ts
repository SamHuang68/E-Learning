import { describe, expect, it } from 'vitest'
import { toeicCertificates, type ToeicCertificate } from '../toeic/data/certificates'
import { localizeToeicCertificate } from './toeicCertificateCopy'
import { TOEIC_BUILDER_EN, toeicBuilderCopy } from './toeicBuilderCopy'

const CJK = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/

describe('TOEIC 嚴格英文文案', () => {
  it('課程工具每筆英文完整且繁中保持原樣', () => {
    for (const [source, english] of Object.entries(TOEIC_BUILDER_EN)) {
      expect(english.trim()).not.toBe('')
      expect(english).not.toMatch(CJK)
      expect(toeicBuilderCopy('en', source)).toBe(english)
      expect(toeicBuilderCopy('zh-Hant', source)).toBe(source)
    }
  })

  it('未知課程文案與證書翻譯缺鍵時明確失敗', () => {
    expect(() => toeicBuilderCopy('en', '未知文案')).toThrow('缺少')
    expect(() => localizeToeicCertificate({ ...toeicCertificates[0], id: 'missing' } as unknown as ToeicCertificate, 'en')).toThrow('缺少')
  })

  it('全部證書英文欄位不含 CJK，繁中回傳原資料', () => {
    for (const source of toeicCertificates) {
      const english = localizeToeicCertificate(source, 'en')
      for (const text of [english.audience, english.mapTitle, english.mapDesc, english.nameEn, english.disclaimerEn]) {
        expect(text.trim()).not.toBe('')
        expect(text).not.toMatch(CJK)
      }
      expect(localizeToeicCertificate(source, 'zh-Hant')).toBe(source)
    }
  })

  it('阻止英文文案污染或空值', () => {
    const source = Object.keys(TOEIC_BUILDER_EN)[0]
    const original = TOEIC_BUILDER_EN[source]
    try {
      for (const invalid of ['中文', '']) {
        TOEIC_BUILDER_EN[source] = invalid
        expect(() => toeicBuilderCopy('en', source)).toThrow('無效')
        expect(() => localizeToeicCertificate({ ...toeicCertificates[0], disclaimerEn: invalid }, 'en')).toThrow('無效')
      }
    } finally {
      TOEIC_BUILDER_EN[source] = original
    }
  })
})
