import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { LocaleContext } from '../i18n/i18n'
import { translate } from '../i18n/messages'
import { ChineseSidebar } from './components/ChineseSidebar'

const appSource = import.meta.glob('./ChineseApp.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
})['./ChineseApp.tsx'] as string

const componentSources = import.meta.glob('./components/*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const reachableLabs = [
  ['pinyin', 'PinyinLab'],
  ['tones-lab', 'ToneListeningLab'],
  ['stroke', 'BopomofoStrokeLab'],
  ['false-friends', 'FalseFriendsLab'],
  ['synonyms', 'SynonymsLab'],
  ['measure-words', 'MeasureWordsLab'],
  ['signals', 'ChineseSignalsView'],
  ['idioms', 'IdiomsLab'],
  ['conversations', 'ChineseConversationLab'],
  ['transit', 'TransitLab'],
  ['housing', 'HousingLab'],
  ['banking', 'BankingLab'],
  ['medical', 'MedicalLab'],
  ['post', 'PostLab'],
  ['railway', 'TravelZhLab'],
  ['food', 'FoodZhLab'],
  ['festivals', 'FestivalZhLab'],
  ['utilities', 'UtilitiesZhLab'],
  ['crafts', 'CraftsZhLab'],
  ['road-trip', 'RoadTripZhLab'],
  ['repair', 'RepairZhLab'],
  ['pet', 'PetZhLab'],
  ['rechao', 'RechaoZhLab'],
  ['convenience-atm', 'ConvenienceAtmZhLab'],
  ['youbike', 'YouBikeZhLab'],
  ['boba', 'BobaZhLab'],
  ['wedding', 'WeddingZhLab'],
  ['lottery', 'LotteryZhLab'],
  ['weiya', 'WeiyaZhLab'],
  ['zhuazhou', 'ZhuazhouZhLab'],
  ['ghost-festival', 'GhostFestivalZhLab'],
  ['tangyuan', 'TangyuanZhLab'],
  ['dragon-boat', 'DragonBoatZhLab'],
  ['mid-autumn', 'MidAutumnZhLab'],
  ['lantern-festival', 'LanternFestivalZhLab'],
  ['qingming-popiah', 'QingmingPopiahZhLab'],
  ['yuelao-love', 'YuelaoLoveZhLab'],
  ['double-ninth', 'DoubleNinthZhLab'],
  ['start-of-winter', 'StartOfWinterZhLab'],
  ['guabao-sishen', 'GuabaoSishenZhLab'],
  ['menu', 'TaiwanMenuLab'],
] as const

function renderSidebar(locale: 'en' | 'zh-Hant') {
  return renderToStaticMarkup(createElement(
    LocaleContext.Provider,
    {
      value: {
        locale,
        setLocale: () => {},
        t: (key, vars) => translate(locale, key, vars),
      },
    },
    createElement(ChineseSidebar, {
      activeSection: 'today',
      onSelectSection: () => {},
      onBackHub: () => {},
      onSwitchLang: () => {},
      xp: 0,
    }),
  ))
}

describe('華語英文模式消費端覆蓋', () => {
  it('每個可達實驗室都保留在 ChineseApp 路由拓樸中', () => {
    expect(reachableLabs).toHaveLength(41)
    for (const [section, component] of reachableLabs) {
      expect(appSource, section).toContain(`section === '${section}'`)
      expect(appSource, component).toContain(`<${component}`)
    }
  })

  it('每個可達實驗室都讀取全域語系並以嚴格字典本地化教材支援欄位', () => {
    for (const [, component] of reachableLabs) {
      const modulePath = `./components/${component}.tsx`
      const source = componentSources[modulePath]
      expect(source, modulePath).toBeTypeOf('string')
      expect(source, modulePath).toContain('useI18n')
      expect(source, modulePath).toMatch(/\blocale\b/)
      expect(source, modulePath).toContain('localizeChineseData')
      expect(source, modulePath).toContain('CHINESE_SUPPORT_EN')
    }
  })

  it('對話場景與台灣借詞不會繞過嚴格字典直接渲染原始支援欄位', () => {
    expect(componentSources['./components/ChineseConversationLab.tsx']).not.toContain(
      '{activeScene.titleZh}',
    )
    expect(componentSources['./components/TaiwanMenuLab.tsx']).not.toContain(
      '{selectedLoanword.meaningZh}',
    )
  })

  it('錯題庫側欄字幕使用臺灣繁體字形', () => {
    const sidebar = componentSources['./components/ChineseSidebar.tsx']
    expect(sidebar).toContain("subtitle: '弱點專項攻克'")
    expect(sidebar).not.toContain('弱点')
  })

  it('今日首頁的繁中歡迎文案使用臺灣正體字形', () => {
    const today = componentSources['./components/ChineseToday.tsx']
    expect(today).toContain('歡迎來到臺灣華語學習空間！')
    expect(today).not.toContain('歡迎來到台湾華語學習空間！')
  })

  it('逐項標示日語與繁中教材字幕，英文模式則統一標示英文', () => {
    const zhHant = renderSidebar('zh-Hant')
    expect(zhHant).toContain('<div class="zh-nav-sub" lang="ja">今日の学習ダッシュボード</div>')
    expect(zhHant).toContain('<div class="zh-nav-sub" lang="zh-Hant">悠遊卡・高鐵・運將對話</div>')
    expect(zhHant).toContain('<div class="zh-nav-sub" lang="zh-Hant">弱點專項攻克</div>')

    const english = renderSidebar('en')
    expect(english).toContain('<div class="zh-nav-sub" lang="en">Today’s learning dashboard</div>')
    expect(english).toContain('<div class="zh-nav-sub" lang="en">EasyCard, high-speed rail, and taxi dialogue</div>')
    expect(english).toContain('<div class="zh-nav-sub" lang="en">Focused review of missed questions</div>')
  })
})
