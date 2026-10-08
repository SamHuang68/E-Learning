import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { SUPPLY_CHAIN_SCENARIOS } from '../data/supplyChainDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function SupplyChainLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => SUPPLY_CHAIN_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="supply-chain-lab"
      icon="🚢"
      idleIcon="📦"
      playingIcon="🚢"
      accentColor="#0ea5e9"
      accentBackground="rgba(14, 165, 233, 0.15)"
      buttonBackground="linear-gradient(135deg, #0ea5e9, #0284c7)"
      title={{ en: "TOEIC Supply-Chain Disruption Listening Lab", zh: "TOEIC 商務供應鏈物流與庫存管理聽力實驗室", ja: "TOEIC サプライチェーン・物流＆在庫管理特訓" }}
      description={{ en: "Practise customs backlogs, safety stock, emergency air freight, freight forwarders, and payment terms.", zh: "多益高頻物流採購題型：海關延遲查驗、產線停擺危機、部分緊急空運與採購合約付款條款！", ja: "リスニングPart 3/4の頻出話題！「通関遅延（customs backlog）・安全在庫（safety stock）・緊急航空便（air freight）・支払い条件（Net 30）」を完全制覇！" }}
      tipsKey="supplyChainKeywordsTipsJa"
    />
  )
}
