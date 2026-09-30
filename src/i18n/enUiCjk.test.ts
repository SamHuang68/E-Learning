import { describe, expect, it } from 'vitest'
import { EN, translate, type MessageKey } from './messages'
import { EN_UI_CJK_ALLOWED_KEYS } from './enUiCjkAllowlist'
import { localizeBadge } from './badgeI18n'
import { localizeTrackRadar } from './radarI18n'
import { BADGE_CATALOG } from '../engine/gamification'
import {
  computeAobaRadar,
  computeCalculusRadar,
  computeChemistryRadar,
  computeChineseRadar,
  computeCsRadar,
  computeMathRadar,
  computePhysicsRadar,
  computeToeicRadar,
} from '../engine/radar'

const CJK = /[\u3400-\u9FFF\uF900-\uFAFF]/

function cjkHits(label: string, value: string): string | null {
  return CJK.test(value) ? `${label}: ${value}` : null
}

describe('English-mode UI CJK guard', () => {
  it('keeps EN dictionary values free of CJK except the allowlist', () => {
    const leaks: string[] = []
    for (const key of Object.keys(EN) as MessageKey[]) {
      if (EN_UI_CJK_ALLOWED_KEYS.has(key)) continue
      const hit = cjkHits(key, EN[key])
      if (hit) leaks.push(hit)
    }
    expect(leaks, leaks.join('\n')).toEqual([])
  })

  it('translate(en) matches the allowlist rule for every key', () => {
    const leaks: string[] = []
    for (const key of Object.keys(EN) as MessageKey[]) {
      if (EN_UI_CJK_ALLOWED_KEYS.has(key)) continue
      const hit = cjkHits(
        key,
        translate('en', key, {
          count: 1,
          n: 1,
          total: 1,
          title: 'X',
          track: 'Math',
          score: 1,
          details: 'a',
          name: 'Lab',
        }),
      )
      if (hit) leaks.push(hit)
    }
    expect(leaks, leaks.join('\n')).toEqual([])
  })

  it('radar and badge English copies stay free of CJK', () => {
    const radars = [
      computeMathRadar([], {}, []),
      computeCalculusRadar(0, 0, 0),
      computePhysicsRadar([], {}, []),
      computeChemistryRadar([], {}, []),
      computeCsRadar([], {}, []),
      computeAobaRadar(0, 0, 0, 0),
      computeToeicRadar(0, 0, 0),
      computeChineseRadar(0, 0, 0, 0, 0),
    ]
    const leaks: string[] = []
    for (const raw of radars) {
      const radar = localizeTrackRadar(raw, 'en')
      const hitName = cjkHits(`${radar.track}.trackName`, radar.trackName)
      if (hitName) leaks.push(hitName)
      for (const dim of radar.dimensions) {
        const a = cjkHits(`${radar.track}.${dim.key}.label`, dim.label)
        const b = cjkHits(`${radar.track}.${dim.key}.description`, dim.description)
        if (a) leaks.push(a)
        if (b) leaks.push(b)
      }
    }
    for (const badge of BADGE_CATALOG) {
      const localized = localizeBadge(badge, 'en')
      const a = cjkHits(`${badge.id}.title`, localized.title)
      const b = cjkHits(`${badge.id}.description`, localized.description)
      if (a) leaks.push(a)
      if (b) leaks.push(b)
    }
    expect(leaks, leaks.join('\n')).toEqual([])
  })

  it('allowlist keys still exist and actually contain CJK', () => {
    for (const key of EN_UI_CJK_ALLOWED_KEYS) {
      expect(key in EN, key).toBe(true)
      expect(CJK.test(EN[key]), key).toBe(true)
    }
  })
})
