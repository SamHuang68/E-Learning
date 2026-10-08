import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { NDA_TRADE_SECRETS_SCENARIOS } from '../data/ndaTradeSecretsDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function NdaTradeSecretsLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => NDA_TRADE_SECRETS_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="nda-trade-secrets-lab"
      icon="🤝"
      playingIcon="📜"
      accentColor="#d97706"
      accentBackground="rgba(217, 119, 6, 0.15)"
      buttonBackground="linear-gradient(135deg, #d97706, #b45309)"
      title={{ en: "TOEIC NDA and Trade-Secrets Listening Lab", zh: "TOEIC 商務保密協議與營業秘密聽力實驗室", ja: "TOEIC 秘密保持契約（NDA）特訓" }}
      description={{ en: "Practise mutual confidentiality duties, trade-secret protection, disclosure remedies, and liquidated damages.", zh: "多益高階商務法務考點：雙向保密協議、營業秘密保護、五年存續期與預定違約金條款！", ja: "企業法務・Part 3＆Part 7頻出！「秘密保持契約（NDA）・営業秘密（trade secret）・予定損害賠償額（liquidated damages）」を完全制覇！" }}
      tipsKey="ndaTradeSecretsKeywordsTipsJa"
    />
  )
}
