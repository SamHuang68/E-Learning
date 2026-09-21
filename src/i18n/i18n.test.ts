import { describe, expect, it } from 'vitest'
import { EN, translate, ZH_HANT, type MessageKey } from './messages'
import { interpolate } from './interpolate'
import { isUiLocale, loadUiLocale, saveUiLocale } from './locale'

describe('i18n dictionary', () => {
  it('keeps zh-Hant and en key sets identical', () => {
    const zhKeys = Object.keys(ZH_HANT).sort()
    const enKeys = Object.keys(EN).sort()
    expect(enKeys).toEqual(zhKeys)
  })

  it('interpolates count tokens', () => {
    expect(translate('en', 'hub.solved', { count: 4 })).toBe('You have solved 4 items')
    expect(translate('zh-Hant', 'hub.solved', { count: 4 })).toBe('你已解 4 題')
  })

  it('persists ui locale preference', () => {
    const mem = new Map<string, string>()
    ;(globalThis as unknown as { localStorage: Storage }).localStorage = {
      getItem: (key) => mem.get(key) ?? null,
      setItem: (key, value) => {
        mem.set(key, String(value))
      },
      removeItem: (key) => {
        mem.delete(key)
      },
      clear: () => mem.clear(),
      key: (index) => Array.from(mem.keys())[index] ?? null,
      get length() {
        return mem.size
      },
    } as Storage
    ;(globalThis as unknown as { document: { documentElement: { lang: string } } }).document = {
      documentElement: { lang: '' },
    }
    ;(globalThis as unknown as { window: { dispatchEvent: () => boolean } }).window = {
      dispatchEvent: () => true,
    }

    expect(isUiLocale('zh-Hant')).toBe(true)
    saveUiLocale('en')
    expect(loadUiLocale()).toBe('en')
    saveUiLocale('zh-Hant')
    expect(loadUiLocale()).toBe('zh-Hant')
  })

  it('translates primary chrome holes Codex flagged', () => {
    expect(translate('en', 'cs.top.today')).toBe('Today')
    expect(translate('en', 'cs.top.practice')).toBe('Practice')
    expect(translate('en', 'cs.top.textbook')).toBe('Reader')
    expect(translate('en', 'ja.nav.today')).toBe('Today')
    expect(translate('en', 'ja.levelSelect')).toBe('JLPT band')
    expect(translate('en', 'ja.unitSelect')).toBe('Choose unit')
    expect(translate('en', 'en.nav.today')).toBe('Today')
    expect(translate('en', 'en.certSelect')).toBe('Certificate band')
    expect(translate('en', 'todayView.start')).toMatch(/Start/)
    expect(translate('en', 'todayView.review')).toMatch(/review/i)
    expect(translate('zh-Hant', 'cs.top.today')).toBe('今日')
    expect(translate('en', 'cs.top.today')).not.toBe(translate('zh-Hant', 'cs.top.today'))
    expect(translate('en', 'ja.levelSelect')).not.toBe(translate('zh-Hant', 'ja.levelSelect'))
    // Hub chrome a11y keys added in R03
    expect(translate('en', 'hub.radar.aria')).toMatch(/radar/i)
    expect(translate('zh-Hant', 'hub.radar.aria')).toMatch(/雷達/)
    expect(translate('en', 'hub.stats.aria')).not.toBe(translate('zh-Hant', 'hub.stats.aria'))
    // R04: sweep additional Hub chrome en keys for completeness & a11y
    expect(translate('en', 'hub.srs.aria')).toMatch(/schedule/i)
    expect(translate('zh-Hant', 'hub.srs.aria')).toMatch(/複習/)
    expect(translate('en', 'hub.moreAuth')).toMatch(/sign/i)
    expect(translate('en', 'hub.radarTitle')).toMatch(/radar/i)
    expect(translate('en', 'hub.badgesTitle')).toMatch(/badge/i)
    expect(translate('en', 'hub.toeicExplain')).toMatch(/explanation/i)
    expect(translate('en', 'hub.catalogFirst.title')).toMatch(/catalog/i)
    expect(translate('en', 'hub.weekHeat')).toMatch(/week/i)
    expect(translate('en', 'hub.goTrack')).toMatch(/go/i)
    expect(translate('en', 'hub.privacy')).toMatch(/privacy/i)
    expect(translate('en', 'hub.footerNote')).not.toBe(translate('zh-Hant', 'hub.footerNote'))
    expect(translate('zh-Hant', 'hub.bottomNav.home')).toBe('大廳')
    expect(translate('en', 'hub.bottomNav.home')).toBe('Home')
    expect(translate('en', 'hub.bottomNav')).toMatch(/bottom/i)
    expect(translate('zh-Hant', 'hub.bottomNav.tracks')).toBe('軌道')
  })

  it('keeps Hub weekly streak copy as local practice continuity, not awards', () => {
    expect(translate('zh-Hant', 'hub.streak')).toMatch(/本機/)
    expect(translate('en', 'hub.streak')).toMatch(/local/i)
    expect(translate('zh-Hant', 'hub.streakShield')).toMatch(/本機/)
    expect(translate('zh-Hant', 'hub.streakShield')).not.toMatch(/防護/)
    expect(translate('en', 'hub.streakShield')).toMatch(/local/i)
    expect(translate('en', 'hub.streakShield')).not.toMatch(/protection/i)
    expect(translate('zh-Hant', 'hub.srsMeta')).not.toMatch(/加成/)
    expect(translate('en', 'hub.srsMeta')).not.toMatch(/bonus/i)
    expect(translate('zh-Hant', 'hub.srsMeta')).toMatch(/本機/)
    expect(translate('en', 'hub.srsMeta')).toMatch(/fluency/i)
    expect(translate('zh-Hant', 'hub.weekHeat')).toMatch(/本機/)
    expect(translate('en', 'hub.weekHeat')).toMatch(/local/i)
    expect(translate('en', 'hub.weekHeat')).toMatch(/week/i)
    expect(translate('zh-Hant', 'hub.stats.aria')).not.toMatch(/連勝/)
    expect(translate('en', 'hub.stats.aria')).not.toMatch(/streak panel/i)
  })

  it('keeps Hub resume empty copy honest: no last track, no invented math start', () => {
    expect(translate('zh-Hant', 'hub.resumeEmpty')).toMatch(/目錄/)
    expect(translate('zh-Hant', 'hub.resumeEmpty')).not.toMatch(/數學/)
    expect(translate('en', 'hub.resumeEmpty')).toMatch(/catalog/i)
    expect(translate('en', 'hub.resumeEmpty')).not.toMatch(/math/i)
    expect(translate('en', 'hub.resumeEmpty')).not.toMatch(/start with/i)
  })

  it('keeps calculus prerequisite copy as catalog teaching edges, not locks', () => {
    expect(translate('zh-Hant', 'calculus.prereq.honesty')).toMatch(/目錄/)
    expect(translate('zh-Hant', 'calculus.prereq.honesty')).toMatch(/不是鎖定/)
    expect(translate('en', 'calculus.prereq.honesty')).toMatch(/catalog/i)
    expect(translate('en', 'calculus.prereq.honesty')).toMatch(/not a lock/i)
    expect(translate('zh-Hant', 'hub.calculus.catalog')).toMatch(/非鎖定/)
    expect(translate('en', 'hub.calculus.catalog')).toMatch(/not locks/i)
  })

  it('keeps physics formula sheet copy as catalog plus offline, not an official exam sheet', () => {
    expect(translate('zh-Hant', 'physics.formulas.honesty')).toMatch(/課綱/)
    expect(translate('zh-Hant', 'physics.formulas.honesty')).toMatch(/離線/)
    expect(translate('zh-Hant', 'physics.formulas.honesty')).toMatch(/不是/)
    expect(translate('en', 'physics.formulas.honesty')).toMatch(/offline/i)
    expect(translate('en', 'physics.formulas.honesty')).toMatch(/not an official/i)
    expect(translate('zh-Hant', 'hub.physics.catalog')).toMatch(/離線/)
    expect(translate('en', 'hub.physics.catalog')).toMatch(/offline/i)
  })

  it('keeps chemistry strand taxonomy labels bilingual and not raw snake_case keys', () => {
    const strands = [
      'chemistry.strand.matter_structure',
      'chemistry.strand.reactions',
      'chemistry.strand.equilibrium_kinetics',
      'chemistry.strand.electrochemistry',
      'chemistry.strand.organic',
    ] as const
    for (const key of strands) {
      expect(translate('zh-Hant', key)).toBeTruthy()
      expect(translate('en', key)).toBeTruthy()
      expect(translate('zh-Hant', key)).not.toMatch(/_/)
      expect(translate('en', key)).not.toMatch(/_/)
      expect(translate('en', key)).not.toBe(translate('zh-Hant', key))
    }
    expect(translate('zh-Hant', 'chemistry.strand.reactions')).toBe('化學反應與計量')
    expect(translate('en', 'chemistry.strand.reactions')).toMatch(/stoichiometry/i)
  })

  it('keeps CS strand taxonomy labels bilingual and not raw snake_case keys', () => {
    const strands = [
      'cs.strand.hardware_software',
      'cs.strand.five_units',
      'cs.strand.digital_logic',
      'cs.strand.operating_systems',
      'cs.strand.networks',
      'cs.strand.ai_hardware',
      'cs.strand.frontier_ai',
    ] as const
    for (const key of strands) {
      expect(translate('zh-Hant', key)).toBeTruthy()
      expect(translate('en', key)).toBeTruthy()
      expect(translate('zh-Hant', key)).not.toMatch(/_/)
      expect(translate('en', key)).not.toMatch(/_/)
      expect(translate('en', key)).not.toBe(translate('zh-Hant', key))
    }
    expect(translate('zh-Hant', 'cs.strand.hardware_software')).toBe('軟硬體本質')
    expect(translate('zh-Hant', 'cs.strand.five_units')).toBe('五大單元架構')
    expect(translate('en', 'cs.strand.five_units')).toMatch(/five-unit/i)
    expect(translate('en', 'cs.strand.hardware_software')).toMatch(/hardware/i)
  })

  it('keeps CS Big-O teaching card copy as catalog teaching, not an interview pass', () => {
    expect(translate('zh-Hant', 'cs.bigo.honesty')).toMatch(/課綱/)
    expect(translate('zh-Hant', 'cs.bigo.honesty')).toMatch(/教學/)
    expect(translate('zh-Hant', 'cs.bigo.honesty')).toMatch(/不是面試/)
    expect(translate('en', 'cs.bigo.honesty')).toMatch(/teaching/i)
    expect(translate('en', 'cs.bigo.honesty')).toMatch(/not an interview/i)
    expect(translate('zh-Hant', 'cs.bigo.title')).toMatch(/課綱/)
    expect(translate('en', 'cs.bigo.title')).toMatch(/catalog/i)
    expect(translate('zh-Hant', 'cs.bigo.rca')).toMatch(/漣波/)
    expect(translate('en', 'cs.bigo.rca')).toMatch(/ripple-carry/i)
  })

  it('keeps Git Archify captions as teaching mental model, not git.git internals', () => {
    expect(translate('zh-Hant', 'cs.archify.git.subtitle')).toMatch(/教學/)
    expect(translate('zh-Hant', 'cs.archify.git.subtitle')).toMatch(/不是/)
    expect(translate('zh-Hant', 'cs.archify.git.subtitle')).toMatch(/git\.git/)
    expect(translate('en', 'cs.archify.git.subtitle')).toMatch(/teaching/i)
    expect(translate('en', 'cs.archify.git.subtitle')).toMatch(/not git\.git/i)
    expect(translate('zh-Hant', 'cs.archify.git.stat.merge.desc')).toMatch(/快轉/)
    expect(translate('en', 'cs.archify.git.stat.merge.desc')).toMatch(/fast-forward/i)
  })

  it('keeps gradient intuition card as teaching, not an exam-pass claim', () => {
    expect(translate('zh-Hant', 'calculus.grad.honesty')).toMatch(/教學/)
    expect(translate('zh-Hant', 'calculus.grad.honesty')).toMatch(/非正式考試/)
    expect(translate('zh-Hant', 'calculus.grad.honesty')).toMatch(/不是本機 108 多變數/)
    expect(translate('en', 'calculus.grad.honesty')).toMatch(/teaching/i)
    expect(translate('en', 'calculus.grad.honesty')).toMatch(/not an exam-pass/i)
    expect(translate('en', 'calculus.grad.honesty')).toMatch(/not a local 108 multivariable/i)
    expect(translate('zh-Hant', 'calculus.grad.directional')).toMatch(/方向導數/)
    expect(translate('en', 'calculus.grad.directional')).toMatch(/directional/i)
  })

  it('keeps Aoba pitch-accent tip as teaching, not a JLPT credential or fluency claim', () => {
    expect(translate('zh-Hant', 'ja.pitch.title')).toMatch(/教學/)
    expect(translate('zh-Hant', 'ja.pitch.body')).toMatch(/不評分/)
    expect(translate('zh-Hant', 'ja.pitch.body')).toMatch(/不是 JLPT/)
    expect(translate('zh-Hant', 'ja.pitch.body')).toMatch(/流利度/)
    expect(translate('en', 'ja.pitch.body')).toMatch(/do not score pitch/i)
    expect(translate('en', 'ja.pitch.body')).toMatch(/not a JLPT credential/i)
    expect(translate('en', 'ja.pitch.body')).toMatch(/fluency/i)
    expect(translate('zh-Hant', 'ja.pitch.example')).toMatch(/東京式/)
    expect(translate('en', 'ja.pitch.example')).toMatch(/Tokyo-style/i)
    expect(translate('zh-Hant', 'ja.pitch.example')).toMatch(/箸/)
    expect(translate('en', 'ja.pitch.example')).toMatch(/箸/)
  })

  it('keeps Chinese measure-word drills as teaching, not TOCFL pass', () => {
    expect(translate('zh-Hant', 'zh.measure.honesty')).toMatch(/教學/)
    expect(translate('zh-Hant', 'zh.measure.honesty')).toMatch(/不是/)
    expect(translate('zh-Hant', 'zh.measure.honesty')).toMatch(/TOCFL/)
    expect(translate('en', 'zh.measure.honesty')).toMatch(/teaching/i)
    expect(translate('en', 'zh.measure.honesty')).toMatch(/not a fluency/i)
    expect(translate('en', 'zh.measure.honesty')).toMatch(/TOCFL/i)
  })

  it('keeps service-worker update toast copy bilingual and not a new SW feature', () => {
    expect(translate('zh-Hant', 'sw.update.message')).toMatch(/題庫/)
    expect(translate('zh-Hant', 'sw.update.apply')).toBe('立即套用')
    expect(translate('zh-Hant', 'sw.update.dismiss')).toMatch(/關閉/)
    expect(translate('en', 'sw.update.message')).toMatch(/lessons/i)
    expect(translate('en', 'sw.update.apply')).toBe('Apply now')
    expect(translate('en', 'sw.update.dismiss')).toMatch(/dismiss/i)
    expect(translate('en', 'sw.update.message')).not.toBe(translate('zh-Hant', 'sw.update.message'))
  })

  it('leaves unknown placeholders intact', () => {
    expect(interpolate('Hello {name}', { other: 'x' })).toBe('Hello {name}')
    const key = 'hub.solved' satisfies MessageKey
    expect(translate('en', key, { count: 0 })).toContain('0')
  })
})
