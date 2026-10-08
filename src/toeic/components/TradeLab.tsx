import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { TRADE_SCENARIOS } from '../data/tradeDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function TradeLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => TRADE_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="trade-lab"
      icon="🌐"
      playingIcon="🚢"
      accentColor="#0ea5e9"
      accentBackground="rgba(14, 165, 233, 0.15)"
      buttonBackground="linear-gradient(135deg, #0ea5e9, #0284c7)"
      title={{ en: "TOEIC Incoterms and Customs-Documentation Listening Lab", zh: "TOEIC 商務國際貿易與海關關稅聽力實驗室", ja: "TOEIC 国際貿易・インコタームズ＆通関特訓" }}
      description={{ en: "Practise FOB and CIF responsibilities, freight and marine insurance, bills of lading, and certificates of origin.", zh: "多益高階國貿題型：國貿條規 FOB 與 CIF 責任分界、海上保險、提單與原產地證明！", ja: "リスニング・読解の難関！「FOB vs CIF条件・船荷証券（B/L）・原産地証明書・関税（tariff）」を直感マスター！" }}
      tipsKey="tradeKeywordsTipsJa"
    />
  )
}
