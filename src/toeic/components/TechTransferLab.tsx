import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { TECH_TRANSFER_SCENARIOS } from '../data/techTransferDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function TechTransferLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => TECH_TRANSFER_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="tech-transfer-lab"
      icon="🔐"
      playingIcon="📜"
      accentColor="#6366f1"
      accentBackground="rgba(99, 102, 241, 0.15)"
      buttonBackground="linear-gradient(135deg, #6366f1, #4f46e5)"
      title={{ en: "TOEIC Technology-Transfer and Escrow Listening Lab", zh: "TOEIC 商務技術移轉與原始碼託管聽力實驗室", ja: "TOEIC 技術移転＆ソースコードエスクロー特訓" }}
      description={{ en: "Practise source-code escrow, liquidation and bankruptcy triggers, patch obligations, and confidentiality protection.", zh: "多益高階智慧財產與技術法規考點：技術移轉協議、第三方原始碼託管、破產釋出條件與 NDA 保密協議！", ja: "知財法務・Part 3＆Part 7頻出！「技術移転（tech transfer）・ソースコードエスクロー（escrow）・破産引渡条項・秘密保持契約（NDA）」を完全制覇！" }}
      tipsKey="techTransferKeywordsTipsJa"
    />
  )
}
