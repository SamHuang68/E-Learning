import { describe, expect, it } from 'vitest'

type VisualContract = readonly [
  playingIcon: string,
  accentColor: string,
  accentBackground: string,
  buttonBackground: string,
  idleIcon?: string,
]

const expectedByWrapper = {
  AntitrustHhiLab: ['📜', '#3b82f6', 'rgba(59, 130, 246, 0.15)', 'linear-gradient(135deg, #3b82f6, #2563eb)'],
  AntitrustLab: ['📜', '#ca8a04', 'rgba(234, 179, 8, 0.15)', 'linear-gradient(135deg, #eab308, #ca8a04)'],
  BondedWarehouseLab: ['📜', '#d97706', 'rgba(217, 119, 6, 0.15)', 'linear-gradient(135deg, #d97706, #b45309)'],
  BusinessInterruptionLab: ['📜', '#d97706', 'rgba(217, 119, 6, 0.15)', 'linear-gradient(135deg, #d97706, #b45309)'],
  CloudSlaLab: ['📜', '#0ea5e9', 'rgba(14, 165, 233, 0.15)', 'linear-gradient(135deg, #0ea5e9, #0284c7)'],
  ColdChainLab: ['✈️', '#0284c7', 'rgba(14, 165, 233, 0.15)', 'linear-gradient(135deg, #0284c7, #0369a1)'],
  ConflictMineralsLab: ['📜', '#0ea5e9', 'rgba(14, 165, 233, 0.15)', 'linear-gradient(135deg, #0ea5e9, #0284c7)'],
  CybersecurityLab: ['🛡️', '#ef4444', 'rgba(239, 68, 68, 0.15)', 'linear-gradient(135deg, #ef4444, #dc2626)', '🔐'],
  EsgLab: ['🌍', '#059669', 'rgba(5, 150, 105, 0.15)', 'linear-gradient(135deg, #059669, #047857)'],
  FcpaComplianceLab: ['📜', '#6366f1', 'rgba(99, 102, 241, 0.15)', 'linear-gradient(135deg, #6366f1, #4f46e5)'],
  ForceMajeureLab: ['📜', '#0284c7', 'rgba(14, 165, 233, 0.15)', 'linear-gradient(135deg, #0284c7, #0369a1)'],
  GdprPrivacyLab: ['📜', '#3b82f6', 'rgba(59, 130, 246, 0.15)', 'linear-gradient(135deg, #3b82f6, #2563eb)'],
  InterviewLab: ['🗣️', '#f59e0b', 'rgba(245, 158, 11, 0.15)', 'linear-gradient(135deg, #f59e0b, #d97706)'],
  IpLab: ['📜', '#f43f5e', 'rgba(244, 63, 94, 0.15)', 'linear-gradient(135deg, #f43f5e, #e11d48)'],
  LetterOfCreditLab: ['📜', '#3b82f6', 'rgba(59, 130, 246, 0.15)', 'linear-gradient(135deg, #3b82f6, #2563eb)', '⚖️'],
  MarineInsuranceLab: ['📜', '#3b82f6', 'rgba(59, 130, 246, 0.15)', 'linear-gradient(135deg, #2563eb, #1d4ed8)'],
  MarketingLab: ['📣', '#ec4899', 'rgba(236, 72, 153, 0.15)', 'linear-gradient(135deg, #ec4899, #db2777)', '📱'],
  MnaLab: ['📊', '#6366f1', 'rgba(99, 102, 241, 0.15)', 'linear-gradient(135deg, #6366f1, #4f46e5)', '💼'],
  NdaTradeSecretsLab: ['📜', '#d97706', 'rgba(217, 119, 6, 0.15)', 'linear-gradient(135deg, #d97706, #b45309)'],
  PatentLitigationLab: ['📜', '#a855f7', 'rgba(168, 85, 247, 0.15)', 'linear-gradient(135deg, #a855f7, #9333ea)'],
  PrLab: ['🎤', '#0284c7', 'rgba(56, 189, 248, 0.15)', 'linear-gradient(135deg, #0284c7, #0369a1)'],
  RealEstateLab: ['🏢', '#f59e0b', 'rgba(245, 158, 11, 0.15)', 'linear-gradient(135deg, #f59e0b, #d97706)', '🔑'],
  RfpBiddingLab: ['📊', '#2563eb', 'rgba(59, 130, 246, 0.15)', 'linear-gradient(135deg, #2563eb, #1d4ed8)'],
  RoyaltyAuditLab: ['📜', '#ea580c', 'rgba(234, 88, 12, 0.15)', 'linear-gradient(135deg, #ea580c, #c2410c)'],
  SupplyChainLab: ['🚢', '#0ea5e9', 'rgba(14, 165, 233, 0.15)', 'linear-gradient(135deg, #0ea5e9, #0284c7)', '📦'],
  TechTransferLab: ['📜', '#6366f1', 'rgba(99, 102, 241, 0.15)', 'linear-gradient(135deg, #6366f1, #4f46e5)'],
  TradeLab: ['🚢', '#0ea5e9', 'rgba(14, 165, 233, 0.15)', 'linear-gradient(135deg, #0ea5e9, #0284c7)'],
  TravelLab: ['🎧', '#0ea5e9', 'rgba(14, 165, 233, 0.15)', 'linear-gradient(135deg, #0284c7, #0ea5e9)', '🛫'],
} satisfies Record<string, VisualContract>

const wrapperSources = import.meta.glob('./components/*Lab.tsx', {
  query: '?raw',
  eager: true,
  import: 'default',
}) as Record<string, string>

function sourceFor(componentName: string): string {
  const source = wrapperSources[`./components/${componentName}.tsx`]
  if (!source) throw new Error(`找不到情境實驗室 wrapper：${componentName}`)
  return source
}

describe('TOEIC 情境實驗室視覺保真契約', () => {
  it('精確涵蓋全部 28 個共用元件 wrapper', () => {
    const actualWrappers = Object.entries(wrapperSources)
      .filter(([, source]) => source.includes('<ScenarioListeningLab'))
      .map(([path]) => path.replace('./components/', '').replace('.tsx', ''))
      .sort()

    expect(actualWrappers).toEqual(Object.keys(expectedByWrapper).sort())
  })

  it.each(Object.entries(expectedByWrapper))(
    '%s 保留 origin/main 的播放與閒置圖示，以及三項色彩常數',
    (componentName, [playingIcon, accentColor, accentBackground, buttonBackground, idleIcon]) => {
      const source = sourceFor(componentName)
      const expectedProps = { playingIcon, accentColor, accentBackground, buttonBackground, ...(idleIcon ? { idleIcon } : {}) }

      for (const [prop, value] of Object.entries(expectedProps)) {
        expect(source, `${componentName}.${prop}`).toContain(`${prop}=${JSON.stringify(value)}`)
      }
      expect(source.match(/\b(?:playingIcon|idleIcon|accentColor|accentBackground|buttonBackground)=/g)?.sort()).toEqual([
        'accentBackground=',
        'accentColor=',
        'buttonBackground=',
        ...(idleIcon ? ['idleIcon='] : []),
        'playingIcon=',
      ])
    },
  )
})
