import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { COLD_CHAIN_SCENARIOS } from '../data/coldChainDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function ColdChainLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => COLD_CHAIN_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="cold-chain-lab"
      icon="❄️"
      playingIcon="✈️"
      accentColor="#0284c7"
      accentBackground="rgba(14, 165, 233, 0.15)"
      buttonBackground="linear-gradient(135deg, #0284c7, #0369a1)"
      title={{ en: "TOEIC Air-Freight and Cold-Chain Listening Lab", zh: "TOEIC 商務國際空運與冷鏈物流聽力實驗室", ja: "TOEIC 航空貨物＆コールドチェーン物流特訓" }}
      description={{ en: "Practise air-waybill tracking, ultra-cold vaccine logistics, temperature-excursion protocols, and cargo claims.", zh: "多益高難度商務空運考點：主空運提單追蹤、生技疫苗超低溫冷鏈、溫度失控隔離通報與貨損理賠！", ja: "国際物流・Part 4＆Part 7頻出！「航空運送状（AWB）・超低温冷凍輸送（-70℃）・温度逸脱（temperature excursion）・貨物保険請求」を完全制覇！" }}
      tipsKey="coldChainKeywordsTipsJa"
    />
  )
}
