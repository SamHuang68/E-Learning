import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { RFP_SCENARIOS } from '../data/rfpBiddingDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function RfpBiddingLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => RFP_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="rfp-bidding-lab"
      icon="📑"
      playingIcon="📊"
      accentColor="#2563eb"
      accentBackground="rgba(59, 130, 246, 0.15)"
      buttonBackground="linear-gradient(135deg, #2563eb, #1d4ed8)"
      title={{ en: "TOEIC RFP and Vendor-Evaluation Listening Lab", zh: "TOEIC 商務採購 RFP 競標與供應商評選聽力實驗室", ja: "TOEIC 調達RFP＆入札ベンダー評価特訓" }}
      description={{ en: "Practise sealed bids, weighted evaluation matrices, preferred bidders, and liquidated-damages clauses.", zh: "多益高階商務採購考點：RFP 徵求建議書、密封投標比價、加權評分矩陣與延遲履約違約金！", ja: "ビジネス契約・Part 4＆Part 7頻出！「提案依頼書（RFP）・封印入札（sealed bids）・加権評価マトリクス・遅延違約金（liquidated damages）」を完全制覇！" }}
      tipsKey="rfpKeywordsTipsJa"
    />
  )
}
