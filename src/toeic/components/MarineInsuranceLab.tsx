import { useMemo } from 'react'
import { useI18n } from '../../i18n/i18n'
import { MARINE_INSURANCE_SCENARIOS } from '../data/marineInsuranceDialogues'
import { localizeToeicData, toeicSupportLang } from '../teachingCopy'
import { ScenarioListeningLab } from './ScenarioListeningLab'

interface Props {
  onEarnXp: (amount: number) => void
  instructionLang?: 'zh' | 'ja'
}

export function MarineInsuranceLab({ onEarnXp, instructionLang = 'zh' }: Props) {
  const { locale } = useI18n()
  const items = useMemo(
    () => MARINE_INSURANCE_SCENARIOS.map((item) => localizeToeicData(item, locale, instructionLang)),
    [instructionLang, locale],
  )

  return (
    <ScenarioListeningLab
      items={items}
      supportLang={toeicSupportLang(locale, instructionLang)}
      onEarnXp={onEarnXp}
      className="marine-insurance-lab"
      icon="🚢"
      playingIcon="📜"
      accentColor="#3b82f6"
      accentBackground="rgba(59, 130, 246, 0.15)"
      buttonBackground="linear-gradient(135deg, #2563eb, #1d4ed8)"
      title={{ en: "TOEIC Marine Insurance and General Average Listening Lab", zh: "TOEIC 海運貨物保險與共同海損聽力實驗室", ja: "TOEIC 海上保険＆共同海損特訓" }}
      description={{ en: "Practise cargo jettison, General Average, underwriter guarantees, salvage expenses, and cash bonds.", zh: "多益高階國際貿易法務考點：共同海損宣告、貨物應急拋海、共同海損保證函與分攤理算！", ja: "国際貿易・Part 3＆Part 7頻出！「共同海損（General Average）・貨物投棄（jettison）・保証状（GA Guarantee）・ヨーク・アントワープ規則」を完全制覇！" }}
      tipsKey="marineInsuranceKeywordsTipsJa"
    />
  )
}
