import { describe, expect, it } from 'vitest'
import { jlptLevels } from '../data/course'
import { translate } from './messages'
import {
  aobaLevelOptionLabel,
  aobaUnitChromeTitle,
  jlptMapTitle,
  jlptTierLabel,
} from './jlptChrome'

const HAN = /[\u4e00-\u9fff]/

describe('Aoba EN chrome: level/unit select labels', () => {
  const tEn = (key: Parameters<typeof translate>[1]) => translate('en', key)

  it('maps 基礎／初級／中級／進階 to EN with no Han', () => {
    for (const raw of ['基礎', '初級', '中級', '進階']) {
      const label = jlptTierLabel(raw, tEn)
      expect(label).toMatch(/^(Beginner|Intermediate|Advanced)$/)
      expect(label).not.toMatch(HAN)
    }
  })

  it('level select options under en contain no Han in the tier half', () => {
    for (const level of jlptLevels) {
      const option = aobaLevelOptionLabel(level, tEn)
      const tierPart = option.split('·').pop()?.trim() ?? ''
      expect(option.startsWith(level.band)).toBe(true)
      expect(tierPart).not.toMatch(HAN)
      expect(tierPart).not.toBe(level.tier)
    }
  })

  it('unit select options under en use titleJa, not ZH titles', () => {
    for (const level of jlptLevels) {
      for (const unit of level.units) {
        const option = aobaUnitChromeTitle('en', unit)
        expect(option).toBe(unit.titleJa)
        expect(option).not.toBe(unit.title)
        expect(aobaUnitChromeTitle('zh-Hant', unit)).toBe(unit.title)
      }
    }
  })

  it('TodayView map heading under en is localized chrome, not raw ZH mapTitle', () => {
    for (const level of jlptLevels) {
      const heading = jlptMapTitle(level, tEn)
      expect(heading).not.toBe(level.mapTitle)
      expect(heading).not.toMatch(HAN)
    }
  })
})
