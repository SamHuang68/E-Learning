import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { MARKETING_SCENARIOS } from '../data/marketingDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function MarketingLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => MARKETING_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="marketing-lab"
      icon="📢"
      idleIcon="📱"
      playingIcon="📣"
      accentColor="#ec4899"
      accentBackground="rgba(236, 72, 153, 0.15)"
      buttonBackground="linear-gradient(135deg, #ec4899, #db2777)"
      title={{ en: "TOEIC Product-Launch Marketing Listening Lab", zh: "TOEIC 商務行銷廣告與社群公關聽力實驗室", ja: "TOEIC マーケティング・SNS広告＆PR特訓ラボ" }}
      description={{ en: "Practise launch campaigns, influencer coordination, click-through rates, target audiences, and brand reach.", zh: "多益現代數位行銷話題：社群開箱影片、預熱電子報點擊率（CTR）與新品發表會宣傳策略！", ja: "リスニング・読解の必須分野！「製品発表会（product launch）・インフルエンサー提携・CTRクリック率・SNS広告」のビジネス英語を速攻習得！" }}
      tipsKey="marketingKeywordsTipsJa"
    />
  )
}
